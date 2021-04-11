/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { zoomFitCanvasThunk } from '../store/actions/zoomTool';
import { RootState } from '../store/reducers';

export const MENU_ITEM_ID = 'viewZoomFitCanvas';

interface MenuViewZoomFitCanvasProps {
  setFitCanvas(fitCanvas: any): void;
}

const MenuViewZoomFitCanvas = (props: MenuViewZoomFitCanvasProps): ReactElement => {
  const { setFitCanvas } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);
  const accelerator = useSelector((state: RootState) => state.keyBindings.view.zoomFit.canvas);
  const isEnabled = useSelector((state: RootState) =>
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setMenuItemTemplate({
      label: 'Fit Canvas',
      id: MENU_ITEM_ID,
      enabled: isEnabled,
      accelerator,
      click: {
        id: MENU_ITEM_ID
      }
    });
    (window as any)[MENU_ITEM_ID] = () => {
      dispatch(zoomFitCanvasThunk());
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
      setFitCanvas(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuViewZoomFitCanvas;