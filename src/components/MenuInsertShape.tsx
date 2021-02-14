import React, { ReactElement, useState, useEffect } from 'react';
import MenuInsertShapeRectangle from './MenuInsertShapeRectangle';
import MenuInsertShapeRounded from './MenuInsertShapeRounded';
import MenuInsertShapeEllipse from './MenuInsertShapeEllipse';
import MenuInsertShapeStar from './MenuInsertShapeStar';
import MenuInsertShapePolygon from './MenuInsertShapePolygon';
import MenuInsertShapeLine from './MenuInsertShapeLine';

interface MenuInsertShapeProps {
  setShape(shape: any): void;
}

const MenuInsertShape = (props: MenuInsertShapeProps): ReactElement => {
  const { setShape } = props;
  const [menuItem, setMenuItem] = useState({
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
        ...menuItem,
        submenu: [rectangle, rounded, ellipse, star, polygon, line]
      });
    }
  }, [rectangle, rounded, ellipse, star, polygon, line]);

  return (
    <>
      <MenuInsertShapeRectangle
        setRectangle={setRectangle} />
      <MenuInsertShapeRounded
        setRounded={setRounded} />
      <MenuInsertShapeEllipse
        setEllipse={setEllipse} />
      <MenuInsertShapeStar
        setStar={setStar} />
      <MenuInsertShapePolygon
        setPolygon={setPolygon} />
      <MenuInsertShapeLine
        setLine={setLine} />
    </>
  );
};

export default MenuInsertShape;

// import React, { ReactElement } from 'react';
// import MenuInsertShapeRectangle from './MenuInsertShapeRectangle';
// import MenuInsertShapeRounded from './MenuInsertShapeRounded';
// import MenuInsertShapeEllipse from './MenuInsertShapeEllipse';
// import MenuInsertShapeStar from './MenuInsertShapeStar';
// import MenuInsertShapePolygon from './MenuInsertShapePolygon';
// import MenuInsertShapeLine from './MenuInsertShapeLine';

// const MenuInsertShape = (): ReactElement => (
//   <>
//     <MenuInsertShapeRectangle />
//     <MenuInsertShapeRounded />
//     <MenuInsertShapeEllipse />
//     <MenuInsertShapeStar />
//     <MenuInsertShapePolygon />
//     <MenuInsertShapeLine />
//   </>
// );

// export default MenuInsertShape;