/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { APP_NAME } from '../constants';
import { getFocusedDocumentFromRenderer } from '../utils';
import MenuInsert from './MenuInsert';
import MenuApp from './MenuApp';
import MenuFile from './MenuFile';
import MenuEdit from './MenuEdit';
import MenuLayer from './MenuLayer';
import MenuArrange from './MenuArrange';
import MenuView from './MenuView';

const Menu = (): ReactElement => {
  const [menuType, setMenuType] = useState('default');
  const [menu, setMenu] = useState(undefined);
  const [app, setApp] = useState(undefined);
  const [file, setFile] = useState(undefined);
  const [edit, setEdit] = useState(undefined);
  const [insert, setInsert] = useState(undefined);

  useEffect(() => {
    if (app && file && edit && insert) {
      setMenu([app, file, edit, insert]);
    }
  }, [app, file, edit, insert]);

  useEffect(() => {
    if (menu) {
      const template = remote.Menu.buildFromTemplate(menu);
      remote.Menu.setApplicationMenu(template);
    }
  }, [menu]);

  return (
    menuType === 'default'
    ? <>
        <MenuApp
          setApp={setApp} />
        <MenuFile
          setFile={setFile} />
        <MenuEdit
          setEdit={setEdit} />
        <MenuInsert
          setInsert={setInsert} />
        {/* <MenuLayer />
        <MenuArrange />
        <MenuView /> */}
      </>
    : null
  )
}

export default Menu;

// /* eslint-disable @typescript-eslint/no-use-before-define */
// import { remote } from 'electron';
// import React, { ReactElement, useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { RootState } from '../store/reducers';
// import { APP_NAME } from '../constants';
// import { getFocusedDocumentFromRenderer } from '../utils';
// import MenuInsert from './MenuInsert';
// import MenuApp from './MenuApp';
// import MenuFile from './MenuFile';
// import MenuEdit from './MenuEdit';
// import MenuLayer from './MenuLayer';
// import MenuArrange from './MenuArrange';
// import MenuView from './MenuView';

// const Menu = (): ReactElement => {
//   const [menuType, setMenuType] = useState(null);
//   const focusing = useSelector((state: RootState) => state.canvasSettings.focusing);

//   const isMac = remote.process.platform === 'darwin';

//   const appMenuItem: any[] = isMac ? [{
//     label: APP_NAME,
//     submenu: [
//       {
//         label: 'Theme',
//         submenu: [
//           {
//             label: 'Dark',
//             type: 'checkbox',
//             checked: false,
//             id: 'appThemeDark',
//             enabled: false,
//             click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//               if (browserWindow) {
//                 getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                   focusedDocument.webContents.executeJavaScript(`appThemeDark(true)`);
//                 });
//               }
//             }
//           },
//           {
//             label: 'Light',
//             type: 'checkbox',
//             checked: false,
//             id: 'appThemeLight',
//             enabled: false,
//             click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//               if (browserWindow) {
//                 getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                   focusedDocument.webContents.executeJavaScript(`appThemeLight(true)`);
//                 });
//               }
//             }
//           }
//         ]
//       },
//       { type: 'separator' },
//       {
//         label: 'Reload',
//         id: 'appReload',
//         enabled: false,
//         accelerator: process.platform === 'darwin' ? 'Cmd+R' : 'Ctrl+R',
//         click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//           if (browserWindow) {
//             getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//               focusedDocument.webContents.executeJavaScript(`appReload()`);
//             });
//           }
//         }
//       },
//       { type: 'separator' },
//       { role: 'services' },
//       { type: 'separator' },
//       { role: 'hide' },
//       { role: 'hideothers' },
//       { role: 'unhide' },
//       { type: 'separator' },
//       { role: 'quit' }
//     ]
//   }] : [];

