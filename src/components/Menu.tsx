/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
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
  const focusing = useSelector((state: RootState) => state.canvasSettings.focusing);
  const isMac = remote.process.platform === 'darwin';
  const [defaultMenu, setDefaultMenu] = useState(undefined);
  const [app, setApp] = useState(undefined);
  const [file, setFile] = useState(undefined);
  const [edit, setEdit] = useState(undefined);
  const [insert, setInsert] = useState(undefined);
  const [layer, setLayer] = useState(undefined);
  const [arrange, setArrange] = useState(undefined);
  const [view, setView] = useState(undefined);
  const [inputMenu, setInputMenu] = useState(remote.Menu.buildFromTemplate([{
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
  }]));

  useEffect(() => {
    if (( isMac ? app : true) && file && edit && insert && layer && arrange && view) {
      setDefaultMenu(remote.Menu.buildFromTemplate([
        ...(isMac ? [ app ] : []),
        file,
        edit,
        insert,
        layer,
        arrange,
        view
      ]));
    }
  }, [app, file, edit, insert, layer, arrange, view]);

  // initial menu on render
  useEffect(() => {
    if (defaultMenu) {
      remote.Menu.setApplicationMenu(defaultMenu);
    }
  }, [defaultMenu]);

  // update menu on canvas focus
  useEffect(() => {
    if (defaultMenu) {
      const menu = focusing ? defaultMenu : inputMenu;
      remote.Menu.setApplicationMenu(menu);
    }
  }, [focusing]);

  return (
    <>
      {
        isMac
        ? <MenuApp
            menu={defaultMenu}
            setApp={setApp} />
        : null
      }
      <MenuFile
        menu={defaultMenu}
        setFile={setFile} />
      <MenuEdit
        menu={defaultMenu}
        setEdit={setEdit} />
      <MenuInsert
        menu={defaultMenu}
        setInsert={setInsert} />
      <MenuLayer
        menu={defaultMenu}
        setLayer={setLayer} />
      <MenuArrange
        menu={defaultMenu}
        setArrange={setArrange} />
      <MenuView
        menu={defaultMenu}
        setView={setView} />
    </>
  )
}

export default Menu;