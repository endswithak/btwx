import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { removeLayersThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'editCut';

interface MenuEditCutProps {
  canCut?: boolean;
  removeLayersThunk?(): void;
}

const MenuEditCut = (props: MenuEditCutProps): ReactElement => {
  const { canCut, removeLayersThunk } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = canCut;
  }, [canCut]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      removeLayersThunk();
    };
  }, []);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  canCut: boolean;
} => {
  const { canvasSettings, layer } = state;
  const canCut = layer.present.selected.length > 0 && canvasSettings.focusing;
  return { canCut };
};

export default connect(
  mapStateToProps,
  { removeLayersThunk }
)(MenuEditCut);