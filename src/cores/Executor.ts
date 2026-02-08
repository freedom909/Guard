//cores/Executor.ts

import { createEventEnvelope } from '../contracts/events/createEventEnvelope';
import { CommandEnvelope } from '../domain/commands/CommandEnvelope';
import { ExecuteTransactionCommand } from '../domain/commands/ExecuteTransactionCommand';
import { decideTransaction } from '../domain/commands/guard/transactionGuard';
import { sendApproved, sendDenied } from '../eventBus/producer';

export async function executeTransaction(
  command: CommandEnvelope<ExecuteTransactionCommand>
): Promise<{ result: 'APPROVED' | 'DENIED' }> {

  const { payload, commandId, correlationId } = command;

  const decision = decideTransaction(payload);

  if (decision.result === 'APPROVED') {
    const event = createEventEnvelope(
      {
        entityId: payload.entityId,
        fromState: payload.fromState,
        toState: payload.toState,
        actorRole: payload.actorRole,
        event: payload.event,
      },
      {
        type: 'transaction.approved',
        source: 'skill.executeTransaction',
        correlationId,
        causationId: commandId,
      }
    );

    await sendApproved(event);
    return { result: 'APPROVED' };
  }

  const deniedEvent = createEventEnvelope(
    {
      actorRole: payload.actorRole,
      reason: decision.reason,
    },
    {
      type: 'transaction.denied',
      source: 'skill.executeTransaction',
      correlationId,
      causationId: commandId,
    }
  );

  await sendDenied(deniedEvent);
  return { result: 'DENIED' };
}
