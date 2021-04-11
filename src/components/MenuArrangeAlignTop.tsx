/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { getSelectedTop } from '../store/selectors/layer';
import { alignSelectedToTopThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'arrangeAlignTop';

interface MenuArrangeAlignTopProps {
  setTop(top: any): void;
}

const MenuArrangeAlignTop = (props: MenuArrangeAlignTopProps): ReactElement => {
  const { setTop } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);
  const accelerator = useSelector((state: RootState) => state.keyBindings.arrange.align.top);
  const isEnabled = useSelector((state: RootState) =>
    state.layer.present.selected.length >= 2 &&
    getSelectedTop(state) === 'multi'
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setMenuItemTemplate({
      label: 'Top',
      id: MENU_ITEM_ID,
      enabled: isEnabled,
      accelerator,
      click: {
        id: MENU_ITEM_ID
      }
    });
    (window as any)[MENU_ITEM_ID] = () => {
      dispatch(alignSelectedToTopThunk());
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
      setTop(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuArrangeAlignTop;