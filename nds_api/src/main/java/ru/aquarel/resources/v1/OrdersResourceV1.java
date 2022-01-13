package ru.aquarel.resources.v1;

import org.eclipse.microprofile.jwt.JsonWebToken;
import ru.aquarel.Pojos.NewOrder;
import ru.aquarel.entities.Goods;
import ru.aquarel.entities.Orders;
import ru.aquarel.entities.Stores;
import ru.aquarel.entities.StoresWarehouses;
import ru.aquarel.enums.OrderStatus;
import ru.aquarel.mtm.CartGoods;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.Set;
import java.util.UUID;

@Path("/api/v1/orders")
@RolesAllowed("nds_user")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class OrdersResourceV1 {

    @Inject
    JsonWebToken jsonWebToken;

    @Inject
    EntityManager entityManager;

    /**
     * Создание пользователем нового заказа
     * 1. Получить объект магазина
     * 2. Забрать все товары и их количество из Set CartGoods
     * 3. Выбрать товары из Goods
     * 4. Занести товары в заказ
     * 5. Оформить заказ
     *
     * @return заказ
     */
    @POST
    @Path("/new")
    @Transactional
    public Response createNewOrder(NewOrder newOrder) {
        if (newOrder.getId_store().equals(UUID.fromString("00000000-0000-0000-0000-000000000000"))) {
            return Response.ok("Сюда нельзя").build();
        }

        var store = entityManager.find(Stores.class, newOrder.getId_store());
        var cartGoods = newOrder.getCartGoods();

        var allOrderGoods = new ArrayList<Goods>();

        for (CartGoods g : cartGoods) {
            var goods = entityManager
                    .createQuery("select g from Goods g where (g.warehouse.id = '00000000-0000-0000-0000-000000000000' or g.warehouse.id = :s_id) and g.goodsLabel.id = :g_id ", Goods.class)
                    .setParameter("g_id", g.getGoods().getId())
                    .setParameter("s_id", store.getWarehouse().getId())
                    .setFirstResult(0).setMaxResults(Math.toIntExact(g.getCount_goods())).getResultList();
            if (goods.size() < g.getCount_goods()) {
                //Если товаров на складе мало, то возвращается простое сообщение.
                //TODO: Однако на фронте будет запрещено выбирать товаров больше, чем доступно для заказа в магазин.
                //      Под каждым товаром в корзине, после выбора магазина, будет его количество доступное для заказа
                return Response.ok("Товаров недостаточно на складе").build();
            }
            allOrderGoods.addAll(goods);
        }

        // Установка установка склада как null, чтобы никто не мог купить тот же товар
        allOrderGoods.forEach(goods -> {
            goods.setWarehouse(null);
            entityManager.merge(goods);
            entityManager.flush();
        });

        var allOrderGoodsSet = Set.copyOf(allOrderGoods);

        var order = new Orders();
        order.setId_nds_user(UUID.fromString(jsonWebToken.getSubject()));
        order.setStatus(OrderStatus.NEW);
        order.setGoods(allOrderGoodsSet);
        order.setWarehouseOut(entityManager.find(StoresWarehouses.class, UUID.fromString("00000000-0000-0000-0000-000000000000")));
        order.setWarehouseIn(store.getWarehouse());

        entityManager.persist(order);
        entityManager.flush();

        return Response.ok(order).build();
    }

    /**
     * Получить все заказы
     *
     * @return все заказы
     */
    @GET
    @Path("/all")
    @Transactional
    public Response getAllOrders() {
        var orders = entityManager.createQuery("select o from Orders o where o.id_nds_user = :id", Orders.class)
                .setParameter("id", UUID.fromString(jsonWebToken.getSubject()))
                .getResultList();
        return Response.ok(orders).build();
    }

    /**
     * Получить все товары для заказа
     *
     * @param id_order uuid заказа
     * @return все товары
     */
    @GET
    @Path("/order/goods")
    @RolesAllowed({"nds_user", "nds_warehouse_manager", "nds_store_manager"})
    @Transactional
    public Response getOrderGoods(@QueryParam("id_order") UUID id_order) {
        var goods = entityManager.find(Orders.class, id_order).getGoods();
        //TODO: Крайне странное поведение, без println не работает :)
        System.out.println(goods.size());
        return Response.ok(goods).build();
    }

    /**
     * Отменить заказ
     *
     * @param order заказ
     * @return отменённый заказ
     */
    @POST
    @Path("/order/cancel")
    @Transactional
    public Response cancelOrder(Orders order) {
        order = entityManager.find(Orders.class, order.getId());
        var status = order.getStatus();
        //Если заказ имеет статус не отменён или не выдан
        if (status != OrderStatus.CANCELED && status != OrderStatus.ISSUED) {
            //Если заказ новый, то просто оставляем товар на складе
            if (status == OrderStatus.NEW) {
                order.setStatus(OrderStatus.CANCELED);
                var warehouse = order.getWarehouseOut();
                order.getGoods().forEach(g -> g.setWarehouse(warehouse));
            } else {
                order.setStatus(OrderStatus.CANCELED);
                var warehouse = order.getWarehouseIn();
                order.getGoods().forEach(g -> g.setWarehouse(warehouse));
            }
            entityManager.merge(order);
            entityManager.flush();
            return Response.ok(order).build();
        }
        return Response.ok("Заказ уже отменён или выдан").build();
    }
}
