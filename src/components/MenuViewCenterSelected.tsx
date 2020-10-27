import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { centerSelectedThunk } from '../store/actions/translateTool';

export const MENU_ITEM_ID = 'viewCenterSelected';

interface MenuViewCenterSelectedProps {
  isEnabled?: boolean;
  centerSelectedThunk?(): void;
}

const MenuViewCenterSelected = (props: MenuViewCenterSelectedProps): ReactElement => {
  const { isEnabled, centerSelectedThunk } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = isEnabled;
  }, [isEnabled]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      centerSelectedThunk();
    };
  }, []);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  isEnabled: boolean;
} => {
  const { layer } = state;
  const isEnabled = layer.present.selected.length > 0;
  return { isEnabled };
};

export default connect(
  mapStateToProps,
  { centerSelectedThunk }
)(MenuViewCenterSelected);