/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleSelectedFillThunk } from '../store/actions/layer';
import { canToggleSelectedFillOrStroke, selectedFillEnabled } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'layerStyleFill';

interface MenuLayerStyleFillProps {
  setFill(fill: any): void;
}

const MenuLayerStyleFill = (props: MenuLayerStyleFillProps): ReactElement => {
  const { setFill } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);
  const accelerator = useSelector((state: RootState) => state.keyBindings.layer.style.fill);
  const isEnabled = useSelector((state: RootState) => canToggleSelectedFillOrStroke(state));
  const isChecked = useSelector((state: RootState) => selectedFillEnabled(state));
  const dispatch = useDispatch();

  useEffect(() => {
    setMenuItemTemplate({
      label: 'Fill',
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
      dispatch(toggleSelectedFillThunk());
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
      setFill(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuLayerStyleFill;