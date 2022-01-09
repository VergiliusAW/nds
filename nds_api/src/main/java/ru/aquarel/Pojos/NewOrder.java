package ru.aquarel.Pojos;

import lombok.Getter;
import lombok.Setter;
import ru.aquarel.mtm.CartGoods;

import java.util.Set;
import java.util.UUID;

public class NewOrder {

    @Getter
    @Setter
    private UUID id_store;

    @Getter
    @Setter
    private Set<CartGoods> cartGoods;

}
