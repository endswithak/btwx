import React, { ReactElement, useEffect } from 'react';
import sharp from 'sharp';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { addImageThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'insertImage';

interface MenuInsertImageProps {
  canInsert?: boolean;
  addImageThunk?(opts: any): void;
}

const MenuInsertImage = (props: MenuInsertImageProps): ReactElement => {
  const { canInsert, addImageThunk } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = canInsert;
  }, [canInsert]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
        filters: [
          { name: 'Images', extensions: ['jpg', 'png'] }
        ],
        properties: ['openFile']
      }).then(result => {
        if (result.filePaths.length > 0 && !result.canceled) {
          sharp(result.filePaths[0]).metadata().then(({ width, height }) => {
            sharp(result.filePaths[0]).resize(Math.round(width * 0.5)).webp({quality: 50}).toBuffer({ resolveWithObject: true }).then(({ data, info }) => {
              addImageThunk({
                layer: {
                  frame: {
                    width: info.width,
                    height: info.height,
                    innerWidth: info.width,
                    innerHeight: info.height
                  } as Btwx.Frame
                },
                buffer: data
              }) as any
            });
          });
        }
      });
    };
  }, []);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  canInsert: boolean;
} => {
  const { canvasSettings } = state;
  const canInsert = canvasSettings.focusing;
  return { canInsert };
};

export default connect(
  mapStateToProps,
  { addImageThunk }
)(MenuInsertImage);