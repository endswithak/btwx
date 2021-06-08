/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleSelectedShadowThunk } from '../store/actions/layer';
import { canToggleSelectedShadow, selectedShadowEnabled } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'layerStyleShadow';

interface MenuLayerStyleShadowProps {
  setShadow(shadow: any): void;
}

const MenuLayerStyleShadow = (props: MenuLayerStyleShadowProps): ReactElement => {
  const { setShadow } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);
  const accelerator = useSelector((state: RootState) => state.keyBindings.layer.style.shadow);
  const isEnabled = useSelector((state: RootState) => canToggleSelectedShadow(state));
  const isChecked = useSelector((state: RootState) => selectedShadowEnabled(state));
  const dispatch = useDispatch();

  useEffect(() => {
    setMenuItemTemplate({
      label: 'Shadow',
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
      dispatch(toggleSelectedShadowThunk());
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
      setShadow(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuLayerStyleShadow;