import Gerencianet from 'gn-api-sdk-typescript';
import { LocalStorage } from 'node-localstorage';

import ContractCredential from '../contracts/contract.credential';
import ContractCredentialPIX from '../contracts/contract.credential.pix';

import AppError from '../entities/app.error';
import Cobranca from '../entities/cobranca';

import Pagamento from '../entities/pagamento.pendente';
import PagamentoLoc from '../entities/pagamento.loc';
import PagamentoQrCode from '../entities/pagamento.qrcode';
import PagamentoAdicionais from '../entities/pagamento.adicionais';
import PagamentoSituacao from '../entities/pagamento.situacao';

import Chave from '../entities/chave';
import Pix from '../entities/pix';

export default class GerencianetCobranca {
  private gerencianet: any;

  constructor(private readonly config: ContractCredential | ContractCredentialPIX) {
    this.initialize(config);
  }

  private initialize(config: ContractCredential | ContractCredentialPIX) {
    this.gerencianet = Gerencianet(config as any);
  }

  public async createChargePIX(cobranca: Cobranca): Promise<Pagamento | void> {
    if (!this.validCPF(cobranca.cliente.cnpjCpf))
      throw new AppError(
        cobranca.id,
        'createChargePIX',
        'CPF INVALIDO',
        'CPF INFORMADO NAO CORRESPODE A UM CPF VALIDO',
        cobranca.cliente.cnpjCpf,
      );

    try {
      const params = { txid: this.createTxId() };
      const body = await this.createBodyPIX(cobranca);

      const respose = await this.gerencianet.pixCreateImmediateCharge(params, body);

      if (respose.status === 'ATIVA') {
        const pagamento = this.mountPagamentoFromResposase(respose, cobranca);
        return pagamento;
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  public async statusPIX(txid: string): Promise<PagamentoSituacao | undefined> {
    try {
      const params = { txid };
      const respose = await this.gerencianet.pixDetailCharge(params);

      const infoAdicionais = respose.infoAdicionais ? respose?.infoAdicionais[0]?.valor : null;
      const pixEndToEndId = respose.pix ? respose?.pix[0]?.endToEndId : null;
      const pixHorario = respose.pix ? new Date(respose?.pix[0]?.horario) : null;

      const _situacao = new PagamentoSituacao(
        respose.txid,
        respose?.loc?.id,
        infoAdicionais,
        pixEndToEndId,
        respose.status,
        respose.chave,
        { ...respose.devedor },
        new Date(respose?.loc?.criacao),
        pixHorario,
      );

      return _situacao;
    } catch (error) {
      console.log(error);
    }
  }

  public async listPIX(startDate: Date, endDate: Date): Promise<any> {
    try {
      const dataInicio = startDate.toISOString();
      const dataFim = endDate.toISOString();
      const params = { inicio: dataInicio, fim: dataFim };
      const respose = await this.gerencianet.pixListReceived(params);
      return respose;
    } catch (error) {
      console.log(error);
    }
  }

  public async listLoc(startDate: Date, endDate: Date): Promise<any> {
    try {
      const dataInicio = startDate.toISOString();
      const dataFim = endDate.toISOString();
      const params = { inicio: dataInicio, fim: dataFim };
      const respose = await this.gerencianet.pixListLocation(params);
      return respose;
    } catch (error) {
      console.log(error);
    }
  }

  public async createQrCodePIX(sysId: string, locid: number): Promise<PagamentoQrCode | undefined> {
    try {
      const params = { id: locid };
      const request = await this.gerencianet.pixGenerateQRCode(params);
      const qrCode = new PagamentoQrCode(sysId, locid, request.qrcode, request.imagemQrcode);
      return qrCode;
    } catch (error) {
      console.log(error);
    }
  }

  public async listChave(): Promise<Chave[] | undefined> {
    try {
      const response = await this.gerencianet.gnListEvp();
      const chaves = response?.chaves.map((key: any) => {
        const stats = 'Ativo';
        const data = new Date();
        return new Chave(stats, data, key);
      });

      return chaves;
    } catch (error) {}
  }

  public async getChave(): Promise<Chave | undefined> {
    try {
      const local = this.getLocalStorageKeys();

      if (!local) {
        const chaves = await this.listChave();
        this.setLocalStorageKeys(chaves);
        return chaves?.shift();
      }

      return local.shift();
    } catch (error) {
      console.log(error);
    }
  }

  public async PIX(endToEndId: string): Promise<Pix | undefined> {
    try {
      const params = { e2eId: endToEndId };
      const respose = await this.gerencianet.pixDetail(params);
      const pix = Pix.fromObject(respose);
      return pix;
    } catch (error) {
      console.log(error);
    }
  }

  private async createBodyPIX(cobranca: Cobranca): Promise<any | undefined> {
    const currencyFormatter = require('currency-formatter');

    const token = await this.getChave();
    const valorCobranca = cobranca?.parcelas[0]?.valorParcela;
    const observacaoCobranca = cobranca?.parcelas[0]?.observacao;

    if (!token) return;
    if (!cobranca) return undefined;
    if (!valorCobranca) return undefined;

    const valorCobrancaFormated: string = currencyFormatter.format(valorCobranca, { code: 'USD', symbol: '' });

    const body = {
      calendario: { expiracao: 3600 },
      devedor: {
        cpf: cobranca.cliente.cnpjCpf,
        nome: cobranca.cliente.nomeCliente,
      },
      valor: { original: valorCobrancaFormated },
      chave: token.chave,
      solicitacaoPagador: observacaoCobranca.toString(),
      infoAdicionais: [
        {
          nome: 'Id do Pedido',
          valor: cobranca.id,
        },
      ],
    };

    return body;
  }

  private async createChave(): Promise<Chave | undefined> {
    try {
      const request = await this.gerencianet.gnCreateEvp();
      const chave = {
        status: 'Ativo',
        dataCriacao: new Date(),
        chave: request.chave,
      } as Chave;

      return chave;
    } catch (error) {
      console.log(error);
    }
  }

  private getLocalStorageKeys(): Chave[] | undefined {
    try {
      const path = require('path');
      const dirPath: string = path.join(__dirname, '..', '/LocalStorage');
      const storege = new LocalStorage(dirPath);
      const result = storege.getItem('keys.json');

      if (!result) return undefined;

      const keysJson = JSON.parse(result);
      const keys = keysJson.chaves.map((key: any) => Chave.fromJson(key));
      return keys;
    } catch (error) {
      console.log(error);
    }
  }

  private setLocalStorageKeys(chaves?: Chave[]): void {
    try {
      const path = require('path');
      const dirPath: string = path.join(__dirname, '..', '/LocalStorage');
      const storege = new LocalStorage(dirPath);
      const result = storege.setItem('keys.json', JSON.stringify({ chaves }));
    } catch (error) {
      console.log(error);
    }
  }

  public validCPF(cpf: string): boolean {
    const regExp = new RegExp('^[0-9]{11}$');
    return regExp.test(cpf);
  }

  public validTxId(txId: string): boolean {
    const regExp = new RegExp('^[a-zA-Z0-9]{26,35}$');
    return regExp.test(txId);
  }

  private createTxId(): string {
    return 'xxxxxxxxxxxxx4xxxxyxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  private mountPagamentoFromResposase(respose: any, cobranca: Cobranca) {
    const moment = require('moment');

    const minutesForExpiret = +respose.calendario.expiracao / 60;
    const createDate = moment(respose.calendario.criacao).toDate();
    const expiretDate = moment(respose.calendario.criacao).add(minutesForExpiret, 'minutes').toDate();

    const mount = {
      id: cobranca.id,
      txid: respose.txid,
      chave: respose.chave,
      status: respose.status,
      criacao: createDate,
      expiracao: expiretDate,
      valor: respose.valor.original,
      solicitacaoPagador: respose.solicitacaoPagador,
      adicionais: respose.infoAdicionais?.map((adicional: any) => {
        return new PagamentoAdicionais(adicional.nome, adicional.valor);
      }),
      loc: new PagamentoLoc(respose.loc.id, respose.loc.location, respose.loc.tipoCob, respose.loc.criacao),
    };

    const pagamento = Pagamento.fromObject(mount);
    return pagamento;
  }
}
