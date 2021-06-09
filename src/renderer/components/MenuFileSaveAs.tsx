/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';

export const MENU_ITEM_ID = 'fileSaveAs';

interface MenuFileSaveAsProps {
  setSaveAs(saveAs: any): void;
}

const MenuFileSaveAs = (props: MenuFileSaveAsProps): ReactElement => {
  const { setSaveAs } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);
  const accelerator = useSelector((state: RootState) => state.keyBindings.file.saveAs);
  const isEnabled = useSelector((state: RootState) =>
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );

  useEffect(() => {
    setMenuItemTemplate({
      label: 'Save As...',
      id: MENU_ITEM_ID,
      enabled: isEnabled,
      accelerator,
      click: {
        id: MENU_ITEM_ID
      }
    });
    (window as any)[MENU_ITEM_ID] = () => {
      (window as any).api.saveInstanceAs();
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
      setSaveAs(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuFileSaveAs;