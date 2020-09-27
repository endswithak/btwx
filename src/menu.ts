import electron, { app, BrowserWindow, Menu, dialog } from 'electron';
import { handleSetTheme, createNewDocument, handleSave, handleSaveAs, handleOpenDocument } from './index';
import { APP_NAME } from './constants';

const isMac = process.platform === 'darwin';

const getFocusedDocument = (): electron.BrowserWindow => {
  return BrowserWindow.getFocusedWindow() ? BrowserWindow.getFocusedWindow().getParentWindow() ? BrowserWindow.getFocusedWindow().getParentWindow() : BrowserWindow.getFocusedWindow() : null;
}

export default Menu.buildFromTemplate([
  // { role: 'appMenu' }
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      // {
      //   label: 'Preferences',
      //   click: () => {
      //     if (!preferencesWindow) {
      //       createPreferencesWindow();
      //     }
      //   }
      // },
      {
        label: 'Theme',
        submenu: [
          {
            label: 'Dark',
            type: 'radio',
            checked: false,
            id: 'appDarkTheme',
            enabled: false,
            click: () => {
              handleSetTheme('dark');
            }
          },
          {
            label: 'Light',
            type: 'radio',
            checked: false,
            id: 'appLightTheme',
            enabled: false,
            click: () => {
              handleSetTheme('light');
            }
          }
        ]
      },
      { type: 'separator' },
      {
        label: 'Reload',
        id: 'appReload',
        enabled: false,
        accelerator: process.platform === 'darwin' ? 'Cmd+R' : 'Ctrl+R',
        click: (): void => {
          const document = getFocusedDocument();
          document.webContents.reload();
        }
      },
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
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [
      {
        label: 'New',
        id: 'fileNew',
        enabled: false,
        accelerator: process.platform === 'darwin' ? 'Cmd+N' : 'Ctrl+N',
        click: (): void => {
          // if document already open, set new document size to focused document size
          const focusedDocument = getFocusedDocument();
          if (focusedDocument) {
            const size = focusedDocument.getSize();
            createNewDocument(size[0], size[1]);
          } else {
            createNewDocument();
          }
        }
      },
      {
        label: 'Save',
        id: 'fileSave',
        enabled: false,
        accelerator: process.platform === 'darwin' ? 'Cmd+S' : 'Ctrl+S',
        click: (): void => {
          const document = getFocusedDocument();
          document.webContents.executeJavaScript(`getDocumentSettings()`).then((documentSettingsJSON) => {
            const documentSettings = JSON.parse(documentSettingsJSON);
            if (documentSettings.path) {
              handleSave(document, documentSettings.path);
            } else {
              handleSaveAs(document);
            }
          });
        }
      },
      {
        label: 'Save As...',
        id: 'fileSaveAs',
        enabled: false,
        accelerator: process.platform === 'darwin' ? 'Cmd+Shift+S' : 'Ctrl+Shift+S',
        click: (): void => {
          const document = getFocusedDocument();
          handleSaveAs(document);
        }
      },
      {
        label: 'Open...',
        id: 'fileOpen',
        enabled: false,
        accelerator: process.platform === 'darwin' ? 'Cmd+O' : 'Ctrl+O',
        click: (): void => {
          dialog.showOpenDialog({
            filters: [
              { name: 'Custom File Type', extensions: [APP_NAME] }
            ],
            properties: ['openFile']
          }).then((result) => {
            if (result.filePaths.length > 0 && !result.canceled) {
              handleOpenDocument(result.filePaths[0]);
            }
          });
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
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  },
  // { role: 'editMenu' }
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        id: 'editUndo',
        enabled: false,
        accelerator: process.platform === 'darwin' ? 'Cmd+Z' : 'Ctrl+Z',
        click: (): void => {
          const document = getFocusedDocument();
          document.webContents.executeJavaScript(`editUndo()`);
        }
      },
      {
        label: 'Redo',
        id: 'editRedo',
        enabled: false,
        accelerator: process.platform === 'darwin' ? 'Cmd+Shift+Z' : 'Ctrl+Shift+Z',
        click: (): void => {
          const document = getFocusedDocument();
          document.webContents.executeJavaScript(`editRedo()`);
        }
      },
      { type: 'separator' },
      {
        label: 'Cut',
        id: 'editCut',
        enabled: false,
        click: (): void => {
          const document = getFocusedDocument();
          document.webContents.executeJavaScript(`editCut()`);
        }
      },
      {
        label: 'Copy',
        submenu: [
          {
            label: 'Copy',
            id: 'editCopy',
            enabled: false,
            accelerator: process.platform === 'darwin' ? 'Cmd+C' : 'Ctrl+C',
            click: () => {
              const document = getFocusedDocument();
              document.webContents.executeJavaScript(`editCopy()`);
            }
          },
          {
            label: 'Copy SVG',
            id: 'editCopySVG',
            enabled: false,
            click: () => {
              const document = getFocusedDocument();
              document.webContents.executeJavaScript(`editCopySVG()`);
            }
          },
          {
            label: 'Copy Style',
            id: 'editCopyStyle',
            enabled: false,
            accelerator: process.platform === 'darwin' ? 'Cmd+Alt+C' : 'Ctrl+Alt+C',
            click: () => {
              const document = getFocusedDocument();
              document.webContents.executeJavaScript(`editCopyStyle()`);
            }
          }
        ]
      },
      {
        label: 'Paste',
        submenu: [
          {
            label: 'Paste',
            id: 'editPaste',
            enabled: false,
            accelerator: process.platform === 'darwin' ? 'Cmd+V' : 'Ctrl+V',
            click: () => {
              const document = getFocusedDocument();
              document.webContents.executeJavaScript(`editPaste()`);
            }
          },
          {
            label: 'Paste Over Selection',
            id: 'editPasteOverSelection',
            enabled: false,
            accelerator: process.platform === 'darwin' ? 'Cmd+Shift+V' : 'Ctrl+Shift+V',
            click: () => {
              const document = getFocusedDocument();
              document.webContents.executeJavaScript(`editPasteOverSelection()`);
            }
          },
          {
            label: 'Paste Style',
            id: 'editPasteStyle',
            enabled: false,
            accelerator: process.platform === 'darwin' ? 'Cmd+Alt+V' : 'Ctrl+Alt+V',
            click: () => {
              const document = getFocusedDocument();
              document.webContents.executeJavaScript(`editPasteStyle()`);
            }
          }
        ]
      },
      {
        label: 'Delete',
        id: 'editDelete',
        enabled: false,
        accelerator: 'Backspace',
        click: (): void => {
          const document = getFocusedDocument();
          document.webContents.executeJavaScript(`editDelete()`);
        }
      }
    ]
  },
  {
    label: 'Insert',
    submenu: [
      {
        label: 'Artboard',
        id: 'insertArtboard',
        enabled: false,
        accelerator: 'A',
        click: () => {
          const document = getFocusedDocument();
          document.webContents.executeJavaScript(`insertArtboard()`);
        }
      },
      { type: 'separator' },
      {
        label: 'Shape',
        submenu: [
          {
            label: 'Rectangle',
            id: 'insertRectangle',
            enabled: false,
            accelerator: 'R',
            click: () => {
              const document = getFocusedDocument();
              document.webContents.executeJavaScript(`insertRectangle()`);
            }
          },
          {
            label: 'Rounded',
            id: 'insertRounded',
            enabled: false,
            accelerator: 'U',
            click: () => {
              const document = getFocusedDocument();
              document.webContents.executeJavaScript(`insertRounded()`);
            }
          },
          {
            label: 'Ellipse',
            id: 'insertEllipse',
            enabled: false,
            accelerator: 'O',
            click: () => {
              const document = getFocusedDocument();
              document.webContents.executeJavaScript(`insertEllipse()`);
            }
          },
          {
            label: 'Star',
            id: 'insertStar',
            enabled: false,
            click: () => {
              const document = getFocusedDocument();
              document.webContents.executeJavaScript(`insertStar()`);
            }
          },
          {
            label: 'Polygon',
            id: 'insertPolygon',
            enabled: false,
            click: () => {
              const document = getFocusedDocument();
              document.webContents.executeJavaScript(`insertPolygon()`);
            }
          },
          {
            label: 'Line',
            id: 'insertLine',
            enabled: false,
            accelerator: 'L',
            click: () => {
              const document = getFocusedDocument();
              document.webContents.executeJavaScript(`insertLine()`);
            }
          },
        ]
      },
      { type: 'separator' },
      {
        label: 'Text',
        id: 'insertText',
        enabled: false,
        accelerator: 'T',
        click: () => {
          const document = getFocusedDocument();
          document.webContents.executeJavaScript(`insertText()`);
        }
      },
      {
        label: 'Image...',
        id: 'insertImage',
        enabled: false,
        click: () => {
          const document = getFocusedDocument();
          document.webContents.executeJavaScript(`insertImage()`);
        }
      }
    ]
  },
  {
    label: 'Arrange',
    submenu: [
      {
        label: 'Bring Forward',
        id: 'arrangeBringForward',
        enabled: false,
        accelerator: process.platform === 'darwin' ? 'Cmd+]' : 'Ctrl+]',
        click: () => {
          const document = getFocusedDocument();
          document.webContents.executeJavaScript(`arrangeBringForward()`);
        }
      },
      {
        label: 'Bring To Front',
        id: 'arrangeBringToFront',
        enabled: false,
        accelerator: process.platform === 'darwin' ? 'Cmd+Alt+]' : 'Ctrl+Alt+]',
        click: () => {
          const document = getFocusedDocument();
          document.webContents.executeJavaScript(`arrangeBringToFront()`);
        }
      },
      {
        label: 'Send Backward',
        id: 'arrangeSendBackward',
        enabled: false,
        accelerator: process.platform === 'darwin' ? 'Cmd+[' : 'Ctrl+[',
        click: () => {
          const document = getFocusedDocument();
          document.webContents.executeJavaScript(`arrangeSendBackward()`);
        }
      },
      {
        label: 'Send To Back',
        id: 'arrangeSendToBack',
        enabled: false,
        accelerator: process.platform === 'darwin' ? 'Cmd+Alt+[' : 'Ctrl+Alt+[',
        click: () => {
          const document = getFocusedDocument();
          document.webContents.executeJavaScript(`arrangeSendToBack()`);
        }
      },
      { type: 'separator' },
      {
        label: 'Align',
        submenu: [
          {
            label: 'Left',
            id: 'arrangeAlignLeft',
            enabled: false,
            click: () => {
              const document = getFocusedDocument();
              document.webContents.executeJavaScript(`arrangeAlignLeft()`);
            }
          },
          {
            label: 'Horizontally',
            id: 'arrangeAlignHorizontally',
            enabled: false,
            click: () => {
              const document = getFocusedDocument();
              document.webContents.executeJavaScript(`arrangeAlignHorizontally()`);
            }
          },
          {
            label: 'Right',
            id: 'arrangeAlignRight',
            enabled: false,
            click: () => {
              const document = getFocusedDocument();
              document.webContents.executeJavaScript(`arrangeAlignRight()`);
            }
          },
          { type: 'separator' },
          {
            label: 'Top',
            id: 'arrangeAlignTop',
            enabled: false,
            click: () => {
              const document = getFocusedDocument();
              document.webContents.executeJavaScript(`arrangeAlignTop()`);
            }
          },
          {
            label: 'Vertically',
            id: 'arrangeAlignVertically',
            enabled: false,
            click: () => {
              const document = getFocusedDocument();
              document.webContents.executeJavaScript(`arrangeAlignVertically()`);
            }
          },
          {
            label: 'Bottom',
            id: 'arrangeAlignBottom',
            enabled: false,
            click: () => {
              const document = getFocusedDocument();
              document.webContents.executeJavaScript(`arrangeAlignBottom()`);
            }
          }
        ]
      },
      {
        label: 'Distribute',
        submenu: [
          {
            label: 'Horizontally',
            id: 'arrangeDistributeHorizontally',
            enabled: false,
            accelerator: process.platform === 'darwin' ? 'Ctrl+Cmd+H' : 'Ctrl+Shift+H',
            click: () => {
              const document = getFocusedDocument();
              document.webContents.executeJavaScript(`arrangeDistributeHorizontally()`);
            }
          },
          {
            label: 'Vertically',
            id: 'arrangeDistributeVertically',
            enabled: false,
            accelerator: process.platform === 'darwin' ? 'Ctrl+Cmd+V' : 'Ctrl+Shift+V',
            click: () => {
              const document = getFocusedDocument();
              document.webContents.executeJavaScript(`arrangeDistributeVertically()`);
            }
          }
        ]
      },
      { type: 'separator' },
      {
        label: 'Group',
        id: 'arrangeGroup',
        enabled: false,
        accelerator: process.platform === 'darwin' ? 'Cmd+G' : 'Ctrl+G',
        click: () => {
          const document = getFocusedDocument();
          document.webContents.executeJavaScript(`arrangeGroup()`);
        }
      },
      {
        label: 'Ungroup',
        id: 'arrangeUngroup',
        enabled: false,
        accelerator: process.platform === 'darwin' ? 'Cmd+Shift+G' : 'Ctrl+Shift+G',
        click: () => {
          const document = getFocusedDocument();
          document.webContents.executeJavaScript(`arrangeUngroup()`);
        }
      },
    ]
  },
  // {
  //   label: 'Import',
  //   submenu: [
  //     {
  //       label: 'Sketch Artboard...',
  //       click: (): void => {
  //         handleSketchImport();
  //       }
  //     }
  //   ]
  // },
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [

      { type: 'separator' },
      { role: 'toggledevtools' },
      { type: 'separator' },
      { role: 'resetzoom' },
      { role: 'zoomin' },
      { role: 'zoomout' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  // { role: 'windowMenu' }
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      ...(isMac ? [
        { type: 'separator' },
        { role: 'front' },
        { type: 'separator' },
        { role: 'window' }
      ] : [
        { role: 'close' }
      ])
    ]
  }
] as any);