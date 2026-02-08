import { ExecuteTransactionCommand } from '../ExecuteTransactionCommand';
import { DecisionResult } from '../decision/DecisionResult';

export function decideTransaction(
   command: ExecuteTransactionCommand
): DecisionResult {
  if (command.actorRole !== 'CUSTOMER') {
    return { result: 'DENIED', reason: 'RBAC_VIOLATION' };
  }

  if (command.fromState !== 'S02' || command.toState !== 'S03') {
    return { result: 'DENIED', reason: 'INVALID_STATE' };
  }

  return { result: 'APPROVED' };
}
