import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { zoomFitSelectedThunk } from '../store/actions/zoomTool';

export const MENU_ITEM_ID = 'viewZoomFitArtboard';

interface MenuViewZoomFitArtboardProps {
  isEnabled?: boolean;
  zoomFitSelectedThunk?(): void;
}

const MenuViewZoomFitArtboard = (props: MenuViewZoomFitArtboardProps): ReactElement => {
  const { isEnabled, zoomFitSelectedThunk } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = isEnabled;
  }, [isEnabled]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      zoomFitSelectedThunk();
    };
  }, []);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  isEnabled: boolean;
} => {
  const { layer } = state;
  const isEnabled = layer.present.selected.length === 1 && layer.present.byId[layer.present.selected[0]].type === 'Artboard';
  return { isEnabled };
};

export default connect(
  mapStateToProps,
  { zoomFitSelectedThunk }
)(MenuViewZoomFitArtboard);