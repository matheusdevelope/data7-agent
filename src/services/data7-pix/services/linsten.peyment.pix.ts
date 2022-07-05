import moment from 'moment';

import AppError from '../entities/app.error';
import PagamentoSituacao, { eStatus } from '../entities/pagamento.situacao';

import GerencianetCobranca from './gerencianet.cobranca';
import FerebasePagamentoSituacaoRepository from '../repository/ferebase.pagamento.situacao.repository';
import FarebasePagamentoPixRepository from '../repository/farebase.pagamento.pix.repository';

import FirebaseAppErrorRepository from '../repository/farebase.app.error.repository';
import PagamentoPix from '../entities/pagamento.pix';

export default class LinstenPeymentPIX {
  private config = require('../assets/config.pix.ts');
  private gerenciador = new GerencianetCobranca(this.config);
  private repositorySituacao = new FerebasePagamentoSituacaoRepository();
  private repositoryPix = new FarebasePagamentoPixRepository();

  constructor() {
    this.inicialize();
  }

  private inicialize() {}

  //create method loop setInterval
  public open(txid: string, secondsInteval: number = 5, request: number = 10) {
    let _contRequest = 0;
    const validTxId = this.gerenciador.validTxId(txid);
    const minSecondsInteval = 5;
    const maxRequest = 50;
    const interval = minSecondsInteval > secondsInteval ? minSecondsInteval : secondsInteval;
    const requests = maxRequest < request ? maxRequest : request;

    if (!validTxId) {
      const appError = new AppError('', 'LinstenPeymentPIX', 'open Linsten Peyment', 'txid invalido', '');
      new FirebaseAppErrorRepository().insert(appError);
    }

    const intevalId = setInterval(async () => {
      const gnPgtoSituacao = await this.gerenciador.statusPIX(txid);

      //stop loop if maxRequest is reached or txid not found
      if (_contRequest > requests || !gnPgtoSituacao) {
        clearInterval(intevalId);
      }

      if (gnPgtoSituacao) {
        //payment confirmed
        if (gnPgtoSituacao.status == eStatus.CONCLUIDA) {
          const newSituacao = new PagamentoSituacao(
            gnPgtoSituacao.txId,
            gnPgtoSituacao.locId,
            gnPgtoSituacao.sysId,
            gnPgtoSituacao.endToEndId,
            gnPgtoSituacao.status,
            gnPgtoSituacao.chave,
            gnPgtoSituacao.devedor,
            gnPgtoSituacao.dataAbertura,
            new Date(moment().toString()),
          );

          await this.repositorySituacao.update(newSituacao);

          //confirmed operation pix
          if (gnPgtoSituacao.endToEndId) {
            const pix = await this.gerenciador.PIX(gnPgtoSituacao.endToEndId);
            if (pix) {
              const _pagamentoPix = new PagamentoPix(
                gnPgtoSituacao.sysId,
                pix.txid,
                pix.endToEndId,
                pix.valor,
                pix.chave,
                pix.horario,
              );

              this.repositoryPix.insert(_pagamentoPix);
            }
          }

          clearInterval(intevalId);
        }
      }

      _contRequest++;
    }, interval * 1000);
  }
}
