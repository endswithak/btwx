import React, { ReactElement, useState, useEffect } from 'react';
import MenuInsertArtboard from './MenuInsertArtboard';
import MenuInsertShape from './MenuInsertShape';
import MenuInsertText from './MenuInsertText';
import MenuInsertImage from './MenuInsertImage';

interface MenuInsertProps {
  menu: Electron.Menu;
  setInsert(insert: any): void;
}

const MenuInsert = (props: MenuInsertProps): ReactElement => {
  const { menu, setInsert } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Insert'
  });
  const [artboard, setArtboard] = useState(undefined);
  const [shape, setShape] = useState(undefined);
  const [text, setText] = useState(undefined);
  const [image, setImage] = useState(undefined);

  useEffect(() => {
    if (artboard && shape && text && image) {
      setInsert({
        ...menuItemTemplate,
        submenu: [
          artboard,
          { type: 'separator' },
          shape,
          { type: 'separator' },
          text,
          image]
      });
    }
  }, [artboard, shape, text, image]);

  return (
    <>
      <MenuInsertArtboard
        menu={menu}
        setArtboard={setArtboard} />
      <MenuInsertShape
        menu={menu}
        setShape={setShape} />
      <MenuInsertText
        menu={menu}
        setText={setText} />
      <MenuInsertImage
        menu={menu}
        setImage={setImage} />
    </>
  )
};

export default MenuInsert;