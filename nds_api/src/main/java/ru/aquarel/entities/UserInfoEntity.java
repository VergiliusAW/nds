package ru.aquarel.entities;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

/**
 * Таблица с информацией о пользователе
 */
@Entity
@Table(name = "user_info")
public class UserInfoEntity {

    @Id
    @Getter
    @Setter
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_info_gen")
    @SequenceGenerator(name = "user_info_gen", sequenceName = "user_info_seq", allocationSize = 1, initialValue = 10)
    private Long id;

    /**
     * Номер телефона клиента
     */
    @Getter
    @Setter
    private String phone;

    @Getter
    @Setter
    @OneToOne(mappedBy = "userInfo")
    private UsersEntity user;
}
