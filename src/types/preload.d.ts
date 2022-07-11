interface ICancelQr {
  canceled: boolean;
  message: string;
  error?: string;
}
interface IRefreshQr {
  awaiting_payment: boolean;
  confirmed_payment: boolean;
  canceled: boolean;
  message: string;
  error?: string;
}
