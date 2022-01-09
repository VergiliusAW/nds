package ru.aquarel.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "goods_labels")
public class GoodsLabels {

    @Id
    @Getter
    @Setter
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    @Column(nullable = false)
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
    @ManyToMany(mappedBy = "goodsLabels")
    @JsonIgnore
    private Set<Cart> carts = new HashSet<>();

    /**
     * Связь многие ко многим с таблицей categories
     */
    @Getter
    @Setter
    @ManyToMany
    @JoinTable(
            name = "categories_goods",
            joinColumns = {@JoinColumn(name = "id_goods", referencedColumnName = "id")},
            inverseJoinColumns = {@JoinColumn(name = "id_category", referencedColumnName = "id")}
    )
    @JsonIgnore
    private Set<Categories> categories = new HashSet<>();

    /**
     * Связь один к многим с таблицей goods
     */
    @Getter
    @Setter
    @OneToMany(mappedBy = "goodsLabel")
    @JsonIgnore
    private Set<Goods> goods = new HashSet<>();
}
