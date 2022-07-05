import { Request, Response } from 'express';

export default class PagamentoController {
  constructor() {}

  public static async get(req: Request, res: Response) {
    res.send('Pagamento get');
  }

  public static async post(req: Request, res: Response) {
    res.send('Pagamento post');
  }

  public static put(req: Request, res: Response) {
    res.send('Pagamento put');
  }

  public static delete(req: Request, res: Response) {
    res.send('Pagamento delete');
  }
}
