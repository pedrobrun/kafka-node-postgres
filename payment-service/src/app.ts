import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  brokers: ['localhost:9092'],
  clientId: 'payment-service',
});

const consumer = kafka.consumer({ groupId: 'payment-group' });

const producer = kafka.producer();

async function run() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'send-payment', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (message && message.value) {
        console.log(message.value.toString());
      }

      // TODO: db interaction

      await producer.connect();
      const stringifiedRes = JSON.stringify({
        message: 'Values were consumed by consumer',
      });
      producer.send({
        topic: 'payment-response',
        messages: [{ value: stringifiedRes }],
      });
    },
  });
}

run().catch(console.error);
