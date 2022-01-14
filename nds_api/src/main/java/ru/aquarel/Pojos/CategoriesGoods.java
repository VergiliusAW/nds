package ru.aquarel.Pojos;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

public class CategoriesGoods {

    @Getter
    @Setter
    private UUID id_goods;

    @Getter
    @Setter
    private Long id_category;
}
