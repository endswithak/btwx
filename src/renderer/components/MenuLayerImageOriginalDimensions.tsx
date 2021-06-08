/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { resetSelectedImageDimensionsThunk } from '../store/actions/layer';
import { canResetSelectedImageDimensions } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'layerImageOriginalDimensions';

interface MenuLayerImageOriginalDimensionsProps {
  setOriginalDims(originalDims: any): void;
}

const MenuLayerImageOriginalDimensions = (props: MenuLayerImageOriginalDimensionsProps): ReactElement => {
  const { setOriginalDims } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);
  const accelerator = useSelector((state: RootState) => state.keyBindings.layer.image.originalDimensions);
  const isEnabled = useSelector((state: RootState) =>
    canResetSelectedImageDimensions(state) &&
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setMenuItemTemplate({
      label: 'Set to Original Dimensions',
      id: MENU_ITEM_ID,
      enabled: isEnabled,
      accelerator,
      click: {
        id: MENU_ITEM_ID
      }
    });
    (window as any)[MENU_ITEM_ID] = () => {
      dispatch(resetSelectedImageDimensionsThunk());
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
      setOriginalDims(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuLayerImageOriginalDimensions;