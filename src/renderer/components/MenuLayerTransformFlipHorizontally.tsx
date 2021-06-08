/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleSelectedHorizontalFlipThunk } from '../store/actions/layer';
import { canFlipSeleted, selectedHorizontalFlipEnabled } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'layerTransformFlipHorizontally';

interface MenuLayerTransformFlipHorizontallyProps {
  setHorizontalFlip(horizontalFlip: any): void;
}

const MenuLayerTransformFlipHorizontally = (props: MenuLayerTransformFlipHorizontallyProps): ReactElement => {
  const { setHorizontalFlip } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);
  const accelerator = useSelector((state: RootState) => state.keyBindings.layer.transform.flipHorizontally);
  const isEnabled = useSelector((state: RootState) => canFlipSeleted(state));
  const isChecked = useSelector((state: RootState) => selectedHorizontalFlipEnabled(state));
  const dispatch = useDispatch();

  useEffect(() => {
    setMenuItemTemplate({
      label: 'Flip Horizontally',
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
      dispatch(toggleSelectedHorizontalFlipThunk());
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
      setHorizontalFlip(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuLayerTransformFlipHorizontally;