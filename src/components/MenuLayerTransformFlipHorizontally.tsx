import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleSelectedHorizontalFlipThunk } from '../store/actions/layer';
import { canFlipSeleted, selectedHorizontalFlipEnabled } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'layerTransformFlipHorizontally';

interface MenuLayerTransformFlipHorizontallyProps {
  isEnabled?: boolean;
  isChecked?: boolean;
  toggleSelectedHorizontalFlipThunk?(): void;
}

const MenuLayerTransformFlipHorizontally = (props: MenuLayerTransformFlipHorizontallyProps): ReactElement => {
  const { isEnabled, isChecked, toggleSelectedHorizontalFlipThunk } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = isEnabled;
    electronMenuItem.checked = isChecked;
  }, [isEnabled, isChecked]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      toggleSelectedHorizontalFlipThunk();
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
  const isChecked = selectedHorizontalFlipEnabled(state);
  return { isEnabled, isChecked };
};

export default connect(
  mapStateToProps,
  { toggleSelectedHorizontalFlipThunk }
)(MenuLayerTransformFlipHorizontally);