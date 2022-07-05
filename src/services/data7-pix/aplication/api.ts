import express from 'express';
import cors from 'cors';
import http from 'http';

import ApiRoute from '../route/api.router';

export default class Api {
  private app = express();
  private server = http.createServer(this.app);
  private publicPath = '../../public';

  constructor(private readonly port: number = 3000) {
    this.initialize();
  }

  private async initialize() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.static(this.publicPath));
    this.app.use(cors());
    this.app.use(ApiRoute.router);
    this.app.set('view engine', 'ejs');
  }

  public execute(cb: Function) {
    this.server.listen(this.port, '0.0.0.0', () => cb());
  }
  public stop(cb: Function) {
    this.server.close((e) => cb(e));
  }
}
