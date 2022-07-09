import { BrowserWindow } from 'electron';
import { resolve } from 'path';
import { Global_State } from '../../global_state';

export default function CreateWindow() {
  const win = new BrowserWindow({
    width: 350,
    height: 410,
    show: true,
    alwaysOnTop: true,
    frame: true,
    resizable: true,
    fullscreenable: false,
    webPreferences: {
      preload: resolve(__dirname, '..', 'main', 'preload.js'),
    },
  });

  if (Global_State.isDev) {
    win.loadURL('http://localhost:3000');
  } else {
    win.loadFile(resolve(__dirname, '../', '../', 'index.html'));
  }

  return win;
}
