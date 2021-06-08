/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { zoomFitSelectedThunk } from '../store/actions/zoomTool';

export const MENU_ITEM_ID = 'viewZoomFitSelected';

interface MenuViewZoomFitSelectedProps {
  setFitSelected(fitSelected: any): void;
}

const MenuViewZoomFitSelected = (props: MenuViewZoomFitSelectedProps): ReactElement => {
  const { setFitSelected } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);
  const accelerator = useSelector((state: RootState) => state.keyBindings.view.zoomFit.selected);
  const isEnabled = useSelector((state: RootState) =>
    state.layer.present.selected.length > 0 &&
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setMenuItemTemplate({
      label: 'Fit Selection',
      id: MENU_ITEM_ID,
      enabled: isEnabled,
      accelerator,
      click: {
        id: MENU_ITEM_ID
      }
    });
    (window as any)[MENU_ITEM_ID] = () => {
      dispatch(zoomFitSelectedThunk());
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
      setFitSelected(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuViewZoomFitSelected;