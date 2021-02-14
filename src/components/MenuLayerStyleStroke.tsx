/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleSelectedStrokeThunk } from '../store/actions/layer';
import { canToggleSelectedFillOrStroke, selectedStrokeEnabled } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'layerStyleStroke';

interface MenuLayerStyleStrokeProps {
  menu: Electron.Menu;
  setStroke(stroke: any): void;
}

const MenuLayerStyleStroke = (props: MenuLayerStyleStrokeProps): ReactElement => {
  const { menu, setStroke } = props;
  const isEnabled = useSelector((state: RootState) => canToggleSelectedFillOrStroke(state));
  const isChecked = useSelector((state: RootState) => selectedStrokeEnabled(state));
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Stroke',
    id: MENU_ITEM_ID,
    enabled: isEnabled,
    type: 'checkbox',
    checked: isChecked,
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(toggleSelectedStrokeThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const dispatch = useDispatch();

  useEffect(() => {
    setStroke(menuItemTemplate);
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

  useEffect(() => {
    if (menuItem) {
      menuItem.checked = isChecked;
    }
  }, [isChecked]);

  return (
    <></>
  );
}

export default MenuLayerStyleStroke;