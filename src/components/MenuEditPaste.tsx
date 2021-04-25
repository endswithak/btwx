import React, { ReactElement, useEffect, useState } from 'react';
import MenuEditPasteLayers from './MenuEditPasteLayers';
import MenuEditPasteOverSelection from './MenuEditPasteOverSelection';
import MenuEditPasteSVG from './MenuEditPasteSVG';
import MenuEditPasteStyle from './MenuEditPasteStyle';

interface MenuEditPasteProps {
  setPaste(paste: any): void;
}

const MenuEditPaste = (props: MenuEditPasteProps): ReactElement => {
  const { setPaste } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Paste'
  });
  const [pasteLayers, setPasteLayers] = useState(undefined);
  const [pasteOverSelection, setPasteOverSelection] = useState(undefined);
  // const [pasteSVG, setPasteSVG] = useState(undefined);
  const [pasteStyle, setPasteStyle] = useState(undefined);

  useEffect(() => {
    if (pasteLayers && pasteOverSelection && pasteStyle) {
      setPaste({
        ...menuItemTemplate,
        submenu: [pasteLayers, pasteOverSelection, pasteStyle]
      });
    }
  }, [pasteLayers, pasteOverSelection, pasteStyle]);

  return (
    <>
      <MenuEditPasteLayers
        setPasteLayers={setPasteLayers} />
      <MenuEditPasteOverSelection
        setPasteOverSelection={setPasteOverSelection} />
      {/* <MenuEditPasteSVG
        setPasteSVG={setPasteSVG} /> */}
      <MenuEditPasteStyle
        setPasteStyle={setPasteStyle} />
    </>
  );
}

export default MenuEditPaste;