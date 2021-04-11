/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { distributeSelectedHorizontallyThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'arrangeDistributeHorizontally';

interface MenuArrangeDistributeHorizontallyProps {
  setHorizontal(horizontal: any): void;
}

const MenuArrangeDistributeHorizontally = (props: MenuArrangeDistributeHorizontallyProps): ReactElement => {
  const { setHorizontal } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);
  const accelerator = useSelector((state: RootState) => state.keyBindings.arrange.distribute.horizontally);
  const isEnabled = useSelector((state: RootState) =>
    state.layer.present.selected.length >= 3 &&
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setMenuItemTemplate({
      label: 'Horizontally',
      id: MENU_ITEM_ID,
      enabled: isEnabled,
      accelerator,
      click: {
        id: MENU_ITEM_ID
      }
    });
    (window as any)[MENU_ITEM_ID] = () => {
      dispatch(distributeSelectedHorizontallyThunk());
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
      setHorizontal(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuArrangeDistributeHorizontally;