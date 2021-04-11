/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSearching } from '../store/actions/leftSidebar';
import { RootState } from '../store/reducers';

export const MENU_ITEM_ID = 'editFind';

interface MenuEditFindProps {
  setFind(find: any): void;
}

const MenuEditFind = (props: MenuEditFindProps): ReactElement => {
  const { setFind } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);
  const accelerator = useSelector((state: RootState) => state.keyBindings.edit.find);
  const isEnabled = useSelector((state: RootState) =>
    state.layer.present.byId.root.children.length !== 0 &&
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setMenuItemTemplate({
      label: 'Find Layer',
      id: MENU_ITEM_ID,
      enabled: isEnabled,
      accelerator,
      click: {
        id: MENU_ITEM_ID
      }
    });
    (window as any)[MENU_ITEM_ID] = () => {
      const layersSearchInput = document.getElementById('layers-search-input');
      dispatch(setSearching({searching: true}));
      layersSearchInput.focus();
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
      setFind(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuEditFind;