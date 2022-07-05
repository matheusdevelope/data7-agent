import WatchPatch from '../controllers/watch.patch';

import GerencianetCobranca from './gerencianet.cobranca';
import Cobranca from '../entities/cobranca';

import AppError from '../entities/app.error';

import FirebaseCobrancaRepository from '../repository/firebase.cobranca.repository';
import FirebasePagamentoRepository from '../repository/firebase.pagamento.repository';
import FirebaseAppErrorRepository from '../repository/farebase.app.error.repository';
import FarebaseQrcodeRepository from '../repository/farebase.qrcode.repository';
import FerebasePagamentoSituacaoRepository from '../repository/ferebase.pagamento.situacao.repository';
import LinstenPeymentPIX from './linsten.peyment.pix';
import Pagamento from '../entities/pagamento.pendente';

export default class ListenCreatePIX {
  private config = require('../assets/config.pix.ts');
  private gerenciador = new GerencianetCobranca(this.config);
  private repositoryCobranca = new FirebaseCobrancaRepository();
  private repositoryPagamento = new FirebasePagamentoRepository();
  private repositoryQrcode = new FarebaseQrcodeRepository();
  private repositorySituacao = new FerebasePagamentoSituacaoRepository();
  private linstenPeymentPIX = new LinstenPeymentPIX();

  constructor() {
    this.initialize();
  }

  private async initialize() {}

  async exec(patch: string) {
    const _watchPatch = new WatchPatch(patch);
    _watchPatch.listen((cobrancas: Cobranca[], filename: string) => {
      if (cobrancas) this.createOrUpdadeChargePIX(cobrancas);
    });
  }

  private async createOrUpdadeChargePIX(cobrancas: Cobranca[]): Promise<void> {
    for (const cobranca of cobrancas) {
      const sysId = cobranca.id;
      const cnpj = cobranca.id.split('.')[2];

      const fbCobranca = await this.repositoryCobranca.getById(cnpj, sysId);
      let pgamentoPendente;
      if (!fbCobranca) {
        pgamentoPendente = await this.newChargePIX(cobranca);
      } else {
        pgamentoPendente = await this.updateChargePIX(fbCobranca);
      }

      //open new listen payment pix
      try {
        const secondsInteval = 5;
        const maxRequest = 10;
        if (pgamentoPendente) {
          this.linstenPeymentPIX.open(pgamentoPendente.txid, secondsInteval, maxRequest);
        }
      } catch (error: any) {
        const appError = new AppError(sysId, 'linstenPeymentPIX.open', error.message, '', '');
        await new FirebaseAppErrorRepository().insert(appError);
      }
    }
  }

  private async newChargePIX(cobranca: Cobranca): Promise<Pagamento | undefined> {
    try {
      const sysId = cobranca.id;
      const cnpj = cobranca.id.split('.')[2];

      //inser new charge dababe and initialize paymant
      await this.repositoryCobranca.insert(cobranca);
      const newPagamento = await this.gerenciador.createChargePIX(cobranca);

      if (newPagamento && newPagamento?.loc?.id) {
        await this.repositoryPagamento.insert(newPagamento);

        //create new qrcode
        const pagamentoQrCode = await this.gerenciador.createQrCodePIX(sysId, newPagamento.loc.id);
        if (pagamentoQrCode) await this.repositoryQrcode.insert(pagamentoQrCode);
        console.log(pagamentoQrCode);

        //request status payment and insert in database
        const resposeSituacao = await this.gerenciador.statusPIX(newPagamento.txid);
        if (resposeSituacao) await this.repositorySituacao.insert(resposeSituacao);

        return newPagamento;
      }
    } catch (error: any) {
      const appError = new AppError('', 'newChargePIX', error.message, '', '');
      await new FirebaseAppErrorRepository().insert(appError);
    }
  }

  private async updateChargePIX(cobranca: Cobranca): Promise<Pagamento | undefined> {
    try {
      const sysId = cobranca.id;
      const cnpj = cobranca.id.split('.')[2];

      const fbPagamento = await this.repositoryPagamento.getById(cnpj, sysId);

      //assert if charge is not created
      if (!fbPagamento) {
        const newPagamento = await this.gerenciador.createChargePIX(cobranca);
        if (newPagamento && newPagamento?.loc?.id) {
          await this.repositoryPagamento.insert(newPagamento);

          //request status payment and insert in database
          const resposeSituacao = await this.gerenciador.statusPIX(newPagamento.txid);
          if (resposeSituacao) await this.repositorySituacao.insert(resposeSituacao);
          return newPagamento;
        }
      }
    } catch (error: any) {
      const appError = new AppError('', 'updateChargePIX', error.message, '', '');
      await new FirebaseAppErrorRepository().insert(appError);
    }
  }
}
