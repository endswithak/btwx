/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { undoThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'editUndo';

interface MenuEditUndoProps {
  setUndo(undo: any): void;
}

const MenuEditUndo = (props: MenuEditUndoProps): ReactElement => {
  const { setUndo } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);
  const accelerator = useSelector((state: RootState) => state.keyBindings.edit.undo);
  const isEnabled = useSelector((state: RootState) =>
    state.layer.past.length > 0 &&
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const edit = useSelector((state: RootState) => state.layer.present.edit);
  const dispatch = useDispatch();

  useEffect(() => {
    setMenuItemTemplate({
      label: 'Undo',
      id: MENU_ITEM_ID,
      enabled: isEnabled,
      accelerator,
      click: {
        id: MENU_ITEM_ID
      }
    });
    (window as any)[MENU_ITEM_ID] = () => {
      dispatch(undoThunk());
    }
  }, []);

  useEffect(() => {
    if (menuItemTemplate) {
      setMenuItemTemplate({
        ...menuItemTemplate,
        label: `Undo${edit.detail ? ` ${edit.detail}` : ''}`,
        enabled: isEnabled,
        accelerator
      });
    }
  }, [edit, isEnabled, accelerator]);

  useEffect(() => {
    if (menuItemTemplate) {
      setUndo(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuEditUndo;