import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleSelectedStrokeThunk } from '../store/actions/layer';
import { canToggleSelectedFillOrStroke, selectedStrokeEnabled } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'layerStyleStroke';

const MenuLayerStyleStroke = (): ReactElement => {
  const isEnabled = useSelector((state: RootState) => canToggleSelectedFillOrStroke(state));
  const isChecked = useSelector((state: RootState) => selectedStrokeEnabled(state));
  const dispatch = useDispatch();

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = isEnabled;
    electronMenuItem.checked = isChecked;
  }, [isEnabled, isChecked]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(toggleSelectedStrokeThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuLayerStyleStroke;