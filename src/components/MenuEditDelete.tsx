import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { removeLayersThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'editDelete';

interface MenuEditDeleteProps {
  canDelete?: boolean;
  removeLayersThunk?(): void;
}

const MenuEditDelete = (props: MenuEditDeleteProps): ReactElement => {
  const { canDelete, removeLayersThunk } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = canDelete;
  }, [canDelete]);

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
  canDelete: boolean;
} => {
  const { canvasSettings, layer } = state;
  const canDelete = layer.present.selected.length > 0 && canvasSettings.focusing;
  return { canDelete };
};

export default connect(
  mapStateToProps,
  { removeLayersThunk }
)(MenuEditDelete);