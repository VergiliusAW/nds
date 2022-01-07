package ru.aquarel.entities;

import lombok.Getter;
import lombok.Setter;
import ru.aquarel.enums.OrderStatus;

import javax.persistence.*;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "orders")
public class OrdersEntity {

    @Id
    @Getter
    @Setter
    @GeneratedValue
    private UUID id;

    @Getter
    @Setter
    private UUID id_nds_user;

    @Getter
    @Setter
    private OrderStatus status;

    @Getter
    @Setter
    @Temporal(TemporalType.DATE)
    private Date creation_date;

    @Getter
    @Setter
    @Temporal(TemporalType.DATE)
    private Date last_change_date;

    /**
     * Связь многие ко многим с таблицей goods
     */
    @Getter
    @Setter
    @ManyToMany
    @JoinTable(
            name = "order_goods",
            joinColumns = {@JoinColumn(name = "id_order", referencedColumnName = "id")},
            inverseJoinColumns = {@JoinColumn(name = "id_goods", referencedColumnName = "id")}
    )
    private List<GoodsEntity> goodsList;

    /**
     * Связь многие к одному с таблицей stores_warehouses для поля id_warehouse_in
     */
    @Getter
    @Setter
    @ManyToOne
    @JoinColumn(name = "id_warehouse_in", referencedColumnName = "id")
    private StoresWarehousesEntity warehouseIn;

    /**
     * Связь многие к одному с таблицей stores_warehouses для поля id_warehouse_out
     */
    @Getter
    @Setter
    @ManyToOne
    @JoinColumn(name = "id_warehouse_out", referencedColumnName = "id")
    private StoresWarehousesEntity warehouseOut;

}
