import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { duplicateSelectedThunk } from '../store/actions/layer';
import { getSelectedById } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'editDuplicate';

interface MenuEditDuplicateProps {
  selectedById?: {
    [id: string]: Btwx.Layer;
  };
  canDuplicate?: boolean;
  duplicateSelectedThunk?(): void;
}

const MenuEditDuplicate = (props: MenuEditDuplicateProps): ReactElement => {
  const { canDuplicate, duplicateSelectedThunk, selectedById } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = canDuplicate;
  }, [canDuplicate]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      duplicateSelectedThunk();
    };
  }, [selectedById]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  selectedById: {
    [id: string]: Btwx.Layer;
  };
  canDuplicate: boolean;
} => {
  const { canvasSettings } = state;
  const selectedById = getSelectedById(state);
  const selected = state.layer.present.selected;
  const canDuplicate = selected.length > 0 && canvasSettings.focusing;
  return { canDuplicate, selectedById };
};

export default connect(
  mapStateToProps,
  { duplicateSelectedThunk }
)(MenuEditDuplicate);