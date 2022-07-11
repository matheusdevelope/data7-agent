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
  qrcode: IDataQrCode;
  devices: EnumDevices[];
  callback: (callback: ICallback) => void;
}
export interface ICloseQrCode {
  qrcode: IDataQrCode;
  devices: EnumDevices[];
  callback: (callback: ICallback) => void;
}
