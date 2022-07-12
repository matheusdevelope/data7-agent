import { Request, Response } from 'express';
import { CallQrCode, EnumDevices } from '../../protocoll_events';
export default class CobrancaController {
  constructor() {}

  public static async get(req: Request, res: Response) {
    console.log('CHAMADO GET');
    res.send('Cobranca get');
  }

  public static async post(req: Request, res: Response) {
    console.log('CHAMADO POST');
    const qrcode = req.body.qrcode;

    CallQrCode({
      qrcode: qrcode,
      devices: [EnumDevices.desktop],
      callback: (ret) => {
        console.log(ret);
      },
    });

    res.send('Cobranca post');
  }

  public static put(req: Request, res: Response) {
    res.send('Cobranca put');
  }

  public static delete(req: Request, res: Response) {
    res.send('Cobranca delete');
  }
}
