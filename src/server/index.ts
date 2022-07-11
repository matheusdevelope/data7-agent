import express from 'express';
import cors from 'cors';
import http from 'http';

import ApiRoute from './routes';
import { Global_State } from '../global_state';

const publicPath = '../dist';

export default function Server_Http(port: number = Global_State.port_server_http) {
  const app = express();
  const server = http.createServer(app);

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(publicPath));
  app.use(cors());
  app.use(ApiRoute());
  app.set('view engine', 'ejs');

  return {
    execute: (cb: Function) => {
      server.listen(port, '0.0.0.0', () => cb());
    },
    stop(cb: Function) {
      server.close((e) => cb(e));
    },
  };
}
