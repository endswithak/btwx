/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import sharp from 'sharp';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { addImageThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'insertImage';

interface MenuInsertImageProps {
  menu: Electron.Menu;
  setImage(image: any): void;
}

const MenuInsertImage = (props: MenuInsertImageProps): ReactElement => {
  const { menu, setImage } = props;
  const accelerator = useSelector((state: RootState) => state.keyBindings.insert.image);
  const isEnabled = useSelector((state: RootState) =>
    state.layer.present.activeArtboard !== null &&
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Image...',
    id: MENU_ITEM_ID,
    enabled: isEnabled,
    accelerator,
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
        filters: [
          { name: 'Images', extensions: ['jpg', 'png'] }
        ],
        properties: ['openFile']
      }).then(result => {
        if (result.filePaths.length > 0 && !result.canceled) {
          sharp(result.filePaths[0]).metadata().then(({ width, height }) => {
            sharp(result.filePaths[0]).resize(Math.round(width * 0.5)).webp({quality: 50}).toBuffer({ resolveWithObject: true }).then(({ data, info }) => {
              dispatch(addImageThunk({
                layer: {
                  frame: {
                    width: info.width,
                    height: info.height,
                    innerWidth: info.width,
                    innerHeight: info.height
                  } as Btwx.Frame
                },
                buffer: data
              })) as any
            });
          });
        }
      });
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const dispatch = useDispatch();

  useEffect(() => {
    setImage(menuItemTemplate);
  }, [menuItemTemplate]);

  useEffect(() => {
    if (menu) {
      setMenuItem(menu.getMenuItemById(MENU_ITEM_ID));
    }
  }, [menu]);

  useEffect(() => {
    if (menuItem) {
      menuItem.enabled = isEnabled;
    }
  }, [isEnabled]);

  return (
    <></>
  );
}

export default MenuInsertImage;