/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { removeArtboardPresetThunk } from '../store/actions/artboardPresets';

export const MENU_ITEM_ID = 'artboardPresetDelete';

interface MenuArtboardPresetDeleteProps {
  setArtboardPresetDelete(artboardPresetDelete: any): void;
}

const MenuArtboardPresetDelete = (props: MenuArtboardPresetDeleteProps): ReactElement => {
  const { setArtboardPresetDelete } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);
  const artboardPreset = useSelector((state: RootState) => state.contextMenu.id ? state.artboardPresets.byId[state.contextMenu.id] : null);
  const dispatch = useDispatch();

  useEffect(() => {
    setMenuItemTemplate({
      label: 'Delete Preset',
      id: MENU_ITEM_ID,
      click: {
        id: MENU_ITEM_ID
      }
    });
  }, []);

  useEffect(() => {
    if (artboardPreset) {
      (window as any)[MENU_ITEM_ID] = () => {
        dispatch(removeArtboardPresetThunk({id: (artboardPreset as Btwx.ArtboardPreset).id}));
      }
    }
  }, [artboardPreset]);

  useEffect(() => {
    if (menuItemTemplate) {
      setArtboardPresetDelete(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuArtboardPresetDelete;