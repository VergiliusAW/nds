package ru.aquarel.resources.v1;

import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.security.SecurityRequirement;
import ru.aquarel.Pojos.CategoriesGoods;
import ru.aquarel.entities.Categories;
import ru.aquarel.entities.GoodsLabels;
import ru.aquarel.entities.Stores;
import ru.aquarel.entities.StoresWarehouses;

@Path("/api/v1/admin")
@SecurityRequirement(name = "SecurityScheme")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AdminGodV1 {

    @Inject
    EntityManager entityManager;

    /**
     * Просто простое добавление магазина
     *
     * @param store магазин
     * @return добавленный магазин
     */
    @POST
    @Path("/store/add")
    @Transactional
    public Response setStore(Stores store) {
        entityManager.persist(store);
        entityManager.flush();
        return Response.ok(store).build();
    }

    /**
     * Просто простое добавление склада
     *
     * @param warehouse склад
     * @return добавленный склад
     */
    @POST
    @Path("/warehouse/add")
    @Transactional
    public Response setWarehouse(StoresWarehouses warehouse) {
        entityManager.persist(warehouse);
        entityManager.flush();
        return Response.ok(warehouse).build();
    }

    /**
     * Добавить запись в goods-labels
     *
     * @param goodsLabels товар
     * @return товар
     */
    @POST
    @Path("/goods/add")
    @Transactional
    public Response postGoodsLabels(GoodsLabels goodsLabels) {
        entityManager.persist(goodsLabels);
        entityManager.flush();
        return Response.ok(goodsLabels).build();
    }

    /**
     * Добавить категорию
     *
     * @param category категория
     * @return добавленная категория
     */
    @POST
    @Path("/category/add")
    @Transactional
    public Response postCategories(Categories category) {
        entityManager.persist(category);
        entityManager.flush();
        return Response.ok(category).build();
    }

    @POST
    @Path("/goods/category")
    @Transactional
    public Response postCategoriesGoods(CategoriesGoods categoriesGoods) {
        var product = entityManager.find(GoodsLabels.class, categoriesGoods.getId_goods());
        var category = entityManager.find(Categories.class, categoriesGoods.getId_category());
        product.getCategories().add(category);
        entityManager.merge(product);
        entityManager.flush();
        return Response.ok(product).build();
    }
}
