import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { zoomFitSelectedThunk } from '../store/actions/zoomTool';

export const MENU_ITEM_ID = 'viewZoomFitSelected';

interface MenuViewZoomFitSelectedProps {
  isEnabled?: boolean;
  zoomFitSelectedThunk?(): void;
}

const MenuViewZoomFitSelected = (props: MenuViewZoomFitSelectedProps): ReactElement => {
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
  const isEnabled = layer.present.selected.length > 0;
  return { isEnabled };
};

export default connect(
  mapStateToProps,
  { zoomFitSelectedThunk }
)(MenuViewZoomFitSelected);