// eventBus/producer.ts
import { Channel, connect } from 'amqplib';
import { TOPICS } from './topics';

const RABBIT_URL = 'amqp://localhost';
let channel: Channel;
async function getChannel() {
  if (typeof channel !== 'undefined') return channel;

  const conn = await connect(RABBIT_URL);
  channel = await conn.createChannel();

  await channel.assertExchange('tx.events', 'topic', { durable: true });
  return channel;
}

export async function sendApproved(payload: unknown) {
  const ch = await getChannel();
  ch.publish(
    'tx.events',
    'transaction.approved',
    Buffer.from(JSON.stringify(payload))
  );
}

export async function sendDenied(payload: unknown) {
  const ch = await getChannel();
  ch.publish(
    'tx.events',
    'transaction.denied',
    Buffer.from(JSON.stringify(payload))
  );
}