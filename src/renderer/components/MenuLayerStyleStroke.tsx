/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleSelectedStrokeThunk } from '../store/actions/layer';
import { canToggleSelectedFillOrStroke, selectedStrokeEnabled } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'layerStyleStroke';

interface MenuLayerStyleStrokeProps {
  setStroke(stroke: any): void;
}

const MenuLayerStyleStroke = (props: MenuLayerStyleStrokeProps): ReactElement => {
  const { setStroke } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);
  const accelerator = useSelector((state: RootState) => state.keyBindings.layer.style.stroke);
  const isEnabled = useSelector((state: RootState) => canToggleSelectedFillOrStroke(state));
  const isChecked = useSelector((state: RootState) => selectedStrokeEnabled(state));
  const dispatch = useDispatch();

  useEffect(() => {
    setMenuItemTemplate({
      label: 'Stroke',
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
      dispatch(toggleSelectedStrokeThunk());
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
      setStroke(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuLayerStyleStroke;