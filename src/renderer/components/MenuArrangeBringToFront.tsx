/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { bringSelectedToFrontThunk } from '../store/actions/layer';
import { canBringSelectedForward } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'arrangeBringToFront';

interface MenuArrangeBringToFrontProps {
  setBringToFront(bringToFront: any): void;
}

const MenuArrangeBringToFront = (props: MenuArrangeBringToFrontProps): ReactElement => {
  const { setBringToFront } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);
  const accelerator = useSelector((state: RootState) => state.keyBindings.arrange.bringToFront);
  const isEnabled = useSelector((state: RootState) =>
    canBringSelectedForward(state) &&
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setMenuItemTemplate({
      label: 'Bring To Front',
      id: MENU_ITEM_ID,
      enabled: isEnabled,
      accelerator,
      click: {
        id: MENU_ITEM_ID
      }
    });
    (window as any)[MENU_ITEM_ID] = () => {
      dispatch(bringSelectedToFrontThunk());
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
      setBringToFront(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuArrangeBringToFront;