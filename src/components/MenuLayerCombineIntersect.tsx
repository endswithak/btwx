/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { applyBooleanOperationThunk } from '../store/actions/layer';
import { canBooleanSelected } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'layerCombineIntersect';

interface MenuLayerCombineIntersectProps {
  setIntersect(intersect: any): void;
}

const MenuLayerCombineIntersect = (props: MenuLayerCombineIntersectProps): ReactElement => {
  const { setIntersect } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);
  const accelerator = useSelector((state: RootState) => state.keyBindings.layer.combine.intersect);
  const isEnabled = useSelector((state: RootState) =>
    canBooleanSelected(state) &&
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setMenuItemTemplate({
      label: 'Intersect',
      id: MENU_ITEM_ID,
      enabled: isEnabled,
      accelerator,
      click: {
        id: MENU_ITEM_ID
      }
    });
    (window as any)[MENU_ITEM_ID] = () => {
      dispatch(applyBooleanOperationThunk('intersect'));
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
      setIntersect(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuLayerCombineIntersect;