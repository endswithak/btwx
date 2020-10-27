import React, { ReactElement } from 'react';
import MenuInsertArtboard from './MenuInsertArtboard';
import MenuInsertShape from './MenuInsertShape';
import MenuInsertText from './MenuInsertText';
import MenuInsertImage from './MenuInsertImage';

const MenuInsert = (): ReactElement => (
  <>
    <MenuInsertArtboard />
    <MenuInsertShape />
    <MenuInsertText />
    <MenuInsertImage />
  </>
);

export default MenuInsert;