import React, { ReactElement, useState, useEffect } from 'react';
import MenuArrangeAlignLeft from './MenuArrangeAlignLeft';
import MenuArrangeAlignHorizontally from './MenuArrangeAlignHorizontally';
import MenuArrangeAlignRight from './MenuArrangeAlignRight';
import MenuArrangeAlignTop from './MenuArrangeAlignTop';
import MenuArrangeAlignVertically from './MenuArrangeAlignVertically';
import MenuArrangeAlignBottom from './MenuArrangeAlignBottom';

interface MenuArrangeAlignProps {
  menu: Electron.Menu;
  setAlign(align: any): void;
}

const MenuArrangeAlign = (props: MenuArrangeAlignProps): ReactElement => {
  const { menu, setAlign } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Align'
  });
  const [left, setLeft] = useState(undefined);
  const [center, setCenter] = useState(undefined);
  const [right, setRight] = useState(undefined);
  const [top, setTop] = useState(undefined);
  const [middle, setMiddle] = useState(undefined);
  const [bottom, setBottom] = useState(undefined);

  useEffect(() => {
    if (left && center && right && top && middle && bottom) {
      setAlign({
        ...menuItemTemplate,
        submenu: [
          left,
          center,
          right,
          { type: 'separator' },
          top,
          middle,
          bottom
        ]
      });
    }
  }, [left, center, right, top, middle, bottom]);

  return (
    <>
      <MenuArrangeAlignLeft
        menu={menu}
        setLeft={setLeft} />
      <MenuArrangeAlignHorizontally
        menu={menu}
        setCenter={setCenter} />
      <MenuArrangeAlignRight
        menu={menu}
        setRight={setRight} />
      <MenuArrangeAlignTop
        menu={menu}
        setTop={setTop} />
      <MenuArrangeAlignVertically
        menu={menu}
        setMiddle={setMiddle} />
      <MenuArrangeAlignBottom
        menu={menu}
        setBottom={setBottom} />
    </>
  );
};

export default MenuArrangeAlign;