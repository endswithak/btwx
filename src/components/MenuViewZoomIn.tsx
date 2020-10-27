import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { zoomInThunk } from '../store/actions/zoomTool';

export const MENU_ITEM_ID = 'viewZoomIn';

interface MenuViewZoomInProps {
  zoomInThunk?(): void;
}

const MenuViewZoomIn = (props: MenuViewZoomInProps): ReactElement => {
  const { zoomInThunk } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = true;
    (window as any)[MENU_ITEM_ID] = (): void => {
      zoomInThunk();
    };
  }, []);

  return (
    <></>
  );
}

export default connect(
  null,
  { zoomInThunk }
)(MenuViewZoomIn);