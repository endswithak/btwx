import React, { ReactElement, useEffect, useState } from 'react';
import MenuEditCopyLayers from './MenuEditCopyLayers';
import MenuEditCopySVG from './MenuEditCopySVG';
import MenuEditCopyStyle from './MenuEditCopyStyle';

interface MenuEditCopyProps {
  setCopy(copy: any): void;
}

const MenuEditCopy = (props: MenuEditCopyProps): ReactElement => {
  const { setCopy } = props;
  const [menuItem, setMenuItem] = useState({
    label: 'Copy'
  });
  const [copyLayers, setCopyLayers] = useState(undefined);
  const [copySVG, setCopySVG] = useState(undefined);
  const [copyStyle, setCopyStyle] = useState(undefined);

  useEffect(() => {
    if (copyLayers && copyStyle && copySVG) {
      setCopy({
        ...menuItem,
        submenu: [copyLayers, copySVG, copyStyle]
      });
    }
  }, [copyLayers, copySVG, copyStyle]);

  return (
    <>
      <MenuEditCopyLayers
        setCopyLayers={setCopyLayers} />
      <MenuEditCopySVG
        setCopySVG={setCopySVG} />
      <MenuEditCopyStyle
        setCopyStyle={setCopyStyle} />
    </>
  );
}

export default MenuEditCopy;

// import React, { ReactElement, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState } from '../store/reducers';
// import { copyLayersThunk } from '../store/actions/layer';
// import MenuItem, { MenuItemProps } from './MenuItem';

// export const MENU_ITEM_ID = 'editCopy';

// const MenuEditCopy = (props: MenuItemProps): ReactElement => {
//   const { menuItem } = props;
//   const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
//   const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
//   const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
//   const canCopy = useSelector((state: RootState) => state.layer.present.selected.length > 0 && state.canvasSettings.focusing);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     menuItem.enabled = canCopy && !isResizing && !isDragging && !isDrawing;
//   }, [canCopy, isDragging, isResizing, isDrawing]);

//   useEffect(() => {
//     (window as any)[MENU_ITEM_ID] = (): void => {
//       dispatch(copyLayersThunk());
//     };
//   }, []);

//   return (
//     <></>
//   );
// }

// export default MenuItem(
//   MenuEditCopy,
//   MENU_ITEM_ID
// );