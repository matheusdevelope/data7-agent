import { Server, Socket } from 'socket.io';
import { GenerateJWT } from '../app/handlers/jwt';
import { Global_State } from '../global_state';
import { GetAplicationData } from '../services/local_storage/Applications_IDs_By_Username';
import {
  DeleteDeviceMobile,
  GetDeviceMobile,
  GetDevicesMobile,
  RegisterDeviceMobile,
  UpdateDeviceMobile,
} from '../services/local_storage/Devices';

function HandleSocket(socket: Socket, io: Server) {
  socket.on('register-device', (received_data) => {
    RegisterDevice(socket, received_data);
  });
  socket.on('unregister-device', (received_data) => {
    UnRegisterDevice(socket, received_data);
  });
  socket.on('authenticate-device', (received_data) => {
    AuthenticateDevice(socket, received_data);
  });
  socket.on('disconnect', (message) => {
    OnDisconnection(socket, message);
  });
}

function RegisterDevice(socket: Socket, device: IDeviceMobile) {
  const LocalDevice = GetDeviceMobile(device.id);
  if (LocalDevice) {
    if (UpdateDeviceMobile({ ...device, socket_id: socket.id })) {
      const ApplicationData = GetAplicationData(Global_State.username_machine);
      if (!ApplicationData) return socket.emit('register-error', 'No aplication data provider');
      return socket.emit('register-success', {
        terminal: ApplicationData,
        newtoken: GenerateJWT(60 * 60),
      });
    }
    return socket.emit('register-failed', 'Failed to register your device!');
  } else {
    if (RegisterDeviceMobile({ ...device, socket_id: socket.id })) {
      const ApplicationData = GetAplicationData(Global_State.username_machine);
      if (!ApplicationData) return socket.emit('register-error', 'No aplication data provider');
      return socket.emit('register-success', {
        terminal: ApplicationData,
        newtoken: GenerateJWT(60 * 60),
      });
    } else {
      return socket.emit('register-error', 'Error on register device!');
    }
  }
  return socket.emit('register-failed', 'Error proccess register device!');
}
function UnRegisterDevice(socket: Socket, device: IDeviceMobile) {
  if (DeleteDeviceMobile(device.id)) {
    socket.emit('unregister-success', 'Success on unregister');
  } else {
    socket.emit('unregister-failed', 'Success on unregister');
  }
}
function AuthenticateDevice(socket: Socket, device: IDeviceMobile) {
  const LocalDevice = GetDeviceMobile(device.id);
  if (LocalDevice) {
    if (UpdateDeviceMobile({ ...device, socket_id: socket.id, online: true })) {
      const ApplicationData = GetAplicationData(Global_State.username_machine);
      if (!ApplicationData) return socket.emit('authenticate-error', 'No application data provider');
      return socket.emit('authenticate-success', { terminal: ApplicationData });
    }
    return socket.emit('authenticate-error', 'Failed on update status o online!');
  }
  return socket.emit('authenticate-failed', 'Register not found to your device!');
}
function OnDisconnection(socket: Socket, message: string) {
  const LocalDevices = GetDevicesMobile();
  if (LocalDevices) {
    const index = LocalDevices.findIndex((obj) => (obj.socket_id = socket.id));
    if (index !== -1) {
      const device = LocalDevices[index];
      UpdateDeviceMobile({ ...device, socket_id: socket.id, online: false });
    }
    return socket.emit('disconnection-success', 'Success on disconect!');
  }
  return socket.emit('disconnection-failed');
}

export { HandleSocket };
