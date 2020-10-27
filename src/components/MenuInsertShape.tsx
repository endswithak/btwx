import React, { ReactElement } from 'react';
import MenuInsertShapeRectangle from './MenuInsertShapeRectangle';
import MenuInsertShapeRounded from './MenuInsertShapeRounded';
import MenuInsertShapeEllipse from './MenuInsertShapeEllipse';
import MenuInsertShapeStar from './MenuInsertShapeStar';
import MenuInsertShapePolygon from './MenuInsertShapePolygon';
import MenuInsertShapeLine from './MenuInsertShapeLine';

const MenuInsertShape = (): ReactElement => (
  <>
    <MenuInsertShapeRectangle />
    <MenuInsertShapeRounded />
    <MenuInsertShapeEllipse />
    <MenuInsertShapeStar />
    <MenuInsertShapePolygon />
    <MenuInsertShapeLine />
  </>
);

export default MenuInsertShape;