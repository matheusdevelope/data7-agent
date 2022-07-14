import { app, dialog, Menu, nativeImage, Tray } from 'electron';
import { resolve } from 'path';
import { Global_State } from '../../global_state';
import CreateWindow from './CreateWindow';
import { GenerateJWT } from './jwt';
import ip from 'ip';

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
          console.log('Stop: ');
        });
      },
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
    {
      label: 'Open QrCode to Login',
      click: () => {
        const WindowQR = CreateWindow('login_with_qrcode');
        WindowQR.once('ready-to-show', () => {
          WindowQR.webContents.send(Global_State.events.login_with_qrcode, {
            ip: ip.address(),
            port: Global_State.port_server_http,
            token: GenerateJWT(),
          });
          WindowQR.show();
        });
      },
    },
    {
      label: 'Encerar Aplicativo',
      click: () => app.quit(),
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
