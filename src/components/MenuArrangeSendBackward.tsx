/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { sendSelectedBackwardThunk } from '../store/actions/layer';
import { canSendSelectedBackward } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'arrangeSendBackward';

interface MenuArrangeSendBackwardProps {
  menu: Electron.Menu;
  setSendBackward(sendBackward: any): void;
}

const MenuArrangeSendBackward = (props: MenuArrangeSendBackwardProps): ReactElement => {
  const { menu, setSendBackward } = props;
  const accelerator = useSelector((state: RootState) => state.keyBindings.arrange.sendBackward);
  const isEnabled = useSelector((state: RootState) =>
    canSendSelectedBackward(state) &&
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Send Backward',
    id: MENU_ITEM_ID,
    enabled: isEnabled,
    accelerator,
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(sendSelectedBackwardThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const dispatch = useDispatch();

  useEffect(() => {
    setSendBackward(menuItemTemplate);
  }, [menuItemTemplate]);

  useEffect(() => {
    if (menu) {
      setMenuItem(menu.getMenuItemById(MENU_ITEM_ID));
    }
  }, [menu]);

  useEffect(() => {
    if (menuItem) {
      menuItem.enabled = isEnabled;
    }
  }, [isEnabled]);

  return (
    <></>
  );
}

export default MenuArrangeSendBackward;