import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleTextToolThunk } from '../store/actions/textTool';

export const MENU_ITEM_ID = 'insertText';

interface MenuInsertTextProps {
  canInsert?: boolean;
  isChecked?: boolean;
  toggleTextToolThunk?(): void;
}

const MenuInsertText = (props: MenuInsertTextProps): ReactElement => {
  const { canInsert, isChecked, toggleTextToolThunk } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = canInsert;
    electronMenuItem.checked = isChecked;
  }, [canInsert, isChecked]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      toggleTextToolThunk();
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
  const { canvasSettings, layer } = state;
  const canInsert = canvasSettings.focusing && layer.present.activeArtboard !== null;
  const isChecked = canvasSettings.activeTool === 'Text';
  return { canInsert, isChecked };
};

export default connect(
  mapStateToProps,
  { toggleTextToolThunk }
)(MenuInsertText);