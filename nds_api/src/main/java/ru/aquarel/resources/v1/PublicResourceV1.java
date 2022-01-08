package ru.aquarel.resources.v1;

import ru.aquarel.entities.GoodsLabels;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Response;
import java.util.UUID;

@Path("/api/v1/public")
public class PublicResourceV1 {

    @Inject
    EntityManager entityManager;
    /**
     * Получить список всех товаров
     * @return
     */
    @GET
    @Path("/get/all/goods")
    public Response getAllGoodsLabels() {
        var resList = entityManager.createQuery("select g from GoodsLabels g", GoodsLabels.class).getResultList();
        return Response.ok(resList).build();
    }

    /**
     * Получить всю информацию о конкретном товаре
     * @return
     */
    @Path("/get/all/goods/{id}")
    public Response getAllGoodsInfo(@PathParam("id") UUID id) {
        var product = new GoodsLabels();
        product.setId(id);
        product = entityManager.find(GoodsLabels.class, product.getId());
        return Response.ok(product).build();
    }
}
