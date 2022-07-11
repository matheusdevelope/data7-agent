import Api from './data7-pix/aplication/api';
import App from './data7-pix/aplication/app';

export function StartPixSrvice() {
  console.log('Serviço pix iniciado');
}

export async function CancelPix(id: string): Promise<ICancelQr> {
  return Promise.resolve({ canceled: true, message: 'PIX cancelado com sucesso!' });
}
export async function RefreshPix(id: string): Promise<IRefreshQr> {
  return Promise.resolve({
    canceled: false,
    awaiting_payment: false,
    confirmed_payment: true,
    message: 'Pix processado com sucesso!',
  });
}
