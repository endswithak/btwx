import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { LayerTypes, SelectLayersPayload } from '../store/actionTypes/layer';
import { selectLayers } from '../store/actions/layer';

export const MENU_ITEM_ID = 'editSelectAllArtboards';

interface MenuEditSelectAllArtboardsProps {
  allArtboardIds?: string[];
  canSelectAllArtboards?: boolean;
  selectLayers?(payload: SelectLayersPayload): LayerTypes;
}

const MenuEditSelectAllArtboards = (props: MenuEditSelectAllArtboardsProps): ReactElement => {
  const { canSelectAllArtboards, selectLayers, allArtboardIds } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = canSelectAllArtboards;
  }, [canSelectAllArtboards]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      selectLayers({layers: allArtboardIds, newSelection: true});
    };
  }, [allArtboardIds]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  allArtboardIds: string[];
  canSelectAllArtboards: boolean;
} => {
  const { canvasSettings, layer } = state;
  const allArtboardIds = layer.present.allArtboardIds;
  const canSelectAllArtboards = allArtboardIds.length > 0 && canvasSettings.focusing;
  return { allArtboardIds, canSelectAllArtboards };
};

export default connect(
  mapStateToProps,
  { selectLayers }
)(MenuEditSelectAllArtboards);