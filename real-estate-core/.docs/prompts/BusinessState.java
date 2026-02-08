package com.realestate.core.domain.model;

/**
 * 業務状態定義 (Business States)
 * 詳細設計書 4. 業務状態定義に基づく
 */
public enum BusinessState {
    S01("Applied"),
    S02("ApplicationAccepted"),
    S03("ContractConcluded"),
    S04("PaymentCompleted"),
    S05("TransactionCompleted"),
    S0X("Refunded");

    private final String description;

    BusinessState(String description) {
        this.description = description;
    }
}