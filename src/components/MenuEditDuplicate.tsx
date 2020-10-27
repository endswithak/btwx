import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { DuplicateLayersPayload, LayerTypes } from '../store/actionTypes/layer';
import { duplicateLayers } from '../store/actions/layer';
import { getSelectedById, getSelected } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'editDuplicate';

interface MenuEditDuplicateProps {
  selected?: string[];
  selectedById?: {
    [id: string]: em.Layer;
  };
  canDuplicate?: boolean;
  duplicateLayers?(payload: DuplicateLayersPayload): LayerTypes;
}

const MenuEditDuplicate = (props: MenuEditDuplicateProps): ReactElement => {
  const { canDuplicate, duplicateLayers, selected, selectedById } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = canDuplicate;
  }, [canDuplicate]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      duplicateLayers({layers: selected});
    };
  }, [selectedById]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  selected: string[];
  selectedById: {
    [id: string]: em.Layer;
  };
  canDuplicate: boolean;
} => {
  const { canvasSettings } = state;
  const selectedById = getSelectedById(state);
  const selected = getSelected(state);
  const canDuplicate = selected.length > 0 && canvasSettings.focusing;
  return { canDuplicate, selectedById, selected };
};

export default connect(
  mapStateToProps,
  { duplicateLayers }
)(MenuEditDuplicate);