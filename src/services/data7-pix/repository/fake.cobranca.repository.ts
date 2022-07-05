import ContractBaseRepository from '../contracts/contract.base.repository';
import Cobranca from '../entities/cobranca';

export default class FakeCobrancaRepository implements ContractBaseRepository<Cobranca> {
  getAll(cnpj: string): Promise<Cobranca[] | undefined> {
    throw new Error('Method not implemented.');
  }
  getById(cnpj: string, id: string): Promise<Cobranca | undefined> {
    throw new Error('Method not implemented.');
  }
  insert(entity: Cobranca): Promise<void> {
    throw new Error('Method not implemented.');
  }
  update(entity: Cobranca): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
