/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleSelectedMaskThunk } from '../store/actions/layer';
import { canToggleSelectedUseAsMask, selectedUseAsMaskEnabled } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'layerMaskUseAsMask';

interface MenuLayerMaskUseAsMaskProps {
  setUseAsMask(useAsMask: any): void;
}

const MenuLayerMaskUseAsMask = (props: MenuLayerMaskUseAsMaskProps): ReactElement => {
  const { setUseAsMask } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);
  const accelerator = useSelector((state: RootState) => state.keyBindings.layer.mask.useAsMask);
  const isEnabled = useSelector((state: RootState) =>
    canToggleSelectedUseAsMask(state) &&
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const isChecked = useSelector((state: RootState) =>
    selectedUseAsMaskEnabled(state)
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setMenuItemTemplate({
      label: 'Use As Mask',
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
      dispatch(toggleSelectedMaskThunk());
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
      setUseAsMask(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuLayerMaskUseAsMask;