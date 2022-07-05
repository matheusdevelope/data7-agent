type Devedor = {
  nome: string;
  cpf: string;
};

export enum eStatus {
  ATIVA = 'ATIVA',
  CONCLUIDA = 'CONCLUIDA',
  REMOVIDA_PELO_USUARIO_RECEBEDOR = 'REMOVIDA_PELO_USUARIO_RECEBEDOR',
  REMOVIDA_PELO_PSP = 'REMOVIDA_PELO_PSP',
}

export default class PagamentoSituacao {
  constructor(
    readonly txId: string,
    readonly locId: string,
    readonly sysId: string,
    readonly endToEndId: string | null,
    readonly status: eStatus,
    readonly chave: string,
    readonly devedor: Devedor,
    readonly dataAbertura: Date,
    readonly dataFechamento?: Date | null,
  ) {}

  //create method to mount PagamentoPIX from json
  public static fromJson(json: any): PagamentoSituacao {
    return new PagamentoSituacao(
      json.txId || json.TxId,
      json.locId || json.LocId,
      json.sysId || json.SysId,
      json.endToEndId || json.EndToEndId,
      json.status || json.Status,
      json.chave || json.Chave,
      json.devedor || json.Devedor,
      json.dataAbertura || json.DataAbertura,
      json.dataFechamento || json.DataFechamento || null,
    );
  }

  //create method to mount PagamentoPIX to json
  public toJson(): any {
    return {
      txId: this.txId,
      locId: this.locId,
      sysId: this.sysId,
      endToEndId: this.endToEndId,
      status: this.status,
      chave: this.chave,
      devedor: this.devedor,
      DataAbertura: this.dataAbertura,
      DataFechamento: this.dataFechamento || null,
    };
  }

  //create method from object
  public static fromObject(obj: any): PagamentoSituacao {
    return new PagamentoSituacao(
      obj.txId || obj.TxId,
      obj.locId || obj.LocId,
      obj.sysId || obj.SysId,
      obj.endToEndId || obj.EndToEndId,
      obj.status || obj.Status,
      obj.chave || obj.Chave,
      obj.devedor || obj.Devedor,
      obj.dataAbertura || obj.DataAbertura,
      obj.dataFechamento || obj.DataFechamento || null,
    );
  }
}
