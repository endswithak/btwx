import { v4 as uuidv4 } from 'uuid';

export const THEME_PRIMARY_COLOR = '#3C88FD';
export const THEME_GUIDE_COLOR = 'red';
export const THEME_UNIT_SIZE = 4;
export const DEFAULT_ARTBOARD_BACKGROUND_COLOR = '#fff';

export const DEFAULT_LEFT_SIDEBAR_WIDTH = 320;
export const DEFAULT_RIGHT_SIDEBAR_WIDTH = 264;
export const DEFAULT_TWEEN_DRAWER_HEIGHT = 320;

export const DEFAULT_ROUNDED_RADIUS = 0.15;
export const DEFAULT_POLYGON_SIDES = 5;
export const DEFAULT_STAR_POINTS = 5;
export const DEFAULT_STAR_RADIUS = 0.5;

export const PREVIEW_TOPBAR_HEIGHT = 44;

export const DEFAULT_GRADIENT_STYLE = (): em.Gradient => {
  const stopId1 = uuidv4();
  const stopId2 = uuidv4();
  return {
    gradientType: 'linear' as em.GradientType,
    origin: {
      x: -0.5,
      y: 0.5
    },
    destination: {
      x: 0.5,
      y: -0.5
    },
    stops: {
      allIds: [stopId1, stopId2],
      byId: {
        [stopId1]: {
          id: stopId1,
          active: true,
          position: 0,
          color: {
            h: 0,
            s: 0,
            l: 0.8,
            v: 0.8,
            a: 1
          }
        },
        [stopId2]: {
          id: stopId2,
          active: false,
          position: 1,
          color: {
            h: 0,
            s: 0,
            l: 0,
            v: 0,
            a: 1
          }
        }
      }
    }
  }
};

export const DEFAULT_FILL_STYLE = (): em.Fill => ({
  fillType: 'color' as em.FillType,
  enabled: true,
  color: {
    h: 0,
    s: 0,
    l: 0.8,
    v: 0.8,
    a: 1
  },
  gradient: DEFAULT_GRADIENT_STYLE()
});

export const DEFAULT_STROKE_STYLE = (): em.Stroke => ({
  fillType: 'color' as em.FillType,
  enabled: true,
  color: {
    h: 0,
    s: 0,
    l: 0.6,
    v: 0.6,
    a: 1
  },
  width: 1,
  gradient: DEFAULT_GRADIENT_STYLE()
});

export const DEFAULT_STROKE_OPTIONS_STYLE: em.StrokeOptions = {
  cap: 'butt',
  join: 'miter',
  dashArray: [0,0],
  dashOffset: 0,
  miterLimit: 10
}

export const DEFAULT_SHADOW_STYLE: em.Shadow = {
  fillType: 'color' as em.FillType,
  enabled: false,
  color: {
    h: 0,
    s: 0,
    l: 0,
    v: 0,
    a: 0.5
  },
  blur: 10,
  offset: {
    x: 0,
    y: 0,
  }
}

export const DEFAULT_STYLE = (): em.Style => ({
  fill: DEFAULT_FILL_STYLE(),
  stroke: DEFAULT_STROKE_STYLE(),
  strokeOptions: DEFAULT_STROKE_OPTIONS_STYLE,
  opacity: 1,
  shadow: DEFAULT_SHADOW_STYLE,
  blendMode: 'normal'
});

export const DEFAULT_TRANSFORM: em.Transform = {
  rotation: 0,
  horizontalFlip: false,
  verticalFlip: false,
  pivot: {
    x: 0,
    y: 0
  },
  scale: {
    x: 1,
    y: 1
  }
}

export const DEFAULT_TEXT_VALUE = 'Type Something';

export const DEFAULT_TEXT_FILL_COLOR = {
  h: 0,
  s: 0,
  l: 0,
  v: 0,
  a: 1
};

export const DEFAULT_TEXT_STYLE: em.TextStyle = {
  fontSize: 12,
  leading: 16,
  fontWeight: 'normal',
  fontFamily: 'Helvetica',
  justification: 'left'
}

export const APPLE_IPHONE_DEVICES: em.Device[] = [
  {
    type: 'iPhone 8',
    category: 'Apple',
    width: 375,
    height: 667
  }, {
    type: 'iPhone 8 Plus',
    category: 'Apple',
    width: 414,
    height: 736
  }, {
    type: 'iPhone SE',
    category: 'Apple',
    width: 320,
    height: 568
  }, {
    type: 'iPhone 11 Pro',
    category: 'Apple',
    width: 375,
    height: 812
  }, {
    type: 'iPhone 11',
    category: 'Apple',
    width: 414,
    height: 896
  }, {
    type: 'iPhone 11 Pro Max',
    category: 'Apple',
    width: 414,
    height: 896
  }
];

export const APPLE_IPAD_DEVICES: em.Device[] = [
  {
    type: '7.9" iPad mini',
    category: 'Apple',
    width: 768,
    height: 1024
  }, {
    type: '10.2" iPad',
    category: 'Apple',
    width: 810,
    height: 1080
  }, {
    type: '10.5" iPad Air',
    category: 'Apple',
    width: 835,
    height: 1112
  }, {
    type: '11" iPad Pro',
    category: 'Apple',
    width: 834,
    height: 1194
  }, {
    type: '12.9" iPad Pro',
    category: 'Apple',
    width: 1024,
    height: 1366
  }
];

