package com.realestate.core.domain.exception;

import com.realestate.core.domain.model.BusinessEvent;
import com.realestate.core.domain.model.Role;

public class RbacViolationException extends RuntimeException {
    public RbacViolationException(Role role, BusinessEvent event) {
        super(String.format("RBAC Violation: Role [%s] is NOT allowed to perform Event [%s]", role, event));
    }
}