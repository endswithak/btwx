/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { bringSelectedForwardThunk } from '../store/actions/layer';
import { canBringSelectedForward } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'arrangeBringForward';

interface MenuArrangeBringForwardProps {
  menu: Electron.Menu;
  setBringForward(bringForward: any): void;
}

const MenuArrangeBringForward = (props: MenuArrangeBringForwardProps): ReactElement => {
  const { menu, setBringForward } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Bring Forward',
    id: MENU_ITEM_ID,
    enabled: false,
    accelerator: remote.process.platform === 'darwin' ? 'Cmd+]' : 'Ctrl+]',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(bringSelectedForwardThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canMove = useSelector((state: RootState) => canBringSelectedForward(state) && state.canvasSettings.focusing);
  const dispatch = useDispatch();

  useEffect(() => {
    setBringForward(menuItemTemplate);
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

export default MenuArrangeBringForward;