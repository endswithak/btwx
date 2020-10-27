import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleSelectionIgnoreUnderlyingMask } from '../store/actions/layer';
import { selectedIgnoreUnderlyingMaskEnabled } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'layerMaskIgnoreUnderlyingMask';

interface MenuLayerMaskToggleUnderlyingMaskProps {
  isChecked?: boolean;
  toggleSelectionIgnoreUnderlyingMask?(): void;
}

const MenuLayerMaskToggleUnderlyingMask = (props: MenuLayerMaskToggleUnderlyingMaskProps): ReactElement => {
  const { isChecked, toggleSelectionIgnoreUnderlyingMask } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = true;
    electronMenuItem.checked = isChecked;
  }, [isChecked]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      toggleSelectionIgnoreUnderlyingMask();
    };
  }, []);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  isChecked: boolean;
} => {
  const isChecked = selectedIgnoreUnderlyingMaskEnabled(state);
  return { isChecked };
};

export default connect(
  mapStateToProps,
  { toggleSelectionIgnoreUnderlyingMask }
)(MenuLayerMaskToggleUnderlyingMask);