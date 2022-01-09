package ru.aquarel.Pojos;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

public class AvailabilityGoods {

    @Getter
    @Setter
    private UUID id_goodsLabel;

    @Getter
    @Setter
    private UUID id_store;
}
