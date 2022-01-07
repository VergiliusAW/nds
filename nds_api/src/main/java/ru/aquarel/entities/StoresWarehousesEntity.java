package ru.aquarel.entities;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "stores_warehouses")
public class StoresWarehousesEntity {

    @Id @Getter @Setter
    private UUID id;

    /**
     * Связь один к многим с таблицей orders
     */
    @Getter
    @Setter
    @OneToMany(mappedBy = "warehouseIn")
    private List<OrdersEntity> ordersListIn;

    /**
     * Связь один к многим с таблицей orders
     */
    @Getter
    @Setter
    @OneToMany(mappedBy = "warehouseOut")
    private List<OrdersEntity> ordersListOut;

    @Getter
    @Setter
    @OneToOne(mappedBy = "warehouse")
    private StoresEntity store;
}
