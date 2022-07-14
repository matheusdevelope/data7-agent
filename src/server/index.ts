import express from 'express';
import cors from 'cors';
import http from 'http';

import { Server } from 'socket.io';
const { HandleSocket } = require('./socket');

import ApiRoute from './routes';
import { Global_State } from '../global_state';
import { Middleware } from './middleware';

const publicPath = '../dist';

export default function Server_Http(port: number = Global_State.port_server_http) {
  const app = express();
  const server = http.createServer(app);

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(publicPath));
  app.use(cors());
  app.use(ApiRoute());

  const io = new Server(server);
  io.use(Middleware);
  io.on('connection', (socket) => {
    HandleSocket(socket, io);
  });

  return {
    execute: (cb: Function) => {
      server.listen(port, '0.0.0.0', () => cb());
    },
    stop(cb: Function) {
      server.close((e) => cb(e));
    },
  };
}
