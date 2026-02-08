// src/domain/commands/guard/transactionGuard.ts
import { ExecuteTransactionCommand } from '../ExecuteTransactionCommand';
import { TransactionDecision} from '../policies/transactionDecision';
import { TransactionDecisionReasonCode } from '../policies/TransactionDecisionReasonCode';

export function decideTransaction(command: ExecuteTransactionCommand): TransactionDecision {
  // 这里模拟 RBAC & 状态校验逻辑
  if (command.actorRole !== 'ADMIN') {
    return {
      result: 'DENIED',
      reasonCode: TransactionDecisionReasonCode.RBAC_VIOLATION,
    };
  }

  if (command.fromState !== 'S02' || command.toState !== 'S03') {
    return {
      result: 'DENIED',
      reasonCode: TransactionDecisionReasonCode.INVALID_STATE_TRANSITION,
    };
  }

  // 通过所有校验
  return {
    result: 'APPROVED',
  };
}
