import { getFirestore } from 'firebase-admin/firestore';

import ContractBaseRepository from '../contracts/contract.base.repository';
import PagamentoPix from '../entities/pagamento.pix';

export default class FarebasePagamentoPixRepository implements ContractBaseRepository<PagamentoPix> {
  readonly doc = 'pix';

  constructor() {
    this.initialize();
  }

  private initialize(): void {}

  async getAll(cnpj: string): Promise<PagamentoPix[]> {
    const db = getFirestore();
    const respose = await db.collection(cnpj).doc(this.doc).listCollections();
    const pixs: PagamentoPix[] = [];

    const collections = respose?.map(async (collection) => {
      return collection.get();
    });

    const docs = await Promise.all(collections);

    docs.forEach((snapshot) => {
      snapshot.forEach((doc) => {
        const pix = doc.data() as PagamentoPix;
        pixs.push(pix);
      });
    });

    return pixs;
  }

  async getById(cnpj: string, id: string): Promise<PagamentoPix | undefined> {
    const db = getFirestore();
    const snapshot = await db.collection(cnpj).doc(this.doc).collection(id).get();
    const pixs = snapshot.docs.map((doc) => {
      const pix = doc.data() as PagamentoPix;
      return pix;
    });

    return pixs?.shift();
  }

  async insert(pagamentoPix: PagamentoPix): Promise<void> {
    const db = getFirestore();
    const cnpj = pagamentoPix.sysId.split('.')[2];
    await db.collection(cnpj).doc(this.doc).collection(pagamentoPix.sysId).add(pagamentoPix.toJson());
  }

  async update(pix: PagamentoPix): Promise<void> {
    const db = getFirestore();
    const cnpj = pix.sysId.split('.')[2];
    const snapshot = await db.collection(cnpj).doc(this.doc).collection(pix.sysId).get();

    const docId = snapshot.docs
      .map((doc) => {
        return doc.id;
      })
      ?.shift();

    if (docId) {
      await db.collection(cnpj).doc(this.doc).collection(pix.sysId).doc(docId).update(pix.toJson());
    }
  }
}
