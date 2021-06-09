/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { pasteLayersThunk } from '../store/actions/layer';
import { setCanvasWaiting } from '../store/actions/canvasSettings';

export const MENU_ITEM_ID = 'editPaste';

interface MenuEditPasteLayersProps {
  setPasteLayers(pasteLayers: any): void;
}

const MenuEditPasteLayers = (props: MenuEditPasteLayersProps): ReactElement => {
  const { setPasteLayers } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);
  const instanceId = useSelector((state: RootState) => state.session.instance);
  const accelerator = useSelector((state: RootState) => state.keyBindings.edit.paste.paste);
  const isEnabled = useSelector((state: RootState) =>
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setMenuItemTemplate({
      label: 'Paste',
      id: MENU_ITEM_ID,
      enabled: isEnabled,
      accelerator,
      click: {
        id: MENU_ITEM_ID
      }
    });
    (window as any)[MENU_ITEM_ID] = () => {
      (window as any).api.initPastingLayers(JSON.stringify({
        instanceId
      })).then(() => {
        return dispatch(pasteLayersThunk({}));
      }).then(() => {
        dispatch(setCanvasWaiting({waiting: false}));
      });
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
      setPasteLayers(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuEditPasteLayers;