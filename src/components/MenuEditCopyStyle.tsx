import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { LayerTypes } from '../store/actionTypes/layer';
import { copyStyleThunk } from '../store/actions/layer';
import { getSelected } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'editCopyStyle';

interface MenuEditCopyStyleProps {
  canCopy?: boolean;
  copyStyleThunk?(): void;
}

const MenuEditCopyStyle = (props: MenuEditCopyStyleProps): ReactElement => {
  const { canCopy, copyStyleThunk } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = canCopy;
  }, [canCopy]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      copyStyleThunk();
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
  const canCopy = selected.length === 1 && canvasSettings.focusing;
  return { canCopy };
};

export default connect(
  mapStateToProps,
  { copyStyleThunk }
)(MenuEditCopyStyle);