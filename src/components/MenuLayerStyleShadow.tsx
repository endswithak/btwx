import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleSelectedShadowThunk } from '../store/actions/layer';
import { canToggleSelectedShadow, selectedShadowEnabled } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'layerStyleShadow';

interface MenuLayerStyleShadowProps {
  isEnabled?: boolean;
  isChecked?: boolean;
  toggleSelectedShadowThunk?(): void;
}

const MenuLayerStyleShadow = (props: MenuLayerStyleShadowProps): ReactElement => {
  const { isEnabled, isChecked, toggleSelectedShadowThunk } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = isEnabled;
    electronMenuItem.checked = isChecked;
  }, [isEnabled, isChecked]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      toggleSelectedShadowThunk();
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
  const isEnabled = canToggleSelectedShadow(state);
  const isChecked = selectedShadowEnabled(state);
  return { isEnabled, isChecked };
};

export default connect(
  mapStateToProps,
  { toggleSelectedShadowThunk }
)(MenuLayerStyleShadow);