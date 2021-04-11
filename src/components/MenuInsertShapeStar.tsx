/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleShapeToolThunk } from '../store/actions/shapeTool';

export const MENU_ITEM_ID = 'insertShapeStar';

interface MenuInsertShapeStarProps {
  setStar(star: any): void;
}

const MenuInsertShapeStar = (props: MenuInsertShapeStarProps): ReactElement => {
  const { setStar } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);
  const accelerator = useSelector((state: RootState) => state.keyBindings.insert.shape.star);
  const isEnabled = useSelector((state: RootState) =>
    state.layer.present.activeArtboard !== null &&
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const isChecked = useSelector((state: RootState) =>
    state.canvasSettings.activeTool === 'Shape' &&
    state.shapeTool.shapeType === 'Star'
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setMenuItemTemplate({
      label: 'Star',
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
      dispatch(toggleShapeToolThunk('Star'));
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
      setStar(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuInsertShapeStar;