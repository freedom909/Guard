// src/contracts/events/rabbitMQProducer.ts
import { EventEnvelope } from './EventEnvelope';
import { sendEvent as sendEventToRabbitMQ } from './rabbitMQProducer';


export async function sendEvent<T>(event: EventEnvelope<T>) {
  await sendEventToRabbitMQ(event);
}