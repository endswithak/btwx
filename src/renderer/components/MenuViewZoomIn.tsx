/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { zoomInThunk } from '../store/actions/zoomTool';
import { RootState } from '../store/reducers';

export const MENU_ITEM_ID = 'viewZoomIn';

interface MenuViewZoomInProps {
  setZoomIn(zoomIn: any): void;
}

const MenuViewZoomIn = (props: MenuViewZoomInProps): ReactElement => {
  const { setZoomIn } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);
  const accelerator = useSelector((state: RootState) => state.keyBindings.view.zoomIn);
  const isEnabled = useSelector((state: RootState) =>
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setMenuItemTemplate({
      label: 'Zoom In',
      id: MENU_ITEM_ID,
      enabled: isEnabled,
      accelerator,
      click: {
        id: MENU_ITEM_ID
      }
    });
    (window as any)[MENU_ITEM_ID] = () => {
      dispatch(zoomInThunk());
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
      setZoomIn(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuViewZoomIn;