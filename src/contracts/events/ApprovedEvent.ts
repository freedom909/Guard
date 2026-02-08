// src/contracts/events/ApprovedEvent.ts
import { EventEnvelope } from './EventEnvelope';

export type ApprovedEvent = EventEnvelope<{
  entityId: string;
}>;