/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleSelectedVerticalFlipThunk } from '../store/actions/layer';
import { canFlipSeleted, selectedVerticalFlipEnabled } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'layerTransformFlipVertically';

interface MenuLayerTransformFlipVerticallyProps {
  setVerticalFlip(verticalFlip: any): void;
}

const MenuLayerTransformFlipVertically = (props: MenuLayerTransformFlipVerticallyProps): ReactElement => {
  const { setVerticalFlip } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);
  const accelerator = useSelector((state: RootState) => state.keyBindings.layer.transform.flipVertically);
  const isEnabled = useSelector((state: RootState) => canFlipSeleted(state));
  const isChecked = useSelector((state: RootState) => selectedVerticalFlipEnabled(state));
  const dispatch = useDispatch();

  useEffect(() => {
    setMenuItemTemplate({
      label: 'Flip Vertically',
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
      dispatch(toggleSelectedVerticalFlipThunk());
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
      setVerticalFlip(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuLayerTransformFlipVertically;