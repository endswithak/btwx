import { Menu } from 'electron';
import { APP_NAME } from '../renderer/constants';
import { createInstance, handleOpenDialog, createPreferences } from './main.dev';

const isMac = process.platform === 'darwin';

const preferences = {
  label: 'Preferences',
  id: 'appPreferences',
  enabled: true,
  click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
    createPreferences();
  }
}

export default Menu.buildFromTemplate([
  ...(isMac ? [{
    label: APP_NAME,
    submenu: [
      preferences,
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),
  {
    label: 'File',
    submenu: [
      {
        label: 'New',
        id: 'fileNew',
        enabled: true,
        accelerator: process.platform === 'darwin' ? 'Cmd+N' : 'Ctrl+N',
        click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
          createInstance({});
        }
      },
      {
        label: 'Open...',
        id: 'fileOpen',
        enabled: true,
        accelerator: process.platform === 'darwin' ? 'Cmd+O' : 'Ctrl+O',
        click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
          handleOpenDialog();
        }
      },
      {
        label: 'Open Recent',
        role: 'recentDocuments',
        submenu: [
          {
            role: 'clearRecentDocuments'
          }
        ]
      },
      ...!isMac ? [ { type: 'separator' }, preferences ] : [],
      { type: 'separator' },
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  }
] as any);