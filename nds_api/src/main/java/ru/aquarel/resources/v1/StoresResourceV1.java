package ru.aquarel.resources.v1;

import io.vertx.core.json.JsonObject;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.jwt.JsonWebToken;
import ru.aquarel.Pojos.NewOrder;
import ru.aquarel.entities.Goods;
import ru.aquarel.entities.Orders;
import ru.aquarel.entities.Stores;
import ru.aquarel.enums.OrderStatus;
import ru.aquarel.mtm.CartGoods;

import java.util.ArrayList;
import java.util.Set;
import java.util.UUID;

@Path("/api/v1/stores")
@RolesAllowed("nds_store_manager")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class StoresResourceV1 {

    @Inject
    JsonWebToken jsonWebToken;

    @Inject
    EntityManager entityManager;

    /**
     * Выдать заказ
     *
     * @param order заказ
     * @return выданный заказ
     */
    @POST
    @Path("/issue")
    @Transactional
    public Response issueAnOrder(Orders order) {
        order = entityManager.find(Orders.class, order.getId());
        if (order.getStatus() != OrderStatus.READY_TO_ISSUE) {
            return Response.ok("Нельзя + " + order.getStatus()).build();
        }
        order.setStatus(OrderStatus.ISSUED);
        order.getGoods().forEach(g -> g.setWarehouse(null));
        return Response.ok(order).build();
    }

    /**
     * Получить товары, доступные оффлайн для конкретного магазина
     *
     * @param id_store      uuid магазина
     * @param id_goodsLabel uuid товара
     * @return json с количеством товара
     */
    @GET
    @Path("/goods/available")
    @Transactional
    public Response getAvailableOfflineGoods(@QueryParam("id_store") UUID id_store, @QueryParam("id_goods_label") UUID id_goodsLabel) {
        var shop = entityManager.find(Stores.class, id_store);
        var goods = entityManager
                .createQuery("select g from Goods g where g.warehouse.id = :s_id and g.goodsLabel.id = :g_id", Goods.class)
                .setParameter("s_id", shop.getWarehouse().getId())
                .setParameter("g_id", id_goodsLabel)
                .getResultList();
        JsonObject count = new JsonObject();
        count.put("available_count", goods.size());
        return Response.ok(count).build();
    }

    /**
     * Получить магазин для администратора
     *
     * @return store
     */
    @GET
    @Path("/store")
    @Transactional
    public Response getStore() {
        var store = entityManager.createQuery("select s from Stores s where s.id_nds_manager = :m_id", Stores.class)
                .setParameter("m_id", UUID.fromString(jsonWebToken.getSubject()))
                .getSingleResult();
        return Response.ok(store).build();
    }

    /**
     * Получить заказ по id
     *
     * @param id_order id заказа
     * @return заказ
     */
    @GET
    @Path("/order/get")
    @Transactional
    public Response getOrderById(@QueryParam("id_order") UUID id_order) {
        var order = entityManager.find(Orders.class, id_order);
        if (order.getStatus() == OrderStatus.READY_TO_ISSUE)
            return Response.ok(order).build();
        return Response.ok("Нет").build();
    }

    /**
     * Продать товар оффлайн клиенту
     * Созаётся заказ с null значением скалада-назначения
     *
     * @param newOrder состав заказа
     * @return выданный заказ
     */
    @POST
    @Path("/sell")
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
                    .createQuery("select g from Goods g where g.warehouse.id = :s_id and g.goodsLabel.id = :g_id ", Goods.class)
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
        order.setStatus(OrderStatus.ISSUED);
        order.setGoods(allOrderGoodsSet);
        order.setWarehouseOut(store.getWarehouse());
        order.setWarehouseIn(null);

        entityManager.persist(order);
        entityManager.flush();

        return Response.ok(order).build();
    }
}
