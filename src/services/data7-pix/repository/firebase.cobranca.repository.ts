import { getFirestore } from 'firebase-admin/firestore';

import ContractBaseRepository from '../contracts/contract.base.repository';
import Cobranca from '../entities/cobranca';

export default class FirebaseCobrancaRepository implements ContractBaseRepository<Cobranca> {
  readonly doc = 'cobranca';

  constructor() {
    this.initialize();
  }

  private initialize(): void {}

  async getAll(cnpj: string): Promise<Cobranca[]> {
    const db = getFirestore();
    const respose = await db.collection(cnpj).doc(this.doc).listCollections();
    const cobrancas: Cobranca[] = [];

    const collections = respose?.map(async (collection) => {
      return collection.get();
    });

    const docs = await Promise.all(collections);

    docs.forEach((snapshot) => {
      snapshot.forEach((doc) => {
        const cobranca = doc.data() as Cobranca;
        cobrancas.push(cobranca);
      });
    });

    return cobrancas;
  }

  async getById(cnpj: string, id: string): Promise<Cobranca | undefined> {
    const db = getFirestore();
    const snapshot = await db.collection(cnpj).doc(this.doc).collection(id).get();
    const cobrancas = snapshot.docs.map((doc) => {
      const responseData = doc.data();
      const cobranca = this.cobrancaFromResponse(responseData);
      return cobranca;
    });

    const _cobranca = cobrancas?.shift();
    return _cobranca;
  }

  async insert(cobranca: Cobranca): Promise<void> {
    const db = getFirestore();
    const cnpj = cobranca.id.split('.')[2];
    await db.collection(cnpj).doc(this.doc).collection(cobranca.id).add(cobranca.toJson());
  }

  async update(cobranca: Cobranca): Promise<void> {
    const db = getFirestore();
    const cnpj = cobranca.id.split('.')[2];
    const snapshot = await db.collection(cnpj).doc(this.doc).collection(cobranca.id).get();

    const docId = snapshot.docs
      .map((doc) => {
        return doc.id;
      })
      ?.shift();

    if (docId) {
      await db.collection(cnpj).doc(this.doc).collection(cobranca.id).doc(docId).update(cobranca.toJson());
    }
  }
  private cobrancaFromResponse(response: any): Cobranca {
    const result = {
      id: response.Id,
      usuario: {
        codUsuario: response.Usuario.CodUsuario,
        nomeUsuario: response.Usuario.NomeUsuario,
        estacaoTrabalho: response.Usuario.EstacaoTrabalho,
      },
      filial: {
        codEmpresa: response.Filial.CodEmpresa,
        codFilial: response.Filial.CodFilial,
        nome: response.Filial.Nome,
        cnpj: response.Filial.CNPJ,
      },
      cliente: {
        codCliente: response.Cliente.CodCliente,
        nomeCliente: response.Cliente.NomeCliente,
        cnpjCpf: response.Cliente.CNPJ_CPF,
        telefone: response.Cliente.Telefone,
        eMail: response.Cliente.Email,
        endereco: response.Cliente.Endereco,
        numero: response.Cliente.Numero,
        complemento: response.Cliente.Complemento,
        bairro: response.Cliente.Bairro,
        cep: response.Cliente.CEP,
        codigoIBGE: response.Cliente.CodigoIBGE,
        nomeMunicipio: response.Cliente.NomeMunicipio,
        uf: response.Cliente.UF,
      },
      parcelas: response?.Parcelas.map((parcela: any) => {
        return {
          Origem: parcela.Origem,
          CodOrigem: parcela.CodOrigem,
          NumeroParcela: parcela.NumeroParcela,
          CodFormaPagamento: parcela.CodFormaPagamento,
          DataEmissao: new Date(parcela.DataEmissao),
          DataVenda: new Date(parcela.DataVenda),
          DataVencimento: new Date(parcela.DataVencimento),
          ValorBruto: parcela.ValorBruto,
          ValorLiquido: parcela.ValorLiquido,
          ValorParcela: parcela.ValorParcela,
          Observacao: parcela.Observacao,
        };
      }),
    };

    const _cobranca = Cobranca.fromObject(result);
    return _cobranca;
  }
}
