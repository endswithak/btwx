import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { zoomFitCanvasThunk } from '../store/actions/zoomTool';

export const MENU_ITEM_ID = 'viewZoomFitCanvas';

interface MenuViewZoomFitCanvasProps {
  zoomFitCanvasThunk?(): void;
}

const MenuViewZoomFitCanvas = (props: MenuViewZoomFitCanvasProps): ReactElement => {
  const { zoomFitCanvasThunk } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = true;
    (window as any)[MENU_ITEM_ID] = (): void => {
      zoomFitCanvasThunk();
    };
  }, []);

  return (
    <></>
  );
}

export default connect(
  null,
  { zoomFitCanvasThunk }
)(MenuViewZoomFitCanvas);