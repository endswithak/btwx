import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { zoomFitActiveArtboardThunk } from '../store/actions/zoomTool';

export const MENU_ITEM_ID = 'viewZoomFitArtboard';

interface MenuViewZoomFitArtboardProps {
  isEnabled?: boolean;
  zoomFitActiveArtboardThunk?(): void;
}

const MenuViewZoomFitArtboard = (props: MenuViewZoomFitArtboardProps): ReactElement => {
  const { isEnabled, zoomFitActiveArtboardThunk } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = isEnabled;
  }, [isEnabled]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      zoomFitActiveArtboardThunk();
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
  const isEnabled = layer.present.activeArtboard !== null;
  return { isEnabled };
};

export default connect(
  mapStateToProps,
  { zoomFitActiveArtboardThunk }
)(MenuViewZoomFitArtboard);