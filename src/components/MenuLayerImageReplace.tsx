import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';

export const MENU_ITEM_ID = 'layerImageReplace';

interface MenuLayerImageReplaceProps {
  isEnabled?: boolean;
}

const MenuLayerImageReplace = (props: MenuLayerImageReplaceProps): ReactElement => {
  const { isEnabled } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = isEnabled;
  }, [isEnabled]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  isEnabled: boolean;
} => {
  const { canvasSettings, layer } = state;
  const selected = layer.present.selected;
  const isEnabled = canvasSettings.focusing && selected.length === 1 && layer.present.byId[selected[0]].type === 'Image';
  return { isEnabled };
};

export default connect(
  mapStateToProps
)(MenuLayerImageReplace);