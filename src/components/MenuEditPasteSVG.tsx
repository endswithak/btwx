import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { pasteSVGThunk } from '../store/actions/layer';
import { canPasteSVG } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'editPasteSVG';

const MenuEditPasteSVG = (): ReactElement => {
  const canPaste = useSelector((state: RootState) => canPasteSVG() && state.canvasSettings.focusing);
  const dispatch = useDispatch();

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = canPaste;
  }, [canPaste]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(pasteSVGThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuEditPasteSVG;