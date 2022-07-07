import { Request, Response } from 'express';
import { CloseQrCode, EnumDevices, OpenQrCode } from '../../services/protocoll_events';
export default class CobrancaController {
  constructor() {}

  public static async get(req: Request, res: Response) {
    res.send('Cobranca get');
  }

  public static async post(req: Request, res: Response) {
    const qrcode = req.body.qrcode;

    // if (req.body.action === 'open')
    //   OpenQrCode({
    //     base64_qrcode: qrcode,
    //     link_copy_paste: '',
    //     devices: [EnumDevices.desktop],
    //     callback: (ret) => {
    //       console.log(ret);
    //     },
    //   });

    // if (req.body.action === 'close') CloseQrCode({ callback: (ret) => console.log(ret) });

    res.send('Cobranca post');
  }

  public static put(req: Request, res: Response) {
    res.send('Cobranca put');
  }

  public static delete(req: Request, res: Response) {
    res.send('Cobranca delete');
  }
}
