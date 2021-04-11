import React, { ReactElement, useState, useEffect } from 'react';
import MenuArrangeAlignLeft from './MenuArrangeAlignLeft';
import MenuArrangeAlignHorizontally from './MenuArrangeAlignHorizontally';
import MenuArrangeAlignRight from './MenuArrangeAlignRight';
import MenuArrangeAlignTop from './MenuArrangeAlignTop';
import MenuArrangeAlignVertically from './MenuArrangeAlignVertically';
import MenuArrangeAlignBottom from './MenuArrangeAlignBottom';

interface MenuArrangeAlignProps {
  setAlign(align: any): void;
}

const MenuArrangeAlign = (props: MenuArrangeAlignProps): ReactElement => {
  const { setAlign } = props;
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
        setLeft={setLeft} />
      <MenuArrangeAlignHorizontally
        setCenter={setCenter} />
      <MenuArrangeAlignRight
        setRight={setRight} />
      <MenuArrangeAlignTop
        setTop={setTop} />
      <MenuArrangeAlignVertically
        setMiddle={setMiddle} />
      <MenuArrangeAlignBottom
        setBottom={setBottom} />
    </>
  );
};

export default MenuArrangeAlign;