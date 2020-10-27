import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { pasteSVGThunk } from '../store/actions/layer';
import { canPasteSVG } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'editPasteSVG';

interface MenuEditPasteSVGProps {
  canPaste?: boolean;
  pasteSVGThunk?(): any;
}

const MenuEditPasteSVG = (props: MenuEditPasteSVGProps): ReactElement => {
  const { canPaste, pasteSVGThunk } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = canPaste;
  }, [canPaste]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      pasteSVGThunk();
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
  const canPaste = canPasteSVG() && canvasSettings.focusing;
  return { canPaste };
};

export default connect(
  mapStateToProps,
  { pasteSVGThunk }
)(MenuEditPasteSVG);