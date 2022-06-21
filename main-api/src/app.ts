import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Kafka } from 'kafkajs';
import paymentsRouter from './domains/payments/PaymentsController';

dotenv.config();
const port = process.env.PORT || 3000;
const app = express();

const kafka = new Kafka({
  clientId: 'main-api',
  brokers: ['localhost:9092'],
  retry: {
    initialRetryTime: 300,
    retries: 10,
  },
});

export const consumer = kafka.consumer({ groupId: 'main-api' });
export const producer = kafka.producer();

async function startApp() {
  app.use(express.json());
  app.use(cors());
  await producer.connect();
  await consumer.connect();

  app.get('/', (req, res) => {
    res.send('💰 Payments Main Api 💰');
  });

  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });

  // routes
  app.use('/payment', paymentsRouter);
}

startApp();
