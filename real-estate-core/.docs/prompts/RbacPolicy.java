package com.realestate.core.domain.policy;

import com.realestate.core.domain.exception.RbacViolationException;
import com.realestate.core.domain.model.BusinessEvent;
import com.realestate.core.domain.model.Role;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Map;
import java.util.Set;

import static com.realestate.core.domain.model.BusinessEvent.*;
import static com.realestate.core.domain.model.Role.*;

/**
 * RBAC 実行マトリクス & ルール
 * 詳細設計書 6. RBAC 実行マトリクス & 7. RBAC 実行ルールに基づく
 */
@Component
public class RbacPolicy {

    // DP-03: Allow 明示方式。未定義は Deny。
    private static final Map<Role, Set<BusinessEvent>> PERMISSIONS = Map.of(
        ADMIN, Collections.emptySet(), // All Deny
        AGENT, Collections.emptySet(), // All Deny
        OWNER, Set.of(CONTRACT_CONCLUDED, PAYMENT_COMPLETED, TRANSACTION_COMPLETED),
        CUSTOMER, Set.of(APPLICATION_ACCEPTED, CONTRACT_CONCLUDED, TRANSACTION_COMPLETED),
        PENDING_AGENT, Collections.emptySet() // All Deny
    );

    /**
     * RBAC 判定ロジック
     * @throws RbacViolationException 権限がない場合
     */
    public void validate(Role role, BusinessEvent event) {
        if (role == null || event == null) {
            throw new IllegalArgumentException("Role and Event must not be null for RBAC check");
        }

        Set<BusinessEvent> allowedEvents = PERMISSIONS.getOrDefault(role, Collections.emptySet());

        if (!allowedEvents.contains(event)) {
            // 7. RBAC 実行ルール: Allow が明示されていない場合は Deny とする
            throw new RbacViolationException(role, event);
        }
    }
}