// contracts/events/index.ts
import { EventEnvelope } from './EventEnvelope';
import { TransactionApprovedEvent } from './TransactionApprovedEvent';
import { TransactionDeniedEvent } from './TransactionDeniedEvent';

export type TransactionApprovedEnvelope =
  EventEnvelope<TransactionApprovedEvent>;

export type TransactionDeniedEnvelope =
  EventEnvelope<TransactionDeniedEvent>;
