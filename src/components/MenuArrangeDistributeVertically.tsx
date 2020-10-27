import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { distributeSelectedVerticallyThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'arrangeDistributeVertically';

interface MenuArrangeDistributeVerticallyProps {
  isEnabled?: boolean;
  distributeSelectedVerticallyThunk?(): void;
}

const MenuArrangeDistributeVertically = (props: MenuArrangeDistributeVerticallyProps): ReactElement => {
  const { isEnabled, distributeSelectedVerticallyThunk } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = isEnabled;
  }, [isEnabled]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      distributeSelectedVerticallyThunk();
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
  const isEnabled = canvasSettings.focusing && layer.present.selected.length >= 3;
  return { isEnabled };
};

export default connect(
  mapStateToProps,
  { distributeSelectedVerticallyThunk }
)(MenuArrangeDistributeVertically);