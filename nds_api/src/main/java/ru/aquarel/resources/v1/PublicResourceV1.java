package ru.aquarel.resources.v1;

import io.vertx.core.json.JsonObject;
import ru.aquarel.entities.Categories;
import ru.aquarel.entities.Goods;
import ru.aquarel.entities.GoodsLabels;
import ru.aquarel.entities.Stores;

import javax.annotation.security.PermitAll;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;
import java.util.UUID;

@Path("/api/v1/public")
@PermitAll
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PublicResourceV1 {

    @Inject
    EntityManager entityManager;

    /**
     * Получить список всех товаров
     *
     * @return все товары
     */
    @GET
    @Path("/goods/all")
    @Transactional
    public Response getAllGoodsLabels() {
        var resList = entityManager.createQuery("select g from GoodsLabels g", GoodsLabels.class).getResultList();
        return Response.ok(resList).build();
    }

    /**
     * Получить всю информацию о конкретном товаре
     * TODO: добавить дополнительную информацию о товаре в отдельную таблицу и возвращать это
     *
     * @return продукт
     */
    @GET
    @Path("/goods/{id}")
    @Transactional
    public Response getAllGoodsInfo(@PathParam("id") UUID id) {
        var product = new GoodsLabels();
        product.setId(id);
        product = entityManager.find(GoodsLabels.class, product.getId());
        return Response.ok(product).build();
    }

    /**
     * Получить список всех товаров по категориям
     *
     * @return все товары с категориями
     */
    @GET
    @Path("/goods/filter")
    @Transactional
    public Response getAllGoodsLabels(@QueryParam("categories") List<String> categories) {
        if (categories.size() == 0) {
            return Response.ok("Пустой фильтр, пустой ответ").build();
        }
        if (categories.size() == 1) {
            var goods = entityManager
                    .createQuery("select g from GoodsLabels g join g.categories c where c.name = :name_0", GoodsLabels.class)
                    .setParameter("name_0", categories.get(0))
                    .getResultList();
            return Response.ok(goods).build();
        }
        var hqlBuilder = new StringBuilder("select g from GoodsLabels g join g.categories c where c.name = '");
        hqlBuilder
                .append(categories.get(0))
                .append("'");
        for (int i = 1; i < categories.size(); i++) {
            hqlBuilder
                    .append(" or c.name = '")
                    .append(categories.get(i))
                    .append("'");
        }
        hqlBuilder.append(" group by g");
        System.out.println(hqlBuilder);
        var resList = entityManager
                .createQuery(hqlBuilder.toString(), GoodsLabels.class)
                .getResultList();
        return Response.ok(resList).build();
    }

    /**
     * Получить все магазины
     *
     * @return все магазины
     */
    @GET
    @Path("/stores/all")
    @Transactional
    public Response getAllStores() {
        var stores = entityManager.createQuery("select s from Stores s where s.warehouse.id <> '00000000-0000-0000-0000-000000000000'", Stores.class).getResultList();
        return Response.ok(stores).build();
    }

    /**
     * Получить товары, доступные для конкретного магазина
     *
     * @param id_store      uuid магазина
     * @param id_goodsLabel uuid товара
     * @return json с количеством товара
     */
    @GET
    @Path("/goods/available")
    @Transactional
    public Response getAvailableGoods(@QueryParam("id_store") UUID id_store, @QueryParam("id_goods_label") UUID id_goodsLabel) {
        var shop = entityManager.find(Stores.class, id_store);
        var goods = entityManager
                .createQuery("select g from Goods g " +
                        "where (g.warehouse.id = :s_id or g.warehouse.id = '00000000-0000-0000-0000-000000000000') " +
                        "and g.goodsLabel.id = :g_id", Goods.class)
                .setParameter("s_id", shop.getWarehouse().getId())
                .setParameter("g_id", id_goodsLabel)
                .getResultList();
        JsonObject count = new JsonObject();
        count.put("available_count", goods.size());
        return Response.ok(count).build();
    }

    /**
     * Получить все категории
     *
     * @return категории
     */
    @GET
    @Path("/categories/all")
    @Transactional
    public Response getAllCategories() {
        var categories = entityManager.createQuery("select c from Categories c", Categories.class).getResultList();
        return Response.ok(categories).build();
    }
}
