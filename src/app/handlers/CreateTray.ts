import { app, dialog, Menu, nativeImage, Tray } from 'electron';
import { resolve } from 'path';

const assets_path = resolve(__dirname, '../', '../', 'assets', 'app');
const iconTrayPath = resolve(assets_path, 'trayicon.png');

export default function CreateTray(Server: any) {
  const tray = new Tray(iconTrayPath);

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
    //  {
    //   label: "Open Window",
    //   click: () => {
    //     console.log(mainWindow);
    //     mainWindow?.isEnabled() ? mainWindow.close() : createWindow();
    //   },
    // },
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
