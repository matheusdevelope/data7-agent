export enum EnumTypeOfCallback {
  error,
  success,
}
export enum EnumDevices {
  desktop,
  mobile,
}
export interface ICallback {
  type: EnumTypeOfCallback;
  message: string;
  error: any;
}
export interface IOpenQrCode {
  base64_qrcode: string;
  link_copy_paste: string;
  devices: EnumDevices[];
  callback: (callback: ICallback) => void;
}
export interface ICloseQrCode {
  callback: (callback: ICallback) => void;
}
