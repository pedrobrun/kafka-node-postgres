import express, { Request, Response } from 'express';
import { consumer, producer } from '../../app';

const paymentsRouter = express.Router();

paymentsRouter.get('/', async (req: Request, res: Response) => {
  return res.send({ ok: true });
});

paymentsRouter.post('/', async (req: Request, res: Response) => {
  const { sender, recipient, value } = req.body;

  if (!sender || !recipient || !value) {
    return res.send({ error: true, message: 'Not all args provided' });
  }

  const stringified = JSON.stringify({ sender, recipient, value });

  await consumer.subscribe({ topic: 'payment-response', fromBeginning: true });
  await producer.send({
    topic: 'send-payment',
    messages: [{ value: stringified }],
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (message && message.value) {
        console.log(message.value.toString());
      }
      const resMsg = message.value?.toString() ?? 'Error';

      res.send(JSON.parse(resMsg));
    },
  });
});

export default paymentsRouter;
