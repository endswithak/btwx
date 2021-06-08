/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { getSelectedRight } from '../store/selectors/layer';
import { alignSelectedToRightThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'arrangeAlignRight';

interface MenuArrangeAlignRightProps {
  setRight(right: any): void;
}

const MenuArrangeAlignRight = (props: MenuArrangeAlignRightProps): ReactElement => {
  const { setRight } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);
  const accelerator = useSelector((state: RootState) => state.keyBindings.arrange.align.right);
  const isEnabled = useSelector((state: RootState) =>
    state.layer.present.selected.length >= 2 &&
    getSelectedRight(state) === 'multi'
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setMenuItemTemplate({
      label: 'Right',
      id: MENU_ITEM_ID,
      enabled: isEnabled,
      accelerator,
      click: {
        id: MENU_ITEM_ID
      }
    });
    (window as any)[MENU_ITEM_ID] = () => {
      dispatch(alignSelectedToRightThunk());
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
      setRight(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuArrangeAlignRight;