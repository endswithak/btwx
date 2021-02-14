/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { sendSelectedToBackThunk } from '../store/actions/layer';
import { canSendSelectedBackward } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'arrangeSendToBack';

interface MenuArrangeSendToBackProps {
  menu: Electron.Menu;
  setSendToBack(sendToBack: any): void;
}

const MenuArrangeSendToBack = (props: MenuArrangeSendToBackProps): ReactElement => {
  const { menu, setSendToBack } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Send To Back',
    id: MENU_ITEM_ID,
    enabled: false,
    accelerator: remote.process.platform === 'darwin' ? 'Cmd+Alt+[' : 'Ctrl+Alt+[',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(sendSelectedToBackThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canMove = useSelector((state: RootState) => canSendSelectedBackward(state) && state.canvasSettings.focusing);
  const dispatch = useDispatch();

  useEffect(() => {
    setSendToBack(menuItemTemplate);
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

export default MenuArrangeSendToBack;