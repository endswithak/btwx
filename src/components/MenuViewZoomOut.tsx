import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { zoomOutThunk } from '../store/actions/zoomTool';

export const MENU_ITEM_ID = 'viewZoomOut';

interface MenuViewZoomOutProps {
  zoomOutThunk?(): void;
}

const MenuViewZoomOut = (props: MenuViewZoomOutProps): ReactElement => {
  const { zoomOutThunk } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = true;
    (window as any)[MENU_ITEM_ID] = (): void => {
      zoomOutThunk();
    };
  }, []);

  return (
    <></>
  );
}

export default connect(
  null,
  { zoomOutThunk }
)(MenuViewZoomOut);