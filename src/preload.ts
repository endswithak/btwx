import { ipcRenderer, contextBridge } from 'electron';
import ContextMenu from './secure-context-menu';

// Figure out best use case for proof of concept (uses these methods)
// 1. contextBridge
// 2. electron store
// 3. electron redux
//    a. redux store in main process

// MENUUUUUUUUUUUUUUUUUU

// 1. REMOVE ALL INSTANCES OF REMOTE FROM RENDERER
// 2. CREATE APIS
// 3. Figure out all the shit
//    4. look into redux store schema from main

contextBridge.exposeInMainWorld('api', {
  contextMenu: ContextMenu.preloadBindings(ipcRenderer),
  file: {
    new: () => ipcRenderer.send('fileNew'),
    open: (path: string) => ipcRenderer.send('fileOpen', path),
    save: (path: string) => ipcRenderer.send('fileSave', path),
    saveAs: () => ipcRenderer.send('fileSaveAs')
  },
  edit: {
    undo: () => ipcRenderer.send('editUndo'),
    redo: () => ipcRenderer.send('editRedo'),
    cut: () => ipcRenderer.send('editCut'),
    copyLayers: () => ipcRenderer.send('editCopyLayers'),
    copyStyle: () => ipcRenderer.send('editCopyStyle'),
    copySVG: () => ipcRenderer.send('editCopySVG'),
    pasteLayers: () => ipcRenderer.send('editPasteLayers'),
    pasteOverSelection: () => ipcRenderer.send('editPasteOverSelection'),
    pasteStyle: () => ipcRenderer.send('editPasteStyle'),
    pasteSVG: () => ipcRenderer.send('editPasteSVG'),
    delete: () => ipcRenderer.send('editDelete'),
    duplicate: () => ipcRenderer.send('editDuplicate'),
    selectAll: () => ipcRenderer.send('editSelectAll'),
    selectAllArtboard: () => ipcRenderer.send('editSelectAllArtboard'),
    find: () => ipcRenderer.send('editFind'),
    rename: () => ipcRenderer.send('editRename')
  },
  menu: {
    build: (template: string) => ipcRenderer.send('buildMenu', template)
  }
});