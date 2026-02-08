package com.realestate.core.domain.exception;

import com.realestate.core.domain.model.BusinessEvent;
import com.realestate.core.domain.model.BusinessState;

public class StateTransitionViolationException extends RuntimeException {
    public StateTransitionViolationException(BusinessState current, BusinessEvent event) {
        super(String.format("Invalid State Transition: Cannot trigger Event [%s] from State [%s]", event, current));
    }
}