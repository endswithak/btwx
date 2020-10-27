import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { alignSelectedToBottomThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'arrangeAlignBottom';

interface MenuArrangeAlignBottomProps {
  isEnabled?: boolean;
  alignSelectedToBottomThunk?(): void;
}

const MenuArrangeAlignBottom = (props: MenuArrangeAlignBottomProps): ReactElement => {
  const { isEnabled, alignSelectedToBottomThunk } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = isEnabled;
  }, [isEnabled]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      alignSelectedToBottomThunk();
    };
  }, []);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  isEnabled: boolean;
} => {
  const { layer, canvasSettings } = state;
  const isEnabled = canvasSettings.focusing && layer.present.selected.length >= 2;
  return { isEnabled };
};

export default connect(
  mapStateToProps,
  { alignSelectedToBottomThunk }
)(MenuArrangeAlignBottom);