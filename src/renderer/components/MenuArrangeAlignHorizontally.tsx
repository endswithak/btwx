/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { getSelectedCenter } from '../store/selectors/layer';
import { alignSelectedToCenterThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'arrangeAlignHorizontally';

interface MenuArrangeAlignHorizontallyProps {
  setCenter(center: any): void;
}

const MenuArrangeAlignHorizontally = (props: MenuArrangeAlignHorizontallyProps): ReactElement => {
  const { setCenter } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);
  const accelerator = useSelector((state: RootState) => state.keyBindings.arrange.align.center);
  const isEnabled = useSelector((state: RootState) =>
    state.layer.present.selected.length >= 2 &&
    getSelectedCenter(state) === 'multi'
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setMenuItemTemplate({
      label: 'Horizontally',
      id: MENU_ITEM_ID,
      enabled: isEnabled,
      click: {
        id: MENU_ITEM_ID
      },
      accelerator
    });
    (window as any)[MENU_ITEM_ID] = () => {
      dispatch(alignSelectedToCenterThunk());
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
      setCenter(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuArrangeAlignHorizontally;