import { safeStorage } from 'electron';
import Store, { Schema } from 'electron-store';
import { GenerateJWT, ValidateJWT } from '../../app/handlers/jwt';
const Expiration_JWT = 180;
const DefaultConfig = [
  { key: 'db_host', value: 'localhost', label: 'Host Banco de Dados', type: 'text', order: 1 },
  { key: 'db_pass', value: '', label: 'Senha Banco de Dados', type: 'text', order: 2 },
];
const Schema_Storage: Schema<Record<string, string>> = {
  application_pass: {
    type: 'string',
  },
  application_ids: {
    type: 'array',
    contains: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        id: { type: 'string' },
        identification: { type: 'string' },
      },
      default: {},
    },
  },
  config: {
    type: 'array',
    contains: {
      type: 'object',
      properties: {
        key: { type: 'string' },
        value: { type: 'string' },
        label: { type: 'string' },
        type: { type: 'string' },
        order: { type: 'number' },
      },
    },
  },
};

interface IApplicationID {
  username: string;
  id: string;
  identification: string;
}

const Storage = new Store({
  name: 'the_config',
  watch: true,
  encryptionKey: 'process.env.encryptionKey',
  schema: Schema_Storage,
});
if (!Storage.has('config')) {
  Storage.set('config', DefaultConfig);
}

const SafeStorage = {
  setPassword(key: string, password: string) {
    try {
      const buffer = safeStorage.encryptString(password);
      Storage.set(key, buffer.toString('latin1'));
      return true;
    } catch (error) {
      return new Error(String(error));
    }
  },
  getPassword(key: string) {
    if (Storage.has(key)) {
      try {
        return safeStorage.decryptString(Buffer.from(Storage.get(key), 'latin1'));
      } catch (error) {
        return new Error(String(error));
      }
    }
    return false;
  },
};

function GetAplicationsIDs(): IApplicationID[] | false {
  if (!Storage.has('application_ids')) return false;
  const IDs = Storage.get('application_ids') as unknown as IApplicationID[];
  return IDs;
}
function GetAplicationData(username: string): IApplicationID | undefined | false {
  const IDs = GetAplicationsIDs();
  if (!IDs) return false;
  return IDs.find((obj) => (obj.username = username));
}
function ValidateApplicationID(id: string) {
  const Payload = ValidateJWT(id);
  if (typeof Payload == 'boolean') {
    return false;
  }
  return Payload;
}

function GenerateApplicationID(username: string) {
  let AplicationID = GetAplicationData(username);
  if (AplicationID === false) {
    try {
      const newApplicationID = { username, id: GenerateJWT(Expiration_JWT), identification: username };
      Storage.set('application_ids', [newApplicationID]);
      return newApplicationID;
    } catch (error) {
      return false;
    }
  }
  let IDs = GetAplicationsIDs();
  if (IDs) {
    //Existe uma lista de ID, mas não pra esse user
    if (typeof AplicationID === undefined) {
      try {
        const newApplicationID: IApplicationID = {
          username,
          id: GenerateJWT(Expiration_JWT),
          identification: username,
        };
        Storage.set('application_ids', [...IDs, newApplicationID]);
        return newApplicationID;
      } catch (error) {
        return false;
      }
    }

    //Já Existe esse user na lista
    if (AplicationID) {
      //Verifica se o ID ainda é valido (renova caso não seja)
      if (ValidateJWT(AplicationID.id) === false) {
        const index = IDs.findIndex((obj) => obj.username === username);
        const newApplicationID: IApplicationID = { ...IDs[index], id: GenerateJWT(Expiration_JWT) };
        IDs.splice(index, 1, newApplicationID);
        return newApplicationID;
      }
      return AplicationID;
    }
  }
  try {
    const newApplicationID = { username, id: GenerateJWT(Expiration_JWT), identification: username };
    Storage.set('application_ids', [newApplicationID]);
    return newApplicationID;
  } catch (error) {
    return false;
  }
}

export { SafeStorage, Storage, GetAplicationsIDs, GetAplicationData, ValidateApplicationID, GenerateApplicationID };
