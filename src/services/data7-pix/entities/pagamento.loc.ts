export default class PagamentoLoc {
  constructor(readonly id: number, readonly location: string, readonly tipoCob?: string, readonly criacao?: Date) {}

  //create method from json
  static fromJson(json: any): PagamentoLoc {
    return new PagamentoLoc(
      json.id || json.Id,
      json.location || json.Location,
      json.tipoCob || json.TipoCob,
      json.criacao || json.Criacao,
    );
  }

  //create method to json
  toJson(): any {
    return {
      Id: this.id,
      Location: this.location,
      TipoCob: this.tipoCob,
      Criacao: this.criacao,
    };
  }

  //create method from object
  static fromObject(obj: any): PagamentoLoc {
    return new PagamentoLoc(
      obj.id || obj.Id,
      obj.location || obj.Location,
      obj.tipoCob || obj.TipoCob,
      obj.criacao || obj.Criacao,
    );
  }
}
