import React, { ReactElement, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ipcRenderer } from 'electron';
import { RootState } from '../store/reducers';
import { setPreviewDevice } from '../store/actions/preview';
import { APPLE_IPHONE_DEVICES, APPLE_IPAD_DEVICES, APPLE_WATCH_DEVICES } from '../constants';
import IconButton from './IconButton';


const PreviewDevice = (): ReactElement => {
  const instance = useSelector((state: RootState) => state.session.instance);
  const device = useSelector((state: RootState) => state.preview.device.id);
  const deviceColor = useSelector((state: RootState) => state.preview.device.color);
  const activeArtboardItem = useSelector((state: RootState) => state.layer.present.byId[state.layer.present.activeArtboard]);
  const dispatch = useDispatch();

  const buildContextMenu = () => {
    let devRef;
    if (device && deviceColor) {
      devRef = [...APPLE_IPHONE_DEVICES, ...APPLE_IPAD_DEVICES, ...APPLE_WATCH_DEVICES].find((d) => d.id === device);
    }
    return [{
      label: 'None',
      type: 'checkbox',
      checked: !device,
      click: {
        id: 'setPreviewDevice',
        params: {
          device: null,
          deviceColor: null
        }
      }
    },
    { type: 'separator' },
    {
      label: 'Fit Frame',
      click: {
        id: 'resizePreview',
        params: {
          instanceId: instance,
          size: device
          ? devRef.frame
          : {
              width: activeArtboardItem.frame.width,
              height: activeArtboardItem.frame.height
            }
        }
      }
    },
    { type: 'separator' },
    ...device && deviceColor ? [
      { type: 'separator' },
      {
        label: devRef.type,
        submenu: devRef.colors.map((c) => ({
          label: c.type,
          type: 'checkbox',
          checked: c.id === deviceColor,
          sublabel: devRef.type,
          click: {
            id: 'setPreviewDevice',
            params: {
              device: device,
              deviceColor: c.id
            }
          }
        }))
      },
      { type: 'separator' },
    ] : [],
    {
      label: 'iPhone',
      submenu: APPLE_IPHONE_DEVICES.map((d) => ({
        label: d.type,
        submenu: d.colors.map((c) => ({
          label: c.type,
          type: 'checkbox',
          checked: d.id === device && c.id === deviceColor,
          click: {
            id: 'setPreviewDevice',
            params: {
              device: d.id,
              deviceColor: c.id
            }
          }
        }))
      }))
    },{
      label: 'iPad',
      submenu: APPLE_IPAD_DEVICES.map((d) => ({
        label: d.type,
        submenu: d.colors.map((c) => ({
          label: c.type,
          type: 'checkbox',
          checked: d.id === device && c.id === deviceColor,
          click: {
            id: 'setPreviewDevice',
            params: {
              device: d.id,
              deviceColor: c.id
            }
          }
        }))
      }))
    },{
      label: 'Apple Watch',
      submenu: APPLE_WATCH_DEVICES.map((d) => ({
        label: d.type,
        submenu: d.colors.map((c) => ({
          label: c.type,
          type: 'checkbox',
          checked: d.id === device && c.id === deviceColor,
          click: {
            id: 'setPreviewDevice',
            params: {
              device: d.id,
              deviceColor: c.id
            }
          }
        }))
      }))
    }];
  }

  const handleClick = () => {
    ipcRenderer.send('openPreviewDeviceContextMenu', JSON.stringify({
      instanceId: instance,
      template: buildContextMenu()
    }));
  }

  useEffect(() => {
    (window as any).setPreviewDevice = (params) => {
      dispatch(setPreviewDevice({
        device: params.device,
        deviceColor: params.deviceColor
      }));
    }
  }, []);

  return (
    <IconButton
      iconName='mobile'
      size='small'
      isActive={device !== null}
      onClick={handleClick}
      toggle />
  );
}

export default PreviewDevice;