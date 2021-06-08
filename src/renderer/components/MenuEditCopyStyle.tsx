/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { copyStyleThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'editCopyStyle';

interface MenuEditCopyStyleProps {
  setCopyStyle(copyStyle: any): void;
}

const MenuEditCopyStyle = (props: MenuEditCopyStyleProps): ReactElement => {
  const { setCopyStyle } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);
  const accelerator = useSelector((state: RootState) => state.keyBindings.edit.copy.style);
  const isEnabled = useSelector((state: RootState) =>
    state.layer.present.selected.length === 1 &&
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setMenuItemTemplate({
      label: 'Copy Style',
      id: MENU_ITEM_ID,
      enabled: isEnabled,
      accelerator,
      click: {
        id: MENU_ITEM_ID
      }
    });
    (window as any)[MENU_ITEM_ID] = () => {
      dispatch(copyStyleThunk());
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
      setCopyStyle(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuEditCopyStyle;