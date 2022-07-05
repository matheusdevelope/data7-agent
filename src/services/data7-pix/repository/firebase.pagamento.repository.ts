import { getFirestore } from 'firebase-admin/firestore';

import ContractBaseRepository from '../contracts/contract.base.repository';
import Pagamento from '../entities/pagamento.pendente';
import PagamentoAdicionais from '../entities/pagamento.adicionais';
import PagamentoLoc from '../entities/pagamento.loc';

export default class FirebasePagamentoRepository implements ContractBaseRepository<Pagamento> {
  readonly doc = 'pagamento';

  constructor() {
    this.initialize();
  }

  private initialize(): void {}

  async getAll(cnpj: string): Promise<Pagamento[]> {
    const db = getFirestore();
    const respose = await db.collection(cnpj).doc(this.doc).listCollections();
    const pagamentos: Pagamento[] = [];

    const collections = respose?.map(async (collection) => {
      return collection.get();
    });

    const docs = await Promise.all(collections);

    docs.forEach((snapshot) => {
      snapshot.forEach((doc) => {
        const responseData = doc.data();
        const pagamento = this.pagamentoFromResponse(responseData);
        pagamentos.push(pagamento);
      });
    });

    return pagamentos;
  }

  async getById(cnpj: string, id: string): Promise<Pagamento | undefined> {
    const db = getFirestore();
    const snapshot = await db.collection(cnpj).doc(this.doc).collection(id).get();
    const pagamentos = snapshot.docs.map((doc) => {
      const responseData = doc.data();
      const pagamento = this.pagamentoFromResponse(responseData);
      return pagamento;
    });

    const _pagamento = pagamentos?.shift();
    return _pagamento;
  }

  async insert(pagamento: Pagamento): Promise<void> {
    const db = getFirestore();
    const cnpj = pagamento.id.split('.')[2];
    await db.collection(cnpj).doc(this.doc).collection(pagamento.id).add(pagamento.toJson());
  }

  async update(pagamento: Pagamento): Promise<void> {
    const db = getFirestore();
    const cnpj = pagamento.id.split('.')[2];
    const snapshot = await db.collection(cnpj).doc(this.doc).collection(pagamento.id).get();

    const docId = snapshot.docs
      .map((doc) => {
        return doc.id;
      })
      ?.shift();

    if (docId) {
      await db.collection(cnpj).doc(this.doc).collection(pagamento.id).doc(docId).update(pagamento.toJson());
    }
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
