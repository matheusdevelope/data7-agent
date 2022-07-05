export default class Filial {
  constructor(readonly codEmpresa: number, readonly codFilial: number, readonly nome: string, readonly cnpj: string) {}

  //create method from json
  static fromJson(json: any): Filial {
    return new Filial(
      json.codEmpresa || json.CodEmpresa,
      json.codFilial || json.CodFilial,
      json.nome || json.Nome,
      json.cnpj || json.CNPJ,
    );
  }

  //create method to json
  toJson(): any {
    return {
      CodEmpresa: this.codEmpresa,
      CodFilial: this.codFilial,
      Nome: this.nome,
      CNPJ: this.cnpj,
    };
  }

  //create method from object
  static fromObject(obj: any): Filial {
    return new Filial(
      obj.codEmpresa || obj.CodEmpresa,
      obj.codFilial || obj.CodFilial,
      obj.nome || obj.Nome,
      obj.cnpj || obj.CNPJ,
    );
  }
}
