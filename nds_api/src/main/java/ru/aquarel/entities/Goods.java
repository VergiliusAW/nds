package ru.aquarel.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "goods")
public class Goods {

    @Id
    @Getter
    @Setter
    @GeneratedValue
    private UUID id;

    /**
     * Связь многие к одному с таблицей goods_labels
     */
    @Getter
    @Setter
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "id_label", referencedColumnName = "id")
    private GoodsLabels goodsLabel;

    /**
     * Связь многие ко многим с таблицей orders
     */
    @Getter
    @Setter
    @ManyToMany(mappedBy = "goods")
    @JsonIgnore
    private Set<Orders> orders = new HashSet<>();

    @Getter
    @Setter
    @ManyToOne
    @JoinColumn(name = "id_warehouse", referencedColumnName = "id")
    private StoresWarehouses warehouse;
}
