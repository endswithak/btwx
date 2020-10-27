import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { bringSelectedToFrontThunk } from '../store/actions/layer';
import { canBringSelectedForward } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'arrangeBringToFront';

interface MenuArrangeBringToFrontProps {
  isEnabled?: boolean;
  bringSelectedToFrontThunk?(): void;
}

const MenuArrangeBringToFront = (props: MenuArrangeBringToFrontProps): ReactElement => {
  const { isEnabled, bringSelectedToFrontThunk } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = isEnabled;
  }, [isEnabled]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      bringSelectedToFrontThunk();
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
  const isEnabled = canBringSelectedForward(state) && canvasSettings.focusing;
  return { isEnabled };
};

export default connect(
  mapStateToProps,
  { bringSelectedToFrontThunk }
)(MenuArrangeBringToFront);