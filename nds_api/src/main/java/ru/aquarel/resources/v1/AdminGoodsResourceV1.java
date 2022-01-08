package ru.aquarel.resources.v1;

import ru.aquarel.entities.*;
import ru.aquarel.mtm.CategoriesGoods;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

//@Path("/api/v1/admin")
@Path("/api/v1/public")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AdminGoodsResourceV1 {

    @Inject
    EntityManager entityManager;

    /**
     * Добавить запись в goods-labels
     * @param goodsLabels
     * @return
     */
    @POST
    @Path("/post/goods/labels")
    @Transactional
    public Response postGoodsLabels(GoodsLabels goodsLabels) {
        entityManager.persist(goodsLabels);
        entityManager.flush();
        return Response.ok(goodsLabels).build();
    }

    /**
     * Добавить запись в goods
     * @param goods
     * @return
     */
    @POST
    @Path("/post/goods")
    @Transactional
    public Response postGoods(Goods goods) {
        goods.setGoodsLabel(entityManager.find(GoodsLabels.class, goods.getGoodsLabel().getId()));
        entityManager.persist(goods);
        entityManager.flush();
        return Response.ok(goods).build();
    }

    /**
     * Получить goods-labels
     * @param id
     * @return
     */
    @GET
    @Path("/get/goods/{id}")
    @Transactional
    public Response getGoods(@PathParam("id")UUID id) {
        var g = entityManager.find(GoodsLabels.class,id);
        return Response.ok(g).build();
    }

    @POST
    @Path("/post/categories")
    @Transactional
    public Response postCategories(Categories categories) {
        entityManager.persist(categories);
        entityManager.flush();
        return Response.ok(categories).build();
    }

    @POST
    @Path("/post/categories/goods")
    @Transactional
    public Response postCategoriesGoods(CategoriesGoods categoriesGoods) {
        var product = new GoodsLabels();
        var category = new Categories();
        category.setId(categoriesGoods.getId_category());

        product.setId(categoriesGoods.getId_goods());
        product.setCategories(Collections.singleton(category));
//        goodsLabels.setCategories(Collections.singleton(categories));
        entityManager.merge(product);
        entityManager.flush();
        return Response.ok(product).build();
    }

    @POST
    @Path("/post/user")
    @Transactional
    public Response postUsers(Users user) {
    //        var cart = new Cart();
    //        var info = new UserInfo();
    //        user.setCart(cart);
    //        user.setUserInfo(info);
        entityManager.persist(user);
        entityManager.flush();
        return Response.ok(user).build();
    }

}
