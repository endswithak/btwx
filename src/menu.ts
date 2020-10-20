import { app, Menu, dialog } from 'electron';
import { handleSetTheme, createNewDocument, handleSave, handleSaveAs, handleOpenDocument } from './index';
import { getFocusedDocument } from './utils';
import { APP_NAME } from './constants';

const isMac = process.platform === 'darwin';

export default Menu.buildFromTemplate([
  ...(isMac ? [{
    label: app.name,
    submenu: [
      {
        label: 'Theme',
        submenu: [
          {
            label: 'Dark',
            type: 'checkbox',
            checked: false,
            id: 'appThemeDark',
            enabled: false,
            click: () => {
              handleSetTheme('dark');
            }
          },
          {
            label: 'Light',
            type: 'checkbox',
            checked: false,
            id: 'appThemeLight',
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
          getFocusedDocument().then((focusedDocument) => {
            if (focusedDocument) {
              focusedDocument.webContents.reload();
            }
          });
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
          getFocusedDocument().then((focusedDocument) => {
            if (focusedDocument) {
              const size = focusedDocument.getSize();
              createNewDocument(size[0], size[1]);
            } else {
              createNewDocument();
            }
          });
        }
      },
      {
        label: 'Save',
        id: 'fileSave',
        enabled: false,
        accelerator: process.platform === 'darwin' ? 'Cmd+S' : 'Ctrl+S',
        click: (): void => {
          getFocusedDocument().then((focusedDocument) => {
            if (focusedDocument) {
              focusedDocument.webContents.executeJavaScript(`getDocumentSettings()`).then((documentSettingsJSON) => {
                const documentSettings = JSON.parse(documentSettingsJSON);
                if (documentSettings.path) {
                  handleSave(focusedDocument, documentSettings.path);
                } else {
                  handleSaveAs(focusedDocument);
                }
              });
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
          getFocusedDocument().then((focusedDocument) => {
            if (focusedDocument) {
              handleSaveAs(focusedDocument);
            }
          });
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
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        id: 'editUndo',
        enabled: false,
        accelerator: process.platform === 'darwin' ? 'Cmd+Z' : 'Ctrl+Z',
        click: (): void => {
          getFocusedDocument().then((focusedDocument) => {
            if (focusedDocument) {
              focusedDocument.webContents.executeJavaScript(`editUndo()`);
            }
          });
        }
      },
      {
        label: 'Redo',
        id: 'editRedo',
        enabled: false,
        accelerator: process.platform === 'darwin' ? 'Cmd+Shift+Z' : 'Ctrl+Shift+Z',
        click: (): void => {
          getFocusedDocument().then((focusedDocument) => {
            if (focusedDocument) {
              focusedDocument.webContents.executeJavaScript(`editRedo()`);
            }
          });
        }
      },
      { type: 'separator' },
      {
        label: 'Cut',
        id: 'editCut',
        enabled: false,
        click: (): void => {
          getFocusedDocument().then((focusedDocument) => {
            if (focusedDocument) {
              focusedDocument.webContents.executeJavaScript(`editCut()`);
            }
          });
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
              getFocusedDocument().then((focusedDocument) => {
                if (focusedDocument) {
                  focusedDocument.webContents.executeJavaScript(`editCopy()`);
                }
              });
            }
          },
          {
            label: 'Copy SVG Code',
            id: 'editCopySVG',
            enabled: false,
            click: () => {
              getFocusedDocument().then((focusedDocument) => {
                if (focusedDocument) {
                  focusedDocument.webContents.executeJavaScript(`editCopySVG()`);
                }
              });
            }
          },
          {
            label: 'Copy Style',
            id: 'editCopyStyle',
            enabled: false,
            accelerator: process.platform === 'darwin' ? 'Cmd+Alt+C' : 'Ctrl+Alt+C',
            click: () => {
              getFocusedDocument().then((focusedDocument) => {
                if (focusedDocument) {
                  focusedDocument.webContents.executeJavaScript(`editCopyStyle()`);
                }
              });
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
              getFocusedDocument().then((focusedDocument) => {
                if (focusedDocument) {
                  focusedDocument.webContents.executeJavaScript(`editPaste()`);
                }
              });
            }
          },
          {
            label: 'Paste Over Selection',
            id: 'editPasteOverSelection',
            enabled: false,
            accelerator: process.platform === 'darwin' ? 'Cmd+Shift+V' : 'Ctrl+Shift+V',
            click: () => {
              getFocusedDocument().then((focusedDocument) => {
                if (focusedDocument) {
                  focusedDocument.webContents.executeJavaScript(`editPasteOverSelection()`);
                }
              });
            }
          },
          {
            label: 'Paste SVG Code',
            id: 'editPasteSVG',
            enabled: false,
            click: () => {
              getFocusedDocument().then((focusedDocument) => {
                if (focusedDocument) {
                  focusedDocument.webContents.executeJavaScript(`editPasteSVG()`);
                }
              });
            }
          },
          {
            label: 'Paste Style',
            id: 'editPasteStyle',
            enabled: false,
            accelerator: process.platform === 'darwin' ? 'Cmd+Alt+V' : 'Ctrl+Alt+V',
            click: () => {
              getFocusedDocument().then((focusedDocument) => {
                if (focusedDocument) {
                  focusedDocument.webContents.executeJavaScript(`editPasteStyle()`);
                }
              });
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
          getFocusedDocument().then((focusedDocument) => {
            if (focusedDocument) {
              focusedDocument.webContents.executeJavaScript(`editDelete()`);
            }
          });
        }
      },
      { type: 'separator' },
      {
        label: 'Duplicate',
        id: 'editDuplicate',
        enabled: false,
        accelerator: process.platform === 'darwin' ? 'Cmd+D' : 'Ctrl+D',
        click: (): void => {
          getFocusedDocument().then((focusedDocument) => {
            if (focusedDocument) {
              focusedDocument.webContents.executeJavaScript(`editDuplicate()`);
            }
          });
        }
      },
      { type: 'separator' },
      {
        label: 'Select',
        submenu: [
          {
            label: 'Select All',
            id: 'editSelectAll',
            enabled: false,
            accelerator: process.platform === 'darwin' ? 'Cmd+A' : 'Ctrl+A',
            click: () => {
              getFocusedDocument().then((focusedDocument) => {
                if (focusedDocument) {
                  focusedDocument.webContents.executeJavaScript(`editSelectAll()`);
                }
              });
            }
          },
          {
            label: 'Select All Artboards',
            id: 'editSelectAllArtboards',
            enabled: false,
            accelerator: process.platform === 'darwin' ? 'Cmd+Shift+A' : 'Ctrl+Shift+A',
            click: () => {
              getFocusedDocument().then((focusedDocument) => {
                if (focusedDocument) {
                  focusedDocument.webContents.executeJavaScript(`editSelectAllArtboards()`);
                }
              });
            }
          }
        ]
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
          return getFocusedDocument().then((focusedDocument) => {
            if (focusedDocument) {
              focusedDocument.webContents.executeJavaScript(`insertArtboard()`);
            }
          });
        }
      },
      { type: 'separator' },
      {
        label: 'Shape',
        submenu: [
          {
            label: 'Rectangle',
            id: 'insertShapeRectangle',
            enabled: false,
            accelerator: 'R',
            click: () => {
              getFocusedDocument().then((focusedDocument) => {
                if (focusedDocument) {
                  focusedDocument.webContents.executeJavaScript(`insertShape(${JSON.stringify('Rectangle')})`);
                }
              });
            }
          },
          {
            label: 'Rounded',
            id: 'insertShapeRounded',
            enabled: false,
            accelerator: 'U',
            click: () => {
              getFocusedDocument().then((focusedDocument) => {
                if (focusedDocument) {
                  focusedDocument.webContents.executeJavaScript(`insertShape(${JSON.stringify('Rounded')})`);
                }
              });
            }
          },
          {
            label: 'Ellipse',
            id: 'insertShapeEllipse',
            enabled: false,
            accelerator: 'O',
            click: () => {
              getFocusedDocument().then((focusedDocument) => {
                if (focusedDocument) {
                  focusedDocument.webContents.executeJavaScript(`insertShape(${JSON.stringify('Ellipse')})`);
                }
              });
            }
          },
          {
            label: 'Star',
            id: 'insertShapeStar',
            enabled: false,
            click: () => {
              getFocusedDocument().then((focusedDocument) => {
                if (focusedDocument) {
                  focusedDocument.webContents.executeJavaScript(`insertShape(${JSON.stringify('Star')})`);
                }
              });
            }
          },
          {
            label: 'Polygon',
            id: 'insertShapePolygon',
            enabled: false,
            click: () => {
              getFocusedDocument().then((focusedDocument) => {
                if (focusedDocument) {
                  focusedDocument.webContents.executeJavaScript(`insertShape(${JSON.stringify('Polygon')})`);
                }
              });
            }
          },
          {
            label: 'Line',
            id: 'insertShapeLine',
            enabled: false,
            accelerator: 'L',
            click: () => {
              getFocusedDocument().then((focusedDocument) => {
                if (focusedDocument) {
                  focusedDocument.webContents.executeJavaScript(`insertShape(${JSON.stringify('Line')})`);
                }
              });
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
          getFocusedDocument().then((focusedDocument) => {
            if (focusedDocument) {
              focusedDocument.webContents.executeJavaScript(`insertText()`);
            }
          });
        }
      },
      {
        label: 'Image...',
        id: 'insertImage',
        enabled: false,
        click: () => {
          getFocusedDocument().then((focusedDocument) => {
            if (focusedDocument) {
              focusedDocument.webContents.executeJavaScript(`insertImage()`);
            }
          });
        }
      }
    ]
  },
  {
    label: 'Layer',
    submenu: [
      {
        label: 'Style',
        submenu: [
          {
            label: 'Fill',
            id: 'layerStyleFill',
            enabled: false,
            type: 'checkbox',
            checked: false,
            click: () => {
              getFocusedDocument().then((focusedDocument) => {
                if (focusedDocument) {
                  focusedDocument.webContents.executeJavaScript(`layerStyleFill()`);
                }
              });
            }
          },
          {
            label: 'Stroke',
            id: 'layerStyleStroke',
            enabled: false,
            type: 'checkbox',
            checked: false,
            click: () => {
              getFocusedDocument().then((focusedDocument) => {
                if (focusedDocument) {
                  focusedDocument.webContents.executeJavaScript(`layerStyleStroke()`);
                }
              });
            }
          },
          {
            label: 'Shadow',
            id: 'layerStyleShadow',
            enabled: false,
            type: 'checkbox',
            checked: false,
            click: () => {
              getFocusedDocument().then((focusedDocument) => {
                if (focusedDocument) {
                  focusedDocument.webContents.executeJavaScript(`layerStyleShadow()`);
                }
              });
            }
          }
        ]
      },
      {
        label: 'Transform',
        submenu: [
          {
            label: 'Flip Horizontally',
            id: 'layerTransformFlipHorizontally',
            enabled: false,
            type: 'checkbox',
            checked: false,
            click: () => {
              getFocusedDocument().then((focusedDocument) => {
                if (focusedDocument) {
                  focusedDocument.webContents.executeJavaScript(`layerTransformFlipHorizontally()`);
                }
              });
            }
          },
          {
            label: 'Flip Vertically',
            id: 'layerTransformFlipVertically',
            enabled: false,
            type: 'checkbox',
            checked: false,
            click: () => {
              getFocusedDocument().then((focusedDocument) => {
                if (focusedDocument) {
                  focusedDocument.webContents.executeJavaScript(`layerTransformFlipVertically()`);
                }
              });
            }
          }
        ]
      },
      {
        label: 'Combine',
        submenu: [
          {
            label: 'Union',
            id: 'layerCombineUnion',
            enabled: false,
            accelerator: process.platform === 'darwin' ? 'Cmd+Alt+U' : 'Ctrl+Alt+U',
            click: () => {
              getFocusedDocument().then((focusedDocument) => {
                if (focusedDocument) {
                  focusedDocument.webContents.executeJavaScript(`layerCombine(${JSON.stringify('unite')})`);
                }
              });
            }
          },
          {
            label: 'Subtract',
            id: 'layerCombineSubtract',
            enabled: false,
            accelerator: process.platform === 'darwin' ? 'Cmd+Alt+S' : 'Ctrl+Alt+S',
            click: () => {
              getFocusedDocument().then((focusedDocument) => {
                if (focusedDocument) {
                  focusedDocument.webContents.executeJavaScript(`layerCombine(${JSON.stringify('subtract')})`);
                }
              });
            }
          },
          {
            label: 'Intersect',
            id: 'layerCombineIntersect',
            enabled: false,
            accelerator: process.platform === 'darwin' ? 'Cmd+Alt+I' : 'Ctrl+Alt+I',
            click: () => {
              getFocusedDocument().then((focusedDocument) => {
                if (focusedDocument) {
                  focusedDocument.webContents.executeJavaScript(`layerCombine(${JSON.stringify('intersect')})`);
                }
              });
            }
          },
          {
            label: 'Difference',
            id: 'layerCombineDifference',
            enabled: false,
            accelerator: process.platform === 'darwin' ? 'Cmd+Alt+X' : 'Ctrl+Alt+X',
            click: () => {
              getFocusedDocument().then((focusedDocument) => {
                if (focusedDocument) {
                  focusedDocument.webContents.executeJavaScript(`layerCombine(${JSON.stringify('exclude')})`);
                }
              });
            }
          }
        ]
      },
      {
        label: 'Image',
        submenu: [
          {
            label: 'Replace...',
            id: 'layerImageReplace',
            enabled: false,
            click: () => {
              getFocusedDocument().then((focusedDocument) => {
                if (focusedDocument) {
                  focusedDocument.webContents.executeJavaScript(`layerImageReplace()`);
                }
              });
            }
          },
          {
            label: 'Set to Original Dimensions',
            id: 'layerImageOriginalDimensions',
            enabled: false,
            click: () => {
              getFocusedDocument().then((focusedDocument) => {
                if (focusedDocument) {
                  focusedDocument.webContents.executeJavaScript(`layerImageOriginalDimensions()`);
                }
              });
            }
          }
        ]
      },
      {
        label: 'Mask',
        submenu: [
          {
            label: 'Use As Mask',
            id: 'layerMaskUseAsMask',
            enabled: false,
            accelerator: process.platform === 'darwin' ? 'Cmd+M' : 'Ctrl+M',
            type: 'checkbox',
            checked: false,
            click: () => {
              getFocusedDocument().then((focusedDocument) => {
                if (focusedDocument) {
                  focusedDocument.webContents.executeJavaScript(`layerMaskUseAsMask()`);
                }
              });
            }
          },
          {
            label: 'Ignore Underlying Mask',
            id: 'layerMaskIgnoreUnderlyingMask',
            enabled: false,
            accelerator: process.platform === 'darwin' ? 'Cmd+Shift+M' : 'Ctrl+Shift+M',
            type: 'checkbox',
            checked: false,
            click: () => {
              getFocusedDocument().then((focusedDocument) => {
                if (focusedDocument) {
                  focusedDocument.webContents.executeJavaScript(`layerMaskIgnoreUnderlyingMask()`);
                }
              });
            }
          }
        ]
      },
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
          getFocusedDocument().then((focusedDocument) => {
            if (focusedDocument) {
              focusedDocument.webContents.executeJavaScript(`arrangeBringForward()`);
            }
          });
        }
      },
      {
        label: 'Bring To Front',
        id: 'arrangeBringToFront',
        enabled: false,
        accelerator: process.platform === 'darwin' ? 'Cmd+Alt+]' : 'Ctrl+Alt+]',
        click: () => {
          getFocusedDocument().then((focusedDocument) => {
            if (focusedDocument) {
              focusedDocument.webContents.executeJavaScript(`arrangeBringToFront()`);
            }
          });
        }
      },
      {
        label: 'Send Backward',
        id: 'arrangeSendBackward',
        enabled: false,
        accelerator: process.platform === 'darwin' ? 'Cmd+[' : 'Ctrl+[',
        click: () => {
          getFocusedDocument().then((focusedDocument) => {
            if (focusedDocument) {
              focusedDocument.webContents.executeJavaScript(`arrangeSendBackward()`);
            }
          });
        }
      },
      {
        label: 'Send To Back',
        id: 'arrangeSendToBack',
        enabled: false,
        accelerator: process.platform === 'darwin' ? 'Cmd+Alt+[' : 'Ctrl+Alt+[',
        click: () => {
          getFocusedDocument().then((focusedDocument) => {
            if (focusedDocument) {
              focusedDocument.webContents.executeJavaScript(`arrangeSendToBack()`);
            }
          });
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
              getFocusedDocument().then((focusedDocument) => {
                if (focusedDocument) {
                  focusedDocument.webContents.executeJavaScript(`arrangeAlignLeft()`);
                }
              });
            }
          },
          {
            label: 'Horizontally',
            id: 'arrangeAlignHorizontally',
            enabled: false,
            click: () => {
              getFocusedDocument().then((focusedDocument) => {
                if (focusedDocument) {
                  focusedDocument.webContents.executeJavaScript(`arrangeAlignHorizontally()`);
                }
              });
            }
          },
          {
            label: 'Right',
            id: 'arrangeAlignRight',
            enabled: false,
            click: () => {
              getFocusedDocument().then((focusedDocument) => {
                if (focusedDocument) {
                  focusedDocument.webContents.executeJavaScript(`arrangeAlignRight()`);
                }
              });
            }
          },
          { type: 'separator' },
          {
            label: 'Top',
            id: 'arrangeAlignTop',
            enabled: false,
            click: () => {
              getFocusedDocument().then((focusedDocument) => {
                if (focusedDocument) {
                  focusedDocument.webContents.executeJavaScript(`arrangeAlignTop()`);
                }
              });
            }
          },
          {
            label: 'Vertically',
            id: 'arrangeAlignVertically',
            enabled: false,
            click: () => {
              getFocusedDocument().then((focusedDocument) => {
                if (focusedDocument) {
                  focusedDocument.webContents.executeJavaScript(`arrangeAlignVertically()`);
                }
              });
            }
          },
          {
            label: 'Bottom',
            id: 'arrangeAlignBottom',
            enabled: false,
            click: () => {
              getFocusedDocument().then((focusedDocument) => {
                if (focusedDocument) {
                  focusedDocument.webContents.executeJavaScript(`arrangeAlignBottom()`);
                }
              });
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
              getFocusedDocument().then((focusedDocument) => {
                if (focusedDocument) {
                  focusedDocument.webContents.executeJavaScript(`arrangeDistributeHorizontally()`);
                }
              });
            }
          },
          {
            label: 'Vertically',
            id: 'arrangeDistributeVertically',
            enabled: false,
            accelerator: process.platform === 'darwin' ? 'Ctrl+Cmd+V' : 'Ctrl+Shift+V',
            click: () => {
              getFocusedDocument().then((focusedDocument) => {
                if (focusedDocument) {
                  focusedDocument.webContents.executeJavaScript(`arrangeDistributeVertically()`);
                }
              });
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
          getFocusedDocument().then((focusedDocument) => {
            if (focusedDocument) {
              focusedDocument.webContents.executeJavaScript(`arrangeGroup()`);
            }
          });
        }
      },
      {
        label: 'Ungroup',
        id: 'arrangeUngroup',
        enabled: false,
        accelerator: process.platform === 'darwin' ? 'Cmd+Shift+G' : 'Ctrl+Shift+G',
        click: () => {
          getFocusedDocument().then((focusedDocument) => {
            if (focusedDocument) {
              focusedDocument.webContents.executeJavaScript(`arrangeUngroup()`);
            }
          });
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
      {
        label: 'Zoom In',
        id: 'viewZoomIn',
        enabled: false,
        accelerator: process.platform === 'darwin' ? 'Cmd+Plus' : 'Ctrl+Plus',
        click: () => {
          getFocusedDocument().then((focusedDocument) => {
            if (focusedDocument) {
              focusedDocument.webContents.executeJavaScript(`viewZoomIn()`);
            }
          });
        }
      },
      {
        label: 'Zoom Out',
        id: 'viewZoomOut',
        enabled: false,
        accelerator: process.platform === 'darwin' ? 'Cmd+-' : 'Ctrl+-',
        click: () => {
          getFocusedDocument().then((focusedDocument) => {
            if (focusedDocument) {
              focusedDocument.webContents.executeJavaScript(`viewZoomOut()`);
            }
          });
        }
      },
      {
        label: 'Zoom To',
        submenu: [
          {
            label: 'Fit Canvas',
            id: 'viewZoomFitCanvas',
            enabled: false,
            accelerator: process.platform === 'darwin' ? 'Cmd+1' : 'Ctrl+1',
            click: () => {
              getFocusedDocument().then((focusedDocument) => {
                if (focusedDocument) {
                  focusedDocument.webContents.executeJavaScript(`viewZoomFitCanvas()`);
                }
              });
            }
          },
          {
            label: 'Fit Selection',
            id: 'viewZoomFitSelection',
            enabled: false,
            accelerator: process.platform === 'darwin' ? 'Cmd+2' : 'Ctrl+2',
            click: () => {
              getFocusedDocument().then((focusedDocument) => {
                if (focusedDocument) {
                  focusedDocument.webContents.executeJavaScript(`viewZoomFitSelection()`);
                }
              });
            }
          },
          {
            label: 'Fit Artboard',
            id: 'viewZoomFitArtboard',
            enabled: false,
            accelerator: process.platform === 'darwin' ? 'Cmd+4' : 'Ctrl+4',
            click: () => {
              getFocusedDocument().then((focusedDocument) => {
                if (focusedDocument) {
                  focusedDocument.webContents.executeJavaScript(`viewZoomFitArtboard()`);
                }
              });
            }
          }
        ]
      },
      { type: 'separator' },
      {
        label: 'Center Selection',
        id: 'viewCenterSelection',
        enabled: false,
        accelerator: process.platform === 'darwin' ? 'Cmd+3' : 'Ctrl+3',
        click: () => {
          getFocusedDocument().then((focusedDocument) => {
            if (focusedDocument) {
              focusedDocument.webContents.executeJavaScript(`viewCenterSelection()`);
            }
          });
        }
      },
      { type: 'separator' },
      {
        label: 'Show Layers',
        id: 'viewShowLayers',
        type: 'checkbox',
        checked: false,
        enabled: false,
        accelerator: process.platform === 'darwin' ? 'Cmd+Alt+1' : 'Ctrl+Alt+1',
        click: () => {
          getFocusedDocument().then((focusedDocument) => {
            if (focusedDocument) {
              focusedDocument.webContents.executeJavaScript(`viewShowLayers()`);
            }
          });
        }
      },
      {
        label: 'Show Styles',
        id: 'viewShowStyles',
        type: 'checkbox',
        checked: false,
        enabled: false,
        accelerator: process.platform === 'darwin' ? 'Cmd+Alt+2' : 'Ctrl+Alt+2',
        click: () => {
          getFocusedDocument().then((focusedDocument) => {
            if (focusedDocument) {
              focusedDocument.webContents.executeJavaScript(`viewShowStyles()`);
            }
          });
        }
      },
      {
        label: 'Show Events',
        id: 'viewShowEvents',
        type: 'checkbox',
        checked: false,
        enabled: false,
        accelerator: process.platform === 'darwin' ? 'Cmd+Alt+3' : 'Ctrl+Alt+3',
        click: () => {
          getFocusedDocument().then((focusedDocument) => {
            if (focusedDocument) {
              focusedDocument.webContents.executeJavaScript(`viewShowEvents()`);
            }
          });
        }
      },
      { type: 'separator' },
      { role: 'toggledevtools' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
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