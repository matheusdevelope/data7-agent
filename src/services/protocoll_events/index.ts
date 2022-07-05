import { exec } from 'child_process';
import { EnumTypeOfCallback, ICloseQrCode, IOpenQrCode, EnumDevices } from '../../types/Protocoll_Events_App';

function OpenQrCode({ base64_qrcode, link_copy_paste, devices, callback }: IOpenQrCode) {
  exec(`start electron-fiddle://open?qrcode=` + base64_qrcode, (e, stdout, stderr) => {});
  return callback({ type: EnumTypeOfCallback.success, message: 'Sucess on open window', error: null });
}
function CloseQrCode({ callback }: ICloseQrCode) {
  exec(`start electron-fiddle://close`, (e, stdout, stderr) => {});
  return callback({ type: EnumTypeOfCallback.success, message: 'Sucess on close window', error: null });
}

export { OpenQrCode, CloseQrCode, EnumDevices };
