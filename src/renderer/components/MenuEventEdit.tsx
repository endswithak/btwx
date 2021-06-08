/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setEventDrawerEventThunk } from '../store/actions/eventDrawer';

export const MENU_ITEM_ID = 'eventEdit';

interface MenuEventEditProps {
  setEventEdit(eventEdit: any): void;
}

const MenuEventEdit = (props: MenuEventEditProps): ReactElement => {
  const { setEventEdit } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);
  const event = useSelector((state: RootState) => state.contextMenu.id);
  const dispatch = useDispatch();

  useEffect(() => {
    setMenuItemTemplate({
      label: 'Edit',
      id: MENU_ITEM_ID,
      click: {
        id: MENU_ITEM_ID
      }
    });
  }, []);

  useEffect(() => {
    if (event) {
      (window as any)[MENU_ITEM_ID] = () => {
        dispatch(setEventDrawerEventThunk({id: event as string}));
      }
    }
  }, [event]);

  useEffect(() => {
    if (menuItemTemplate) {
      setEventEdit(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuEventEdit;