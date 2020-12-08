import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { replaceSelectedImagesThunk } from '../store/actions/layer';
import { canReplaceSelectedImages } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'layerImageReplace';

interface MenuLayerImageReplaceProps {
  isEnabled?: boolean;
  replaceSelectedImagesThunk?(): void;
}

const MenuLayerImageReplace = (props: MenuLayerImageReplaceProps): ReactElement => {
  const { isEnabled, replaceSelectedImagesThunk } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = isEnabled;
  }, [isEnabled]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      replaceSelectedImagesThunk();
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
  const isEnabled = canvasSettings.focusing && canReplaceSelectedImages(state);
  return { isEnabled };
};

export default connect(
  mapStateToProps,
  { replaceSelectedImagesThunk }
)(MenuLayerImageReplace);