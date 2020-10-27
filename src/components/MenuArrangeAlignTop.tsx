import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { alignSelectedToTopThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'arrangeAlignTop';

interface MenuArrangeAlignTopProps {
  isEnabled?: boolean;
  alignSelectedToTopThunk?(): void;
}

const MenuArrangeAlignTop = (props: MenuArrangeAlignTopProps): ReactElement => {
  const { isEnabled, alignSelectedToTopThunk } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = isEnabled;
  }, [isEnabled]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      alignSelectedToTopThunk();
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
  { alignSelectedToTopThunk }
)(MenuArrangeAlignTop);