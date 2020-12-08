import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { resetSelectedImageDimensionsThunk } from '../store/actions/layer';
import { canResetSelectedImageDimensions } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'layerImageOriginalDimensions';

interface MenuLayerImageOriginalDimensionsProps {
  isEnabled?: boolean;
  resetSelectedImageDimensionsThunk?(): void;
}

const MenuLayerImageOriginalDimensions = (props: MenuLayerImageOriginalDimensionsProps): ReactElement => {
  const { isEnabled, resetSelectedImageDimensionsThunk } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = isEnabled;
  }, [isEnabled]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      resetSelectedImageDimensionsThunk();
    };
  }, []);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  isEnabled: boolean;
} => {
  const { canvasSettings } = state;
  const isEnabled = canvasSettings.focusing && canResetSelectedImageDimensions(state);
  return { isEnabled };
};

export default connect(
  mapStateToProps,
  { resetSelectedImageDimensionsThunk }
)(MenuLayerImageOriginalDimensions);