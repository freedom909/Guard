// contracts/events/TransactionApprovedEvent.ts
import { DecisionResult } from '../../domain/commands/decision/DecisionResult';
import { BusinessEvent, Role } from '../../domain/index';
import { BusinessState } from '../../cores/StateMachine';

export interface TransactionApprovedEvent {
  decision: 'APPROVED';

  entity_id: string;

  from_state: BusinessState;
  to_state: BusinessState;

  event: BusinessEvent;
  actor_role: Role;

  audit: string;
}
