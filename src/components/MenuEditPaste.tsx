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
  const [menuItem, setMenuItem] = useState({
    label: 'Copy'
  });
  const [pasteLayers, setPasteLayers] = useState(undefined);
  const [pasteOverSelection, setPasteOverSelection] = useState(undefined);
  const [pasteSVG, setPasteSVG] = useState(undefined);
  const [pasteStyle, setPasteStyle] = useState(undefined);

  useEffect(() => {
    if (pasteLayers && pasteOverSelection && pasteSVG && pasteStyle) {
      setPaste({
        ...menuItem,
        submenu: [pasteLayers, pasteOverSelection, pasteSVG, pasteStyle]
      });
    }
  }, [pasteLayers, pasteOverSelection, pasteSVG, pasteStyle]);

  return (
    <>
      <MenuEditPasteLayers
        setPasteLayers={setPasteLayers} />
      <MenuEditPasteOverSelection
        setPasteOverSelection={setPasteOverSelection} />
      <MenuEditPasteSVG
        setPasteSVG={setPasteSVG} />
      <MenuEditPasteStyle
        setPasteStyle={setPasteStyle} />
    </>
  );
}

export default MenuEditPaste;

// import React, { ReactElement, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState } from '../store/reducers';
// import { pasteLayersThunk } from '../store/actions/layer';
// import MenuItem, { MenuItemProps } from './MenuItem';

// export const MENU_ITEM_ID = 'editPaste';

// const MenuEditPaste = (props: MenuItemProps): ReactElement => {
//   const { menuItem } = props;
//   const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
//   const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
//   const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
//   const canPaste = useSelector((state: RootState) => state.canvasSettings.focusing);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     menuItem.enabled = canPaste && !isResizing && !isDragging && !isDrawing;
//   }, [canPaste, isDragging, isResizing, isDrawing]);

//   useEffect(() => {
//     (window as any)[MENU_ITEM_ID] = (): void => {
//       dispatch(pasteLayersThunk({}));
//     };
//   }, []);

//   return (
//     <></>
//   );
// }

// export default MenuItem(
//   MenuEditPaste,
//   MENU_ITEM_ID
// );