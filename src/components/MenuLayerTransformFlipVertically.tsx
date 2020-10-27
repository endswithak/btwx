import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleSelectedVerticalFlipThunk } from '../store/actions/layer';
import { canFlipSeleted, selectedVerticalFlipEnabled } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'layerTransformFlipVertically';

interface MenuLayerTransformFlipVerticallyProps {
  isEnabled?: boolean;
  isChecked?: boolean;
  toggleSelectedVerticalFlipThunk?(): void;
}

const MenuLayerTransformFlipVertically = (props: MenuLayerTransformFlipVerticallyProps): ReactElement => {
  const { isEnabled, isChecked, toggleSelectedVerticalFlipThunk } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = isEnabled;
    electronMenuItem.checked = isChecked;
  }, [isEnabled, isChecked]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      toggleSelectedVerticalFlipThunk();
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
  const isEnabled = canFlipSeleted(state);
  const isChecked = selectedVerticalFlipEnabled(state);
  return { isEnabled, isChecked };
};

export default connect(
  mapStateToProps,
  { toggleSelectedVerticalFlipThunk }
)(MenuLayerTransformFlipVertically);