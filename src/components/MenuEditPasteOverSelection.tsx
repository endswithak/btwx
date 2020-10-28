import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { pasteLayersThunk } from '../store/actions/layer';
import { getSelected } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'editPasteOverSelection';

interface MenuEditPasteOverSelectionProps {
  canPasteOverSelection?: boolean;
  pasteLayersThunk?(props?: { overSelection?: boolean; overPoint?: Btwx.Point; overLayer?: string }): any;
}

const MenuEditPasteOverSelection = (props: MenuEditPasteOverSelectionProps): ReactElement => {
  const { canPasteOverSelection, pasteLayersThunk } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = canPasteOverSelection;
  }, [canPasteOverSelection]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      pasteLayersThunk({overSelection: true});
    };
  }, []);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  canPasteOverSelection: boolean;
} => {
  const { canvasSettings } = state;
  const selected = getSelected(state);
  const canPasteOverSelection = selected.length > 0 && canvasSettings.focusing;
  return { canPasteOverSelection };
};

export default connect(
  mapStateToProps,
  { pasteLayersThunk }
)(MenuEditPasteOverSelection);