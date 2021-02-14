import React, { ReactElement, useState, useEffect } from 'react';
import MenuInsertShapeRectangle from './MenuInsertShapeRectangle';
import MenuInsertShapeRounded from './MenuInsertShapeRounded';
import MenuInsertShapeEllipse from './MenuInsertShapeEllipse';
import MenuInsertShapeStar from './MenuInsertShapeStar';
import MenuInsertShapePolygon from './MenuInsertShapePolygon';
import MenuInsertShapeLine from './MenuInsertShapeLine';

interface MenuInsertShapeProps {
  menu: Electron.Menu;
  setShape(shape: any): void;
}

const MenuInsertShape = (props: MenuInsertShapeProps): ReactElement => {
  const { menu, setShape } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Shape'
  });
  const [rectangle, setRectangle] = useState(undefined);
  const [rounded, setRounded] = useState(undefined);
  const [ellipse, setEllipse] = useState(undefined);
  const [star, setStar] = useState(undefined);
  const [polygon, setPolygon] = useState(undefined);
  const [line, setLine] = useState(undefined);

  useEffect(() => {
    if (rectangle && rounded && ellipse && star && polygon && line) {
      setShape({
        ...menuItemTemplate,
        submenu: [rectangle, rounded, ellipse, star, polygon, line]
      });
    }
  }, [rectangle, rounded, ellipse, star, polygon, line]);

  return (
    <>
      <MenuInsertShapeRectangle
        menu={menu}
        setRectangle={setRectangle} />
      <MenuInsertShapeRounded
        menu={menu}
        setRounded={setRounded} />
      <MenuInsertShapeEllipse
        menu={menu}
        setEllipse={setEllipse} />
      <MenuInsertShapeStar
        menu={menu}
        setStar={setStar} />
      <MenuInsertShapePolygon
        menu={menu}
        setPolygon={setPolygon} />
      <MenuInsertShapeLine
        menu={menu}
        setLine={setLine} />
    </>
  );
};

export default MenuInsertShape;