// src/domain/commands/guard/transactionGuard.ts
import { ExecuteTransactionCommand } from '../ExecuteTransactionCommand';
import { TransactionDecision} from '../policies/transactionDecision';
import { TransactionDecisionReasonCode } from '../policies/TransactionDecisionReasonCode';
import { validateRbac } from '../../../cores/RbacPolicy';
import { getNextState } from '../../../cores/StateMachine';

export function decideTransaction(command: ExecuteTransactionCommand): TransactionDecision {
  // 1. RBAC Check
  if (!validateRbac(command.actorRole, command.event)) {
    return {
      result: 'DENIED',
      reasonCode: TransactionDecisionReasonCode.RBAC_VIOLATION,
    };
  }

  // 2. State Machine Check
  const nextState = getNextState(command.fromState, command.event);
  
  if (!nextState || nextState !== command.toState) {
    return {
      result: 'DENIED',
      reasonCode: TransactionDecisionReasonCode.INVALID_STATE_TRANSITION,
    };
  }

  // 3. Approved
  return {
    result: 'APPROVED',
  };
}
