import { getFirestore } from 'firebase-admin/firestore';

import ContractBaseRepository from '../contracts/contract.base.repository';
import PagamentoSituacao from '../entities/pagamento.situacao';

export default class FerebasePagamentoSituacaoRepository implements ContractBaseRepository<PagamentoSituacao> {
  readonly doc = 'situacao';

  constructor() {
    this.initialize();
  }

  private initialize(): void {}

  async getAll(cnpj: string): Promise<PagamentoSituacao[]> {
    const db = getFirestore();
    const respose = await db.collection(cnpj).doc(this.doc).listCollections();
    const situacoes: PagamentoSituacao[] = [];

    const collections = respose?.map(async (collection) => {
      return collection.get();
    });

    const docs = await Promise.all(collections);

    docs.forEach((snapshot) => {
      snapshot.forEach((doc) => {
        const situacao = doc.data() as PagamentoSituacao;
        situacoes.push(situacao);
      });
    });

    return situacoes;
  }

  async getById(cnpj: string, id: string): Promise<PagamentoSituacao | undefined> {
    const db = getFirestore();
    const snapshot = await db.collection(cnpj).doc(this.doc).collection(id).get();
    const situacoes = snapshot.docs.map((doc) => {
      const situacao = doc.data() as PagamentoSituacao;
      return situacao;
    });

    return situacoes?.shift();
  }

  async insert(situacao: PagamentoSituacao): Promise<void> {
    const db = getFirestore();
    const cnpj = situacao.sysId.split('.')[2];
    await db.collection(cnpj).doc(this.doc).collection(situacao.sysId).add(situacao.toJson());
  }

  async update(situacao: PagamentoSituacao): Promise<void> {
    const db = getFirestore();
    const cnpj = situacao.sysId.split('.')[2];
    const snapshot = await db.collection(cnpj).doc(this.doc).collection(situacao.sysId).get();

    const docId = snapshot.docs
      .map((doc) => {
        return doc.id;
      })
      ?.shift();

    if (docId) {
      await db.collection(cnpj).doc(this.doc).collection(situacao.sysId).doc(docId).update(situacao.toJson());
    }
  }
}
