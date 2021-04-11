/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { openArtboardPresetEditor } from '../store/actions/artboardPresetEditor';

export const MENU_ITEM_ID = 'artboardPresetEdit';

interface MenuArtboardPresetEditProps {
  setArtboardPresetEdit(artboardPresetEdit: any): void;
}

const MenuArtboardPresetEdit = (props: MenuArtboardPresetEditProps): ReactElement => {
  const { setArtboardPresetEdit } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);
  const artboardPreset = useSelector((state: RootState) => state.contextMenu.id ? state.artboardPresets.byId[state.contextMenu.id] : null);
  const dispatch = useDispatch();

  useEffect(() => {
    setMenuItemTemplate({
      label: 'Edit',
      id: MENU_ITEM_ID,
      click: {
        id: MENU_ITEM_ID
      }
    });
  }, []);

  useEffect(() => {
    if (artboardPreset) {
      (window as any)[MENU_ITEM_ID] = () => {
        dispatch(openArtboardPresetEditor({
          id: (artboardPreset as Btwx.ArtboardPreset).id,
          category: 'Custom',
          type: (artboardPreset as Btwx.ArtboardPreset).type,
          width: (artboardPreset as Btwx.ArtboardPreset).width,
          height: (artboardPreset as Btwx.ArtboardPreset).height
        }));
      }
    }
  }, [artboardPreset]);

  useEffect(() => {
    if (menuItemTemplate) {
      setArtboardPresetEdit(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuArtboardPresetEdit;