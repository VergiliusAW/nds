package ru.aquarel.entities;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "goods_labels")
public class GoodsLabelsEntity {

    @Id
    @Getter
    @Setter
    @GeneratedValue
    private UUID id;

    @Getter
    @Setter
    private String name;

    @Getter
    @Setter
    private String description;

    @Getter
    @Setter
    private double price;

    /**
     * Связь многие ко многим с таблицей cart
     */
    @Getter
    @Setter
    @ManyToMany
    @JoinTable(
            name = "cart_goods",
            joinColumns = {@JoinColumn(name = "id_cart", referencedColumnName = "id")},
            inverseJoinColumns = {@JoinColumn(name = "id_goods", referencedColumnName = "id")}
    )
    private List<CartEntity> cartList;

    /**
     * Связь многие ко многим с таблицей categories
     */
    @Getter
    @Setter
    @ManyToMany
    @JoinTable(
            name = "categories_goods",
            joinColumns = {@JoinColumn(name = "id_category", referencedColumnName = "id")},
            inverseJoinColumns = {@JoinColumn(name = "id_goods", referencedColumnName = "id")}
    )
    private List<CategoriesEntity> categoriesList;

    /**
     * Связь один к многим с таблицей goods
     */
    @OneToMany(mappedBy = "goodsLabel")
    private List<GoodsEntity> goodsList;
}
