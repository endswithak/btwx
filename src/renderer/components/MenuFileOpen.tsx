/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';

export const MENU_ITEM_ID = 'fileOpen';

interface MenuFileOpenProps {
  setOpen(open: any): void;
}

const MenuFileOpen = (props: MenuFileOpenProps): ReactElement => {
  const { setOpen } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);
  const accelerator = useSelector((state: RootState) => state.keyBindings.file.open);
  const isEnabled = useSelector((state: RootState) =>
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );

  useEffect(() => {
    setMenuItemTemplate({
      label: 'Open...',
      id: MENU_ITEM_ID,
      enabled: isEnabled,
      accelerator,
      click: {
        id: MENU_ITEM_ID
      }
    });
    (window as any)[MENU_ITEM_ID] = () => {
      (window as any).api.openInstance();
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
      setOpen(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuFileOpen;