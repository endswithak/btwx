import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
// import { ipcRenderer } from 'electron';
import { RootState } from '../store/reducers';
import { APPLE_IPHONE_DEVICES, APPLE_IPAD_DEVICES, APPLE_WATCH_DEVICES } from '../constants';

// iphone 8
import iphone8Gold from '../../../assets/devices/iPhone/iPhone8Gold.png';
import iphone8Silver from '../../../assets/devices/iPhone/iPhone8Silver.png';
import iphone8SpaceGray from '../../../assets/devices/iPhone/iPhone8SpaceGray.png';
import iphone8Gold2x from '../../../assets/devices/iPhone/iPhone8Gold@2x.png';
import iphone8Silver2x from '../../../assets/devices/iPhone/iPhone8Silver@2x.png';
import iphone8SpaceGray2x from '../../../assets/devices/iPhone/iPhone8SpaceGray@2x.png';
// iphone 8 plus
import iphone8PlusGold from '../../../assets/devices/iPhone/iPhone8PlusGold.png';
import iphone8PlusSilver from '../../../assets/devices/iPhone/iPhone8PlusSilver.png';
import iphone8PlusSpaceGray from '../../../assets/devices/iPhone/iPhone8PlusSpaceGray.png';
import iphone8PlusGold2x from '../../../assets/devices/iPhone/iPhone8PlusGold@2x.png';
import iphone8PlusSilver2x from '../../../assets/devices/iPhone/iPhone8PlusSilver@2x.png';
import iphone8PlusSpaceGray2x from '../../../assets/devices/iPhone/iPhone8PlusSpaceGray@2x.png';
// iphone SE
import iphoneSEBlack from '../../../assets/devices/iPhone/iPhoneSEBlack.png';
import iphoneSEWhite from '../../../assets/devices/iPhone/iPhoneSEWhite.png';
import iphoneSERed from '../../../assets/devices/iPhone/iPhoneSERed.png';
import iphoneSEBlack2x from '../../../assets/devices/iPhone/iPhoneSEBlack@2x.png';
import iphoneSEWhite2x from '../../../assets/devices/iPhone/iPhoneSEWhite@2x.png';
import iphoneSERed2x from '../../../assets/devices/iPhone/iPhoneSERed@2x.png';
// iphone 11
import iphone11Black from '../../../assets/devices/iPhone/iPhone11Black.png';
import iphone11Green from '../../../assets/devices/iPhone/iPhone11Green.png';
import iphone11Purple from '../../../assets/devices/iPhone/iPhone11Purple.png';
import iphone11Red from '../../../assets/devices/iPhone/iPhone11Red.png';
import iphone11White from '../../../assets/devices/iPhone/iPhone11White.png';
import iphone11Yellow from '../../../assets/devices/iPhone/iPhone11Yellow.png';
import iphone11Black2x from '../../../assets/devices/iPhone/iPhone11Black@2x.png';
import iphone11Green2x from '../../../assets/devices/iPhone/iPhone11Green@2x.png';
import iphone11Purple2x from '../../../assets/devices/iPhone/iPhone11Purple@2x.png';
import iphone11Red2x from '../../../assets/devices/iPhone/iPhone11Red@2x.png';
import iphone11White2x from '../../../assets/devices/iPhone/iPhone11White@2x.png';
import iphone11Yellow2x from '../../../assets/devices/iPhone/iPhone11Yellow@2x.png';
// iphone 11 Pro
import iphone11ProGold from '../../../assets/devices/iPhone/iPhone11ProGold.png';
import iphone11ProMidnightGreen from '../../../assets/devices/iPhone/iPhone11ProMidnightGreen.png';
import iphone11ProSilver from '../../../assets/devices/iPhone/iPhone11ProSilver.png';
import iphone11ProSpaceGray from '../../../assets/devices/iPhone/iPhone11ProSpaceGray.png';
import iphone11ProGold2x from '../../../assets/devices/iPhone/iPhone11ProGold@2x.png';
import iphone11ProMidnightGreen2x from '../../../assets/devices/iPhone/iPhone11ProMidnightGreen@2x.png';
import iphone11ProSilver2x from '../../../assets/devices/iPhone/iPhone11ProSilver@2x.png';
import iphone11ProSpaceGray2x from '../../../assets/devices/iPhone/iPhone11ProSpaceGray@2x.png';
// iphone 11 pro max
import iphone11ProMaxGold from '../../../assets/devices/iPhone/iPhone11ProMaxGold.png';
import iphone11ProMaxMidnightGreen from '../../../assets/devices/iPhone/iPhone11ProMaxMidnightGreen.png';
import iphone11ProMaxSilver from '../../../assets/devices/iPhone/iPhone11ProMaxSilver.png';
import iphone11ProMaxSpaceGray from '../../../assets/devices/iPhone/iPhone11ProMaxSpaceGray.png';
import iphone11ProMaxGold2x from '../../../assets/devices/iPhone/iPhone11ProMaxGold@2x.png';
import iphone11ProMaxMidnightGreen2x from '../../../assets/devices/iPhone/iPhone11ProMaxMidnightGreen@2x.png';
import iphone11ProMaxSilver2x from '../../../assets/devices/iPhone/iPhone11ProMaxSilver@2x.png';
import iphone11ProMaxSpaceGray2x from '../../../assets/devices/iPhone/iPhone11ProMaxSpaceGray@2x.png';
// ipad mini
import ipadMiniGold from '../../../assets/devices/iPad/iPadMiniGold.png';
import ipadMiniSilver from '../../../assets/devices/iPad/iPadMiniSilver.png';
import ipadMiniSpaceGray from '../../../assets/devices/iPad/iPadMiniSpaceGray.png';
import ipadMiniGold2x from '../../../assets/devices/iPad/iPadMiniGold@2x.png';
import ipadMiniSilver2x from '../../../assets/devices/iPad/iPadMiniSilver@2x.png';
import ipadMiniSpaceGray2x from '../../../assets/devices/iPad/iPadMiniSpaceGray@2x.png';
// ipad
import ipadGold from '../../../assets/devices/iPad/iPadGold.png';
import ipadSilver from '../../../assets/devices/iPad/iPadSilver.png';
import ipadSpaceGray from '../../../assets/devices/iPad/iPadSpaceGray.png';
import ipadGold2x from '../../../assets/devices/iPad/iPadGold@2x.png';
import ipadSilver2x from '../../../assets/devices/iPad/iPadSilver@2x.png';
import ipadSpaceGray2x from '../../../assets/devices/iPad/iPadSpaceGray@2x.png';
// ipad air
import ipadAirGold from '../../../assets/devices/iPad/iPadAirGold.png';
import ipadAirSilver from '../../../assets/devices/iPad/iPadAirSilver.png';
import ipadAirSpaceGray from '../../../assets/devices/iPad/iPadAirSpaceGray.png';
import ipadAirGold2x from '../../../assets/devices/iPad/iPadAirGold@2x.png';
import ipadAirSilver2x from '../../../assets/devices/iPad/iPadAirSilver@2x.png';
import ipadAirSpaceGray2x from '../../../assets/devices/iPad/iPadAirSpaceGray@2x.png';
// ipad pro 11
import ipadPro11Silver from '../../../assets/devices/iPad/iPadPro11Silver.png';
import ipadPro11SpaceGray from '../../../assets/devices/iPad/iPadPro11SpaceGray.png';
import ipadPro11Silver2x from '../../../assets/devices/iPad/iPadPro11Silver@2x.png';
import ipadPro11SpaceGray2x from '../../../assets/devices/iPad/iPadPro11SpaceGray@2x.png';
// ipad pro 13
import ipadPro13Silver from '../../../assets/devices/iPad/iPadPro13Silver.png';
import ipadPro13SpaceGray from '../../../assets/devices/iPad/iPadPro13SpaceGray.png';
import ipadPro13Silver2x from '../../../assets/devices/iPad/iPadPro13Silver@2x.png';
import ipadPro13SpaceGray2x from '../../../assets/devices/iPad/iPadPro13SpaceGray@2x.png';
// appleWatch 38mm
import appleWatch38mmStone from '../../../assets/devices/AppleWatch/appleWatch38mmStone.png';
import appleWatch38mmAntiqueWhite from '../../../assets/devices/AppleWatch/appleWatch38mmAntiqueWhite.png';
import appleWatch38mmWhite from '../../../assets/devices/AppleWatch/appleWatch38mmWhite.png';
import appleWatch38mmWalnut from '../../../assets/devices/AppleWatch/appleWatch38mmWalnut.png';
import appleWatch38mmRed from '../../../assets/devices/AppleWatch/appleWatch38mmRed.png';
import appleWatch38mmGreen from '../../../assets/devices/AppleWatch/appleWatch38mmGreen.png';
import appleWatch38mmFog from '../../../assets/devices/AppleWatch/appleWatch38mmFog.png';
import appleWatch38mmBlue from '../../../assets/devices/AppleWatch/appleWatch38mmBlue.png';
import appleWatch38mmStone2x from '../../../assets/devices/AppleWatch/appleWatch38mmStone@2x.png';
import appleWatch38mmAntiqueWhite2x from '../../../assets/devices/AppleWatch/appleWatch38mmAntiqueWhite@2x.png';
import appleWatch38mmWhite2x from '../../../assets/devices/AppleWatch/appleWatch38mmWhite@2x.png';
import appleWatch38mmWalnut2x from '../../../assets/devices/AppleWatch/appleWatch38mmWalnut@2x.png';
import appleWatch38mmRed2x from '../../../assets/devices/AppleWatch/appleWatch38mmRed@2x.png';
import appleWatch38mmGreen2x from '../../../assets/devices/AppleWatch/appleWatch38mmGreen@2x.png';
import appleWatch38mmFog2x from '../../../assets/devices/AppleWatch/appleWatch38mmFog@2x.png';
import appleWatch38mmBlue2x from '../../../assets/devices/AppleWatch/appleWatch38mmBlue@2x.png';
// appleWatch 40mm
import appleWatch40mmWhite from '../../../assets/devices/AppleWatch/appleWatch40mmWhite.png';
import appleWatch40mmRed from '../../../assets/devices/AppleWatch/appleWatch40mmRed.png';
import appleWatch40mmLemonCream from '../../../assets/devices/AppleWatch/appleWatch40mmLemonCream.png';
import appleWatch40mmBlack from '../../../assets/devices/AppleWatch/appleWatch40mmBlack.png';
import appleWatch40mmPineGreen from '../../../assets/devices/AppleWatch/appleWatch40mmPineGreen.png';
import appleWatch40mmAlaskanBlue from '../../../assets/devices/AppleWatch/appleWatch40mmAlaskanBlue.png';
import appleWatch40mmClementine from '../../../assets/devices/AppleWatch/appleWatch40mmClementine.png';
import appleWatch40mmStone from '../../../assets/devices/AppleWatch/appleWatch40mmStone.png';
import appleWatch40mmPinkSand from '../../../assets/devices/AppleWatch/appleWatch40mmPinkSand.png';
import appleWatch40mmWhite2x from '../../../assets/devices/AppleWatch/appleWatch40mmWhite@2x.png';
import appleWatch40mmRed2x from '../../../assets/devices/AppleWatch/appleWatch40mmRed@2x.png';
import appleWatch40mmLemonCream2x from '../../../assets/devices/AppleWatch/appleWatch40mmLemonCream@2x.png';
import appleWatch40mmBlack2x from '../../../assets/devices/AppleWatch/appleWatch40mmBlack@2x.png';
import appleWatch40mmPineGreen2x from '../../../assets/devices/AppleWatch/appleWatch40mmPineGreen@2x.png';
import appleWatch40mmAlaskanBlue2x from '../../../assets/devices/AppleWatch/appleWatch40mmAlaskanBlue@2x.png';
import appleWatch40mmClementine2x from '../../../assets/devices/AppleWatch/appleWatch40mmClementine@2x.png';
import appleWatch40mmStone2x from '../../../assets/devices/AppleWatch/appleWatch40mmStone@2x.png';
import appleWatch40mmPinkSand2x from '../../../assets/devices/AppleWatch/appleWatch40mmPinkSand@2x.png';
// appleWatch 42mm
import appleWatch42mmStone from '../../../assets/devices/AppleWatch/appleWatch42mmStone.png';
import appleWatch42mmAntiqueWhite from '../../../assets/devices/AppleWatch/appleWatch42mmAntiqueWhite.png';
import appleWatch42mmWhite from '../../../assets/devices/AppleWatch/appleWatch42mmWhite.png';
import appleWatch42mmWalnut from '../../../assets/devices/AppleWatch/appleWatch42mmWalnut.png';
import appleWatch42mmRed from '../../../assets/devices/AppleWatch/appleWatch42mmRed.png';
import appleWatch42mmGreen from '../../../assets/devices/AppleWatch/appleWatch42mmGreen.png';
import appleWatch42mmFog from '../../../assets/devices/AppleWatch/appleWatch42mmFog.png';
import appleWatch42mmBlue from '../../../assets/devices/AppleWatch/appleWatch42mmBlue.png';
import appleWatch42mmStone2x from '../../../assets/devices/AppleWatch/appleWatch42mmStone@2x.png';
import appleWatch42mmAntiqueWhite2x from '../../../assets/devices/AppleWatch/appleWatch42mmAntiqueWhite@2x.png';
import appleWatch42mmWhite2x from '../../../assets/devices/AppleWatch/appleWatch42mmWhite@2x.png';
import appleWatch42mmWalnut2x from '../../../assets/devices/AppleWatch/appleWatch42mmWalnut@2x.png';
import appleWatch42mmRed2x from '../../../assets/devices/AppleWatch/appleWatch42mmRed@2x.png';
import appleWatch42mmGreen2x from '../../../assets/devices/AppleWatch/appleWatch42mmGreen@2x.png';
import appleWatch42mmFog2x from '../../../assets/devices/AppleWatch/appleWatch42mmFog@2x.png';
import appleWatch42mmBlue2x from '../../../assets/devices/AppleWatch/appleWatch42mmBlue@2x.png';
// appleWatch 44mm
import appleWatch44mmWhite from '../../../assets/devices/AppleWatch/appleWatch44mmWhite.png';
import appleWatch44mmRed from '../../../assets/devices/AppleWatch/appleWatch44mmRed.png';
import appleWatch44mmLemonCream from '../../../assets/devices/AppleWatch/appleWatch44mmLemonCream.png';
import appleWatch44mmBlack from '../../../assets/devices/AppleWatch/appleWatch44mmBlack.png';
import appleWatch44mmPineGreen from '../../../assets/devices/AppleWatch/appleWatch44mmPineGreen.png';
import appleWatch44mmAlaskanBlue from '../../../assets/devices/AppleWatch/appleWatch44mmAlaskanBlue.png';
import appleWatch44mmClementine from '../../../assets/devices/AppleWatch/appleWatch44mmClementine.png';
import appleWatch44mmStone from '../../../assets/devices/AppleWatch/appleWatch44mmStone.png';
import appleWatch44mmPinkSand from '../../../assets/devices/AppleWatch/appleWatch44mmPinkSand.png';
import appleWatch44mmWhite2x from '../../../assets/devices/AppleWatch/appleWatch44mmWhite@2x.png';
import appleWatch44mmRed2x from '../../../assets/devices/AppleWatch/appleWatch44mmRed@2x.png';
import appleWatch44mmLemonCream2x from '../../../assets/devices/AppleWatch/appleWatch44mmLemonCream@2x.png';
import appleWatch44mmBlack2x from '../../../assets/devices/AppleWatch/appleWatch44mmBlack@2x.png';
import appleWatch44mmPineGreen2x from '../../../assets/devices/AppleWatch/appleWatch44mmPineGreen@2x.png';
import appleWatch44mmAlaskanBlue2x from '../../../assets/devices/AppleWatch/appleWatch44mmAlaskanBlue@2x.png';
import appleWatch44mmClementine2x from '../../../assets/devices/AppleWatch/appleWatch44mmClementine@2x.png';
import appleWatch44mmStone2x from '../../../assets/devices/AppleWatch/appleWatch44mmStone@2x.png';
import appleWatch44mmPinkSand2x from '../../../assets/devices/AppleWatch/appleWatch44mmPinkSand@2x.png';

const deviceImages = {
  iphone8Gold: {
    '1x': iphone8Gold,
    '2x': iphone8Gold2x
  },
  iphone8Silver: {
    '1x': iphone8Silver,
    '2x': iphone8Silver2x
  },
  iphone8SpaceGray: {
    '1x': iphone8SpaceGray,
    '2x': iphone8SpaceGray2x
  },
  iphone8PlusGold: {
    '1x': iphone8PlusGold,
    '2x': iphone8PlusGold2x
  },
  iphone8PlusSilver: {
    '1x': iphone8PlusSilver,
    '2x': iphone8PlusSilver2x
  },
  iphone8PlusSpaceGray: {
    '1x': iphone8PlusSpaceGray,
    '2x': iphone8PlusSpaceGray2x
  },
  iphoneSEBlack: {
    '1x': iphoneSEBlack,
    '2x': iphoneSEBlack2x
  },
  iphoneSEWhite: {
    '1x': iphoneSEWhite,
    '2x': iphoneSEWhite2x
  },
  iphoneSERed: {
    '1x': iphoneSERed,
    '2x': iphoneSERed2x
  },
  iphone11Black: {
    '1x': iphone11Black,
    '2x': iphone11Black2x
  },
  iphone11Green: {
    '1x': iphone11Green,
    '2x': iphone11Green2x
  },
  iphone11Purple: {
    '1x': iphone11Purple,
    '2x': iphone11Purple2x
  },
  iphone11Red: {
    '1x': iphone11Red,
    '2x': iphone11Red2x
  },
  iphone11White: {
    '1x': iphone11White,
    '2x': iphone11White2x
  },
  iphone11Yellow: {
    '1x': iphone11Yellow,
    '2x': iphone11Yellow2x
  },
  iphone11ProGold: {
    '1x': iphone11ProGold,
    '2x': iphone11ProGold2x
  },
  iphone11ProMidnightGreen: {
    '1x': iphone11ProMidnightGreen,
    '2x': iphone11ProMidnightGreen2x
  },
  iphone11ProSilver: {
    '1x': iphone11ProSilver,
    '2x': iphone11ProSilver2x
  },
  iphone11ProSpaceGray: {
    '1x': iphone11ProSpaceGray,
    '2x': iphone11ProSpaceGray2x
  },
  iphone11ProMaxGold: {
    '1x': iphone11ProMaxGold,
    '2x': iphone11ProMaxGold2x
  },
  iphone11ProMaxMidnightGreen: {
    '1x': iphone11ProMaxMidnightGreen,
    '2x': iphone11ProMaxMidnightGreen2x
  },
  iphone11ProMaxSilver: {
    '1x': iphone11ProMaxSilver,
    '2x': iphone11ProMaxSilver2x
  },
  iphone11ProMaxSpaceGray: {
    '1x': iphone11ProMaxSpaceGray,
    '2x': iphone11ProMaxSpaceGray2x
  },
  ipadMiniGold: {
    '1x': ipadMiniGold,
    '2x': ipadMiniGold2x
  },
  ipadMiniSilver: {
    '1x': ipadMiniSilver,
    '2x': ipadMiniSilver2x
  },
  ipadMiniSpaceGray: {
    '1x': ipadMiniSpaceGray,
    '2x': ipadMiniSpaceGray2x
  },
  ipadGold: {
    '1x': ipadGold,
    '2x': ipadGold2x
  },
  ipadSilver: {
    '1x': ipadSilver,
    '2x': ipadSilver2x
  },
  ipadSpaceGray: {
    '1x': ipadSpaceGray,
    '2x': ipadSpaceGray2x
  },
  ipadAirGold: {
    '1x': ipadAirGold,
    '2x': ipadAirGold2x
  },
  ipadAirSilver: {
    '1x': ipadAirSilver,
    '2x': ipadAirSilver2x
  },
  ipadAirSpaceGray: {
    '1x': ipadAirSpaceGray,
    '2x': ipadAirSpaceGray2x
  },
  ipadPro11Silver: {
    '1x': ipadPro11Silver,
    '2x': ipadPro11Silver2x
  },
  ipadPro11SpaceGray: {
    '1x': ipadPro11SpaceGray,
    '2x': ipadPro11SpaceGray2x
  },
  ipadPro13Silver: {
    '1x': ipadPro13Silver,
    '2x': ipadPro13Silver2x
  },
  ipadPro13SpaceGray: {
    '1x': ipadPro13SpaceGray,
    '2x': ipadPro13SpaceGray2x
  },
  appleWatch38mmStone: {
    '1x': appleWatch38mmStone,
    '2x': appleWatch38mmStone2x
  },
  appleWatch38mmAntiqueWhite: {
    '1x': appleWatch38mmAntiqueWhite,
    '2x': appleWatch38mmAntiqueWhite2x
  },
  appleWatch38mmWhite: {
    '1x': appleWatch38mmWhite,
    '2x': appleWatch38mmWhite2x
  },
  appleWatch38mmWalnut: {
    '1x': appleWatch38mmWalnut,
    '2x': appleWatch38mmWalnut2x
  },
  appleWatch38mmRed: {
    '1x': appleWatch38mmRed,
    '2x': appleWatch38mmRed2x
  },
  appleWatch38mmGreen: {
    '1x': appleWatch38mmGreen,
    '2x': appleWatch38mmGreen2x
  },
  appleWatch38mmFog: {
    '1x': appleWatch38mmFog,
    '2x': appleWatch38mmFog2x
  },
  appleWatch38mmBlue: {
    '1x': appleWatch38mmBlue,
    '2x': appleWatch38mmBlue2x
  },
  appleWatch42mmStone: {
    '1x': appleWatch42mmStone,
    '2x': appleWatch42mmStone2x
  },
  appleWatch42mmAntiqueWhite: {
    '1x': appleWatch42mmAntiqueWhite,
    '2x': appleWatch42mmAntiqueWhite2x
  },
  appleWatch42mmWhite: {
    '1x': appleWatch42mmWhite,
    '2x': appleWatch42mmWhite2x
  },
  appleWatch42mmWalnut: {
    '1x': appleWatch42mmWalnut,
    '2x': appleWatch42mmWalnut2x
  },
  appleWatch42mmRed: {
    '1x': appleWatch42mmRed,
    '2x': appleWatch42mmRed2x
  },
  appleWatch42mmGreen: {
    '1x': appleWatch42mmGreen,
    '2x': appleWatch42mmGreen2x
  },
  appleWatch42mmFog: {
    '1x': appleWatch42mmFog,
    '2x': appleWatch42mmFog2x
  },
  appleWatch42mmBlue: {
    '1x': appleWatch42mmBlue,
    '2x': appleWatch42mmBlue2x
  },
  appleWatch40mmWhite: {
    '1x': appleWatch40mmWhite,
    '2x': appleWatch40mmWhite2x
  },
  appleWatch40mmRed: {
    '1x': appleWatch40mmRed,
    '2x': appleWatch40mmRed2x
  },
  appleWatch40mmLemonCream: {
    '1x': appleWatch40mmLemonCream,
    '2x': appleWatch40mmLemonCream2x
  },
  appleWatch40mmBlack: {
    '1x': appleWatch40mmBlack,
    '2x': appleWatch40mmBlack2x
  },
  appleWatch40mmPineGreen: {
    '1x': appleWatch40mmPineGreen,
    '2x': appleWatch40mmPineGreen2x
  },
  appleWatch40mmAlaskanBlue: {
    '1x': appleWatch40mmAlaskanBlue,
    '2x': appleWatch40mmAlaskanBlue2x
  },
  appleWatch40mmClementine: {
    '1x': appleWatch40mmClementine,
    '2x': appleWatch40mmClementine2x
  },
  appleWatch40mmStone: {
    '1x': appleWatch40mmStone,
    '2x': appleWatch40mmStone2x
  },
  appleWatch40mmPinkSand: {
    '1x': appleWatch40mmPinkSand,
    '2x': appleWatch40mmPinkSand2x
  },
  appleWatch44mmWhite: {
    '1x': appleWatch44mmWhite,
    '2x': appleWatch44mmWhite2x
  },
  appleWatch44mmRed: {
    '1x': appleWatch44mmRed,
    '2x': appleWatch44mmRed2x
  },
  appleWatch44mmLemonCream: {
    '1x': appleWatch44mmLemonCream,
    '2x': appleWatch44mmLemonCream2x
  },
  appleWatch44mmBlack: {
    '1x': appleWatch44mmBlack,
    '2x': appleWatch44mmBlack2x
  },
  appleWatch44mmPineGreen: {
    '1x': appleWatch44mmPineGreen,
    '2x': appleWatch44mmPineGreen2x
  },
  appleWatch44mmAlaskanBlue: {
    '1x': appleWatch44mmAlaskanBlue,
    '2x': appleWatch44mmAlaskanBlue2x
  },
  appleWatch44mmClementine: {
    '1x': appleWatch44mmClementine,
    '2x': appleWatch44mmClementine2x
  },
  appleWatch44mmStone: {
    '1x': appleWatch44mmStone,
    '2x': appleWatch44mmStone2x
  },
  appleWatch44mmPinkSand: {
    '1x': appleWatch44mmPinkSand,
    '2x': appleWatch44mmPinkSand2x
  }
}

