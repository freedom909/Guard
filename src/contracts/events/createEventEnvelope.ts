import { randomUUID } from 'crypto';
import { EventEnvelope } from './EventEnvelope';

interface CreateEventOptions {
  type: string;
  source: string;
  correlationId: string;
  causationId?: string;
}

export function createEventEnvelope<T>(
  data: T,
  options: CreateEventOptions
): EventEnvelope<T> {
  return {
    specversion: '1.0',
    id: randomUUID(),
    type: options.type,
    source: options.source,
    time: new Date().toISOString(),

    correlationId: options.correlationId,
    causationId: options.causationId,

    data,
  };
}
