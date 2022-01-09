package ru.aquarel.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import ru.aquarel.enums.OrderStatus;

import javax.persistence.*;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "orders")
public class Orders {

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
    @CreationTimestamp
    private Date creation_date;

    @Getter
    @Setter
    @Temporal(TemporalType.DATE)
    @UpdateTimestamp
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
    @JsonIgnore
    private Set<Goods> goods = new HashSet<>();

    /**
     * Связь многие к одному с таблицей stores_warehouses для поля id_warehouse_in
     */
    @Getter
    @Setter
    @ManyToOne
    @JoinColumn(name = "id_warehouse_in", referencedColumnName = "id")
    private StoresWarehouses warehouseIn;

    /**
     * Связь многие к одному с таблицей stores_warehouses для поля id_warehouse_out
     */
    @Getter
    @Setter
    @ManyToOne
    @JoinColumn(name = "id_warehouse_out", referencedColumnName = "id")
    private StoresWarehouses warehouseOut;

}
