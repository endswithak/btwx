/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { bringSelectedToFrontThunk } from '../store/actions/layer';
import { canBringSelectedForward } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'arrangeBringToFront';

interface MenuArrangeBringToFrontProps {
  menu: Electron.Menu;
  setBringToFront(bringToFront: any): void;
}

const MenuArrangeBringToFront = (props: MenuArrangeBringToFrontProps): ReactElement => {
  const { menu, setBringToFront } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Bring To Front',
    id: MENU_ITEM_ID,
    enabled: false,
    accelerator: remote.process.platform === 'darwin' ? 'Cmd+Alt+]' : 'Ctrl+Alt+]',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(bringSelectedToFrontThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canMove = useSelector((state: RootState) => canBringSelectedForward(state) && state.canvasSettings.focusing);
  const dispatch = useDispatch();

  useEffect(() => {
    setBringToFront(menuItemTemplate);
  }, [menuItemTemplate]);

  useEffect(() => {
    if (menu) {
      setMenuItem(menu.getMenuItemById(MENU_ITEM_ID));
    }
  }, [menu]);

  useEffect(() => {
    if (menuItem) {
      menuItem.enabled = canMove && !isResizing && !isDragging && !isDrawing;
    }
  }, [canMove, isDragging, isResizing, isDrawing]);

  return (
    <></>
  );
}

export default MenuArrangeBringToFront;