package ru.aquarel.mtm;

import lombok.Getter;
import lombok.Setter;
import ru.aquarel.entities.Cart;
import ru.aquarel.entities.Goods;
import ru.aquarel.entities.GoodsLabels;

import javax.persistence.*;

@Entity
@Table(name = "cart_goods")
public class CartGoods {

    @EmbeddedId
    @Getter
    @Setter
    private CartGoodsId cartGoodsId = new CartGoodsId();

    @Getter
    @Setter
    @ManyToOne
    @MapsId(value = "cart_id")
    private Cart cart;

    @Getter
    @Setter
    @ManyToOne
    @MapsId(value = "goods_id")
    private GoodsLabels goods;

    @Getter
    @Setter
    private Long count_goods;

}
