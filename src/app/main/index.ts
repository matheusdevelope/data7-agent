import { app, BrowserWindow, dialog, globalShortcut, ipcMain } from 'electron';
import * as path from 'path';
import ControlWindow from '../handlers/ControlWindow';
import CreateWindow from '../handlers/CreateWindow';
import CreateTray from '../handlers/CreateTray';
import Server_Http from '../../server';
import { SendMessageOnWhatsapp } from '../../services/protocoll_events';
import { Global_State } from '../../global_state';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

let Window: BrowserWindow;
let Tray: any;
const Server = Server_Http();

function RegisterDeepLink() {
  if (process.defaultApp) {
    if (process.argv.length >= 2) {
      app.setAsDefaultProtocolClient('data7', process.execPath, [path.resolve(process.argv[1])]);
    }
  } else {
    app.setAsDefaultProtocolClient('data7');
  }
}
RegisterDeepLink();

function RunElectron() {
  function StartElectron() {
    Window = CreateWindow();
    Tray = CreateTray(Server);
    globalShortcut.register('f5', function () {
      console.log('f5 is pressed!!');
      Window.reload();
    });

    const { toggle } = ControlWindow(Window, Tray);
    Tray.on('click', toggle);
  }

  const gotTheLock = app.requestSingleInstanceLock();

  if (!gotTheLock) {
    app.quit();
  } else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
      // Someone tried to run a second instance, we should focus our window.
      if (Window) {
        const { show } = ControlWindow(Window, Tray);
        const deeplinkingUrl = commandLine.find((arg) => arg.startsWith('data7://'));

        if (deeplinkingUrl?.includes('data7://open/?qrcode=')) {
          console.log('opening');
          const qr = {
            id: '',
            img: deeplinkingUrl.split('open/?qrcode=')[1],
            link: 'a',
            phone: '',
            awaiting_payment: true,
            confirmed_payment: false,
            canceled: false,
            message: 'Aguardando pagamento Pix...',
          };
          Window.webContents.send('new-qrcode', qr);
          // show();
        }
        if (deeplinkingUrl?.includes('data7://close')) {
          console.log('Closing');
          Window.webContents.send(Global_State.events.update_qrcode, {
            id: '',
            img: '',
            link: 'a',
            phone: '',
            awaiting_payment: false,
            confirmed_payment: false,
            canceled: true,
            message: 'Aguardando pagamento Pix...',
          });
          //Window.hide();
        }
      }
    });

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.whenReady().then(() => {
      StartElectron();
    });

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    // Handle the protocol. In this case, we choose to show an Error Box.
    app.on('open-url', (event, url) => {
      dialog.showErrorBox('Welcome Back', `You arrived from: ${url}`);
    });
  }

  ipcMain.on(Global_State.events.open_qrcode, async (event, params) => {
    Window.show();
    return true;
  });
  ipcMain.on(Global_State.events.close_qrcode, async (event, params) => {
    Window.hide();
    return true;
  });
}

export default RunElectron;
