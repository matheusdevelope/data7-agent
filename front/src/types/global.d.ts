import { ElectronAPI } from '../../../src/app/main/preload';
declare global {
  interface Window {
    ElectronAPI: typeof ElectronAPI;
  }
}
