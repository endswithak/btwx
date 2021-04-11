/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { distributeSelectedVerticallyThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'arrangeDistributeVertically';

interface MenuArrangeDistributeVerticallyProps {
  setVertical(vertical: any): void;
}

const MenuArrangeDistributeVertically = (props: MenuArrangeDistributeVerticallyProps): ReactElement => {
  const { setVertical } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);
  const accelerator = useSelector((state: RootState) => state.keyBindings.arrange.distribute.vertically);
  const isEnabled = useSelector((state: RootState) =>
    state.layer.present.selected.length >= 3 &&
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setMenuItemTemplate({
      label: 'Vertically',
      id: MENU_ITEM_ID,
      enabled: isEnabled,
      accelerator,
      click: {
        id: MENU_ITEM_ID
      }
    });
    (window as any)[MENU_ITEM_ID] = () => {
      dispatch(distributeSelectedVerticallyThunk());
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
      setVertical(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuArrangeDistributeVertically;