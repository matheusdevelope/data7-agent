import FirebaseCobrancaRepository from '../repository/firebase.cobranca.repository';

import Usuario from '../entities/usuario';
import Cobranca from '../entities/cobranca';
import CobrancaParcela from '../entities/cobranca.parcela';

export default class CobrancaPixFbSpec {
  constructor() {
    this.initialize();
  }

  private async initialize() {}

  async exec() {
    const repository = new FirebaseCobrancaRepository();
    const fakeCobrancas = require('../assets/cobranca.json');

    //test methods / remenber inicializeAPP
    //
    // const cobranca = this.cobrancaFromResponse(fakeCobrancas[0]);
    // repository.insert(cobranca);

    // const cnpj = '27740308000120';
    // const cobranca = await repository.getAll(cnpj);
    // console.log(cobranca);

    // const cnpj = '27740308000120';
    // const id = '3831849.11.27740308000120.20220622181050-OB.21.002';
    // const respose = await repository.getById(cnpj, id);
    // console.log(respose);

    // const cobranca = this.cobrancaFromResponse(fakeCobrancas[2]);
    // const respose = await repository.update(cobranca);
    // console.log(respose);
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
