// contracts/events/TransactionDeniedEvent.ts
import { DecisionResult } from '../../domain/commands/decision/DecisionResult';
import { ViolationReason } from '../ViolationReason';
import { BusinessEvent, Role } from '../../domain/index';

export interface TransactionDeniedEvent {
  decision: 'DENIED';

  entity_id: string;

  event: BusinessEvent;
  actor_role: Role;

  reason: ViolationReason;
}
