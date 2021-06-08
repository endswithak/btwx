/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleEventDrawerThunk } from '../store/actions/viewSettings';

export const MENU_ITEM_ID = 'viewShowEvents';

interface MenuViewShowEventsProps {
  setShowEvents(showEvents: any): void;
}

const MenuViewShowEvents = (props: MenuViewShowEventsProps): ReactElement => {
  const { setShowEvents } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);
  const accelerator = useSelector((state: RootState) => state.keyBindings.view.showEvents);
  const isEnabled = useSelector((state: RootState) =>
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const isChecked = useSelector((state: RootState) => state.viewSettings.eventDrawer.isOpen);
  const dispatch = useDispatch();

  useEffect(() => {
    setMenuItemTemplate({
      label: 'Show Styles',
      id: MENU_ITEM_ID,
      type: 'checkbox',
      checked: isChecked,
      enabled: isEnabled,
      accelerator,
      click: {
        id: MENU_ITEM_ID
      }
    });
    (window as any)[MENU_ITEM_ID] = () => {
      dispatch(toggleEventDrawerThunk());
    }
  }, []);

  useEffect(() => {
    if (menuItemTemplate) {
      setMenuItemTemplate({
        ...menuItemTemplate,
        enabled: isEnabled,
        checked: isChecked,
        accelerator
      });
    }
  }, [isEnabled, isChecked, accelerator]);

  useEffect(() => {
    if (menuItemTemplate) {
      setShowEvents(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuViewShowEvents;