import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import MenuInsert from './MenuInsert';
import MenuApp from './MenuApp';
import MenuFile from './MenuFile';
import MenuEdit from './MenuEdit';
import MenuLayer from './MenuLayer';
import MenuArrange from './MenuArrange';
import MenuView from './MenuView';

const Menu = (): ReactElement => {
  const ready = useSelector((state: RootState) => state.canvasSettings.ready);

  return (
    ready
    ? <>
        <MenuApp />
        <MenuFile />
        <MenuEdit />
        <MenuInsert />
        <MenuLayer />
        <MenuArrange />
        <MenuView />
      </>
    : null
  )
}

export default Menu;