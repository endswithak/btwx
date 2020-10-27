import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { LayerTypes } from '../store/actionTypes/layer';
import { copyLayersThunk } from '../store/actions/layer';
import { getSelected } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'editCopy';

interface MenuEditCopyProps {
  canCopy?: boolean;
  copyLayersThunk?(): void;
}

const MenuEditCopy = (props: MenuEditCopyProps): ReactElement => {
  const { canCopy, copyLayersThunk } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = canCopy;
  }, [canCopy]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      copyLayersThunk();
    };
  }, []);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  canCopy: boolean;
} => {
  const { canvasSettings } = state;
  const selected = getSelected(state);
  const canCopy = selected.length > 0 && canvasSettings.focusing;
  return { canCopy };
};

export default connect(
  mapStateToProps,
  { copyLayersThunk }
)(MenuEditCopy);