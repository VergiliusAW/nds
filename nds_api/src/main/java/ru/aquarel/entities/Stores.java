package ru.aquarel.entities;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "stores")
//@JsonIdentityInfo(
//        generator = ObjectIdGenerators.PropertyGenerator.class,
//        property = "id"
//)
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
