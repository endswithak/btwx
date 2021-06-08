/* eslint-disable @typescript-eslint/no-use-before-define */
// import { ipcRenderer } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import MenuInsert from './MenuInsert';
import MenuApp from './MenuApp';
import MenuFile from './MenuFile';
import MenuEdit from './MenuEdit';
import MenuLayer from './MenuLayer';
import MenuArrange from './MenuArrange';
import MenuView from './MenuView';

const Menu = (): ReactElement => {
  const isMac = useSelector((state: RootState) => state.session.platform === 'darwin');
  const focusing = useSelector((state: RootState) => state.canvasSettings.focusing);
  const [inputMenu, setInputMenu] = useState<any[] | undefined>(undefined);
  const [defaultMenu, setDefaultMenu] = useState<any[] | undefined>(undefined);
  const [app, setApp] = useState(undefined);
  const [file, setFile] = useState(undefined);
  const [edit, setEdit] = useState(undefined);
  const [insert, setInsert] = useState(undefined);
  const [layer, setLayer] = useState(undefined);
  const [arrange, setArrange] = useState(undefined);
  const [view, setView] = useState(undefined);

  useEffect(() => {
    if (app) {
      setInputMenu([
        ...isMac ? [app] : [],
        {
          label: 'Edit',
          submenu: [
            { role: 'undo' },
            { role: 'redo' },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
            { role: 'delete' },
            { type: 'separator' },
            { role: 'selectAll' }
          ]
        }
      ]);
    }
  }, [app]);

  useEffect(() => {
    if (app && file && edit && insert && layer && arrange && view) {
      setDefaultMenu([
        ...isMac ? [app] : [],
        file,
        edit,
        insert,
        layer,
        arrange,
        view
      ]);
    }
  }, [app, file, edit, insert, layer, arrange, view]);

  // set default application menu
  useEffect(() => {
    if (defaultMenu) {
      (window as any).api.buildDefaultApplicationMenu(JSON.stringify({
        template: defaultMenu
      })).then(() => {
        (window as any).api.setApplicationMenu(JSON.stringify({
          type: focusing ? 'default' : 'input'
        }));
      });
      // ipcRenderer.invoke('buildDefaultApplicationMenu', JSON.stringify({
      //   template: defaultMenu
      // })).then(() => {
      //   ipcRenderer.invoke('setApplicationMenu', JSON.stringify({
      //     type: focusing ? 'default' : 'input'
      //   }));
      // });
    }
  }, [defaultMenu]);

  // set input application menu
  useEffect(() => {
    if (inputMenu) {
      (window as any).api.buildInputApplicationMenu(JSON.stringify({
        template: inputMenu
      }));
      // ipcRenderer.invoke('buildInputApplicationMenu', JSON.stringify({
      //   template: inputMenu
      // }));
    }
  }, [inputMenu]);

  // set application menu
  useEffect(() => {
    if (defaultMenu && inputMenu) {
      (window as any).api.setApplicationMenu(JSON.stringify({
        type: focusing ? 'default' : 'input'
      }));
      // ipcRenderer.invoke('setApplicationMenu', JSON.stringify({
      //   type: focusing ? 'default' : 'input'
      // }));
    }
  }, [focusing]);

  return (
    <>
      <MenuApp
        setApp={setApp} />
      <MenuFile
        setFile={setFile} />
      <MenuEdit
        setEdit={setEdit} />
      <MenuInsert
        setInsert={setInsert} />
      <MenuLayer
        setLayer={setLayer} />
      <MenuArrange
        setArrange={setArrange} />
      <MenuView
        setView={setView} />
    </>
  )
}

export default Menu;