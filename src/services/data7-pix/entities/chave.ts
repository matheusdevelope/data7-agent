export default class Chave {
  constructor(readonly status: string, readonly dataCriacao: Date, readonly chave: string) {}

  //create method from json
  static fromJson(json: any): Chave {
    return new Chave(json.status || json.Status, json.dataCriacao || json.DataCriacao, json.chave || json.chave);
  }

  //create method to json
  toJson(): any {
    return {
      status: this.status,
      dataCriacao: this.dataCriacao,
      chave: this.chave,
    };
  }

  //create method from object
  static fromObject(obj: any): Chave {
    return new Chave(obj.status || obj.Status, obj.dataCriacao || obj.DataCriacao, obj.chave || obj.Chave);
  }
}
