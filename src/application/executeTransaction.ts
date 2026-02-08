import { createEventEnvelope } from '../contracts/events/createEventEnvelope';
import { CommandEnvelope } from '../domain/commands/CommandEnvelope';
import { ExecuteTransactionCommand } from '../domain/commands/ExecuteTransactionCommand';
import { ExecuteTxInput } from '../domain/commands/ExecuteTxInput';
import { decideTransaction } from '../domain/commands/guard/transactionGuard';
import { sendApproved, sendDenied } from '../eventBus/producer';



export async function executeTransaction(
  command: CommandEnvelope<ExecuteTransactionCommand>
) {
  const { payload, commandId, correlationId } = command;
  
  const decision = decideTransaction(payload);// 
  const approved = decision.result === 'APPROVED';

  if (approved) {
    const event = createEventEnvelope(
      { ...payload },
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

