/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { applyBooleanOperationThunk } from '../store/actions/layer';
import { canBooleanSelected } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'layerCombineDifference';

interface MenuLayerCombineDifferenceProps {
  menu: Electron.Menu;
  setDifference(difference: any): void;
}

const MenuLayerCombineDifference = (props: MenuLayerCombineDifferenceProps): ReactElement => {
  const { menu, setDifference } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Difference',
    id: MENU_ITEM_ID,
    enabled: false,
    accelerator: remote.process.platform === 'darwin' ? 'Cmd+Alt+X' : 'Ctrl+Alt+X',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(applyBooleanOperationThunk('exclude'));
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canBool = useSelector((state: RootState) => canBooleanSelected(state));
  const dispatch = useDispatch();

  useEffect(() => {
    setDifference(menuItemTemplate);
  }, [menuItemTemplate]);

  useEffect(() => {
    if (menu) {
      setMenuItem(menu.getMenuItemById(MENU_ITEM_ID));
    }
  }, [menu]);

  useEffect(() => {
    if (menuItem) {
      menuItem.enabled = canBool && !isResizing && !isDragging && !isDrawing;
    }
  }, [canBool, isDragging, isResizing, isDrawing]);

  return (
    <></>
  );
}

export default MenuLayerCombineDifference;