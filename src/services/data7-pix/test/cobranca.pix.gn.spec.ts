import GerencianetCobranca from '../services/gerencianet.cobranca';
import ContractCredentialPIX from '../contracts/contract.credential.pix';
import PagamentoLoc from '../entities/pagamento.loc';
import FakeCobrancaRepository from '../repository/fake.cobranca.repository';

//todo: create test jest
export default class CobrancaPixGnSpec {
  private fakeCobrancaRepository = new FakeCobrancaRepository();

  private docsIdFake = [
    '3831849.11.27740308000120.20220622181050-OB.21.001',
    '3831849.11.27740308000120.20220622181050-OB.21.002',
    '3831849.11.27740308000120.20220622181050-OB.21.003',
  ];

  constructor() {
    this.initialize();
  }

  private async initialize() {}

  async exec() {
    const cnpj = '00000000000000';
    const docId: string = this.docsIdFake[0];
    const config: ContractCredentialPIX = require('../assets/config.pix.ts');
    const gerencianetCobranca = new GerencianetCobranca(config);

    // test methods / endpoints
    // const validCPF = '00000000000';
    // const isValidCPF = gerencianetCobranca.validCPF(validCPF);
    // console.log(isValidCPF);

    // const validTXID = '123456789';
    // const isValidTXID = gerencianetCobranca.validTxId(validTXID);
    // console.log(isValidTXID);

    // const chave = await gerencianetCobranca.getChave();
    // console.log(chave);

    // const chaves = await gerencianetCobranca.listChave();
    // console.log(chaves);

    // const txid = 'e8df2b259b32493db5c4aeb4a22413d1';
    // const statusPIX = await gerencianetCobranca.statusPIX(txid);
    // console.log(statusPIX);

    // const locid = 40;
    // const sysId = '3831849.11.00000000000000.20220622181050-OB.21.001';
    // const qrCode = await gerencianetCobranca.createQrCodePIX(sysId, locid);
    // console.log(qrCode);

    // const PixDataInicia = new Date('2022-06-01T20:24:24.846Z');
    // const PixDataFinal = new Date('2022-06-30T20:24:24.846Z');
    // const listPIX = await gerencianetCobranca.listPIX(PixDataInicia, PixDataFinal);
    // console.log(listPIX);

    // const LocDataInicial = new Date('2022-06-01T20:24:24.846Z');
    // const LocDataFinal = new Date('2022-06-30T20:24:24.846Z');
    // const listLoc = await gerencianetCobranca.listLoc(LocDataInicial, LocDataInicial);
    // console.log(listLoc);

    // const endToEndId = 'E18236120202206201518s15b18235b9';
    // const pix = await gerencianetCobranca.PIX(endToEndId);
    // console.log(pix);

    // const fakeCobranca = await this.fakeCobrancaRepository.getById(cnpj, docId);
    // if (fakeCobranca) {
    //   const pagamento = await gerencianetCobranca.createChargePIX(fakeCobranca);
    //   console.log(pagamento);
    // }
  }
}
