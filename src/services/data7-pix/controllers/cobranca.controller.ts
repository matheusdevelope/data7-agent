import { Request, Response } from 'express';
import { CloseQrCode, EnumDevices, OpenQrCode } from '../../protocoll_events';
export default class CobrancaController {
  constructor() {}

  public static async get(req: Request, res: Response) {
    console.log('CHAMADO GET');
    res.send('Cobranca get');
  }

  public static async post(req: Request, res: Response) {
    console.log('CHAMADO POST');
    // res.redirect('electron-fiddle://open');
    const qrcode = req.body.qrcode;

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

    res.send('Cobranca post');
  }

  public static put(req: Request, res: Response) {
    res.send('Cobranca put');
  }

  public static delete(req: Request, res: Response) {
    res.send('Cobranca delete');
  }
}
