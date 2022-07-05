import { BrowserWindow } from 'electron';
import { join, resolve } from 'path';

export default function CreateWindow(isDev: boolean) {
  const win = new BrowserWindow({
    width: 350,
    height: 410,
    show: false,
    frame: false,
    resizable: false,
    fullscreenable: false,
    webPreferences: {
      preload: resolve(__dirname, '..', 'main', 'preload.js'),
    },
  });

  if (isDev) {
    win.loadURL('http://localhost:3001');
    //win.webContents.openDevTools();
  } else {
    // win.removeMenu(); // Optional
    win.loadFile(resolve(__dirname, '../', '../', '../', 'index.html'));
  }

  return win;
}
