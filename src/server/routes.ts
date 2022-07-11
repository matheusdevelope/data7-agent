import { Router, Request, Response } from 'express';
import QrCode from './controllers/QrCode';

export default function ApiRoute() {
  const router = Router();

  router.get('/', (req: Request, res: Response) => {
    res.send('Data7 Agent is Working!');
  });

  router.get('/qrcode', QrCode.get);
  router.post('/qrcode', QrCode.post);
  router.put('/qrcode', QrCode.put);
  router.delete('/qrcode', QrCode.deleteQr);
  return router;
}
