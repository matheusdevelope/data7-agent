import { exec } from 'child_process';
import { EnumTypeOfCallback, ICloseQrCode, IOpenQrCode, EnumDevices } from '../../types/Protocoll_Events_App';

function OpenQrCode({ base64_qrcode, link_copy_paste, devices, callback }: IOpenQrCode) {
  exec(`start data7://open?qrcode=` + base64_qrcode, (e, stdout, stderr) => {});
  return callback({ type: EnumTypeOfCallback.success, message: 'Sucess on open window', error: null });
}
function CloseQrCode({ callback }: ICloseQrCode) {
  exec(`start data7://close`, (e, stdout, stderr) => {});
  return callback({ type: EnumTypeOfCallback.success, message: 'Sucess on close window', error: null });
}

function SendMessageOnWhatsapp(data: IWhatsAppMessage) {
  const baseProtocoll = 'start whatsapp://send?';
  const text = 'text=';
  const and = '^&';
  const phone = 'phone=55';
  function apenasNumeros(string: string) {
    return string.replace(/[^0-9]/g, '');
  }
  function EncodeURI(text: string) {
    return encodeURIComponent(text);
  }
  const ToExec = baseProtocoll + phone + apenasNumeros(data.phone) + and + text + EncodeURI(data.message);
  exec(ToExec, (e, stdout, stderr) => {
    stderr && console.error(stderr);
  });
}
export { OpenQrCode, CloseQrCode, EnumDevices, SendMessageOnWhatsapp };
