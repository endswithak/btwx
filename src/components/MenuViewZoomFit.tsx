import React, { ReactElement, useState, useEffect } from 'react';
import MenuViewZoomFitCanvas from './MenuViewZoomFitCanvas';
import MenuViewZoomFitSelected from './MenuViewZoomFitSelected';
import MenuViewZoomFitArtboard from './MenuViewZoomFitArtboard';

interface MenuViewZoomFitProps {
  setZoomFit(zoomFit: any): void;
}

const MenuViewZoomFit = (props: MenuViewZoomFitProps): ReactElement => {
  const { setZoomFit } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Zoom To'
  });
  const [fitCanvas, setFitCanvas] = useState(undefined);
  const [fitSelected, setFitSelected] = useState(undefined);
  const [fitArtboard, setFitArtboard] = useState(undefined);

  useEffect(() => {
    if (fitCanvas && fitSelected && fitArtboard) {
      setZoomFit({
        ...menuItemTemplate,
        submenu: [fitCanvas, fitSelected, fitArtboard]
      });
    }
  }, [fitCanvas, fitSelected, fitArtboard]);

  return (
    <>
      <MenuViewZoomFitCanvas
        setFitCanvas={setFitCanvas} />
      <MenuViewZoomFitSelected
        setFitSelected={setFitSelected} />
      <MenuViewZoomFitArtboard
        setFitArtboard={setFitArtboard} />
    </>
  );
};

export default MenuViewZoomFit;