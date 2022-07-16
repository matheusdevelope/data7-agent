import { Request, Response } from 'express';
import { CallQrCode, EnumDevices } from '../../services/protocoll_events';

async function get(req: Request, res: Response) {
  res.send('Cobranca get');
}

async function post(req: Request, res: Response) {
  const qrcode = req.body;
  function BadRequest(message: string) {
    return res.status(400).send(message);
  }

  const { action, id, awaiting_payment, confirmed_payment, canceled, img } = qrcode;
  if (!action) return BadRequest('action not provided');
  if (action !== 'open' && action !== 'update' && action !== 'close') return BadRequest('invalid action');
  if (!id) return BadRequest('id not provided');
  if (awaiting_payment == undefined) return BadRequest('awaiting_payment not provided');
  if (awaiting_payment !== true && awaiting_payment !== false) return BadRequest('awaiting_payment must be a boolean');
  if (confirmed_payment == undefined) return BadRequest('confirmed_payment not provided');
  if (confirmed_payment !== true && confirmed_payment !== false)
    return BadRequest('awaiting_payment must be a boolean');
  if (canceled == undefined) return BadRequest('canceled not provided');
  if (canceled !== true && canceled !== false) return BadRequest('awaiting_payment must be a boolean');
  if (!img && action !== 'close') return BadRequest('img not provided');

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
