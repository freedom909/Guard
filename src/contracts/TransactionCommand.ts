// contracts/TransactionCommand.ts
import { BusinessEvent,  Role } from '../cores/RbacPolicy';
import { BusinessState } from '../cores/StateMachine';


export interface TransactionCommand {
  entity_id: string;
  current_state: BusinessState;
  requested_event: BusinessEvent;
  actor: {
    user_id: string;
    role: Role;
  };
}
