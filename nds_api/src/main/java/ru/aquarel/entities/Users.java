package ru.aquarel.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "users")
public class Users {

    @Id
    @Getter
    @Setter
    private UUID id;

    @Getter
    @Setter
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "id_user_info", referencedColumnName = "id")
    private UserInfo userInfo;

    @Getter
    @Setter
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "id_cart", referencedColumnName = "id")
    private Cart cart;
}
