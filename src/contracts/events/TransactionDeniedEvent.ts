// contracts/events/TransactionDeniedEvent.ts
import { DecisionResult } from './DecisionResult';
import { ViolationReason } from '../ViolationReason';
import { BusinessEvent, Role } from '../../domain/index';

export interface TransactionDeniedEvent {
  decision: DecisionResult.DENIED;

  entity_id: string;

  event: BusinessEvent;
  actor_role: Role;

  reason: ViolationReason;
}
