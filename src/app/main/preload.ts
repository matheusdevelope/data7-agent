import { contextBridge, ipcRenderer } from 'electron';
import { toDataURL } from 'qrcode';
import { Global_State } from '../../global_state';
import { CancelPix, RefreshPix } from '../../services/Api_Pix';
import { SendMessageOnWhatsapp } from '../../services/protocoll_events';
import { SafeStorage } from '../../services/local_storage';

function SetLocalPassApp(password: string): Promise<true | Error> {
  return ipcRenderer.invoke(Global_State.events.set_app_pass, password);
}
function GetLocalPassApp(): Promise<string | false | Error> {
  return ipcRenderer.invoke(Global_State.events.get_app_pass);
}

function GetLocalConfig(): Promise<IObjectConfig[]> {
  return ipcRenderer.invoke(Global_State.events.get_app_config);
}
function SetLocalConfig(config: IObjectConfig[]): Promise<void | Error> {
  return ipcRenderer.invoke(Global_State.events.set_app_config, config);
}

function RegisterEventUpdateQr(event: string, cb: Function) {
  ipcRenderer.on(event, (e, args: IDataQrCode) => {
    cb(args);
  });
}
interface IDataToLoginWithQrCode {
  ip: string;
  port: string;
  token: string;
}

function RegisterEventLoginWithQr(cb: Function) {
  ipcRenderer.on(Global_State.events.login_with_qrcode, (e, obj: IDataToLoginWithQrCode) => {
    toDataURL(JSON.stringify(obj)).then((img) => {
      return cb(img);
    });
    cb('none');
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
  SetLocalPassApp,
  GetLocalPassApp,
  GetLocalConfig,
  SetLocalConfig,
  RegisterEventUpdateQr,
  CancelQr,
  OpenQr,
  CloseQr,
  RefreshQr,
  SendWhats,
  RegisterEventLoginWithQr,
};

contextBridge.exposeInMainWorld('ElectronAPI', ElectronAPI);
