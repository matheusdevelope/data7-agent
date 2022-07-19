import { exec } from 'child_process';
import { EnumTypeOfCallback, IOpenQrCode, EnumDevices } from '../../types/Protocoll_Events_App';
import { apenasNumeros, MakeParamsFromObj } from '../../utils';

function CallQrCode({ qrcode, devices, callback }: IOpenQrCode) {
  const params = MakeParamsFromObj(qrcode).join('^&');
  exec(`start data7://qrcode?${params}`);
  return callback({ type: EnumTypeOfCallback.success, message: 'Sucess on open window', error: null });
}

function SendMessageOnWhatsapp(data: IWhatsAppMessage) {
  const newData = {
    text: data.message,
    phone: '55' + apenasNumeros(data.phone),
  };
  const params = MakeParamsFromObj(newData).join('^&');
  exec('start whatsapp://send?' + params, (e, stdout, stderr) => {
    stderr && console.error(stderr);
  });
}
export { CallQrCode, EnumDevices, SendMessageOnWhatsapp };
