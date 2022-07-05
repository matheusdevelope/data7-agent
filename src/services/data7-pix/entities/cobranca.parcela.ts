export default class CobrancaParcela {
  constructor(
    readonly origem: string,
    readonly codOrigem: string,
    readonly numeroParcela: string,
    readonly codFormaPagamento: string,
    readonly dataEmissao: string,
    readonly dataVenda: string,
    readonly dataVencimento: string,
    readonly valorBruto: number,
    readonly valorLiquido: number,
    readonly valorParcela: number,
    readonly observacao: string,
  ) {}

  //create method from json
  static fromJson(json: any): CobrancaParcela {
    return new CobrancaParcela(
      json.Origem,
      json.CodOrigem,
      json.NumeroParcela,
      json.CodFormaPagamento,
      json.DataEmissao,
      json.DataVenda,
      json.DataVencimento,
      json.ValorBruto,
      json.ValorLiquido,
      json.ValorParcela,
      json.Observacao,
    );
  }

  //create method to json
  toJson(): any {
    return {
      Origem: this.origem,
      CodOrigem: this.codOrigem,
      NumeroParcela: this.numeroParcela,
      CodFormaPagamento: this.codFormaPagamento,
      DataEmissao: this.dataEmissao,
      DataVenda: this.dataVenda,
      DataVencimento: this.dataVencimento,
      ValorBruto: this.valorBruto,
      ValorLiquido: this.valorLiquido,
      ValorParcela: this.valorParcela,
      Observacao: this.observacao,
    };
  }

  //create method from object
  static fromObject(obj: any): CobrancaParcela {
    return new CobrancaParcela(
      obj.Origem,
      obj.CodOrigem,
      obj.NumeroParcela,
      obj.CodFormaPagamento,
      obj.DataEmissao,
      obj.DataVenda,
      obj.DataVencimento,
      obj.ValorBruto,
      obj.ValorLiquido,
      obj.ValorParcela,
      obj.Observacao,
    );
  }

  //create method to object
  toObject(): any {
    return {
      Origem: this.origem,
      CodOrigem: this.codOrigem,
      NumeroParcela: this.numeroParcela,
      CodFormaPagamento: this.codFormaPagamento,
      DataEmissao: this.dataEmissao,
      DataVenda: this.dataVenda,
      DataVencimento: this.dataVencimento,
      ValorBruto: this.valorBruto,
      ValorLiquido: this.valorLiquido,
      ValorParcela: this.valorParcela,
      Observacao: this.observacao,
    };
  }
}
