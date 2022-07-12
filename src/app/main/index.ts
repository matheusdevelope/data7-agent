import { app, BrowserWindow, dialog, globalShortcut, ipcMain, Notification } from 'electron';
import ControlWindow from '../handlers/ControlWindow';
import CreateWindow from '../handlers/CreateWindow';
import CreateTray from '../handlers/CreateTray';
import Server_Http from '../../server';
import { HandleDeepLinkProtocoll, RegisterDeepLink } from '../handlers/deeplink_protocoll';
import { RegisterListenersIpcMain } from '../handlers/ipmain';
import { RegisterShortcuts } from '../handlers/shortcuts';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

RegisterDeepLink(app);

let Window: BrowserWindow;
let Tray: Electron.CrossProcessExports.Tray;
const Server = Server_Http();

function StartIterface() {
  Window = CreateWindow();
  Tray = CreateTray(Server);
  const { toggle } = ControlWindow(Window, Tray);
  Tray.on('click', toggle);
  RegisterListenersIpcMain(Window);
  RegisterShortcuts(Window).F5();
}

function RegisterEventsApp() {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    return HandleDeepLinkProtocoll(event, commandLine, workingDirectory, Window);
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
  app.on('open-url', (event, url) => {
    dialog.showMessageBox(Window, { message: `Welcome Back! You arrived from: ${url}` });
  });
}

function RunElectron() {
  const gotTheLock = app.requestSingleInstanceLock();
  if (!gotTheLock) {
    app.quit();
  } else {
    app.whenReady().then(StartIterface);
    RegisterEventsApp();
  }
}

export default RunElectron;
