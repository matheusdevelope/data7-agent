import { safeStorage } from 'electron';
import Store from 'electron-store';

const DefaultConfig = [
  { key: 'db_host', value: 'localhost', label: 'Host Banco de Dados', type: 'text', order: 1 },
  { key: 'db_pass', value: '', label: 'Senha Banco de Dados', type: 'text', order: 2 },
];

const Storage = new Store<Record<string, string>>({
  name: 'the_config',
  watch: true,
  encryptionKey: 'process.env.encryptionKey',
  schema: {
    application_pass: {
      type: 'string',
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
  },
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
export { SafeStorage, Storage };
