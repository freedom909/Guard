// src/contracts/commands/createCommandEnvelope.ts

import { randomUUID } from 'crypto';
import { CommandEnvelope } from './CommandEnvelope';

export function createCommandEnvelope<TPayload>(
  payload: TPayload,
  meta: {
    type: string;
    source: string;
    correlationId: string;
    causationId?: string;
  }
): CommandEnvelope<TPayload> {
  return {
    commandId: randomUUID(),
    issuedAt: new Date().toISOString(),
    payload,
    ...meta,
  };
}
