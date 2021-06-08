/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleSelectionIgnoreUnderlyingMask } from '../store/actions/layer';
import { selectedIgnoreUnderlyingMaskEnabled } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'layerMaskIgnoreUnderlyingMask';

interface MenuLayerMaskToggleUnderlyingMaskProps {
  setIgnoreUnderlyingMask(ignoreUnderlyingMask: any): void;
}

const MenuLayerMaskToggleUnderlyingMask = (props: MenuLayerMaskToggleUnderlyingMaskProps): ReactElement => {
  const { setIgnoreUnderlyingMask } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);
  const accelerator = useSelector((state: RootState) => state.keyBindings.layer.mask.ignoreUnderlyingMask);
  const isEnabled = useSelector((state: RootState) =>
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const isChecked = useSelector((state: RootState) =>
    selectedIgnoreUnderlyingMaskEnabled(state)
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setMenuItemTemplate({
      label: 'Ignore Underlying Mask',
      id: MENU_ITEM_ID,
      enabled: isEnabled,
      type: 'checkbox',
      checked: isChecked,
      accelerator,
      click: {
        id: MENU_ITEM_ID
      }
    });
    (window as any)[MENU_ITEM_ID] = () => {
      dispatch(toggleSelectionIgnoreUnderlyingMask());
    }
  }, []);

  useEffect(() => {
    if (menuItemTemplate) {
      setMenuItemTemplate({
        ...menuItemTemplate,
        enabled: isEnabled,
        checked: isChecked,
        accelerator
      });
    }
  }, [isEnabled, isChecked, accelerator]);

  useEffect(() => {
    if (menuItemTemplate) {
      setIgnoreUnderlyingMask(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuLayerMaskToggleUnderlyingMask;