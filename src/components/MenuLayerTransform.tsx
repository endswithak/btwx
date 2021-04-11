/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import MenuLayerTransformFlipHorizontally from './MenuLayerTransformFlipHorizontally';
import MenuLayerTransformFlipVertically from './MenuLayerTransformFlipVertically';

interface MenuLayerTransformProps {
  setTransform(transform: any): void;
}

const MenuLayerTransform = (props: MenuLayerTransformProps): ReactElement => {
  const { setTransform } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Transform'
  });
  const [horizontalFlip, setHorizontalFlip] = useState(undefined);
  const [verticalFlip, setVerticalFlip] = useState(undefined);

  useEffect(() => {
    if (horizontalFlip && verticalFlip) {
      setTransform({
        ...menuItemTemplate,
        submenu: [horizontalFlip, verticalFlip]
      });
    }
  }, [horizontalFlip, verticalFlip]);

  return (
    <>
      <MenuLayerTransformFlipHorizontally
        setHorizontalFlip={setHorizontalFlip} />
      <MenuLayerTransformFlipVertically
        setVerticalFlip={setVerticalFlip} />
    </>
  );
};

export default MenuLayerTransform;