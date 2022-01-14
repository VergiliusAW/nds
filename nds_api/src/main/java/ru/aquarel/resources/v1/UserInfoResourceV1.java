package ru.aquarel.resources.v1;

import org.eclipse.microprofile.jwt.JsonWebToken;
import ru.aquarel.entities.Cart;
import ru.aquarel.entities.UserInfo;
import ru.aquarel.entities.Users;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.UUID;

@Path("/api/v1/info")
@RolesAllowed("nds_user")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UserInfoResourceV1 {

    @Inject
    JsonWebToken jsonWebToken;

    @Inject
    EntityManager entityManager;

    /**
     * Установить user info
     *
     * @param userInfo информация о пользователе
     * @return утсановленную информацию
     */
    @POST
    @Path("/set")
    @Transactional
    public Response setUserInfo(UserInfo userInfo) {
        var user = entityManager.find(Users.class, UUID.fromString(jsonWebToken.getSubject()));
        if (user == null) {
            return Response.ok("Рано, пользователь ещё не сущетсвует").build();
        }

        userInfo.setId(user.getUserInfo().getId());
        user.setUserInfo(userInfo);
        entityManager.merge(user);
        entityManager.flush();
        return Response.ok(userInfo).build();
    }

    /**
     * Получить user info
     *
     * @return информация о пользователе
     */
    @GET
    @Path("/get")
    @Transactional
    public Response getUserInfo() {
        var user = entityManager.find(Users.class, UUID.fromString(jsonWebToken.getSubject()));
        //если пользователь не существует, то добавляем
        if (user == null) {
            user = new Users();
            user.setId(UUID.fromString(jsonWebToken.getSubject()));
            var cart = new Cart();
            var info = new UserInfo();
            user.setCart(cart);
            user.setUserInfo(info);
            entityManager.persist(user);
            entityManager.flush();
        }
        return Response.ok(user.getUserInfo()).build();
    }
}
