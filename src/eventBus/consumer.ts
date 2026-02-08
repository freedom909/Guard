import { connect, Channel } from 'amqplib';
import { ExecuteTransaction } from '../application/executeTransaction';
import { TransactionEventBusPublisher } from '../eventBus/TransactionEventBusPublisher';
import { CommandEnvelope } from '../domain/commands/CommandEnvelope';
import { ExecuteTransactionCommand } from '../domain/commands/ExecuteTransactionCommand';

const RABBIT_URL = 'amqp://localhost';

let channel: Channel;

// ✅ Composition Root（Infra 层允许 new）
const publisher = new TransactionEventBusPublisher();
const executeTransactionSkill = new ExecuteTransaction(publisher);

async function getChannel() {
  if (channel) return channel;

  const conn = await connect(RABBIT_URL);
  channel = await conn.createChannel();

  await channel.assertExchange('tx.events', 'topic', { durable: true });
  await channel.assertQueue('tx.commands', { durable: true });
  await channel.bindQueue(
    'tx.commands',
    'tx.events',
    'transaction.command'
  );

  return channel;
}

export async function startConsumer() {
  const ch = await getChannel();

  await ch.consume('tx.commands', async (msg) => {
    if (!msg) return;

    try {
      const command = JSON.parse(
        msg.content.toString()
      ) as CommandEnvelope<ExecuteTransactionCommand>;

      await executeTransactionSkill.execute(command); // ✅ 正确
      ch.ack(msg);
    } catch (err) {
      console.error('Failed to process message', err);
      ch.nack(msg, false, false); // dead-letter
    }
  });
}
