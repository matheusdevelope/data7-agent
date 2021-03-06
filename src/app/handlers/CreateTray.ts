import { app, dialog, Menu, nativeImage, Tray } from 'electron';
import { resolve } from 'path';
import { Global_State } from '../../global_state';
import { Storage } from '../../services/local_storage';
import { GetAplicationsIDs } from '../../services/local_storage/Applications_IDs_By_Username';
import { GetDevicesMobile } from '../../services/local_storage/Devices';
import CreateWindow from './CreateWindow';
import { DataToLoginMobile, URL_Login_Mobile } from './login_mobile';

const assets_path = resolve(__dirname, '../', '../', 'assets', 'app');
const iconTrayPath = resolve(assets_path, 'trayicon.png');

export default function CreateTray(Server: any) {
  const tray = new Tray(iconTrayPath);
  Server.execute(() => {
    menuTemplate[1].enabled = false;
    menuTemplate[2].enabled = true;
    buildTrayMenu(menuTemplate);
  });
  tray.setToolTip('PIX - Se7e Sistemas');

  const menuTemplate = [
    {
      label: null,
      enabled: false,
    },
    {
      label: 'Iniciar Serviço',
      enabled: true,
      click: () => {
        Server.execute(() => {
          menuTemplate[1].enabled = false;
          menuTemplate[2].enabled = true;
          buildTrayMenu(menuTemplate);
          console.log('Start: ');
        });
      },
    },
    {
      label: 'Parar Serviço',
      enabled: false,
      click: () => {
        Server.stop((e: any) => {
          menuTemplate[1].enabled = true;
          menuTemplate[2].enabled = false;
          buildTrayMenu(menuTemplate);
        });
      },
    },

    {
      label: 'Registrar Dispositivo',
      click: () => {
        const WindowQR = CreateWindow('login_with_qrcode');
        WindowQR.once('ready-to-show', () => {
          WindowQR.webContents.send(Global_State.events.login_with_qrcode, URL_Login_Mobile(DataToLoginMobile));
          WindowQR.show();
        });
      },
    },
    {
      label: 'Abrir Configurações',
      click: () => {
        const WindowQR = CreateWindow('/', { alwaysOnTop: true });
        WindowQR.once('ready-to-show', () => {
          WindowQR.show();
        });
      },
    },
    {
      label: 'Exibir Lista IDs Aplicativo',
      click: () => console.log(GetAplicationsIDs()),
    },
    {
      label: 'Exibir Lista Devices',
      click: () => console.log(GetDevicesMobile()),
    },
    {
      label: 'Exibir Storage',
      click: () => console.log(Storage),
    },
    {
      label: 'Limpar Local Storage',
      click: () => console.log(Storage.clear()),
    },
    {
      label: 'Reiniciar Aplicativo',
      click: () => app.relaunch(),
    },
    {
      label: 'Encerar Aplicativo',
      click: () => app.quit(),
    },
    {
      label: 'Sobre',
      click: () => {
        dialog.showMessageBox({
          type: 'info',
          title: 'Sobre',
          message: 'PIX Se7e Sistemas V.1.0.0',
        });
      },
    },
  ];

  const buildTrayMenu = (menu: any) => {
    let lblStatus = 'Desativado';
    let iconStatus = resolve(assets_path, 'red.png');
    if (!menu[1].enabled) {
      iconStatus = resolve(assets_path, 'green.png');
      lblStatus = 'Ativo';
    }

    const iconStatusPath = resolve(__dirname, iconStatus);

    menu[0].label = `Service Status ${lblStatus}`;
    menu[0].icon = nativeImage.createFromPath(iconStatusPath).resize({ width: 14, height: 14 });

    const trayMenu = Menu.buildFromTemplate(menu);
    tray.setContextMenu(trayMenu);
  };

  buildTrayMenu(menuTemplate);

  return tray;
}
