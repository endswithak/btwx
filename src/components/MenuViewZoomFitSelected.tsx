/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { zoomFitSelectedThunk } from '../store/actions/zoomTool';

export const MENU_ITEM_ID = 'viewZoomFitSelected';

interface MenuViewZoomFitSelectedProps {
  menu: Electron.Menu;
  setFitSelected(fitSelected: any): void;
}

const MenuViewZoomFitSelected = (props: MenuViewZoomFitSelectedProps): ReactElement => {
  const { menu, setFitSelected } = props;
  const accelerator = useSelector((state: RootState) => state.keyBindings.view.zoomFit.selected);
  const isEnabled = useSelector((state: RootState) =>
    state.layer.present.selected.length > 0 &&
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Fit Selection',
    id: MENU_ITEM_ID,
    enabled: isEnabled,
    accelerator,
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(zoomFitSelectedThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const dispatch = useDispatch();

  useEffect(() => {
    setFitSelected(menuItemTemplate);
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

export default MenuViewZoomFitSelected;