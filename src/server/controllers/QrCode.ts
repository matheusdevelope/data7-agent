import { Request, Response } from 'express';
import { CloseQrCode, EnumDevices, OpenQrCode } from '../../services/protocoll_events';

async function get(req: Request, res: Response) {
  res.send('Cobranca get');
}

async function post(req: Request, res: Response) {
  const qrcode = req.body;

  if (req.body.action === 'open')
    OpenQrCode({
      qrcode: qrcode,
      devices: [EnumDevices.desktop],
      callback: (ret) => {
        console.log(ret);
      },
    });

  if (req.body.action === 'close')
    CloseQrCode({
      qrcode: qrcode,
      devices: [EnumDevices.desktop],
      callback: (ret) => {
        console.log(ret);
      },
    });

  res.send('QrCode post');
}

async function put(req: Request, res: Response) {
  res.send('QrCode put');
}

async function deleteQr(req: Request, res: Response) {
  res.send('QrCode delete');
}
export default { get, post, put, deleteQr };
