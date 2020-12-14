import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleTextToolThunk } from '../store/actions/textTool';

export const MENU_ITEM_ID = 'insertText';

const MenuInsertText = (): ReactElement => {
  const canInsert = useSelector((state: RootState) => state.canvasSettings.focusing && state.layer.present.activeArtboard !== null);
  const isChecked = useSelector((state: RootState) => state.canvasSettings.activeTool === 'Text');
  const dispatch = useDispatch();

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = canInsert;
    electronMenuItem.checked = isChecked;
  }, [canInsert, isChecked]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(toggleTextToolThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuInsertText;