import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleSelectedFillThunk } from '../store/actions/layer';
import { canToggleSelectedFillOrStroke, selectedFillsEnabled } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'layerStyleFill';

interface MenuLayerStyleFillProps {
  isEnabled?: boolean;
  isChecked?: boolean;
  toggleSelectedFillThunk?(): void;
}

const MenuLayerStyleFill = (props: MenuLayerStyleFillProps): ReactElement => {
  const { isEnabled, isChecked, toggleSelectedFillThunk } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = isEnabled;
    electronMenuItem.checked = isChecked;
  }, [isEnabled, isChecked]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      toggleSelectedFillThunk();
    };
  }, []);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  isEnabled: boolean;
  isChecked: boolean;
} => {
  const isEnabled = canToggleSelectedFillOrStroke(state);
  const isChecked = selectedFillsEnabled(state);
  return { isEnabled, isChecked };
};

export default connect(
  mapStateToProps,
  { toggleSelectedFillThunk }
)(MenuLayerStyleFill);