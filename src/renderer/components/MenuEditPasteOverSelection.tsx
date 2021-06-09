/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { pasteLayersThunk } from '../store/actions/layer';
import { setCanvasWaiting } from '../store/actions/canvasSettings';

export const MENU_ITEM_ID = 'editPasteOverSelection';

interface MenuEditPasteOverSelectionProps {
  setPasteOverSelection(pasteOverSelection: any): void;
}

const MenuEditPasteOverSelection = (props: MenuEditPasteOverSelectionProps): ReactElement => {
  const { setPasteOverSelection } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);
  const instanceId = useSelector((state: RootState) => state.session.instance);
  const accelerator = useSelector((state: RootState) => state.keyBindings.edit.paste.overSelection);
  const isEnabled = useSelector((state: RootState) =>
    state.layer.present.selected.length > 0 &&
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setMenuItemTemplate({
      label: 'Paste Over Selection',
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
        return dispatch(pasteLayersThunk({overSelection: true}));
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
      setPasteOverSelection(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuEditPasteOverSelection;