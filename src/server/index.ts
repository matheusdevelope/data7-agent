import express from 'express';
import cors from 'cors';
import http from 'http';

import ApiRoute from './routes';
import { Global_State } from '../global_state';

export default class Server_Http {
  private app = express();
  private server = http.createServer(this.app);
  private publicPath = '../../public';

  constructor(private readonly port: number = Global_State.port_server_http) {
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
