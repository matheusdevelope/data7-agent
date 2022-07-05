export default class PagamentoQrCode {
  constructor(readonly id: string, readonly idloc: number, readonly qrcode: string, readonly imagemQrcode: string) {}

  //create method from json
  static fromJson(json: any): PagamentoQrCode {
    return new PagamentoQrCode(json.id, json.idloc, json.qrcode, json.imagemQrcode);
  }

  //create method to json
  toJson(): any {
    return {
      id: this.id,
      idloc: this.idloc,
      qrcode: this.qrcode,
      imagemQrcode: this.imagemQrcode,
    };
  }

  //create method from object
  static fromObject(obj: any): PagamentoQrCode {
    return new PagamentoQrCode(obj.id, obj.idloc, obj.qrcode, obj.imagemQrcode);
  }
}
