package ru.aquarel.entities;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "goods")
public class GoodsEntity {

    @Id
    @Getter
    @Setter
    @GeneratedValue
    private UUID id;

    /**
     * Связь многие к одному с таблицей goods_labels
     */
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "id_label", nullable = false, referencedColumnName = "id")
    private GoodsLabelsEntity goodsLabel;

    /**
     * Связь многие ко многим с таблицей orders
     */
    @Getter
    @Setter
    @ManyToMany(mappedBy = "goodsList")
    private List<OrdersEntity> ordersList;
}
