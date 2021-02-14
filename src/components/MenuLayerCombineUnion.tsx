/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { applyBooleanOperationThunk } from '../store/actions/layer';
import { canBooleanSelected } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'layerCombineUnion';

interface MenuLayerCombineUnionProps {
  menu: Electron.Menu;
  setUnion(union: any): void;
}

const MenuLayerCombineUnion = (props: MenuLayerCombineUnionProps): ReactElement => {
  const { menu, setUnion } = props;
  const isEnabled = useSelector((state: RootState) =>
    canBooleanSelected(state) &&
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Union',
    id: MENU_ITEM_ID,
    enabled: isEnabled,
    accelerator: remote.process.platform === 'darwin' ? 'Cmd+Alt+U' : 'Ctrl+Alt+U',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(applyBooleanOperationThunk('unite'));
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const dispatch = useDispatch();

  useEffect(() => {
    setUnion(menuItemTemplate);
  }, [menuItemTemplate]);

  useEffect(() => {
    if (menu) {
      setMenuItem(menu.getMenuItemById(MENU_ITEM_ID));
    }
  }, [menu]);

  useEffect(() => {
    if (menuItem) {
      menuItem.enabled = isEnabled;
    }
  }, [isEnabled]);

  return (
    <></>
  );
}

export default MenuLayerCombineUnion;