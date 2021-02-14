import React, { ReactElement, useState, useEffect } from 'react';
import MenuLayerStyle from './MenuLayerStyle';
import MenuLayerTransform from './MenuLayerTransform';
import MenuLayerCombine from './MenuLayerCombine';
import MenuLayerImage from './MenuLayerImage';
import MenuLayerMask from './MenuLayerMask';

interface MenuLayerProps {
  menu: Electron.Menu;
  setLayer(layer: any): void;
}

const MenuLayer = (props: MenuLayerProps): ReactElement => {
  const { menu, setLayer } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Layer'
  });
  const [style, setStyle] = useState(undefined);
  const [transform, setTransform] = useState(undefined);
  const [combine, setCombine] = useState(undefined);
  const [image, setImage] = useState(undefined);
  const [mask, setMask] = useState(undefined);

  useEffect(() => {
    if (style && transform && combine && image && mask) {
      setLayer({
        ...menuItemTemplate,
        submenu: [style, transform, combine, image, mask]
      });
    }
  }, [style, transform, combine, image, mask]);

  return (
    <>
      <MenuLayerStyle
        menu={menu}
        setStyle={setStyle} />
      <MenuLayerTransform
        menu={menu}
        setTransform={setTransform} />
      <MenuLayerCombine
        menu={menu}
        setCombine={setCombine} />
      <MenuLayerImage
        menu={menu}
        setImage={setImage} />
      <MenuLayerMask
        menu={menu}
        setMask={setMask} />
    </>
  );
};

export default MenuLayer;