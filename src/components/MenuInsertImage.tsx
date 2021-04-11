/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { insertImageThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'insertImage';

interface MenuInsertImageProps {
  setImage(image: any): void;
}

const MenuInsertImage = (props: MenuInsertImageProps): ReactElement => {
  const { setImage } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);
  const accelerator = useSelector((state: RootState) => state.keyBindings.insert.image);
  const isEnabled = useSelector((state: RootState) =>
    state.layer.present.activeArtboard !== null &&
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setMenuItemTemplate({
      label: 'Image...',
      id: MENU_ITEM_ID,
      enabled: isEnabled,
      accelerator,
      click: {
        id: MENU_ITEM_ID
      }
    });
    (window as any)[MENU_ITEM_ID] = () => {
      dispatch(insertImageThunk());
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
      setImage(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuInsertImage;