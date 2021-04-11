/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { removeLayerEvent } from '../store/actions/layer';

export const MENU_ITEM_ID = 'eventDelete';

interface MenuEventDeleteProps {
  setEventDelete(eventDelete: any): void;
}

const MenuEventDelete = (props: MenuEventDeleteProps): ReactElement => {
  const { setEventDelete } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);
  const event = useSelector((state: RootState) => state.contextMenu.id);
  const dispatch = useDispatch();

  useEffect(() => {
    setMenuItemTemplate({
      label: 'Delete',
      id: MENU_ITEM_ID,
      click: {
        id: MENU_ITEM_ID
      }
    });
  }, []);

  useEffect(() => {
    if (event) {
      (window as any)[MENU_ITEM_ID] = () => {
        dispatch(removeLayerEvent({id: event as string}));
      }
    }
  }, [event]);

  useEffect(() => {
    if (menuItemTemplate) {
      setEventDelete(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuEventDelete;