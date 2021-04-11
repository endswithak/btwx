import React, { ReactElement, useState, useEffect } from 'react';
import MenuLayerAddEvent from './MenuLayerAddEvent';
import MenuLayerStyle from './MenuLayerStyle';
import MenuLayerTransform from './MenuLayerTransform';
import MenuLayerCombine from './MenuLayerCombine';
import MenuLayerImage from './MenuLayerImage';
import MenuLayerMask from './MenuLayerMask';

interface MenuLayerProps {
  setLayer(layer: any): void;
}

const MenuLayer = (props: MenuLayerProps): ReactElement => {
  const { setLayer } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Layer'
  });
  const [addEvent, setAddEvent] = useState(undefined);
  const [style, setStyle] = useState(undefined);
  const [transform, setTransform] = useState(undefined);
  const [combine, setCombine] = useState(undefined);
  const [image, setImage] = useState(undefined);
  const [mask, setMask] = useState(undefined);

  useEffect(() => {
    if (addEvent && style && transform && combine && image && mask) {
      setLayer({
        ...menuItemTemplate,
        submenu: [
          addEvent,
          { type: 'separator' },
          style,
          transform,
          combine,
          image,
          mask
        ]
      });
    }
  }, [addEvent, style, transform, combine, image, mask]);

  return (
    <>
      <MenuLayerAddEvent
        setAddEvent={setAddEvent} />
      <MenuLayerStyle
        setStyle={setStyle} />
      <MenuLayerTransform
        setTransform={setTransform} />
      <MenuLayerCombine
        setCombine={setCombine} />
      <MenuLayerImage
        setImage={setImage} />
      <MenuLayerMask
        setMask={setMask} />
    </>
  );
};

export default MenuLayer;