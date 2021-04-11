/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { canUngroupSelected } from '../store/selectors/layer';
import { ungroupSelectedThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'arrangeUngroup';

interface MenuArrangeUngroupProps {
  setUngroup(ungroup: any): void;
}

const MenuArrangeUngroup = (props: MenuArrangeUngroupProps): ReactElement => {
  const { setUngroup } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);
  const accelerator = useSelector((state: RootState) => state.keyBindings.arrange.ungroup);
  const isEnabled = useSelector((state: RootState) =>
    canUngroupSelected(state) &&
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setMenuItemTemplate({
      label: 'Ungroup',
      id: MENU_ITEM_ID,
      enabled: isEnabled,
      accelerator,
      click: {
        id: MENU_ITEM_ID
      }
    });
    (window as any)[MENU_ITEM_ID] = () => {
      dispatch(ungroupSelectedThunk());
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
      setUngroup(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuArrangeUngroup;