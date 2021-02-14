import React, { ReactElement, useState, useEffect } from 'react';
import MenuLayerStyleFill from './MenuLayerStyleFill';
import MenuLayerStyleStroke from './MenuLayerStyleStroke';
import MenuLayerStyleShadow from './MenuLayerStyleShadow';

interface MenuLayerStyleProps {
  menu: Electron.Menu;
  setStyle(style: any): void;
}

const MenuLayerStyle = (props: MenuLayerStyleProps): ReactElement => {
  const { menu, setStyle } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Style'
  });
  const [fill, setFill] = useState(undefined);
  const [stroke, setStroke] = useState(undefined);
  const [shadow, setShadow] = useState(undefined);

  useEffect(() => {
    if (fill && stroke && shadow) {
      setStyle({
        ...menuItemTemplate,
        submenu: [fill, stroke, shadow]
      });
    }
  }, [fill, stroke, shadow]);

  return (
    <>
      <MenuLayerStyleFill
        menu={menu}
        setFill={setFill} />
      <MenuLayerStyleStroke
        menu={menu}
        setStroke={setStroke} />
      <MenuLayerStyleShadow
        menu={menu}
        setShadow={setShadow} />
    </>
  );
};

export default MenuLayerStyle;