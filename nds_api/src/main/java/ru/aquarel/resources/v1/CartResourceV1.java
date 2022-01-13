package ru.aquarel.resources.v1;

import io.vertx.core.json.JsonObject;
import org.eclipse.microprofile.jwt.JsonWebToken;
import ru.aquarel.entities.Cart;
import ru.aquarel.entities.GoodsLabels;
import ru.aquarel.entities.UserInfo;
import ru.aquarel.entities.Users;
import ru.aquarel.mtm.CartGoods;
import ru.aquarel.mtm.CartGoodsId;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.UUID;

@Path("/api/v1/cart")
@RolesAllowed({"nds_user","nds_store_manager"})
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CartResourceV1 {

    @Inject
    JsonWebToken accessToken;

    @Inject
    EntityManager entityManager;

    /**
     * Добавление товара в корзину и регистрация пользователя, если он не зарегистрирован
     *
     * @return cartGoods
     */
    @POST
    @Path("/add")
    @Transactional
    public Response addToCart(GoodsLabels goodsLabel) {
        var user = getUserFromSubject(accessToken.getSubject());
        //если пользователь не существует, то добавляем
        if (user == null) {
            user = new Users();
            user.setId(UUID.fromString(accessToken.getSubject()));
            var cart = new Cart();
            var info = new UserInfo();
            user.setCart(cart);
            user.setUserInfo(info);
            entityManager.persist(user);
            entityManager.flush();
        }

        var userCart = user.getCart();
        var goods = entityManager.find(GoodsLabels.class, goodsLabel.getId());

        CartGoodsId cartGoodsId = getCartGoodsId(userCart, goods);

        var cartGoods = entityManager.find(CartGoods.class, cartGoodsId);

        if (cartGoods == null) {
            cartGoods = new CartGoods();
            cartGoods.setCartGoodsId(cartGoodsId);
            cartGoods.setCart(userCart);
            cartGoods.setGoods(goods);
            cartGoods.setCount_goods(1L);
            entityManager.persist(cartGoods);
        } else {
            cartGoods.setCount_goods(cartGoods.getCount_goods() + 1);
            entityManager.merge(cartGoods);
        }
        System.out.println(cartGoods.getCartGoodsId());
        entityManager.flush();
        return Response.ok(cartGoods).build();
    }

    /**
     * Изменение количества товара
     *
     * @param count      количество на которое заменить значение (не может быть меньше или равно 0)
     * @param goodsLabel товар
     * @return cartGoods
     */
    @POST
    @Path("/change")
    @Transactional
    public Response changeCountOfGoods(@QueryParam("count") Long count, GoodsLabels goodsLabel) {
        if (count <= 0) {
            return Response.ok("меньше или равно нулю нельзя").build();
        }
        var user = getUserFromSubject(accessToken.getSubject());
        if (user == null) {
            return Response.ok("пока сюда нельзя").build();
        }
        var userCart = user.getCart();
        var goods = entityManager.find(GoodsLabels.class, goodsLabel.getId());

        CartGoodsId cartGoodsId = getCartGoodsId(userCart, goods);

        var cartGoods = entityManager.find(CartGoods.class, cartGoodsId);

        if (cartGoods == null) {
            return Response.ok("товара в корзине не существует").build();
        } else {
            cartGoods.setCount_goods(count);
            entityManager.merge(cartGoods);
        }

        entityManager.flush();
        return Response.ok(cartGoods).build();
    }

    /**
     * Получить все товары в корзине
     *
     * @return все товары
     */
    @GET
    @Path("/all")
    @Transactional
    public Response getAllCartGoods() {
        var user = getUserFromSubject(accessToken.getSubject());
        if (user == null) {
            return Response.ok("пока сюда нельзя").build();
        }
        var userCartId = user.getCart().getId();

        var cartGoods = entityManager
                .createQuery("select c from CartGoods c where c.cart.id = ?1", CartGoods.class)
                .setParameter(1, userCartId)
                .getResultList();
        return Response.ok(cartGoods).build();
    }

    /**
     * Удалить товар из корзины
     *
     * @param goodsLabel товар
     * @return удалённый товар
     */
    @POST
    @Path("/remove")
    @Transactional
    public Response removeCartGoods(GoodsLabels goodsLabel) {
        var user = getUserFromSubject(accessToken.getSubject());
        if (user == null) {
            return Response.ok("пользователь не существует").build();
        }
        var userCart = user.getCart();
        var goods = entityManager.find(GoodsLabels.class, goodsLabel.getId());

        CartGoodsId cartGoodsId = getCartGoodsId(userCart, goods);

        var cartGoods = entityManager.find(CartGoods.class, cartGoodsId);

        if (cartGoods == null) {
            return Response.ok("товара в корзине не существует").build();
        } else {
            entityManager.remove(cartGoods);
        }
        entityManager.flush();
        return Response.ok(goods).build();
    }

    /**
     * Получить количество товаров в корзине
     *
     * @return количество
     */
    @GET
    @Path("/goods/count")
    @Transactional
    public Response getCartGoodsCount() {
        var user = getUserFromSubject(accessToken.getSubject());
        var userCartId = user.getCart().getId();

        var cartGoods = entityManager
                .createQuery("select c from CartGoods c where c.cart.id = ?1", CartGoods.class)
                .setParameter(1, userCartId)
                .getResultList();
        var count = 0;
        for (CartGoods cg : cartGoods) {
            count += cg.getCount_goods();
        }
        JsonObject jsonObject = new JsonObject();
        jsonObject.put("count", count);
        return Response.ok(count).build();
    }

    /**
     * Получить CartGoodsId
     *
     * @param cart    корзина текущего пользователя
     * @param product продукт
     * @return CartGoodsId
     */
    private CartGoodsId getCartGoodsId(Cart cart, GoodsLabels product) {
        CartGoodsId cartGoodsId = new CartGoodsId();
        cartGoodsId.setCart_id(cart.getId());
        cartGoodsId.setGoods_id(product.getId());
        return cartGoodsId;
    }

    /**
     * Получить пользователя по sub
     *
     * @param sub id в кейклоаке
     * @return user
     */
    private Users getUserFromSubject(String sub) {
        return entityManager.find(Users.class, UUID.fromString(sub));
    }
}
