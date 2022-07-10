import { contextBridge, ipcRenderer } from 'electron';
function openQr(event: string, cb: Function) {
  ipcRenderer.on(event, (e, ...args) => {
    cb(args[0]);
  });
}
function closeQr(event: string, cb: Function) {
  ipcRenderer.on(event, (e, ...args) => {
    cb(args[0]);
  });
}

// open: (qrcode: string) => ipcRenderer.send('open-qrcode', qrcode),
// close: () => ipcRenderer.send('close-qrcode'),
// GenerateQrCode: (qrcode: string) => QRCode.toDataURL(qrcode),
export const ElectronAPI = {
  openQr: openQr,
  closeQr: closeQr,
};

contextBridge.exposeInMainWorld('ElectronAPI', ElectronAPI);
