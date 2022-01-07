package ru.aquarel.resources;

import io.quarkus.oidc.IdToken;
import io.quarkus.security.identity.SecurityIdentity;
import io.vertx.core.json.JsonObject;
import org.eclipse.microprofile.jwt.JsonWebToken;
import org.keycloak.KeycloakSecurityContext;
import org.keycloak.adapters.KeycloakDeployment;

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
    SecurityIdentity securityIdentity;

    @Inject
    JsonWebToken jsonWebToken;

    @GET
    @Path("/demo")
    @RolesAllowed("nds_user")
    public Response demo() {
        JsonObject jsonObject = new JsonObject();
        jsonObject.put("name",jsonWebToken.getClaim("given_name"));
        jsonObject.put("surname",jsonWebToken.getClaim("family_name"));
        jsonObject.put("id",jsonWebToken.getSubject());

        return Response.ok(jsonObject).build();
    }
}
