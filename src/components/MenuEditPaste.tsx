import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { pasteLayersThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'editPaste';

interface MenuEditPasteProps {
  canPaste?: boolean;
  pasteLayersThunk?(props?: { overSelection?: boolean; overPoint?: em.Point; overLayer?: string }): any;
}

const MenuEditPaste = (props: MenuEditPasteProps): ReactElement => {
  const { canPaste, pasteLayersThunk } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = canPaste;
  }, [canPaste]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      pasteLayersThunk();
    };
  }, []);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  canPaste: boolean;
} => {
  const { canvasSettings } = state;
  const canPaste = canvasSettings.focusing;
  return { canPaste };
};

export default connect(
  mapStateToProps,
  { pasteLayersThunk }
)(MenuEditPaste);