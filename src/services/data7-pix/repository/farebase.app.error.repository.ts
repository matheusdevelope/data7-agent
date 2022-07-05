import { getFirestore } from 'firebase-admin/firestore';

import ContractBaseRepository from '../contracts/contract.base.repository';
import AppError from '../entities/app.error';

export default class FirebaseAppErrorRepository implements ContractBaseRepository<AppError> {
  readonly doc = 'errors';

  constructor() {
    this.initialize();
  }

  private initialize(): void {}

  async getAll(cnpj: string): Promise<AppError[]> {
    const db = getFirestore();
    const respose = await db.collection(cnpj).doc(this.doc).listCollections();
    const errors: AppError[] = [];

    const collections = respose?.map(async (collection) => {
      return collection.get();
    });

    const docs = await Promise.all(collections);

    docs.forEach((snapshot) => {
      snapshot.forEach((doc) => {
        const error = doc.data() as AppError;
        errors.push(error);
      });
    });

    return errors;
  }

  async getById(cnpj: string, id: string): Promise<AppError | undefined> {
    const db = getFirestore();
    const snapshot = await db.collection(cnpj).doc(this.doc).collection(id).get();
    const errors = snapshot.docs.map((doc) => {
      const error = doc.data() as AppError;
      return error;
    });

    return errors?.shift();
  }

  async insert(error: AppError): Promise<void> {
    const db = getFirestore();
    const cnpj = error.id.length >= 30 ? error.id.split('.')[2] : '00000000000000';
    const id = error.id.length >= 30 ? error.id : 'app';
    await db.collection(cnpj).doc(this.doc).collection(id).add(error.toJson());
  }

  async update(error: AppError): Promise<void> {
    const db = getFirestore();
    const cnpj = error.id.length >= 30 ? error.id.split('.')[2] : '00000000000000';
    const id = error.id.length >= 30 ? error.id : 'app';
    const snapshot = await db.collection(cnpj).doc(this.doc).collection(id).get();

    const docId = snapshot.docs
      .map((doc) => {
        return doc.id;
      })
      ?.shift();

    if (docId) {
      await db.collection(cnpj).doc(this.doc).collection(id).doc(docId).update(error.toJson());
    }
  }
}
