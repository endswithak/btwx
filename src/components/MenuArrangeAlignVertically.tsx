/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { getSelectedMiddle } from '../store/selectors/layer';
import { alignSelectedToMiddleThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'arrangeAlignVertically';

interface MenuArrangeAlignVerticallyProps {
  setMiddle(middle: any): void;
}

const MenuArrangeAlignVertically = (props: MenuArrangeAlignVerticallyProps): ReactElement => {
  const { setMiddle } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);
  const accelerator = useSelector((state: RootState) => state.keyBindings.arrange.align.middle);
  const isEnabled = useSelector((state: RootState) =>
    state.layer.present.selected.length >= 2 &&
    getSelectedMiddle(state) === 'multi'
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
      dispatch(alignSelectedToMiddleThunk());
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
      setMiddle(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuArrangeAlignVertically;