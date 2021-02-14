import React, { ReactElement, useEffect, useState } from 'react';
import MenuEditPasteLayers from './MenuEditPasteLayers';
import MenuEditPasteOverSelection from './MenuEditPasteOverSelection';
import MenuEditPasteSVG from './MenuEditPasteSVG';
import MenuEditPasteStyle from './MenuEditPasteStyle';

interface MenuEditPasteProps {
  menu: Electron.Menu;
  setPaste(paste: any): void;
}

const MenuEditPaste = (props: MenuEditPasteProps): ReactElement => {
  const { menu, setPaste } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Paste'
  });
  const [pasteLayers, setPasteLayers] = useState(undefined);
  const [pasteOverSelection, setPasteOverSelection] = useState(undefined);
  const [pasteSVG, setPasteSVG] = useState(undefined);
  const [pasteStyle, setPasteStyle] = useState(undefined);

  useEffect(() => {
    if (pasteLayers && pasteOverSelection && pasteSVG && pasteStyle) {
      setPaste({
        ...menuItemTemplate,
        submenu: [pasteLayers, pasteOverSelection, pasteSVG, pasteStyle]
      });
    }
  }, [pasteLayers, pasteOverSelection, pasteSVG, pasteStyle]);

  return (
    <>
      <MenuEditPasteLayers
        menu={menu}
        setPasteLayers={setPasteLayers} />
      <MenuEditPasteOverSelection
        menu={menu}
        setPasteOverSelection={setPasteOverSelection} />
      <MenuEditPasteSVG
        menu={menu}
        setPasteSVG={setPasteSVG} />
      <MenuEditPasteStyle
        menu={menu}
        setPasteStyle={setPasteStyle} />
    </>
  );
}

export default MenuEditPaste;