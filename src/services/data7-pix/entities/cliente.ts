export default class Cliente {
  constructor(
    readonly codCliente: number,
    readonly nomeCliente: string,
    readonly cnpjCpf: string,
    readonly telefone: string,
    readonly eMail: string,
    readonly endereco: string,
    readonly numero: string,
    readonly complemento: string,
    readonly bairro: string,
    readonly cep: string,
    readonly codigoIBGE: string,
    readonly nomeMunicipio: string,
    readonly uf: string,
  ) {}

  //create method from json
  static fromJson(json: any): Cliente {
    return new Cliente(
      json.CodCliente,
      json.NomeCliente,
      json.CNPJ_CPF || null,
      json.Telefone || null,
      json.EMail || null,
      json.Endereco || null,
      json.Numero || null,
      json.Complemento || null,
      json.Bairro || null,
      json.CEP || null,
      json.CodigoIBGE || null,
      json.NomeMunicipio,
      json.UF,
    );
  }

  //create method to json
  toJson(): any {
    return {
      CodCliente: this.codCliente,
      NomeCliente: this.nomeCliente,
      CNPJ_CPF: this.cnpjCpf,
      Telefone: this.telefone,
      EMail: this.eMail,
      Endereco: this.endereco,
      Numero: this.numero,
      Complemento: this.complemento,
      Bairro: this.bairro,
      CEP: this.cep,
      CodigoIBGE: this.codigoIBGE,
      NomeMunicipio: this.nomeMunicipio,
      UF: this.uf,
    };
  }

  //create method from object
  static fromObject(obj: any): Cliente {
    return new Cliente(
      obj.codCliente,
      obj.nomeCliente,
      obj.cnpjCpf || null,
      obj.telefone || null,
      obj.eMail || null,
      obj.endereco || null,
      obj.numero || null,
      obj.complemento || null,
      obj.bairro || null,
      obj.cep || null,
      obj.codigoIBGE || null,
      obj.nomeMunicipio,
      obj.uf,
    );
  }
}
