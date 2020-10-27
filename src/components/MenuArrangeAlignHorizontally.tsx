import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { alignSelectedToCenterThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'arrangeAlignHorizontally';

interface MenuArrangeAlignHorizontallyProps {
  isEnabled?: boolean;
  alignSelectedToCenterThunk?(): void;
}

const MenuArrangeAlignHorizontally = (props: MenuArrangeAlignHorizontallyProps): ReactElement => {
  const { isEnabled, alignSelectedToCenterThunk } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = isEnabled;
  }, [isEnabled]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      alignSelectedToCenterThunk();
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
  { alignSelectedToCenterThunk }
)(MenuArrangeAlignHorizontally);