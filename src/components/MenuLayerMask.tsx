import React, { ReactElement, useState, useEffect } from 'react';
import MenuLayerMaskUseAsMask from './MenuLayerMaskUseAsMask';
import MenuLayerMaskIgnoreUnderlyingMask from './MenuLayerMaskIgnoreUnderlyingMask';

interface MenuLayerMaskProps {
  setMask(mask: any): void;
}

const MenuLayerMask = (props: MenuLayerMaskProps): ReactElement => {
  const { setMask } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Mask'
  });
  const [useAsMask, setUseAsMask] = useState(undefined);
  const [ignoreUnderlyingMask, setIgnoreUnderlyingMask] = useState(undefined);

  useEffect(() => {
    if (useAsMask && ignoreUnderlyingMask) {
      setMask({
        ...menuItemTemplate,
        submenu: [
          useAsMask,
          ignoreUnderlyingMask
        ]
      });
    }
  }, [useAsMask, ignoreUnderlyingMask]);

  return (
    <>
      <MenuLayerMaskUseAsMask
        setUseAsMask={setUseAsMask} />
      <MenuLayerMaskIgnoreUnderlyingMask
        setIgnoreUnderlyingMask={setIgnoreUnderlyingMask} />
    </>
  );
};

export default MenuLayerMask;