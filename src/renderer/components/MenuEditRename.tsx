/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setEditingThunk } from '../store/actions/leftSidebar';

export const MENU_ITEM_ID = 'editRename';

interface MenuEditRenameProps {
  setRename(rename: any): void;
}

const MenuEditRename = (props: MenuEditRenameProps): ReactElement => {
  const { setRename } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);
  const accelerator = useSelector((state: RootState) => state.keyBindings.edit.rename);
  const isEnabled = useSelector((state: RootState) =>
    state.layer.present.selected.length === 1 &&
    state.leftSidebar.editing !== state.layer.present.selected[0] &&
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setMenuItemTemplate({
      label: 'Rename Layer',
      id: MENU_ITEM_ID,
      enabled: isEnabled,
      accelerator,
      click: {
        id: MENU_ITEM_ID
      }
    });
    (window as any)[MENU_ITEM_ID] = () => {
      dispatch(setEditingThunk());
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
      setRename(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuEditRename;