const setButton: any = document.getElementById('btn');
const titleInput: any = document.getElementById('title');
const imagem: any = document.getElementById('imagemqr');
const win: any = window;
setButton.addEventListener('click', async () => {
  const title = titleInput.value;
  const Qr = await win.electronAPI.GenerateQrCode(title);
  imagem.src = Qr;

  // window.electronAPI.setTitle(title);
});
win.electronAPI.openQr('new-qrcode', (qrcode: any) => {
  imagem.src = qrcode;
});
win.electronAPI.closeQr('clean-qrcode', (qrcode: any) => {
  imagem.src = '';
});
