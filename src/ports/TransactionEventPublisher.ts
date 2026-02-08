// ports/TransactionEventPublisher.ts

import { EventEnvelope } from "../contracts/events/EventEnvelope";

export interface TransactionEventPublisher {
  approved(event: EventEnvelope): Promise<void>;
  denied(event: EventEnvelope): Promise<void>;
}