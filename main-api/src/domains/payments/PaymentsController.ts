import express, { Request, Response } from 'express';
import { producer } from '../../app';

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

  await producer.send({
    topic: 'send-payment',
    messages: [{ value: stringified }],
  });
});

export default paymentsRouter;
