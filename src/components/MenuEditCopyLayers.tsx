/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { copySelectedToClipboardThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'editCopy';

interface MenuEditCopyLayersProps {
  setCopyLayers(copyLayers: any): void;
}

const MenuEditCopyLayers = (props: MenuEditCopyLayersProps): ReactElement => {
  const { setCopyLayers } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);
  const accelerator = useSelector((state: RootState) => state.keyBindings.edit.copy.copy);
  const isEnabled = useSelector((state: RootState) =>
    state.layer.present.selected.length > 0 &&
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setMenuItemTemplate({
      label: 'Copy',
      id: MENU_ITEM_ID,
      enabled: isEnabled,
      accelerator,
      click: {
        id: MENU_ITEM_ID
      }
    });
    (window as any)[MENU_ITEM_ID] = () => {
      dispatch(copySelectedToClipboardThunk());
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
      setCopyLayers(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuEditCopyLayers;