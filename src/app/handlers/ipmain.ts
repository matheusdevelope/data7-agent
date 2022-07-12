import { BrowserWindow, ipcMain } from 'electron';
import { Global_State } from '../../global_state';

function RegisterListenersIpcMain(Window: BrowserWindow) {
  ipcMain.on(Global_State.events.open_qrcode, async (event, params) => {
    Window.show();
    return true;
  });
  ipcMain.on(Global_State.events.close_qrcode, async (event, params) => {
    Window.hide();
    return true;
  });
}

export { RegisterListenersIpcMain };
