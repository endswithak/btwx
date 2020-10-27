import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { undoThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'editUndo';

interface MenuEditUndoProps {
  canUndo?: boolean;
  undoThunk?(): void;
}

const MenuEditUndo = (props: MenuEditUndoProps): ReactElement => {
  const { canUndo, undoThunk } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = canUndo;
  }, [canUndo]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      undoThunk();
    };
  }, []);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  canUndo: boolean;
} => {
  const { canvasSettings, layer } = state;
  const canUndo = layer.past.length > 0 && canvasSettings.focusing;
  return { canUndo };
};

export default connect(
  mapStateToProps,
  { undoThunk }
)(MenuEditUndo);