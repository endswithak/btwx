/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { replaceSelectedImagesThunk } from '../store/actions/layer';
import { canReplaceSelectedImages } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'layerImageReplace';

interface MenuLayerImageReplaceProps {
  setReplace(replace: any): void;
}

const MenuLayerImageReplace = (props: MenuLayerImageReplaceProps): ReactElement => {
  const { setReplace } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);
  const accelerator = useSelector((state: RootState) => state.keyBindings.layer.image.replace);
  const isEnabled = useSelector((state: RootState) =>
    canReplaceSelectedImages(state) &&
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setMenuItemTemplate({
      label: 'Replace...',
      id: MENU_ITEM_ID,
      enabled: isEnabled,
      accelerator,
      click: {
        id: MENU_ITEM_ID
      }
    });
    (window as any)[MENU_ITEM_ID] = () => {
      dispatch(replaceSelectedImagesThunk());
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
      setReplace(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuLayerImageReplace;