import { URL } from 'url';
import path from 'path';

export let resolveHtmlPath: (htmlFileName: string) => string;

if (process.env.NODE_ENV === 'development') {
  const port = process.env.PORT || 1212;
  resolveHtmlPath = (htmlFileName: string) => {
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
} else {
  resolveHtmlPath = (htmlFileName: string) => {
    return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
  }
}

export const buildContentMenuTemplate = (args, btwxElectron, type: 'document' | 'preview')  => {
  const { instanceId, template } = JSON.parse(args, (key, value) => {
    if (key === 'click') {
      const { id, params } = value;
      return (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event) => {
        const instance = btwxElectron.instance.byId[instanceId];
        if (instance) {
          instance[type].webContents.executeJavaScript(`${id}(${JSON.stringify(params)})`);
        }
      }
    } else {
      return value;
    }
  });
  return template;
}