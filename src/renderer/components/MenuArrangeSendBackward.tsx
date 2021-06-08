/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { sendSelectedBackwardThunk } from '../store/actions/layer';
import { canSendSelectedBackward } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'arrangeSendBackward';

interface MenuArrangeSendBackwardProps {
  setSendBackward(sendBackward: any): void;
}

const MenuArrangeSendBackward = (props: MenuArrangeSendBackwardProps): ReactElement => {
  const { setSendBackward } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);
  const accelerator = useSelector((state: RootState) => state.keyBindings.arrange.sendBackward);
  const isEnabled = useSelector((state: RootState) =>
    canSendSelectedBackward(state) &&
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setMenuItemTemplate({
      label: 'Send Backward',
      id: MENU_ITEM_ID,
      enabled: isEnabled,
      accelerator,
      click: {
        id: MENU_ITEM_ID
      }
    });
    (window as any)[MENU_ITEM_ID] = () => {
      dispatch(sendSelectedBackwardThunk());
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
      setSendBackward(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuArrangeSendBackward;