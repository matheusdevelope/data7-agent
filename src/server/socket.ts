import { readFile, writeFileSync } from 'fs';
import { Server, Socket } from 'socket.io';
import { GenerateJWT } from '../app/handlers/jwt';

interface IDevice {
  id: string;
  identificacao: string;
  socket_id: string;
}
const uuid = 'daropprf546aniowqeuifbv';
const identificacao = 'Terminal caixa 01';
const terminal = {
  id: uuid,
  identificacao: identificacao,
};

let devices: IDevice[] = [];

readFile('./devices.json', (err, file) => {
  if (file) {
    devices = JSON.parse(file.toString());
  }
});

function TheDevices() {
  function push(data: IDevice) {
    devices.push(data);
    writeFileSync('./devices.json', JSON.stringify(devices));
  }
  function findIndex(id: string) {
    return devices.findIndex((device) => device.id === id);
  }
  function splice(index: number, qtd: number, data: IDevice) {
    devices.splice(index, qtd, data);
  }
  return {
    push,
    findIndex,
    splice,
  };
}

function FindIndexDevice(id: string) {
  return TheDevices().findIndex(id);
}

function RegisterDevice(socket: Socket, device: IDevice) {
  const IndexDevice = FindIndexDevice(device.id);
  if (IndexDevice >= 0) {
    TheDevices().splice(IndexDevice, 1, { ...device, socket_id: socket.id });
  } else {
    TheDevices().push({ ...device, socket_id: socket.id });
  }
  socket.emit('register-success', {
    terminal,
    newtoken: GenerateJWT(),
  });
}

function AuthenticateDevice(socket: Socket, device: IDevice) {
  const IndexDevice = FindIndexDevice(device.id);
  if (IndexDevice >= 0) {
    socket.emit('authenticate-success', terminal);
    return;
  }
  socket.emit('authenticate-failed');
}

function HandleSocket(socket: Socket, io: Server) {
  socket.on('register-device', (received_data) => {
    RegisterDevice(socket, received_data);
  });
  socket.on('authenticate-device', (received_data) => {
    AuthenticateDevice(socket, received_data);
  });
  socket.on('disconnect', (args) => {
    console.log(socket.id + ' disconnecting');
  });
}

module.exports = { HandleSocket };
