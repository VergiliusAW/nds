package ru.aquarel.entities;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.Table;
import java.util.List;

@Entity
@Table(name = "categories")
public class CategoriesEntity {

    @Id
    @Getter
    @Setter
    private Long id;

    @Getter
    @Setter
    private String name;

    /**
     * Связь многие ко многим с таблицей goods_labels
     */
    @ManyToMany(mappedBy = "categoriesList")
    private List<GoodsLabelsEntity> goodsLabelsList;
}
