/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import sharp from 'sharp';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { addImageThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'insertImage';

interface MenuInsertImageProps {
  setImage(image: any): void;
}

const MenuInsertImage = (props: MenuInsertImageProps): ReactElement => {
  const { setImage } = props;
  const [menuItem, setMenuItem] = useState({
    label: 'Image...',
    id: MENU_ITEM_ID,
    enabled: false,
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
  const canInsert = useSelector((state: RootState) => state.canvasSettings.focusing && state.layer.present.activeArtboard !== null);
  const dispatch = useDispatch();

  useEffect(() => {
    const appMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    if (appMenuItem) {
      appMenuItem.enabled = canInsert;
    }
  }, [canInsert]);

  useEffect(() => {
    setImage(menuItem);
  }, [menuItem]);

  return (
    <></>
  );
}

export default MenuInsertImage;

// import React, { ReactElement, useEffect } from 'react';
// import sharp from 'sharp';
// import { remote } from 'electron';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState } from '../store/reducers';
// import { addImageThunk } from '../store/actions/layer';
// import MenuItem, { MenuItemProps } from './MenuItem';

// export const MENU_ITEM_ID = 'insertImage';

// const MenuInsertImage = (props: MenuItemProps): ReactElement => {
//   const { menuItem } = props;
//   const canInsert = useSelector((state: RootState) => state.canvasSettings.focusing && state.layer.present.activeArtboard !== null);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     menuItem.enabled = canInsert;
//   }, [canInsert]);

//   useEffect(() => {
//     (window as any)[MENU_ITEM_ID] = (): void => {
//       remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
//         filters: [
//           { name: 'Images', extensions: ['jpg', 'png'] }
//         ],
//         properties: ['openFile']
//       }).then(result => {
//         if (result.filePaths.length > 0 && !result.canceled) {
//           sharp(result.filePaths[0]).metadata().then(({ width, height }) => {
//             sharp(result.filePaths[0]).resize(Math.round(width * 0.5)).webp({quality: 50}).toBuffer({ resolveWithObject: true }).then(({ data, info }) => {
//               dispatch(addImageThunk({
//                 layer: {
//                   frame: {
//                     width: info.width,
//                     height: info.height,
//                     innerWidth: info.width,
//                     innerHeight: info.height
//                   } as Btwx.Frame
//                 },
//                 buffer: data
//               })) as any
//             });
//           });
//         }
//       });
//     };
//   }, []);

//   return (
//     <></>
//   );
// }

// export default MenuItem(
//   MenuInsertImage,
//   MENU_ITEM_ID
// );