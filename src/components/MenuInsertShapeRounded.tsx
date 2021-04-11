/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleShapeToolThunk } from '../store/actions/shapeTool';

export const MENU_ITEM_ID = 'insertShapeRounded';

interface MenuInsertShapeRoundedProps {
  setRounded(rounded: any): void;
}

const MenuInsertShapeRounded = (props: MenuInsertShapeRoundedProps): ReactElement => {
  const { setRounded } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);
  const accelerator = useSelector((state: RootState) => state.keyBindings.insert.shape.rounded);
  const isEnabled = useSelector((state: RootState) =>
    state.layer.present.activeArtboard !== null &&
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const isChecked = useSelector((state: RootState) =>
    state.canvasSettings.activeTool === 'Shape' &&
    state.shapeTool.shapeType === 'Rounded'
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setMenuItemTemplate({
      label: 'Rounded',
      id: MENU_ITEM_ID,
      type: 'checkbox',
      checked: isChecked,
      enabled: isEnabled,
      accelerator,
      click: {
        id: MENU_ITEM_ID
      }
    });
    (window as any)[MENU_ITEM_ID] = () => {
      dispatch(toggleShapeToolThunk('Rounded'));
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
      setRounded(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuInsertShapeRounded;