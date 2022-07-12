import { exec } from 'child_process';
import { EnumTypeOfCallback, ICloseQrCode, IOpenQrCode, EnumDevices } from '../../types/Protocoll_Events_App';
function MakeParamsFromObj<T>(obj: T) {
  let text = [];
  for (let props in obj) {
    if (typeof obj[props] == 'string') {
      text.push(props + '=' + EncodeURI(String(obj[props])));
    } else {
      text.push(props + '=' + obj[props]);
    }
  }
  return text;
}
function EncodeURI(text: string) {
  return encodeURIComponent(text);
}
function apenasNumeros(string: string) {
  return string.replace(/[^0-9]/g, '');
}
function CallQrCode({ qrcode, devices, callback }: IOpenQrCode) {
  const params = MakeParamsFromObj(qrcode).join('^&');
  exec(`start data7://qrcode?${params}`);
  return callback({ type: EnumTypeOfCallback.success, message: 'Sucess on open window', error: null });
}
// function CloseQrCode({ qrcode, devices, callback }: ICloseQrCode) {
//   const params = MakeParamsFromObj(qrcode).join('^&');
//   exec(`start data7://qrcode?${params}`);
//   return callback({ type: EnumTypeOfCallback.success, message: 'Sucess on close window', error: null });
// }

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
