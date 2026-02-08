package com.realestate.core.domain.policy;

import com.realestate.core.domain.exception.StateTransitionViolationException;
import com.realestate.core.domain.model.BusinessEvent;
import com.realestate.core.domain.model.BusinessState;
import org.springframework.stereotype.Component;

import java.util.Map;

import static com.realestate.core.domain.model.BusinessEvent.*;
import static com.realestate.core.domain.model.BusinessState.*;

/**
 * 状態遷移定義
 * 詳細設計書 5. 状態遷移定義に基づく
 */
@Component
public class StateTransitionPolicy {

    // Key: Current State, Value: Map<Event, Next State>
    private static final Map<BusinessState, Map<BusinessEvent, BusinessState>> TRANSITIONS = Map.of(
        S01, Map.of(APPLICATION_ACCEPTED, S02),
        S02, Map.of(CONTRACT_CONCLUDED, S03),
        S03, Map.of(PAYMENT_COMPLETED, S04),
        S04, Map.of(TRANSACTION_COMPLETED, S05)
    );

    /**
     * 状態遷移検証および次状態取得
     * @throws StateTransitionViolationException 定義されていない遷移の場合
     */
    public BusinessState nextState(BusinessState currentState, BusinessEvent event) {
        if (currentState == null || event == null) {
            throw new IllegalArgumentException("Current state and event must not be null");
        }

        Map<BusinessEvent, BusinessState> allowedTransitions = TRANSITIONS.get(currentState);

        if (allowedTransitions == null || !allowedTransitions.containsKey(event)) {
            // 詳細設計書 5. ※ 本表に記載のない遷移は一切認めない。
            throw new StateTransitionViolationException(currentState, event);
        }

        return allowedTransitions.get(event);
    }
}