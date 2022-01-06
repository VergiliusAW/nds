package ru.aquarel.resources;

import io.vertx.core.json.JsonObject;
import org.eclipse.microprofile.jwt.JsonWebToken;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class DemoResource {

    @Inject
    JsonWebToken jsonWebToken;

    @GET
    @Path("/demo")
    @RolesAllowed("nds_user")
    public Response demo() {
        JsonObject jsonObject = new JsonObject();
        jsonObject.put("Имя",jsonWebToken.getClaim("given_name"));
        jsonObject.put("Фамилия",jsonWebToken.getClaim("family_name"));
        return Response.ok(jsonObject).build();
    }
}
