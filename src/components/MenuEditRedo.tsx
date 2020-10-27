import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { redoThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'editRedo';

interface MenuEditRedoProps {
  canRedo?: boolean;
  redoThunk?(): void;
}

const MenuEditRedo = (props: MenuEditRedoProps): ReactElement => {
  const { canRedo, redoThunk } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = canRedo;
  }, [canRedo]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      redoThunk();
    };
  }, []);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  canRedo: boolean;
} => {
  const { canvasSettings, layer } = state;
  const canRedo = layer.future.length > 0 && canvasSettings.focusing;
  return { canRedo };
};

export default connect(
  mapStateToProps,
  { redoThunk }
)(MenuEditRedo);