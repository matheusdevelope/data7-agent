import { BrowserWindow, ipcMain } from 'electron';
import { Global_State } from '../../global_state';
import { SafeStorage, Storage } from './storage';

function RegisterListenersIpcMain(Window: BrowserWindow) {
  ipcMain.handle(Global_State.events.set_app_pass, (event, password: string) => {
    return SafeStorage.setPassword('application_pass', password);
  });
  ipcMain.handle(Global_State.events.get_app_pass, (event, params) => {
    return SafeStorage.getPassword('application_pass');
  });
  ipcMain.handle(Global_State.events.get_app_config, (event, params) => {
    return Storage.get('config');
  });
  ipcMain.handle(Global_State.events.set_app_config, (event, config) => {
    return Storage.set({ ...Storage.store, config });
  });
  ipcMain.on(Global_State.events.close_qrcode, async (event, params) => {
    Window.hide();
    return true;
  });
  ipcMain.on(Global_State.events.close_qrcode, async (event, params) => {
    Window.hide();
    return true;
  });
}

export { RegisterListenersIpcMain };