export const APPLE_WATCH_DEVICES: em.Device[] = [
  {
    type: 'Apple Watch 38mm',
    category: 'Apple',
    width: 136,
    height: 170
  }, {
    type: 'Apple Watch 40mm',
    category: 'Apple',
    width: 162,
    height: 197
  }, {
    type: 'Apple Watch 42mm',
    category: 'Apple',
    width: 156,
    height: 195
  }, {
    type: 'Apple Watch 44mm',
    category: 'Apple',
    width: 184,
    height: 224
  }
];

export const APPLE_TV_DEVICES: em.Device[] = [
  {
    type: 'Apple TV',
    category: 'Apple',
    width: 1920,
    height: 1028
  }
];

export const APPLE_MAC_DEVICES: em.Device[] = [
  {
    type: 'Touch Bar',
    category: 'Apple',
    width: 1085,
    height: 30
  }
];

export const APPLE_DEVICES: em.DeviceCategory[] = [
  {
    type: 'iPhone',
    devices: APPLE_IPHONE_DEVICES
  }, {
    type: 'iPad',
    devices: APPLE_IPAD_DEVICES
  }, {
    type: 'Apple Watch',
    devices: APPLE_WATCH_DEVICES
  }, {
    type: 'Apple TV',
    devices: APPLE_TV_DEVICES
  }, {
    type: 'Mac',
    devices: APPLE_MAC_DEVICES
  }
];

export const ANDROID_MOBILE_DEVICES: em.Device[] = [
  {
    type: 'Android',
    category: 'Android',
    width: 360,
    height: 640
  }, {
    type: 'Pixel 2',
    category: 'Android',
    width: 412,
    height: 732
  }, {
    type: 'Pixel 2 XL',
    category: 'Android',
    width: 360,
    height: 720
  }, {
    type: 'Pixel 3',
    category: 'Android',
    width: 360,
    height: 720
  }, {
    type: 'Pixel 3 XL',
    category: 'Android',
    width: 360,
    height: 740
  }, {
    type: 'Galaxy S10e',
    category: 'Android',
    width: 360,
    height: 760
  }, {
    type: 'Galaxy S10',
    category: 'Android',
    width: 360,
    height: 760
  }, {
    type: 'Galaxy S10+',
    category: 'Android',
    width: 360,
    height: 760
  }
];

export const ANDROID_TABLET_DEVICES: em.Device[] = [
  {
    type: 'Nexus 7',
    category: 'Android',
    width: 600,
    height: 960
  }, {
    type: 'Nexus 9',
    category: 'Android',
    width: 768,
    height: 1024
  }, {
    type: 'Nexus 10',
    category: 'Android',
    width: 800,
    height: 1280
  }
];

export const ANDROID_CHROMEBOOK_DEVICES: em.Device[] = [
  {
    type: 'Pixel State',
    category: 'Android',
    width: 1333,
    height: 888
  }, {
    type: 'Pixelbook',
    category: 'Android',
    width: 1200,
    height: 800
  }
];

export const ANDROID_DEVICES: em.DeviceCategory[] = [
  {
    type: 'Common Mobile',
    devices: ANDROID_MOBILE_DEVICES
  }, {
    type: 'Common Tablet',
    devices: ANDROID_TABLET_DEVICES
  }, {
    type: 'Chromebook',
    devices: ANDROID_CHROMEBOOK_DEVICES
  }
];

export const RESPONSIVE_WEB_MOBILE_DEVICES: em.Device[] = [
  {
    type: 'Mobile',
    category: 'Responsive Web',
    width: 320,
    height: 1024
  }
];

export const RESPONSIVE_WEB_TABLET_DEVICES: em.Device[] = [
  {
    type: 'Tablet',
    category: 'Responsive Web',
    width: 768,
    height: 1024
  }
];

export const RESPONSIVE_WEB_DESKTOP_DEVICES: em.Device[] = [
  {
    type: 'Desktop',
    category: 'Responsive Web',
    width: 1024,
    height: 1024
  }, {
    type: 'Desktop HD',
    category: 'Responsive Web',
    width: 1440,
    height: 1024
  }
];

export const RESPONSIVE_WEB_DEVICES: em.DeviceCategory[] = [
  {
    type: 'Mobile',
    devices: RESPONSIVE_WEB_MOBILE_DEVICES
  }, {
    type: 'Tablet',
    devices: RESPONSIVE_WEB_TABLET_DEVICES
  }, {
    type: 'Desktop',
    devices: RESPONSIVE_WEB_DESKTOP_DEVICES
  }
];

export const DEVICES: em.DevicePlatform[] = [
  {
    type: 'Apple',
    categories: APPLE_DEVICES
  }, {
    type: 'Android',
    categories: ANDROID_DEVICES
  }, {
    type: 'Responsive Web',
    categories: RESPONSIVE_WEB_DEVICES
  }
];