import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { LayerTypes } from '../store/actionTypes/layer';
import { selectAllLayers } from '../store/actions/layer';

export const MENU_ITEM_ID = 'editSelectAll';

interface MenuEditSelectAllProps {
  canSelectAll?: boolean;
  selectAllLayers?(): LayerTypes;
}

const MenuEditSelectAll = (props: MenuEditSelectAllProps): ReactElement => {
  const { canSelectAll, selectAllLayers } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = canSelectAll;
  }, [canSelectAll]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      selectAllLayers();
    };
  }, []);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  canSelectAll: boolean;
} => {
  const { canvasSettings, layer } = state;
  const canSelectAll = layer.present.allIds.length > 1 && canvasSettings.focusing;
  return { canSelectAll };
};

export default connect(
  mapStateToProps,
  { selectAllLayers }
)(MenuEditSelectAll);