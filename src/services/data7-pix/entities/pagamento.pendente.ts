import PagamentoAdicionais from './pagamento.adicionais';
import PagamentoLoc from './pagamento.loc';

export default class PagamentoPendente {
  //create constructor initialize properties
  constructor(
    readonly id: string,
    readonly txid: string,
    readonly chave: string,
    readonly status: string,
    readonly criacao: Date,
    readonly expiracao: Date,
    readonly valor: number,
    readonly solicitacaoPagador: string,
    readonly loc: PagamentoLoc,
    readonly adicionais?: PagamentoAdicionais[],
  ) {}

  //create method from json
  static fromJson(json: any): PagamentoPendente {
    return new PagamentoPendente(
      json.Id,
      json.Txid,
      json.Chave,
      json.Status,
      json.Criacao,
      json.Expiracao,
      json.Valor,
      json.SolicitacaoPagador,
      PagamentoLoc.fromJson(json.Loc),
      json.Adicionais.map((adicional: any) => PagamentoAdicionais.fromJson(adicional)),
    );
  }

  //create method to json
  toJson(): any {
    return {
      Id: this.id,
      Txid: this.txid,
      Chave: this.chave,
      Status: this.status,
      Criacao: this.criacao,
      Expiracao: this.expiracao,
      Valor: this.valor,
      SolicitacaoPagador: this.solicitacaoPagador,
      Loc: this.loc.toJson(),
      Adicionais: this.adicionais?.map((adicional: any) => adicional.toJson()),
    };
  }

  //create method from object
  static fromObject(obj: any): PagamentoPendente {
    return new PagamentoPendente(
      obj.id,
      obj.txid,
      obj.chave,
      obj.status,
      obj.criacao,
      obj.expiracao,
      obj.valor,
      obj.solicitacaoPagador,
      PagamentoLoc.fromObject(obj.loc),
      obj.adicionais.map((adicional: any) => PagamentoAdicionais.fromObject(adicional)),
    );
  }
}
