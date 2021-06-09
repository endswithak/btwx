import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';

export const MENU_ITEM_ID = 'fileNew';

interface MenuAppThemeProps {
  setNewDocument(newDocument: any): void;
}

const MenuFileNew = (props: MenuAppThemeProps): ReactElement => {
  const { setNewDocument } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);
  const accelerator = useSelector((state: RootState) => state.keyBindings.file.new);
  const isEnabled = useSelector((state: RootState) =>
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );

  useEffect(() => {
    setMenuItemTemplate({
      label: 'New',
      id: MENU_ITEM_ID,
      enabled: isEnabled,
      accelerator,
      click: {
        id: MENU_ITEM_ID
      }
    });
    (window as any)[MENU_ITEM_ID] = () => {
      (window as any).api.newInstance();
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
      setNewDocument(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuFileNew;