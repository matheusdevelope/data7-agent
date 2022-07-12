import { Request, Response } from 'express';
import { CallQrCode, EnumDevices } from '../../services/protocoll_events';

async function get(req: Request, res: Response) {
  res.send('Cobranca get');
}

async function post(req: Request, res: Response) {
  const qrcode = req.body;

  CallQrCode({
    qrcode: qrcode,
    devices: [EnumDevices.desktop],
    callback: (ret) => null,
  });

  res.send('Success');
}

async function put(req: Request, res: Response) {
  res.send('QrCode put');
}

async function deleteQr(req: Request, res: Response) {
  res.send('QrCode delete');
}
export default { get, post, put, deleteQr };
