import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { pasteStyleThunk } from '../store/actions/layer';
import { getSelected } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'editPasteStyle';

interface MenuEditPasteStyleProps {
  canPasteStyle?: boolean;
  pasteStyleThunk?(): any;
}

const MenuEditPasteStyle = (props: MenuEditPasteStyleProps): ReactElement => {
  const { canPasteStyle, pasteStyleThunk } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = canPasteStyle;
  }, [canPasteStyle]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      pasteStyleThunk();
    };
  }, []);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  canPasteStyle: boolean;
} => {
  const { canvasSettings } = state;
  const selected = getSelected(state);
  const canPasteStyle = selected.length > 0 && canvasSettings.focusing;
  return { canPasteStyle };
};

export default connect(
  mapStateToProps,
  { pasteStyleThunk }
)(MenuEditPasteStyle);