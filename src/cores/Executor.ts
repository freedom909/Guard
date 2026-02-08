import { ExecuteTransaction } from '../application/executeTransaction';
import { TransactionEventBusPublisher } from '../eventBus/TransactionEventBusPublisher';

const publisher = new TransactionEventBusPublisher();
const executeTransactionSkill = new ExecuteTransaction(publisher);

export async function executeTransaction(command: any) {
  return executeTransactionSkill.execute(command);
}
