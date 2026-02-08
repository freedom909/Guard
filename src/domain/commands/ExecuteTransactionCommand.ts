// src/domain/commands/ExecuteTransactionCommand.ts

// domain/commands/ExecuteTransactionCommand.ts
import { BusinessEvent, Role } from '../../cores/RbacPolicy';
import { BusinessState } from '../../cores/StateMachine';

export interface ExecuteTransactionCommand {
  entityId: string;
  fromState: BusinessState;
  toState: BusinessState;
  event: BusinessEvent;
  actorRole: Role;
}

