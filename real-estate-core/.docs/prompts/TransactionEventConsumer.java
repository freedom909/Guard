package com.realestate.core.infrastructure.kafka;

import com.realestate.core.domain.exception.RbacViolationException;
import com.realestate.core.domain.model.BusinessEvent;
import com.realestate.core.domain.model.TransactionEvent;
import com.realestate.core.domain.policy.RbacPolicy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Service;

/**
 * Consumer 側制御
 * 詳細設計書 9.2 Consumer 側制御に基づく
 */
@Service
public class TransactionEventConsumer {

    private static final Logger logger = LoggerFactory.getLogger(TransactionEventConsumer.class);
    private final RbacPolicy rbacPolicy;

    public TransactionEventConsumer(RbacPolicy rbacPolicy) {
        this.rbacPolicy = rbacPolicy;
    }

    @KafkaListener(topics = "transaction-events", groupId = "audit-group")
    public void consume(TransactionEvent message, Acknowledgment ack) {
        try {
            // 9.2 Actor 情報が欠落しているイベントは即時 Reject
            if (message.getActor() == null || message.getActor().getRole() == null) {
                logger.error("Invalid Event: Actor information missing. EntityID: {}", message.getEntityId());
                return; 
            }

            // 9.2 Consumer は 必ず RBAC 再検証を行う
            BusinessEvent eventType = BusinessEvent.valueOf(message.getEvent());
            rbacPolicy.validate(message.getActor().getRole(), eventType);

            logger.info("Event Processed: {} by {}", message.getEvent(), message.getActor().getRole());
            ack.acknowledge();

        } catch (RbacViolationException e) {
            // 9.2 再検証失敗時は Dead Letter Queue に送信 (例外送出によりフレームワークに委譲)
            logger.error("Security Alert: RBAC Re-verification failed for event {}. User: {}", message.getEvent(), message.getActor().getUserId());
            throw e; 
        }
    }
}