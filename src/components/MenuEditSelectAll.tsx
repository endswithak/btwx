/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { selectAllLayers } from '../store/actions/layer';

export const MENU_ITEM_ID = 'editSelectAll';

interface MenuEditSelectAllProps {
  setSelectAll(selectAll: any): void;
}

const MenuEditSelectAll = (props: MenuEditSelectAllProps): ReactElement => {
  const { setSelectAll } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);
  const accelerator = useSelector((state: RootState) => state.keyBindings.edit.select.selectAll);
  const isEnabled = useSelector((state: RootState) =>
    state.layer.present.allIds.length > 1 &&
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setMenuItemTemplate({
      label: 'Select All',
      id: MENU_ITEM_ID,
      enabled: isEnabled,
      accelerator,
      click: {
        id: MENU_ITEM_ID
      }
    });
    (window as any)[MENU_ITEM_ID] = () => {
      dispatch(selectAllLayers());
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
      setSelectAll(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuEditSelectAll;