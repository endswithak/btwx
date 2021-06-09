/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';

export const MENU_ITEM_ID = 'fileSave';

interface MenuFileSaveProps {
  setSave(save: any): void;
}

const MenuFileSave = (props: MenuFileSaveProps): ReactElement => {
  const { setSave } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);
  const accelerator = useSelector((state: RootState) => state.keyBindings.file.save);
  const isEnabled = useSelector((state: RootState) =>
    state.layer.present.edit &&
    state.layer.present.edit.id !== state.documentSettings.edit &&
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );

  useEffect(() => {
    setMenuItemTemplate({
      label: 'Save',
      id: MENU_ITEM_ID,
      enabled: isEnabled,
      accelerator,
      click: {
        id: MENU_ITEM_ID
      }
    });
    (window as any)[MENU_ITEM_ID] = () => {
      (window as any).api.saveInstance();
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
      setSave(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuFileSave;