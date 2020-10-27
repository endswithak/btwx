import React, { ReactElement } from 'react';
import MenuFileSave from './MenuFileSave';
import MenuFileSaveAs from './MenuFileSaveAs';
import MenuFileOpen from './MenuFileOpen';

const MenuFile = (): ReactElement => (
  <>
    <MenuFileSave />
    <MenuFileSaveAs />
    <MenuFileOpen />
  </>
);

export default MenuFile;