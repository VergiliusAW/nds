package ru.aquarel.entities;

import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "stores")
public class Stores {

    @Id
    @Getter
    @Setter
    @GeneratedValue
    private UUID id;

    @Getter
    @Setter
    private UUID id_nds_manager;

    @Getter
    @Setter
    private String address;

    @Getter
    @Setter
    @OneToOne
    @JoinColumn(name = "id_store_warehouse", referencedColumnName = "id")
    private StoresWarehouses warehouse;
}
