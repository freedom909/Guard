package com.realestate.core.infrastructure.kafka;

import com.realestate.core.domain.model.BusinessEvent;
import com.realestate.core.domain.model.BusinessState;
import com.realestate.core.domain.model.Role;
import com.realestate.core.domain.model.TransactionEvent;
import com.realestate.core.domain.policy.RbacPolicy;
import com.realestate.core.domain.policy.StateTransitionPolicy;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * イベント発行および状態遷移オーケストレーター
 * 詳細設計書 8. 状態遷移実行フロー（RBAC 統合）に基づく
 */
@Service
public class TransactionEventPublisher {

    private final RbacPolicy rbacPolicy;
    private final StateTransitionPolicy stateTransitionPolicy;
    private final KafkaTemplate<String, TransactionEvent> kafkaTemplate;

    public TransactionEventPublisher(RbacPolicy rbacPolicy, 
                                     StateTransitionPolicy stateTransitionPolicy,
                                     KafkaTemplate<String, TransactionEvent> kafkaTemplate) {
        this.rbacPolicy = rbacPolicy;
        this.stateTransitionPolicy = stateTransitionPolicy;
        this.kafkaTemplate = kafkaTemplate;
    }

    @Transactional
    public BusinessState executeTransition(String entityId, BusinessState currentState, BusinessEvent event, String userId, Role role) {
        // 1. [判断主体チェック] & 2. [RBAC 権限チェック]
        rbacPolicy.validate(role, event);

        // 3. [現在状態検証] & 4. [状態遷移]
        BusinessState nextState = stateTransitionPolicy.nextState(currentState, event);

        // 5. [イベント発行]
        TransactionEvent transactionEvent = new TransactionEvent(event, entityId, new TransactionEvent.Actor(userId, role));
        kafkaTemplate.send("transaction-events", entityId, transactionEvent);

        return nextState;
    }
}