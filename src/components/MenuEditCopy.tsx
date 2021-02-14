import React, { ReactElement, useEffect, useState } from 'react';
import MenuEditCopyLayers from './MenuEditCopyLayers';
import MenuEditCopySVG from './MenuEditCopySVG';
import MenuEditCopyStyle from './MenuEditCopyStyle';

interface MenuEditCopyProps {
  menu: Electron.Menu;
  setCopy(copy: any): void;
}

const MenuEditCopy = (props: MenuEditCopyProps): ReactElement => {
  const { menu, setCopy } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Copy'
  });
  const [copyLayers, setCopyLayers] = useState(undefined);
  const [copySVG, setCopySVG] = useState(undefined);
  const [copyStyle, setCopyStyle] = useState(undefined);

  useEffect(() => {
    if (copyLayers && copyStyle && copySVG) {
      setCopy({
        ...menuItemTemplate,
        submenu: [copyLayers, copySVG, copyStyle]
      });
    }
  }, [copyLayers, copySVG, copyStyle]);

  return (
    <>
      <MenuEditCopyLayers
        menu={menu}
        setCopyLayers={setCopyLayers} />
      <MenuEditCopySVG
        menu={menu}
        setCopySVG={setCopySVG} />
      <MenuEditCopyStyle
        menu={menu}
        setCopyStyle={setCopyStyle} />
    </>
  );
}

export default MenuEditCopy;