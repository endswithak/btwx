/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { sendSelectedToBackThunk } from '../store/actions/layer';
import { canSendSelectedBackward } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'arrangeSendToBack';

interface MenuArrangeSendToBackProps {
  setSendToBack(sendToBack: any): void;
}

const MenuArrangeSendToBack = (props: MenuArrangeSendToBackProps): ReactElement => {
  const { setSendToBack } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);
  const accelerator = useSelector((state: RootState) => state.keyBindings.arrange.sendToBack);
  const isEnabled = useSelector((state: RootState) =>
    canSendSelectedBackward(state) &&
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setMenuItemTemplate({
      label: 'Send To Back',
      id: MENU_ITEM_ID,
      enabled: isEnabled,
      accelerator,
      click: {
        id: MENU_ITEM_ID
      }
    });
    (window as any)[MENU_ITEM_ID] = () => {
      dispatch(sendSelectedToBackThunk());
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
      setSendToBack(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuArrangeSendToBack;