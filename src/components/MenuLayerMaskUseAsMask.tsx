import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleSelectedMaskThunk } from '../store/actions/layer';
import { canToggleSelectedUseAsMask, selectedUseAsMaskEnabled } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'layerMaskUseAsMask';

interface MenuLayerMaskUseAsMaskProps {
  isEnabled?: boolean;
  isChecked?: boolean;
  toggleSelectedMaskThunk?(): void;
}

const MenuLayerMaskUseAsMask = (props: MenuLayerMaskUseAsMaskProps): ReactElement => {
  const { isEnabled, isChecked, toggleSelectedMaskThunk } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = isEnabled;
    electronMenuItem.checked = isChecked;
  }, [isEnabled, isChecked]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      toggleSelectedMaskThunk();
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
  const isEnabled = canToggleSelectedUseAsMask(state);
  const isChecked = selectedUseAsMaskEnabled(state);
  return { isEnabled, isChecked };
};

export default connect(
  mapStateToProps,
  { toggleSelectedMaskThunk }
)(MenuLayerMaskUseAsMask);