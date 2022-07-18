import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import { resolve } from 'path';
import { Global_State } from '../../global_state';

export default function CreateWindow(route: string, options?: BrowserWindowConstructorOptions): BrowserWindow {
  const win = new BrowserWindow({
    width: 500,
    height: 460,
    show: false,
    alwaysOnTop: false,
    frame: true,
    autoHideMenuBar: true,
    resizable: true,
    fullscreenable: false,
    webPreferences: {
      preload: resolve(__dirname, '..', 'main', 'preload.js'),
    },
    ...options,
  });

  if (Global_State.isDev) {
    win.loadURL(`http://localhost:3000/${route}`);
  } else {
    win.loadFile(resolve(__dirname, '../', '../', 'index.html'));
  }

  return win;
}
