export default interface ContractBaseRepository<T> {
  getAll(cnpj: string): Promise<T[] | undefined>;
  getById(cnpj: string, id: string): Promise<T | undefined>;
  insert(entity: T): Promise<void>;
  update(entity: T): Promise<void>;
}
