import { contextBridge, ipcRenderer } from 'electron';
contextBridge.exposeInMainWorld('electronAPI', {
  openQr: (event: string, cb: Function) => {
    ipcRenderer.on(event, (e, ...args) => {
      cb(args[0]);
    });
  },
  closeQr: (event: string, cb: Function) => {
    ipcRenderer.on(event, (e, ...args) => {
      cb(args[0]);
    });
  },
  // open: (qrcode: string) => ipcRenderer.send('open-qrcode', qrcode),
  // close: () => ipcRenderer.send('close-qrcode'),
  // GenerateQrCode: (qrcode: string) => QRCode.toDataURL(qrcode),
});
