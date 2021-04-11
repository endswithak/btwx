/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { getSelectedBottom } from '../store/selectors/layer';
import { alignSelectedToBottomThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'arrangeAlignBottom';

interface MenuArrangeAlignBottomProps {
  setBottom(bottom: any): void;
}

const MenuArrangeAlignBottom = (props: MenuArrangeAlignBottomProps): ReactElement => {
  const { setBottom } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);
  const accelerator = useSelector((state: RootState) => state.keyBindings.arrange.align.bottom);
  const isEnabled = useSelector((state: RootState) =>
    state.layer.present.selected.length >= 2 &&
    getSelectedBottom(state) === 'multi'
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setMenuItemTemplate({
      label: 'Bottom',
      id: MENU_ITEM_ID,
      enabled: isEnabled,
      click: {
        id: MENU_ITEM_ID
      },
      accelerator
    });
    (window as any)[MENU_ITEM_ID] = () => {
      dispatch(alignSelectedToBottomThunk());
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
      setBottom(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuArrangeAlignBottom;