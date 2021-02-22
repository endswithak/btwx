/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { pasteLayersThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'editPasteOverSelection';

interface MenuEditPasteOverSelectionProps {
  menu: Electron.Menu;
  setPasteOverSelection(pasteOverSelection: any): void;
}

const MenuEditPasteOverSelection = (props: MenuEditPasteOverSelectionProps): ReactElement => {
  const { menu, setPasteOverSelection } = props;
  const accelerator = useSelector((state: RootState) => state.keyBindings.edit.paste.overSelection);
  const isEnabled = useSelector((state: RootState) =>
    state.layer.present.selected.length > 0 &&
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Paste Over Selection',
    id: MENU_ITEM_ID,
    enabled: isEnabled,
    accelerator,
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(pasteLayersThunk({overSelection: true}));
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const dispatch = useDispatch();

  useEffect(() => {
    setPasteOverSelection(menuItemTemplate);
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

export default MenuEditPasteOverSelection;