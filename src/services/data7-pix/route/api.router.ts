import { Router, Request, Response } from 'express';
import CobrancaController from '../controllers/cobranca.controller';
import PagamentoController from '../controllers/pagamento.controller';

export default class ApiRoute {
  private _router = Router();

  constructor() {
    this.inicialize();
  }

  inicialize() {
    this.index();
    this.cobranca();
    this.pagamento();
  }

  static router = new ApiRoute().getRouter();
  private getRouter() {
    return this._router;
  }

  //add new route here
  private index() {
    this._router.get('/', (req: Request, res: Response) => {
      res.send('Data7 API-PIX');
    });
  }

  private cobranca() {
    this._router.get('/cobranca', CobrancaController.get);
    this._router.post('/cobranca', CobrancaController.post);
    this._router.put('/cobranca', CobrancaController.put);
    this._router.delete('/cobranca', CobrancaController.delete);
  }

  private pagamento() {
    this._router.get('/pagamento', PagamentoController.get);
    this._router.post('/pagamento', PagamentoController.post);
    this._router.put('/pagamento', PagamentoController.put);
    this._router.delete('/pagamento', PagamentoController.delete);
  }
}
