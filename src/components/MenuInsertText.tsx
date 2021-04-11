/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleTextToolThunk } from '../store/actions/textTool';

export const MENU_ITEM_ID = 'insertText';

interface MenuInsertTextProps {
  setText(text: any): void;
}

const MenuInsertText = (props: MenuInsertTextProps): ReactElement => {
  const { setText } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);
  const accelerator = useSelector((state: RootState) => state.keyBindings.insert.text);
  const isEnabled = useSelector((state: RootState) =>
    state.layer.present.activeArtboard !== null &&
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const isChecked = useSelector((state: RootState) =>
    state.canvasSettings.activeTool === 'Text'
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setMenuItemTemplate({
      label: 'Text',
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
      dispatch(toggleTextToolThunk());
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
      setText(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuInsertText;