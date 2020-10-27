import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleArtboardToolThunk } from '../store/actions/artboardTool';

export const MENU_ITEM_ID = 'insertArtboard';

interface MenuInsertArtboardProps {
  canInsert?: boolean;
  isChecked?: boolean;
  toggleArtboardToolThunk?(): void;
}

const MenuInsertArtboard = (props: MenuInsertArtboardProps): ReactElement => {
  const { canInsert, isChecked, toggleArtboardToolThunk } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = canInsert;
    electronMenuItem.checked = isChecked;
  }, [canInsert, isChecked]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      toggleArtboardToolThunk();
    };
  }, []);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  canInsert: boolean;
  isChecked: boolean;
} => {
  const { canvasSettings } = state;
  const canInsert = canvasSettings.focusing;
  const isChecked = canvasSettings.activeTool === 'Artboard';
  return { canInsert, isChecked };
};

export default connect(
  mapStateToProps,
  { toggleArtboardToolThunk }
)(MenuInsertArtboard);