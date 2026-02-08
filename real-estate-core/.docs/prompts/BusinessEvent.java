package com.realestate.core.domain.model;

/**
 * 状態遷移イベント定義
 * 詳細設計書 5. 状態遷移定義に基づく
 */
public enum BusinessEvent {
    APPLICATION_ACCEPTED,
    CONTRACT_CONCLUDED,
    PAYMENT_COMPLETED,
    TRANSACTION_COMPLETED
}