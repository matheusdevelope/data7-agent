import { contextBridge, ipcRenderer } from 'electron';
import { Global_State } from '../../global_state';
import { CancelPix, RefreshPix } from '../../services/Api_Pix';
import { SendMessageOnWhatsapp } from '../../services/protocoll_events';

function RegisterEventOpenQr(event: string, cb: Function) {
  ipcRenderer.on(event, (e, ...args) => {
    cb(args[0]);
  });
}
function RegisterEventCloseQr(event: string, cb: Function) {
  ipcRenderer.on(event, (e, ...args) => {
    cb(args[0]);
  });
}
async function CancelQr(id_qrcode: string): Promise<ICancelQr> {
  try {
    const result = await CancelPix(id_qrcode);
    return Promise.resolve(result);
  } catch (e) {
    return Promise.resolve({
      canceled: false,
      message: 'Houve um erro ao solicitar o cancelamento do PIX',
      error: String(e),
    });
  }
}
function OpenQr() {
  try {
    ipcRenderer.send(Global_State.events.open_qrcode);
  } catch (e) {
    alert(e);
  }
}
function CloseQr() {
  try {
    ipcRenderer.send(Global_State.events.close_qrcode);
  } catch (e) {
    alert(e);
  }
}
async function RefreshQr(id_qrcode: string): Promise<IRefreshQr> {
  try {
    const result = await RefreshPix(id_qrcode);
    return Promise.resolve(result);
  } catch (e) {
    return Promise.resolve({
      awaiting_payment: false,
      confirmed_payment: false,
      canceled: false,
      message: 'Houve um erro ao solicitar a situação do PIX',
      error: String(e),
    });
  }
}
function SendWhats(data: IWhatsAppMessage) {
  SendMessageOnWhatsapp(data);
}

export const ElectronAPI = {
  RegisterEventOpenQr,
  RegisterEventCloseQr,
  CancelQr,
  OpenQr,
  CloseQr,
  RefreshQr,
  SendWhats,
};

contextBridge.exposeInMainWorld('ElectronAPI', ElectronAPI);
