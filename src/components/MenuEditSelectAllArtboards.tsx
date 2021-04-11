/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { selectAllArtboardsThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'editSelectAllArtboards';

interface MenuEditSelectAllArtboardsProps {
  setSelectAllArtboards(selectAllArtboards: any): void;
}

const MenuEditSelectAllArtboards = (props: MenuEditSelectAllArtboardsProps): ReactElement => {
  const { setSelectAllArtboards } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);
  const accelerator = useSelector((state: RootState) => state.keyBindings.edit.select.selectAllArtboards);
  const isEnabled = useSelector((state: RootState) =>
    state.layer.present.allArtboardIds.length > 0 &&
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setMenuItemTemplate({
      label: 'Select All Artboards',
      id: MENU_ITEM_ID,
      enabled: isEnabled,
      accelerator,
      click: {
        id: MENU_ITEM_ID
      }
    });
    (window as any)[MENU_ITEM_ID] = () => {
      dispatch(selectAllArtboardsThunk());
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
      setSelectAllArtboards(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuEditSelectAllArtboards;