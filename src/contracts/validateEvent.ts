import { ZodSchema } from 'zod';
import { EventEnvelope } from './events/EventEnvelope';

export function validateEvent<T>(
  envelope: EventEnvelope<unknown>,
  schema: ZodSchema<T>
): EventEnvelope<T> {
  const parsed = schema.parse(envelope.data);
  return {
    ...envelope,
    data: parsed,
  };
}
