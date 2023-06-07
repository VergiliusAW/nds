package ru.aquarel.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "stores_warehouses")
public class StoresWarehouses {

    @Id
    @Getter
    @Setter
    private UUID id;

    /**
     * Связь один к многим с таблицей orders
     */
    @Getter
    @Setter
    @OneToMany(mappedBy = "warehouseIn")
    @JsonIgnore
    private Set<Orders> ordersIn = new HashSet<>();

    /**
     * Связь один к многим с таблицей orders
     */
    @Getter
    @Setter
    @OneToMany(mappedBy = "warehouseOut")
    @JsonIgnore
    private Set<Orders> ordersOut = new HashSet<>();

    @Getter
    @Setter
    @OneToOne(mappedBy = "warehouse")
    @JsonIgnore
    private Stores store;

    @Getter
    @Setter
    @OneToMany(mappedBy = "warehouse")
    @JsonIgnore
    private Set<Goods> goods;
}
