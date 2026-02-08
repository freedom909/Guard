import { createEventEnvelope } from '../contracts/events/createEventEnvelope';
import { ExecuteTransactionCommand } from '../domain/commands/ExecuteTransactionCommand';

import { sendApproved, sendDenied } from '../eventBus/producer';
import { decideTransaction } from '../domain/commands/guard/transactionGuard';
import { CommandEnvelope } from '../domain/commands/CommandEnvelope';

export async function executeTransaction(
  command: CommandEnvelope<ExecuteTransactionCommand>
) {
  const { payload, commandId, correlationId } = command;

  const decision = decideTransaction(payload); // 決定を行う
  const approved = decision.result === 'APPROVED';
  if (approved) {
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
      reasonCode: decision.reasonCode,
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