//   const buildInputMenu = () => {
//     const menu = remote.Menu.buildFromTemplate([
//       ...appMenuItem,
//       {
//         label: 'Edit',
//         submenu: [
//           { role: 'undo' },
//           { role: 'redo' },
//           { type: 'separator' },
//           { role: 'cut' },
//           { role: 'copy' },
//           { role: 'paste' },
//           ...(isMac ? [
//             { role: 'pasteAndMatchStyle' },
//             { role: 'delete' },
//             { role: 'selectAll' },
//             { type: 'separator' },
//             {
//               label: 'Speech',
//               submenu: [
//                 { role: 'startSpeaking' },
//                 { role: 'stopSpeaking' }
//               ]
//             }
//           ] : [
//             { role: 'delete' },
//             { type: 'separator' },
//             { role: 'selectAll' }
//           ])
//         ]
//       }
//     ]);
//     remote.Menu.setApplicationMenu(menu);
//     setMenuType('input');
//   }

//   const buildDefaultMenu = () => {
//     const menu = remote.Menu.buildFromTemplate([
//       ...appMenuItem,
//       {
//         label: 'File',
//         submenu: [
//           {
//             label: 'New',
//             id: 'fileNew',
//             enabled: true,
//             accelerator: process.platform === 'darwin' ? 'Cmd+N' : 'Ctrl+N',
//             click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//               // if (browserWindow) {
//               //   getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//               //     const size = focusedDocument.getSize();
//               //     createNewDocument({width: size[0], height: size[1]});
//               //   });
//               // } else {
//               //   createNewDocument({});
//               // }
//             }
//           },
//           {
//             label: 'Save',
//             id: 'fileSave',
//             enabled: false,
//             accelerator: process.platform === 'darwin' ? 'Cmd+S' : 'Ctrl+S',
//             click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//               if (browserWindow) {
//                 getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                   focusedDocument.webContents.executeJavaScript(`fileSave()`);
//                 });
//               }
//             }
//           },
//           {
//             label: 'Save As...',
//             id: 'fileSaveAs',
//             enabled: false,
//             accelerator: process.platform === 'darwin' ? 'Cmd+Shift+S' : 'Ctrl+Shift+S',
//             click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//               if (browserWindow) {
//                 getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                   focusedDocument.webContents.executeJavaScript(`fileSaveAs()`);
//                 });
//               }
//             }
//           },
//           {
//             label: 'Open...',
//             id: 'fileOpen',
//             enabled: false,
//             accelerator: process.platform === 'darwin' ? 'Cmd+O' : 'Ctrl+O',
//             click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//               // if (browserWindow) {
//               //   getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//               //     focusedDocument.webContents.executeJavaScript(`fileOpen()`);
//               //   });
//               // } else {
//               //   dialog.showOpenDialog({
//               //     filters: [
//               //       { name: 'Custom File Type', extensions: [APP_NAME] }
//               //     ],
//               //     properties: ['openFile']
//               //   }).then((result) => {
//               //     if (result.filePaths.length > 0 && !result.canceled) {
//               //       fs.readFile(result.filePaths[0], {encoding: 'utf-8'}, function(err, data) {
//               //         if(err) {
//               //           return console.log(err);
//               //         } else {
//               //           createNewDocument({document: JSON.parse(data)});
//               //         }
//               //       });
//               //     }
//               //   });
//               // }
//             }
//           },
//           {
//             label: 'Open Recent',
//             role: 'recentDocuments',
//             submenu: [
//               {
//                 role: 'clearRecentDocuments'
//               }
//             ]
//           },
//           isMac ? { role: 'close' } : { role: 'quit' }
//         ]
//       },
//       {
//         label: 'Edit',
//         submenu: [
//           {
//             label: 'Undo',
//             id: 'editUndo',
//             enabled: false,
//             accelerator: process.platform === 'darwin' ? 'Cmd+Z' : 'Ctrl+Z',
//             click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//               if (browserWindow) {
//                 getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                   focusedDocument.webContents.executeJavaScript(`editUndo()`);
//                 });
//               }
//             }
//           },
//           {
//             label: 'Redo',
//             id: 'editRedo',
//             enabled: false,
//             accelerator: process.platform === 'darwin' ? 'Cmd+Shift+Z' : 'Ctrl+Shift+Z',
//             click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//               if (browserWindow) {
//                 getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                   focusedDocument.webContents.executeJavaScript(`editRedo()`);
//                 });
//               }
//             }
//           },
//           { type: 'separator' },
//           {
//             label: 'Cut',
//             id: 'editCut',
//             enabled: false,
//             click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//               if (browserWindow) {
//                 getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                   focusedDocument.webContents.executeJavaScript(`editCut()`);
//                 });
//               }
//             }
//           },
//           {
//             label: 'Copy',
//             submenu: [
//               {
//                 label: 'Copy',
//                 id: 'editCopy',
//                 enabled: false,
//                 accelerator: process.platform === 'darwin' ? 'Cmd+C' : 'Ctrl+C',
//                 click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//                   if (browserWindow) {
//                     getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                       focusedDocument.webContents.executeJavaScript(`editCopy()`);
//                     });
//                   }
//                 }
//               },
//               {
//                 label: 'Copy SVG Code',
//                 id: 'editCopySVG',
//                 enabled: false,
//                 click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//                   if (browserWindow) {
//                     getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                       focusedDocument.webContents.executeJavaScript(`editCopySVG()`);
//                     });
//                   }
//                 }
//               },
//               {
//                 label: 'Copy Style',
//                 id: 'editCopyStyle',
//                 enabled: false,
//                 accelerator: process.platform === 'darwin' ? 'Cmd+Alt+C' : 'Ctrl+Alt+C',
//                 click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//                   if (browserWindow) {
//                     getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                       focusedDocument.webContents.executeJavaScript(`editCopyStyle()`);
//                     });
//                   }
//                 }
//               }
//             ]
//           },
//           {
//             label: 'Paste',
//             submenu: [
//               {
//                 label: 'Paste',
//                 id: 'editPaste',
//                 enabled: false,
//                 accelerator: process.platform === 'darwin' ? 'Cmd+V' : 'Ctrl+V',
//                 click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//                   if (browserWindow) {
//                     getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                       focusedDocument.webContents.executeJavaScript(`editPaste()`);
//                     });
//                   }
//                 }
//               },
//               {
//                 label: 'Paste Over Selection',
//                 id: 'editPasteOverSelection',
//                 enabled: false,
//                 accelerator: process.platform === 'darwin' ? 'Cmd+Shift+V' : 'Ctrl+Shift+V',
//                 click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//                   if (browserWindow) {
//                     getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                       focusedDocument.webContents.executeJavaScript(`editPasteOverSelection()`);
//                     });
//                   }
//                 }
//               },
//               {
//                 label: 'Paste SVG Code',
//                 id: 'editPasteSVG',
//                 enabled: false,
//                 click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//                   if (browserWindow) {
//                     getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                       focusedDocument.webContents.executeJavaScript(`editPasteSVG()`);
//                     });
//                   }
//                 }
//               },
//               {
//                 label: 'Paste Style',
//                 id: 'editPasteStyle',
//                 enabled: false,
//                 accelerator: process.platform === 'darwin' ? 'Cmd+Alt+V' : 'Ctrl+Alt+V',
//                 click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//                   if (browserWindow) {
//                     getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                       focusedDocument.webContents.executeJavaScript(`editPasteStyle()`);
//                     });
//                   }
//                 }
//               }
//             ]
//           },
//           {
//             label: 'Delete',
//             id: 'editDelete',
//             enabled: false,
//             accelerator: 'Backspace',
//             click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//               if (browserWindow) {
//                 getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                   focusedDocument.webContents.executeJavaScript(`editDelete()`);
//                 });
//               }
//             }
//           },
//           { type: 'separator' },
//           {
//             label: 'Duplicate',
//             id: 'editDuplicate',
//             enabled: false,
//             accelerator: process.platform === 'darwin' ? 'Cmd+D' : 'Ctrl+D',
//             click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//               if (browserWindow) {
//                 getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                   focusedDocument.webContents.executeJavaScript(`editDuplicate()`);
//                 });
//               }
//             }
//           },
//           { type: 'separator' },
//           {
//             label: 'Select',
//             submenu: [
//               {
//                 label: 'Select All',
//                 id: 'editSelectAll',
//                 enabled: false,
//                 accelerator: process.platform === 'darwin' ? 'Cmd+A' : 'Ctrl+A',
//                 click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//                   if (browserWindow) {
//                     getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                       focusedDocument.webContents.executeJavaScript(`editSelectAll()`);
//                     });
//                   }
//                 }
//               },
//               {
//                 label: 'Select All Artboards',
//                 id: 'editSelectAllArtboards',
//                 enabled: false,
//                 accelerator: process.platform === 'darwin' ? 'Cmd+Shift+A' : 'Ctrl+Shift+A',
//                 click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//                   if (browserWindow) {
//                     getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                       focusedDocument.webContents.executeJavaScript(`editSelectAllArtboards()`);
//                     });
//                   }
//                 }
//               }
//             ]
//           },
//           { type: 'separator' },
//           {
//             label: 'Find Layer',
//             id: 'editFind',
//             enabled: false,
//             accelerator: process.platform === 'darwin' ? 'Cmd+F' : 'Ctrl+F',
//             click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//               if (browserWindow) {
//                 getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                   focusedDocument.webContents.executeJavaScript(`editFind()`);
//                 });
//               }
//             }
//           },
//           {
//             label: 'Rename Layer',
//             id: 'editRename',
//             enabled: false,
//             accelerator: process.platform === 'darwin' ? 'Cmd+R' : 'Ctrl+R',
//             click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//               if (browserWindow) {
//                 getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                   focusedDocument.webContents.executeJavaScript(`editRename()`);
//                 });
//               }
//             }
//           }
//         ]
//       },
//       {
//         label: 'Insert',
//         submenu: [
//           {
//             label: 'Artboard',
//             id: 'insertArtboard',
//             type: 'checkbox',
//             checked: false,
//             enabled: false,
//             accelerator: 'A',
//             click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//               if (browserWindow) {
//                 getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                   focusedDocument.webContents.executeJavaScript(`insertArtboard()`);
//                 });
//               }
//             }
//           },
//           { type: 'separator' },
//           {
//             label: 'Shape',
//             submenu: [
//               {
//                 label: 'Rectangle',
//                 id: 'insertShapeRectangle',
//                 type: 'checkbox',
//                 checked: false,
//                 enabled: false,
//                 accelerator: 'R',
//                 click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//                   if (browserWindow) {
//                     getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                       focusedDocument.webContents.executeJavaScript(`insertShapeRectangle()`);
//                     });
//                   }
//                 }
//               },
//               {
//                 label: 'Rounded',
//                 id: 'insertShapeRounded',
//                 type: 'checkbox',
//                 checked: false,
//                 enabled: false,
//                 accelerator: 'U',
//                 click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//                   if (browserWindow) {
//                     getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                       focusedDocument.webContents.executeJavaScript(`insertShapeRounded()`);
//                     });
//                   }
//                 }
//               },
//               {
//                 label: 'Ellipse',
//                 id: 'insertShapeEllipse',
//                 type: 'checkbox',
//                 checked: false,
//                 enabled: false,
//                 accelerator: 'O',
//                 click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//                   if (browserWindow) {
//                     getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                       focusedDocument.webContents.executeJavaScript(`insertShapeEllipse()`);
//                     });
//                   }
//                 }
//               },
//               {
//                 label: 'Star',
//                 id: 'insertShapeStar',
//                 type: 'checkbox',
//                 checked: false,
//                 enabled: false,
//                 click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//                   if (browserWindow) {
//                     getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                       focusedDocument.webContents.executeJavaScript(`insertShapeStar()`);
//                     });
//                   }
//                 }
//               },
//               {
//                 label: 'Polygon',
//                 id: 'insertShapePolygon',
//                 type: 'checkbox',
//                 checked: false,
//                 enabled: false,
//                 click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//                   if (browserWindow) {
//                     getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                       focusedDocument.webContents.executeJavaScript(`insertShapePolygon()`);
//                     });
//                   }
//                 }
//               },
//               {
//                 label: 'Line',
//                 id: 'insertShapeLine',
//                 type: 'checkbox',
//                 checked: false,
//                 enabled: false,
//                 accelerator: 'L',
//                 click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//                   if (browserWindow) {
//                     getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                       focusedDocument.webContents.executeJavaScript(`insertShapeLine()`);
//                     });
//                   }
//                 }
//               },
//             ]
//           },
//           { type: 'separator' },
//           {
//             label: 'Text',
//             id: 'insertText',
//             type: 'checkbox',
//             checked: false,
//             enabled: false,
//             accelerator: 'T',
//             click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//               if (browserWindow) {
//                 getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                   focusedDocument.webContents.executeJavaScript(`insertText()`);
//                 });
//               }
//             }
//           },
//           {
//             label: 'Image...',
//             id: 'insertImage',
//             enabled: false,
//             click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//               if (browserWindow) {
//                 getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                   focusedDocument.webContents.executeJavaScript(`insertImage()`);
//                 });
//               }
//             }
//           }
//         ]
//       },
//       {
//         label: 'Layer',
//         submenu: [
//           {
//             label: 'Style',
//             submenu: [
//               {
//                 label: 'Fill',
//                 id: 'layerStyleFill',
//                 enabled: false,
//                 type: 'checkbox',
//                 checked: false,
//                 click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//                   if (browserWindow) {
//                     getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                       focusedDocument.webContents.executeJavaScript(`layerStyleFill()`);
//                     });
//                   }
//                 }
//               },
//               {
//                 label: 'Stroke',
//                 id: 'layerStyleStroke',
//                 enabled: false,
//                 type: 'checkbox',
//                 checked: false,
//                 click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//                   if (browserWindow) {
//                     getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                       focusedDocument.webContents.executeJavaScript(`layerStyleStroke()`);
//                     });
//                   }
//                 }
//               },
//               {
//                 label: 'Shadow',
//                 id: 'layerStyleShadow',
//                 enabled: false,
//                 type: 'checkbox',
//                 checked: false,
//                 click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//                   if (browserWindow) {
//                     getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                       focusedDocument.webContents.executeJavaScript(`layerStyleShadow()`);
//                     });
//                   }
//                 }
//               }
//             ]
//           },
//           {
//             label: 'Transform',
//             submenu: [
//               {
//                 label: 'Flip Horizontally',
//                 id: 'layerTransformFlipHorizontally',
//                 enabled: false,
//                 type: 'checkbox',
//                 checked: false,
//                 click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//                   if (browserWindow) {
//                     getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                       focusedDocument.webContents.executeJavaScript(`layerTransformFlipHorizontally()`);
//                     });
//                   }
//                 }
//               },
//               {
//                 label: 'Flip Vertically',
//                 id: 'layerTransformFlipVertically',
//                 enabled: false,
//                 type: 'checkbox',
//                 checked: false,
//                 click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//                   if (browserWindow) {
//                     getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                       focusedDocument.webContents.executeJavaScript(`layerTransformFlipVertically()`);
//                     });
//                   }
//                 }
//               }
//             ]
//           },
//           {
//             label: 'Combine',
//             submenu: [
//               {
//                 label: 'Union',
//                 id: 'layerCombineUnion',
//                 enabled: false,
//                 accelerator: process.platform === 'darwin' ? 'Cmd+Alt+U' : 'Ctrl+Alt+U',
//                 click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//                   if (browserWindow) {
//                     getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                       focusedDocument.webContents.executeJavaScript(`layerCombineUnion()`);
//                     });
//                   }
//                 }
//               },
//               {
//                 label: 'Subtract',
//                 id: 'layerCombineSubtract',
//                 enabled: false,
//                 accelerator: process.platform === 'darwin' ? 'Cmd+Alt+S' : 'Ctrl+Alt+S',
//                 click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//                   if (browserWindow) {
//                     getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                       focusedDocument.webContents.executeJavaScript(`layerCombineSubtract()`);
//                     });
//                   }
//                 }
//               },
//               {
//                 label: 'Intersect',
//                 id: 'layerCombineIntersect',
//                 enabled: false,
//                 accelerator: process.platform === 'darwin' ? 'Cmd+Alt+I' : 'Ctrl+Alt+I',
//                 click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//                   if (browserWindow) {
//                     getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                       focusedDocument.webContents.executeJavaScript(`layerCombineIntersect()`);
//                     });
//                   }
//                 }
//               },
//               {
//                 label: 'Difference',
//                 id: 'layerCombineDifference',
//                 enabled: false,
//                 accelerator: process.platform === 'darwin' ? 'Cmd+Alt+X' : 'Ctrl+Alt+X',
//                 click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//                   if (browserWindow) {
//                     getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                       focusedDocument.webContents.executeJavaScript(`layerCombineDifference()`);
//                     });
//                   }
//                 }
//               }
//             ]
//           },
//           {
//             label: 'Image',
//             submenu: [
//               {
//                 label: 'Replace...',
//                 id: 'layerImageReplace',
//                 enabled: false,
//                 click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//                   if (browserWindow) {
//                     getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                       focusedDocument.webContents.executeJavaScript(`layerImageReplace()`);
//                     });
//                   }
//                 }
//               },
//               {
//                 label: 'Set to Original Dimensions',
//                 id: 'layerImageOriginalDimensions',
//                 enabled: false,
//                 click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//                   if (browserWindow) {
//                     getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                       focusedDocument.webContents.executeJavaScript(`layerImageOriginalDimensions()`);
//                     });
//                   }
//                 }
//               }
//             ]
//           },
//           {
//             label: 'Mask',
//             submenu: [
//               {
//                 label: 'Use As Mask',
//                 id: 'layerMaskUseAsMask',
//                 enabled: false,
//                 accelerator: process.platform === 'darwin' ? 'Cmd+M' : 'Ctrl+M',
//                 type: 'checkbox',
//                 checked: false,
//                 click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//                   if (browserWindow) {
//                     getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                       focusedDocument.webContents.executeJavaScript(`layerMaskUseAsMask()`);
//                     });
//                   }
//                 }
//               },
//               {
//                 label: 'Ignore Underlying Mask',
//                 id: 'layerMaskIgnoreUnderlyingMask',
//                 enabled: false,
//                 accelerator: process.platform === 'darwin' ? 'Cmd+Shift+M' : 'Ctrl+Shift+M',
//                 type: 'checkbox',
//                 checked: false,
//                 click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//                   if (browserWindow) {
//                     getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                       focusedDocument.webContents.executeJavaScript(`layerMaskIgnoreUnderlyingMask()`);
//                     });
//                   }
//                 }
//               }
//             ]
//           },
//         ]
//       },
//       {
//         label: 'Arrange',
//         submenu: [
//           {
//             label: 'Bring Forward',
//             id: 'arrangeBringForward',
//             enabled: false,
//             accelerator: process.platform === 'darwin' ? 'Cmd+]' : 'Ctrl+]',
//             click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//               if (browserWindow) {
//                 getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                   focusedDocument.webContents.executeJavaScript(`arrangeBringForward()`);
//                 });
//               }
//             }
//           },
//           {
//             label: 'Bring To Front',
//             id: 'arrangeBringToFront',
//             enabled: false,
//             accelerator: process.platform === 'darwin' ? 'Cmd+Alt+]' : 'Ctrl+Alt+]',
//             click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//               if (browserWindow) {
//                 getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                   focusedDocument.webContents.executeJavaScript(`arrangeBringToFront()`);
//                 });
//               }
//             }
//           },
//           {
//             label: 'Send Backward',
//             id: 'arrangeSendBackward',
//             enabled: false,
//             accelerator: process.platform === 'darwin' ? 'Cmd+[' : 'Ctrl+[',
//             click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//               if (browserWindow) {
//                 getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                   focusedDocument.webContents.executeJavaScript(`arrangeSendBackward()`);
//                 });
//               }
//             }
//           },
//           {
//             label: 'Send To Back',
//             id: 'arrangeSendToBack',
//             enabled: false,
//             accelerator: process.platform === 'darwin' ? 'Cmd+Alt+[' : 'Ctrl+Alt+[',
//             click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//               if (browserWindow) {
//                 getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                   focusedDocument.webContents.executeJavaScript(`arrangeSendToBack()`);
//                 });
//               }
//             }
//           },
//           { type: 'separator' },
//           {
//             label: 'Align',
//             submenu: [
//               {
//                 label: 'Left',
//                 id: 'arrangeAlignLeft',
//                 enabled: false,
//                 click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//                   if (browserWindow) {
//                     getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                       focusedDocument.webContents.executeJavaScript(`arrangeAlignLeft()`);
//                     });
//                   }
//                 }
//               },
//               {
//                 label: 'Horizontally',
//                 id: 'arrangeAlignHorizontally',
//                 enabled: false,
//                 click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//                   if (browserWindow) {
//                     getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                       focusedDocument.webContents.executeJavaScript(`arrangeAlignHorizontally()`);
//                     });
//                   }
//                 }
//               },
//               {
//                 label: 'Right',
//                 id: 'arrangeAlignRight',
//                 enabled: false,
//                 click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//                   if (browserWindow) {
//                     getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                       focusedDocument.webContents.executeJavaScript(`arrangeAlignRight()`);
//                     });
//                   }
//                 }
//               },
//               { type: 'separator' },
//               {
//                 label: 'Top',
//                 id: 'arrangeAlignTop',
//                 enabled: false,
//                 click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//                   if (browserWindow) {
//                     getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                       focusedDocument.webContents.executeJavaScript(`arrangeAlignTop()`);
//                     });
//                   }
//                 }
//               },
//               {
//                 label: 'Vertically',
//                 id: 'arrangeAlignVertically',
//                 enabled: false,
//                 click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//                   if (browserWindow) {
//                     getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                       focusedDocument.webContents.executeJavaScript(`arrangeAlignVertically()`);
//                     });
//                   }
//                 }
//               },
//               {
//                 label: 'Bottom',
//                 id: 'arrangeAlignBottom',
//                 enabled: false,
//                 click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//                   if (browserWindow) {
//                     getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                       focusedDocument.webContents.executeJavaScript(`arrangeAlignBottom()`);
//                     });
//                   }
//                 }
//               }
//             ]
//           },
//           {
//             label: 'Distribute',
//             submenu: [
//               {
//                 label: 'Horizontally',
//                 id: 'arrangeDistributeHorizontally',
//                 enabled: false,
//                 accelerator: process.platform === 'darwin' ? 'Ctrl+Cmd+H' : 'Ctrl+Shift+H',
//                 click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//                   if (browserWindow) {
//                     getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                       focusedDocument.webContents.executeJavaScript(`arrangeDistributeHorizontally()`);
//                     });
//                   }
//                 }
//               },
//               {
//                 label: 'Vertically',
//                 id: 'arrangeDistributeVertically',
//                 enabled: false,
//                 accelerator: process.platform === 'darwin' ? 'Ctrl+Cmd+V' : 'Ctrl+Shift+V',
//                 click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//                   if (browserWindow) {
//                     getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                       focusedDocument.webContents.executeJavaScript(`arrangeDistributeVertically()`);
//                     });
//                   }
//                 }
//               }
//             ]
//           },
//           { type: 'separator' },
//           {
//             label: 'Group',
//             id: 'arrangeGroup',
//             enabled: false,
//             accelerator: process.platform === 'darwin' ? 'Cmd+G' : 'Ctrl+G',
//             click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//               if (browserWindow) {
//                 getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                   focusedDocument.webContents.executeJavaScript(`arrangeGroup()`);
//                 });
//               }
//             }
//           },
//           {
//             label: 'Ungroup',
//             id: 'arrangeUngroup',
//             enabled: false,
//             accelerator: process.platform === 'darwin' ? 'Cmd+Shift+G' : 'Ctrl+Shift+G',
//             click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//               if (browserWindow) {
//                 getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                   focusedDocument.webContents.executeJavaScript(`arrangeUngroup()`);
//                 });
//               }
//             }
//           },
//         ]
//       },
//       {
//         label: 'View',
//         submenu: [
//           {
//             label: 'Zoom In',
//             id: 'viewZoomIn',
//             enabled: false,
//             accelerator: process.platform === 'darwin' ? 'Cmd+Plus' : 'Ctrl+Plus',
//             click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//               if (browserWindow) {
//                 getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                   focusedDocument.webContents.executeJavaScript(`viewZoomIn()`);
//                 });
//               }
//             }
//           },
//           {
//             label: 'Zoom Out',
//             id: 'viewZoomOut',
//             enabled: false,
//             accelerator: process.platform === 'darwin' ? 'Cmd+-' : 'Ctrl+-',
//             click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//               if (browserWindow) {
//                 getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                   focusedDocument.webContents.executeJavaScript(`viewZoomOut()`);
//                 });
//               }
//             }
//           },
//           {
//             label: 'Zoom To',
//             submenu: [
//               {
//                 label: 'Fit Canvas',
//                 id: 'viewZoomFitCanvas',
//                 enabled: false,
//                 accelerator: process.platform === 'darwin' ? 'Cmd+1' : 'Ctrl+1',
//                 click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//                   if (browserWindow) {
//                     getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                       focusedDocument.webContents.executeJavaScript(`viewZoomFitCanvas()`);
//                     });
//                   }
//                 }
//               },
//               {
//                 label: 'Fit Selection',
//                 id: 'viewZoomFitSelected',
//                 enabled: false,
//                 accelerator: process.platform === 'darwin' ? 'Cmd+2' : 'Ctrl+2',
//                 click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//                   if (browserWindow) {
//                     getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                       focusedDocument.webContents.executeJavaScript(`viewZoomFitSelected()`);
//                     });
//                   }
//                 }
//               },
//               {
//                 label: 'Fit Active Artboard',
//                 id: 'viewZoomFitArtboard',
//                 enabled: false,
//                 accelerator: process.platform === 'darwin' ? 'Cmd+4' : 'Ctrl+4',
//                 click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//                   if (browserWindow) {
//                     getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                       focusedDocument.webContents.executeJavaScript(`viewZoomFitArtboard()`);
//                     });
//                   }
//                 }
//               }
//             ]
//           },
//           { type: 'separator' },
//           {
//             label: 'Center Selection',
//             id: 'viewCenterSelected',
//             enabled: false,
//             accelerator: process.platform === 'darwin' ? 'Cmd+3' : 'Ctrl+3',
//             click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//               if (browserWindow) {
//                 getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                   focusedDocument.webContents.executeJavaScript(`viewCenterSelected()`);
//                 });
//               }
//             }
//           },
//           { type: 'separator' },
//           {
//             label: 'Show Layers',
//             id: 'viewShowLayers',
//             type: 'checkbox',
//             checked: false,
//             enabled: false,
//             accelerator: process.platform === 'darwin' ? 'Cmd+Alt+1' : 'Ctrl+Alt+1',
//             click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//               if (browserWindow) {
//                 getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                   focusedDocument.webContents.executeJavaScript(`viewShowLayers()`);
//                 });
//               }
//             }
//           },
//           {
//             label: 'Show Styles',
//             id: 'viewShowStyles',
//             type: 'checkbox',
//             checked: false,
//             enabled: false,
//             accelerator: process.platform === 'darwin' ? 'Cmd+Alt+2' : 'Ctrl+Alt+2',
//             click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//               if (browserWindow) {
//                 getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                   focusedDocument.webContents.executeJavaScript(`viewShowStyles()`);
//                 });
//               }
//             }
//           },
//           {
//             label: 'Show Events',
//             id: 'viewShowEvents',
//             type: 'checkbox',
//             checked: false,
//             enabled: false,
//             accelerator: process.platform === 'darwin' ? 'Cmd+Alt+3' : 'Ctrl+Alt+3',
//             click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
//               if (browserWindow) {
//                 getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
//                   focusedDocument.webContents.executeJavaScript(`viewShowEvents()`);
//                 });
//               }
//             }
//           },
//           { type: 'separator' },
//           { role: 'toggledevtools' },
//           { type: 'separator' },
//           { role: 'togglefullscreen' }
//         ]
//       },
//       {
//         label: 'Window',
//         submenu: [
//           { role: 'minimize' },
//           { role: 'zoom' },
//           ...(isMac ? [
//             { type: 'separator' },
//             { role: 'front' },
//             { type: 'separator' },
//             { role: 'window' }
//           ] : [
//             { role: 'close' }
//           ])
//         ]
//       }
//     ] as any);
//     remote.Menu.setApplicationMenu(menu);
//     setMenuType('default');
//   }

//   useEffect(() => {
//     if (focusing) {
//       buildDefaultMenu();
//     } else {
//       buildInputMenu();
//     }
//   }, [focusing]);

//   return (
//     menuType === 'default'
//     ? <>
//         <MenuApp />
//         <MenuFile />
//         <MenuEdit />
//         <MenuInsert />
//         <MenuLayer />
//         <MenuArrange />
//         <MenuView />
//       </>
//     : null
//   )
// }

// export default Menu;