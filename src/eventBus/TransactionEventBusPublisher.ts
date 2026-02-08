import { TransactionEventPublisher } from '../ports/TransactionEventPublisher';
import { sendApproved, sendDenied } from './producer';
import { EventEnvelope } from '../contracts/events/EventEnvelope';

export class TransactionEventBusPublisher
  implements TransactionEventPublisher {

  async approved(event: EventEnvelope): Promise<void> {
    await sendApproved(event);
  }

  async denied(event: EventEnvelope): Promise<void> {
    await sendDenied(event);
  }
}
