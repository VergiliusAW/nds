package ru.aquarel.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.Getter;
import lombok.Setter;
import ru.aquarel.mtm.CartGoods;

import javax.persistence.*;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "cart")
public class Cart {

    @Id
    @Getter
    @Setter
    @GeneratedValue
    private Long id;

    @Getter
    @Setter
    @OneToOne(mappedBy = "cart")
    @JsonIgnore
    private Users user;

    /**
     * Связь многие ко многим с таблицей goods_labels
     */
    @Getter
    @Setter
    @ManyToMany()
    @JoinTable(
            name = "cart_goods",
            joinColumns = {@JoinColumn(name = "cart_id")},
            inverseJoinColumns = {@JoinColumn(name = "goods_id")}
    )
    @JsonIgnore
    private Set<GoodsLabels> goodsLabels = new HashSet<>();

//    @Getter @Setter
//    @OneToMany(mappedBy = "cart")
//    @JsonIgnore
//    private Set<CartGoods> cartGoods = new HashSet<>();
}
