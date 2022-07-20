import { readFile, writeFileSync } from 'fs';
import { Server, Socket } from 'socket.io';
import { GenerateJWT } from '../app/handlers/jwt';
import { Global_State } from '../global_state';
import { GetAplicationData } from '../services/local_storage';

const uuid = 'daropprf546aniowqeuifbv';
const identificacao = 'Terminal caixa 01';

let devices: IDevice[] = [];

function HandleSocket(socket: Socket, io: Server) {
  socket.on('register-device', (received_data) => {
    RegisterDevice(socket, received_data);
  });
  socket.on('authenticate-device', (received_data) => {
    AuthenticateDevice(socket, received_data);
  });
  socket.on('disconnect', (message) => {
    OnDisconnection(socket, message);
  });
}

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
  const ApplicationData = GetAplicationData(Global_State.username_machine);
  if (!ApplicationData) return socket.emit('register-error', 'No aplication data provider');
  socket.emit('register-success', {
    ApplicationData,
    newtoken: GenerateJWT(60),
  });
}

function AuthenticateDevice(socket: Socket, device: IDevice) {
  const IndexDevice = FindIndexDevice(device.id);
  if (IndexDevice >= 0) {
    const ApplicationData = GetAplicationData(Global_State.username_machine);
    if (!ApplicationData) return socket.emit('authenticate-error', 'No aplication data provider');
    socket.emit('authenticate-success', ApplicationData);
    return;
  }
  socket.emit('authenticate-failed');
}
function OnDisconnection(socket: Socket, message: string) {
  console.log(socket.id, 'disconnected with the message: ' + message);
}

export { HandleSocket };
