import { BrowserWindow, globalShortcut } from 'electron';

function RegisterShortcuts(Window: BrowserWindow) {
  function F5() {
    globalShortcut.register('f5', () => Window.reload());
  }

  return { F5 };
}

export { RegisterShortcuts };