const PreviewDevice = (): ReactElement => {
  const instance = useSelector((state: RootState) => state.session.instance);
  const device = useSelector((state: RootState) => state.preview.device.id);
  const deviceColor = useSelector((state: RootState) => state.preview.device.color);
  const deviceOrientation = useSelector((state: RootState) => state.preview.device.orientation);
  const activeArtboardItem = useSelector((state: RootState) => state.layer.present.byId[state.layer.present.activeArtboard]);
  const [images, setImages] = useState<{'1x': string; '2x': string}>(null);
  const [size, setSize] = useState(null);

  useEffect(() => {
    if (device && deviceColor) {
      const newDevice = [...APPLE_IPHONE_DEVICES, ...APPLE_IPAD_DEVICES, ...APPLE_WATCH_DEVICES].find((d) => d.id === device);
      const newImages = newDevice.colors.find((c) => c.id === deviceColor);
      if (newImages) {
        setImages(deviceImages[`${device}${deviceColor.charAt(0).toUpperCase()}${deviceColor.slice(1)}`]);
        setSize(newDevice.frame);
        (window as any).api.resizePreview(JSON.stringify({
          instanceId: instance,
          size: newDevice.frame
        }));
        // ipcRenderer.send('resizePreview', JSON.stringify({
        //   instanceId: instance,
        //   size: newDevice.frame
        // }));
      }
    } else {
      if (images) {
        setImages(null);
      }
      if (activeArtboardItem) {
        (window as any).api.resizePreview(JSON.stringify({
          instanceId: instance,
          size: {
            width: activeArtboardItem.frame.width,
            height: activeArtboardItem.frame.height
          }
        }));
        // ipcRenderer.send('resizePreview', JSON.stringify({
        //   instanceId: instance,
        //   size: {
        //     width: activeArtboardItem.frame.width,
        //     height: activeArtboardItem.frame.height
        //   }
        // }));
      }
    }
  }, [device, deviceColor]);

  useEffect(() => {
    if (device && deviceColor && size) {
      (window as any).api.resizePreview(JSON.stringify({
        instanceId: instance,
        size: {
          width: deviceOrientation === 'Landscape' ? size.height : size.width,
          height: deviceOrientation === 'Landscape' ? size.width : size.height
        }
      }));
      // ipcRenderer.send('resizePreview', JSON.stringify({
      //   instanceId: instance,
      //   size: {
      //     width: deviceOrientation === 'Landscape' ? size.height : size.width,
      //     height: deviceOrientation === 'Landscape' ? size.width : size.height
      //   }
      // }));
    }
  }, [deviceOrientation]);

  return (
    <>
      {
        device && deviceColor && images
        ? <div
            className={`c-preview__device c-preview__device--${deviceOrientation.toLowerCase()}`}
            style={{
              width: size.width,
              height: size.height
            }}>
            <img srcSet={`${images['1x']} 1x, ${images['2x']} 2x`} />
          </div>
        : null
      }
    </>
  );
}

export default PreviewDevice;