package ru.aquarel.entities;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "cart")
public class CartEntity {

    @Id
    @Getter
    @Setter
    private Long id;

    @Getter
    @Setter
    @OneToOne(mappedBy = "cart")
    private UsersEntity user;

    /**
     * Связь многие ко многим с таблицей goods_labels
     */
    @Getter
    @Setter
    @ManyToMany(mappedBy = "cartList")
    private List<GoodsLabelsEntity> goodsLabelsList;
}
