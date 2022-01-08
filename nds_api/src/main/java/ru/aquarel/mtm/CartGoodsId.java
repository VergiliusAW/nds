package ru.aquarel.mtm;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Embeddable;
import java.io.Serializable;
import java.util.UUID;

@Embeddable
public class CartGoodsId implements Serializable {

    private static final long serialVersionUID = 1L;

    public CartGoodsId() {

    }

    public CartGoodsId(Long cart_id, UUID goods_id) {
        super();
        this.cart_id = cart_id;
        this.goods_id = goods_id;
    }

    @Getter @Setter
    private Long cart_id;

    @Getter @Setter
    private UUID goods_id;

}
