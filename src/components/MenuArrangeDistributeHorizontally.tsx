import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { distributeSelectedHorizontallyThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'arrangeDistributeHorizontally';

interface MenuArrangeDistributeHorizontallyProps {
  isEnabled?: boolean;
  distributeSelectedHorizontallyThunk?(): void;
}

const MenuArrangeDistributeHorizontally = (props: MenuArrangeDistributeHorizontallyProps): ReactElement => {
  const { isEnabled, distributeSelectedHorizontallyThunk } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = isEnabled;
  }, [isEnabled]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      distributeSelectedHorizontallyThunk();
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
  { distributeSelectedHorizontallyThunk }
)(MenuArrangeDistributeHorizontally);