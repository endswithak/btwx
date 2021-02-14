import React, { ReactElement, useState, useEffect } from 'react';
import MenuViewZoomIn from './MenuViewZoomIn';
import MenuViewZoomOut from './MenuViewZoomOut';
import MenuViewZoomFit from './MenuViewZoomFit';
import MenuViewCenterSelected from './MenuViewCenterSelected';
import MenuViewShowLayers from './MenuViewShowLayers';
import MenuViewShowStyles from './MenuViewShowStyles';
import MenuViewShowEvents from './MenuViewShowEvents';

interface MenuViewProps {
  menu: Electron.Menu;
  setView(view: any): void;
}

const MenuView = (props: MenuViewProps): ReactElement => {
  const { menu, setView } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'View'
  });
  const [zoomIn, setZoomIn] = useState(undefined);
  const [zoomOut, setZoomOut] = useState(undefined);
  const [zoomFit, setZoomFit] = useState(undefined);
  const [center, setCenter] = useState(undefined);
  const [showLayers, setShowLayers] = useState(undefined);
  const [showStyles, setShowStyles] = useState(undefined);
  const [showEvents, setShowEvents] = useState(undefined);

  useEffect(() => {
    if (zoomIn && zoomOut && zoomFit && center && showLayers && showStyles && showEvents) {
      setView({
        ...menuItemTemplate,
        submenu: [
          zoomIn,
          zoomOut,
          zoomFit,
          { type: 'separator' },
          center,
          { type: 'separator' },
          showLayers,
          showStyles,
          showEvents,
          { type: 'separator' },
          { role: 'toggledevtools' },
          { type: 'separator' },
          { role: 'togglefullscreen' }
        ]
      });
    }
  }, [zoomIn, zoomOut, zoomFit, center, showLayers, showStyles, showEvents]);

  return (
    <>
      <MenuViewZoomIn
        menu={menu}
        setZoomIn={setZoomIn} />
      <MenuViewZoomOut
        menu={menu}
        setZoomOut={setZoomOut} />
      <MenuViewZoomFit
        menu={menu}
        setZoomFit={setZoomFit} />
      <MenuViewCenterSelected
        menu={menu}
        setCenter={setCenter} />
      <MenuViewShowLayers
        menu={menu}
        setShowLayers={setShowLayers} />
      <MenuViewShowStyles
        menu={menu}
        setShowStyles={setShowStyles} />
      <MenuViewShowEvents
        menu={menu}
        setShowEvents={setShowEvents} />
    </>
  );
};

export default MenuView;