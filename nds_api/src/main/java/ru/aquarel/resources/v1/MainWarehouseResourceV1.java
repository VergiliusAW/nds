package ru.aquarel.resources.v1;

import org.eclipse.microprofile.jwt.JsonWebToken;
import ru.aquarel.entities.*;
import ru.aquarel.enums.OrderStatus;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.transaction.Transactional;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.Set;
import java.util.UUID;

@Path("/api/v1/main")
@RolesAllowed("nds_warehouse_manager")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class MainWarehouseResourceV1 {


    @Inject
    JsonWebToken jsonWebToken;

    @Inject
    EntityManager entityManager;

    /**
     * Изменить статус нового заказа на "готов к отправке"
     *
     * @param order заказ
     * @return заказ готовый к отправке
     */
    @POST
    @Path("/orders/ready")
    @Transactional
    public Response markOrderAsReadyToShipment(Orders order) {
        var o = entityManager.find(Orders.class, order.getId());
        if (o.getStatus() == OrderStatus.NEW) {
            o.setStatus(OrderStatus.READY_TO_SHIPMENT);
            entityManager.merge(o);
            entityManager.flush();
        } else {
            return Response.ok("Нельзя, так как заказ имеет статус " + o.getStatus()).build();
        }
        return Response.ok(o).build();
    }

    /**
     * Отправить все заказы(готовые к отправке) в магазин
     *
     * @param store магазин-получатель
     * @return все заказы
     */
    @POST
    @Path("/orders/transit")
    @Transactional
    public Response sendOrdersToStore(Stores store) {
        var orders = entityManager.createQuery("select o from Orders o join o.warehouseIn w where w.store.id = :s_id and o.status = :status", Orders.class)
                .setParameter("s_id", store.getId())
                .setParameter("status", OrderStatus.READY_TO_SHIPMENT)
                .getResultList();
        //Заказы доставляются с помощью телепорта, поэтому сразу же становятся доступны для выдачи
        //TODO: Сделать так, чтобы заказы возились с помощью транспортной компании
        orders.forEach(o -> o.setStatus(OrderStatus.READY_TO_ISSUE));
        entityManager.merge(orders);
        entityManager.flush();
        return Response.ok(orders).build();
    }

    /**
     * Принять товары на головной склад
     *
     * @param goods список товаров на приём
     * @return принятые товары
     */
    @POST
    @Path("/accept")
    @Transactional
    public Response acceptGoods(Set<Goods> goods) {
        //Получение головного склада
        var main = entityManager
                .find(StoresWarehouses.class, UUID.fromString("00000000-0000-0000-0000-000000000000"));
        //Добавление всех товаров в таблицу goods и присвоение им уникальных адресов
        goods.forEach(g -> {
            var gl = entityManager.find(GoodsLabels.class, g.getGoodsLabel().getId());
            g.setGoodsLabel(gl);
            g.setWarehouse(main);
            entityManager.persist(g);
            entityManager.flush();
        });

        //Создание приёмной накладной в таблице orders
        var orderIn = new Orders();
        //Установка только принимающего головного склада, так как товары пришли извне
        orderIn.setWarehouseIn(main);
        orderIn.setWarehouseOut(null);
        //Добавляем товары в накладную
        orderIn.setGoods(goods);
        //Пользователь с ролью администратор склада
        orderIn.setId_nds_user(UUID.fromString(jsonWebToken.getSubject()));
        entityManager.persist(orderIn);
        entityManager.flush();
        return Response.ok(orderIn).build();
    }
}
