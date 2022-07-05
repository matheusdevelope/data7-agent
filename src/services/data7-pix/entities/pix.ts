export default class Pix {
  //create construtor inilize all properties
  constructor(
    readonly txid: string,
    readonly endToEndId: string,
    readonly valor: string,
    readonly chave: string,
    readonly horario: Date,
  ) {}

  //create method to mount PagamentoPIX from json
  static fromJson(json: any): Pix {
    return new Pix(
      json.txid || json.Txid,
      json.endToEndId || json.EndToEndId,
      json.valor || json.Valor,
      json.chave || json.Chave,
      new Date(json.horario || json.Horario) || null,
    );
  }

  //create method to mount PagamentoPIX to json
  toJson(): any {
    return {
      txid: this.txid,
      endToEndId: this.endToEndId,
      valor: this.valor,
      chave: this.chave,
      horario: this.horario,
    };
  }

  //create method from object
  static fromObject(obj: any): Pix {
    return new Pix(
      obj.txid || obj.Txid,
      obj.endToEndId || obj.EndToEndId,
      obj.valor || obj.Valor,
      obj.chave || obj.Chave,
      obj.horario || obj.Horario,
    );
  }
}
