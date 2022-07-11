interface IDataQrCode {
  id: string;
  img: string;
  link: string;
  phone: string;
  awaiting_payment: boolean;
  confirmed_payment: boolean;
  canceled: boolean;
  error?: string;
  message: string;
}
interface IDialog {
  isOpen: boolean;
  title?: string;
  message: string;
  onClickOK: React.MouseEventHandler<HTMLButtonElement>;
  onClickCancel?: React.MouseEventHandler<HTMLButtonElement>;
  textbuttonOK?: string;
  textbuttonCancel?: string;
}
