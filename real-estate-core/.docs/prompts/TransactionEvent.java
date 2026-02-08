package com.realestate.core.domain.model;

import java.time.Instant;

/**
 * イベント構造
 * 詳細設計書 9.1 イベント構造に基づく
 */
public class TransactionEvent {
    private String event;       // BusinessEvent.name()
    private String entityId;
    private Actor actor;
    private Instant occurredAt;

    public TransactionEvent() {}

    public TransactionEvent(BusinessEvent event, String entityId, Actor actor) {
        this.event = event.name();
        this.entityId = entityId;
        this.actor = actor;
        this.occurredAt = Instant.now();
    }

    public String getEvent() { return event; }
    public String getEntityId() { return entityId; }
    public Actor getActor() { return actor; }
    public Instant getOccurredAt() { return occurredAt; }

    public static class Actor {
        private String userId;
        private Role role;

        public Actor() {}
        public Actor(String userId, Role role) {
            this.userId = userId;
            this.role = role;
        }

        public String getUserId() { return userId; }
        public Role getRole() { return role; }
    }
}