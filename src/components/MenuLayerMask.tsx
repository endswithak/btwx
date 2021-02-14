import React, { ReactElement, useState, useEffect } from 'react';
import MenuLayerMaskUseAsMask from './MenuLayerMaskUseAsMask';
import MenuLayerMaskIgnoreUnderlyingMask from './MenuLayerMaskIgnoreUnderlyingMask';

interface MenuLayerMaskProps {
  menu: Electron.Menu;
  setMask(mask: any): void;
}

const MenuLayerMask = (props: MenuLayerMaskProps): ReactElement => {
  const { menu, setMask } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Mask'
  });
  const [useAsMask, setUseAsMask] = useState(undefined);
  const [ignore, setIgnore] = useState(undefined);

  useEffect(() => {
    if (useAsMask && ignore) {
      setMask({
        ...menuItemTemplate,
        submenu: [useAsMask, ignore]
      });
    }
  }, [useAsMask, ignore]);

  return (
    <>
      <MenuLayerMaskUseAsMask
        menu={menu}
        setUseAsMask={setUseAsMask} />
      <MenuLayerMaskIgnoreUnderlyingMask
        menu={menu}
        setIgnore={setIgnore} />
    </>
  );
};

export default MenuLayerMask;