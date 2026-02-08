import { createEventEnvelope } from '../contracts/events/createEventEnvelope';
import { CommandEnvelope } from '../domain/commands/CommandEnvelope';
import { ExecuteTransactionCommand } from '../domain/commands/ExecuteTransactionCommand';
import { ExecuteTxInput } from '../domain/commands/ExecuteTxInput';
import { decideTransaction } from '../domain/commands/guard/transactionGuard';
import { sendApproved, sendDenied } from '../eventBus/producer';
import { TransactionEventPublisher } from '../ports/TransactionEventPublisher';

export class ExecuteTransaction {
  constructor(
    private readonly publisher: TransactionEventPublisher
  ) {}

  async execute(
    command: CommandEnvelope<ExecuteTransactionCommand>
  ) {
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

      await this.publisher.approved(event);
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

    await this.publisher.denied(deniedEvent);
    return { result: 'DENIED' };
  }
}