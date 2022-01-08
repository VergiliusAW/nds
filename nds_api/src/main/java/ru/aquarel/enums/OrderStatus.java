package ru.aquarel.enums;

public enum OrderStatus {
    /**
     * Новый заказ
     */
    NEW,

    /**
     * Готов к отправке
     */
    READY_TO_SHIPMENT,

    /**
     * В пути
     */
    IN_TRANSIT,

    /**
     * Готов к выдаче
     */
    READY_TO_ISSUE,

    /**
     * Выдан
     */
    ISSUED,

    /**
     * Отменён
     */
    CANCELED
}
