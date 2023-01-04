import express from 'express';
import cors from 'cors';
import type { Server } from 'http';

const server = (): Promise<Server> => {
  const app = express();
  app.use(cors());

  app.get('/health', (req, res) => {
    res.status(200).send();
  });

  return new Promise((resolve) => {
    const s = app.listen(3000, () => resolve(s));
  });
};
export default server;
