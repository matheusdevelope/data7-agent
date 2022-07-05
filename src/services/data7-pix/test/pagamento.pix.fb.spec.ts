import Pagamento from '../entities/pagamento.pendente';
import PagamentoAdicionais from '../entities/pagamento.adicionais';
import PagamentoLoc from '../entities/pagamento.loc';
import FirebasePagamentoRepository from '../repository/firebase.pagamento.repository';

export default class PagamentoPixFbSpec {
  constructor() {
    this.initialize();
  }

  private async initialize() {}

  async exec() {
    const fakePagamentos = require('../assets/respose.pagamento.json') as Pagamento[];

    const repository = new FirebasePagamentoRepository();

    //test methods / remenber inicializeAPP
    // const pagamento = this.pagamentoFromResponse(fakePagamentos[0]);
    // repository.insert(pagamento);

    // const cnpj = '27740308000120';
    // const pagamentos = await repository.getAll(cnpj);
    // console.log(pagamentos);

    // const cnpj = '27740308000120';
    // const id = '3831849.11.27740308000120.20220622181050-OB.21.002';
    // const respose = await repository.getById(cnpj, id);
    // console.log(respose);

    // const pagamento = this.pagamentoFromResponse(fakePagamentos[2]);
    // const respose = await repository.update(pagamento);
    // console.log(respose);
  }

  private pagamentoFromResponse(response: any): Pagamento {
    const result = {
      id: response.Id,
      txid: response.Txid,
      chave: response.Chave,
      status: response.Status,
      criacao: new Date(response.Criacao),
      expiracao: new Date(response.Expiracao),
      valor: response.Valor,
      solicitacaoPagador: response.SolicitacaoPagador,
      adicionais: response?.Adicionais?.map((adicional: any) => {
        return new PagamentoAdicionais(adicional.Nome, adicional.Valor);
      }),
      loc: new PagamentoLoc(
        response.Loc.Id,
        response.Loc.Location,
        response.Loc.TipoCob,
        new Date(response.Loc.Criacao),
      ),
    };

    const _pagamento = Pagamento.fromObject(result);
    return _pagamento;
  }
}
