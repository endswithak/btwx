import React, { ReactElement, useState, useEffect } from 'react';
import MenuLayerImageReplace from './MenuLayerImageReplace';
import MenuLayerImageOriginalDimensions from './MenuLayerImageOriginalDimensions';

interface MenuLayerImageProps {
  menu: Electron.Menu;
  setImage(image: any): void;
}

const MenuLayerImage = (props: MenuLayerImageProps): ReactElement => {
  const { menu, setImage } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Image'
  });
  const [replace, setReplace] = useState(undefined);
  const [originalDims, setOriginalDims] = useState(undefined);

  useEffect(() => {
    if (replace && originalDims) {
      setImage({
        ...menuItemTemplate,
        submenu: [replace, originalDims]
      });
    }
  }, [replace, originalDims]);

  return (
    <>
      <MenuLayerImageReplace
        menu={menu}
        setReplace={setReplace} />
      <MenuLayerImageOriginalDimensions
        menu={menu}
        setOriginalDims={setOriginalDims} />
    </>
  );
};

export default MenuLayerImage;