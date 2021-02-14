/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { canGroupSelected } from '../store/selectors/layer';
import { groupSelectedThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'arrangeGroup';

interface MenuArrangeGroupProps {
  menu: Electron.Menu;
  setGroup(group: any): void;
}

const MenuArrangeGroup = (props: MenuArrangeGroupProps): ReactElement => {
  const { menu, setGroup } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Group',
    id: MENU_ITEM_ID,
    enabled: false,
    accelerator: remote.process.platform === 'darwin' ? 'Cmd+G' : 'Ctrl+G',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(groupSelectedThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canGroup = useSelector((state: RootState) => canGroupSelected(state) && state.canvasSettings.focusing);
  const dispatch = useDispatch();

  useEffect(() => {
    setGroup(menuItemTemplate);
  }, [menuItemTemplate]);

  useEffect(() => {
    if (menu) {
      setMenuItem(menu.getMenuItemById(MENU_ITEM_ID));
    }
  }, [menu]);

  useEffect(() => {
    if (menuItem) {
      menuItem.enabled = canGroup && !isResizing && !isDragging && !isDrawing;
    }
  }, [canGroup, isDragging, isResizing, isDrawing]);

  return (
    <></>
  );
}

export default MenuArrangeGroup;