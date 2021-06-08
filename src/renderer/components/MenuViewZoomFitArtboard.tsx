/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { zoomFitActiveArtboardThunk } from '../store/actions/zoomTool';

export const MENU_ITEM_ID = 'viewZoomFitArtboard';

interface MenuViewZoomFitArtboardProps {
  setFitArtboard(fitArtboard: any): void;
}

const MenuViewZoomFitArtboard = (props: MenuViewZoomFitArtboardProps): ReactElement => {
  const { setFitArtboard } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);
  const accelerator = useSelector((state: RootState) => state.keyBindings.view.zoomFit.activeArtboard);
  const isEnabled = useSelector((state: RootState) =>
    state.layer.present.activeArtboard !== null &&
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setMenuItemTemplate({
      label: 'Fit Active Artboard',
      id: MENU_ITEM_ID,
      enabled: isEnabled,
      accelerator,
      click: {
        id: MENU_ITEM_ID
      }
    });
    (window as any)[MENU_ITEM_ID] = () => {
      dispatch(zoomFitActiveArtboardThunk());
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
      setFitArtboard(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuViewZoomFitArtboard;