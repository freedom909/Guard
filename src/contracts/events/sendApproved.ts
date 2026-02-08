// src/contracts/events/sendApproved.ts

import { ApprovedEvent } from './ApprovedEvent';
import { sendEvent } from './rabbitMQProducer';

export async function sendApproved(event: ApprovedEvent) {
  await sendEvent(event);
}