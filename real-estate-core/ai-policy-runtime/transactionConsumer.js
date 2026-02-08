const { Kafka } = require('kafkajs');
const { RbacPolicy, RbacViolationError } = require('./rbacPolicy');

const kafka = new Kafka({
  clientId: 'audit-service',
  brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'audit-group' });
const rbacPolicy = new RbacPolicy();

async function start() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'transaction-events', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const event = JSON.parse(message.value.toString());

      // Actor 校验
      if (!event.actor || !event.actor.role) {
        console.error('Invalid Event: Actor info missing', event.entityId);
        return;
      }

      try {
        // RBAC 再验证
        rbacPolicy.validate(event.actor.role, event.event);

        console.log(
          `Event processed: ${event.event}, role=${event.actor.role}`
        );

      } catch (err) {
        if (err instanceof RbacViolationError) {
          console.error('SECURITY ALERT:', err.message);
          // 这里可以丢到 DLQ
          throw err;
        }
        throw err;
      }
    }
  });
}

start().catch(console.error);
