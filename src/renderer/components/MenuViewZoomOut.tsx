/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { zoomOutThunk } from '../store/actions/zoomTool';
import { RootState } from '../store/reducers';

export const MENU_ITEM_ID = 'viewZoomOut';

interface MenuViewZoomOutProps {
  setZoomOut(zoomOut: any): void;
}

const MenuViewZoomOut = (props: MenuViewZoomOutProps): ReactElement => {
  const { setZoomOut } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);
  const accelerator = useSelector((state: RootState) => state.keyBindings.view.zoomOut);
  const isEnabled = useSelector((state: RootState) =>
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setMenuItemTemplate({
      label: 'Zoom Out',
      id: MENU_ITEM_ID,
      enabled: isEnabled,
      accelerator,
      click: {
        id: MENU_ITEM_ID
      }
    });
    (window as any)[MENU_ITEM_ID] = () => {
      dispatch(zoomOutThunk());
    }
  }, []);

  useEffect(() => {
    if (menuItemTemplate) {
      setMenuItemTemplate({
        ...menuItemTemplate,
        enabled: isEnabled,
        accelerator
      });
    }
  }, [isEnabled, accelerator]);

  useEffect(() => {
    if (menuItemTemplate) {
      setZoomOut(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuViewZoomOut;