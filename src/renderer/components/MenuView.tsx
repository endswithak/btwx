import React, { ReactElement, useState, useEffect } from 'react';
import MenuViewZoomIn from './MenuViewZoomIn';
import MenuViewZoomOut from './MenuViewZoomOut';
import MenuViewZoomFit from './MenuViewZoomFit';
import MenuViewCenterSelected from './MenuViewCenterSelected';
import MenuViewShowLayers from './MenuViewShowLayers';
import MenuViewShowStyles from './MenuViewShowStyles';
import MenuViewShowEvents from './MenuViewShowEvents';

interface MenuViewProps {
  setView(view: any): void;
}

const MenuView = (props: MenuViewProps): ReactElement => {
  const { setView } = props;
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
        setZoomIn={setZoomIn} />
      <MenuViewZoomOut
        setZoomOut={setZoomOut} />
      <MenuViewZoomFit
        setZoomFit={setZoomFit} />
      <MenuViewCenterSelected
        setCenter={setCenter} />
      <MenuViewShowLayers
        setShowLayers={setShowLayers} />
      <MenuViewShowStyles
        setShowStyles={setShowStyles} />
      <MenuViewShowEvents
        setShowEvents={setShowEvents} />
    </>
  );
};

export default MenuView;