import { getFirestore, Timestamp, FieldValue, QuerySnapshot } from 'firebase-admin/firestore';

import ContractBaseRepository from '../contracts/contract.base.repository';
import PagamentoQrCode from '../entities/pagamento.qrcode';

export default class FarebaseQrcodeRepository implements ContractBaseRepository<PagamentoQrCode> {
  readonly doc = 'qRCode';

  constructor() {
    this.initialize();
  }

  private initialize(): void {}

  async getAll(cnpj: string): Promise<PagamentoQrCode[]> {
    const db = getFirestore();
    const respose = await db.collection(cnpj).doc(this.doc).listCollections();
    const qRCodes: PagamentoQrCode[] = [];

    const collections = respose?.map(async (collection) => {
      return collection.get();
    });

    const docs = await Promise.all(collections);

    docs.forEach((snapshot) => {
      snapshot.forEach((doc) => {
        const qRCode = doc.data() as PagamentoQrCode;
        qRCodes.push(qRCode);
      });
    });

    return qRCodes;
  }

  async getById(cnpj: string, id: string): Promise<PagamentoQrCode | undefined> {
    const db = getFirestore();
    const snapshot = await db.collection(cnpj).doc(this.doc).collection(id).get();
    const qRCodes = snapshot.docs.map((doc) => {
      const qRCode = doc.data() as PagamentoQrCode;
      return qRCode;
    });

    return qRCodes?.shift();
  }

  async insert(qRCode: PagamentoQrCode): Promise<void> {
    const db = getFirestore();
    const cnpj = qRCode.id.split('.')[2];
    await db.collection(cnpj).doc(this.doc).collection(qRCode.id).add(qRCode.toJson());
  }

  async update(qRCode: PagamentoQrCode): Promise<void> {
    const db = getFirestore();
    const cnpj = qRCode.id.split('.')[2];
    const snapshot = await db.collection(cnpj).doc(this.doc).collection(qRCode.id).get();

    const docId = snapshot.docs
      .map((doc) => {
        return doc.id;
      })
      ?.shift();

    if (docId) {
      await db.collection(cnpj).doc(this.doc).collection(qRCode.id).doc(docId).update(qRCode.toJson());
    }
  }
}
