/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { getSelectedAvailableEventListeners, getSelectedAvailableEventDestinations, getAllArtboardItems } from '../store/selectors/layer';
import { MENU_ITEM_ID } from './MenuLayerAddEvent';

interface MenuLayerEventProps {
  eventListener: Btwx.EventType;
  label: string;
  setEvent(event: any): void;
}

const MenuLayerEvent = (props: MenuLayerEventProps): ReactElement => {
  const { eventListener, label, setEvent } = props;
  const isEnabled = useSelector((state: RootState) =>
    state.layer.present.selected.length > 0 &&
    getSelectedAvailableEventListeners(state).includes(eventListener)
  );
  const artboardItems = useSelector((state: RootState) => getAllArtboardItems(state));
  const availableDestinations = useSelector((state: RootState) => getSelectedAvailableEventDestinations(state));
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);

  const buildSubMenu = () => {
    return availableDestinations.reduce((result: any[], current) => {
      return [
        ...result,
        {
          label: `Go to ${(artboardItems as any)[current].name}`,
          click: {
            id: MENU_ITEM_ID,
            params: {
              destinationArtboard: current,
              event: eventListener,
            }
          }
        }
      ]
    }, []);
  }

  useEffect(() => {
    setMenuItemTemplate({
      label: `On ${label}...`,
      enabled: isEnabled,
      submenu: buildSubMenu()
    });
  }, []);

  useEffect(() => {
    if (menuItemTemplate) {
      setMenuItemTemplate({
        ...menuItemTemplate,
        enabled: isEnabled,
        submenu: buildSubMenu()
      });
    }
  }, [isEnabled, availableDestinations, artboardItems]);

  useEffect(() => {
    if (menuItemTemplate) {
      setEvent(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuLayerEvent;