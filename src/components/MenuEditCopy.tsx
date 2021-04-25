import React, { ReactElement, useEffect, useState } from 'react';
import MenuEditCopyLayers from './MenuEditCopyLayers';
import MenuEditCopySVG from './MenuEditCopySVG';
import MenuEditCopyStyle from './MenuEditCopyStyle';

interface MenuEditCopyProps {
  setCopy(copy: any): void;
}

const MenuEditCopy = (props: MenuEditCopyProps): ReactElement => {
  const { setCopy } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Copy'
  });
  const [copyLayers, setCopyLayers] = useState(undefined);
  // const [copySVG, setCopySVG] = useState(undefined);
  const [copyStyle, setCopyStyle] = useState(undefined);

  useEffect(() => {
    if (copyLayers && copyStyle) {
      setCopy({
        ...menuItemTemplate,
        submenu: [copyLayers, copyStyle]
      });
    }
  }, [copyLayers, copyStyle]);

  return (
    <>
      <MenuEditCopyLayers
        setCopyLayers={setCopyLayers} />
      {/* <MenuEditCopySVG
        setCopySVG={setCopySVG} /> */}
      <MenuEditCopyStyle
        setCopyStyle={setCopyStyle} />
    </>
  );
}

export default MenuEditCopy;