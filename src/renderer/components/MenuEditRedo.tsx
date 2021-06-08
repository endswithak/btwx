/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { redoThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'editRedo';

interface MenuEditRedoProps {
  setRedo(redo: any): void;
}

const MenuEditRedo = (props: MenuEditRedoProps): ReactElement => {
  const { setRedo } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);
  const accelerator = useSelector((state: RootState) => state.keyBindings.edit.redo);
  const isEnabled = useSelector((state: RootState) =>
    state.layer.future.length > 0 &&
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const edit = useSelector((state: RootState) =>
    state.layer.future.length > 0 ?
    state.layer.future[0].edit
    : null
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setMenuItemTemplate({
      label: 'Redo',
      id: MENU_ITEM_ID,
      enabled: isEnabled,
      accelerator,
      click: {
        id: MENU_ITEM_ID
      }
    });
    (window as any)[MENU_ITEM_ID] = () => {
      dispatch(redoThunk());
    }
  }, []);

  useEffect(() => {
    if (menuItemTemplate) {
      setMenuItemTemplate({
        ...menuItemTemplate,
        label: `Redo${edit && edit.detail ? ` ${edit.detail}` : ''}`,
        enabled: isEnabled,
        accelerator
      });
    }
  }, [edit, isEnabled, accelerator]);

  useEffect(() => {
    if (menuItemTemplate) {
      setRedo(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuEditRedo;