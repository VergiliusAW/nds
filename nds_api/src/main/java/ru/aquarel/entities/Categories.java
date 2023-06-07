package ru.aquarel.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "categories")
public class Categories {

    @Id
    @Getter
    @Setter
    @GeneratedValue
    private Long id;

    @Getter
    @Setter
    @Column(unique = true)
    private String name;

    /**
     * Связь многие ко многим с таблицей goods_labels
     */
    @Getter
    @Setter
    @ManyToMany(mappedBy = "categories")
    @JsonIgnore
    private Set<GoodsLabels> goodsLabels = new HashSet<>();
}
