/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useState } from 'react';
import { remote } from 'electron';

export interface MenuItemProps {
  menuItem: Electron.MenuItem;
}

const MenuItemWrap = (Component: any, id: string): () => ReactElement => {
  const MenuItem = (): ReactElement => {
    const [menuItem, setMenuItem] = useState(remote.Menu.getApplicationMenu().getMenuItemById(id));

    return (
      <Component menuItem={menuItem} />
    );
  }
  return MenuItem;
}

export default MenuItemWrap;