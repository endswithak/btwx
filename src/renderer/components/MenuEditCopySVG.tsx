/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { copySVGThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'editCopySVG';

interface MenuEditCopySVGProps {
  setCopySVG(copySVG: any): void;
}

const MenuEditCopySVG = (props: MenuEditCopySVGProps): ReactElement => {
  const { setCopySVG } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);
  const accelerator = useSelector((state: RootState) => state.keyBindings.edit.copy.svg);
  const isEnabled = useSelector((state: RootState) =>
    state.layer.present.selected.length === 1 &&
    state.layer.present.byId[state.layer.present.selected[0]].type === 'Shape' &&
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setMenuItemTemplate({
      label: 'Copy Shape Path Data',
      id: MENU_ITEM_ID,
      enabled: isEnabled,
      accelerator,
      click: {
        id: MENU_ITEM_ID
      }
    });
    (window as any)[MENU_ITEM_ID] = () => {
      dispatch(copySVGThunk());
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
      setCopySVG(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuEditCopySVG;