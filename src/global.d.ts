declare module 'lodash.debounce';
declare module 'react-scroll-sync';
declare namespace em {

  type ResizingType = 'n' | 'e' | 's' | 'w' | 'ne' | 'nw' | 'se' | 'sw' | 'ew' | 'ns' | 'nesw' | 'nwses';

  type ZoomingType = 'in' | 'out';

  type ToolType = 'Shape' | 'Selection' | 'Artboard' | 'Text';

  type Orientation = 'Portrait' | 'Landscape';

  type TweenEventType = 'click' | 'doubleclick' | 'mouseenter' | 'mouseleave';

  type CubicBezier = 'linear' | 'power1' | 'power2' | 'power3' | 'power4' | 'back' | 'elastic' | 'bounce' | 'rough' | 'slow' | 'steps' | 'circ' | 'expo' | 'sine' | 'custom';

  type CubicBezierType = 'in' | 'inOut' | 'out';

  type ContextMenu = 'LayerEdit' | 'TweenEvent' | 'TweenEventDestination' | 'ArtboardCustomPreset';

  type ColorFormat = 'rgb' | 'hsl';

  type TweenProp = 'image' | 'shape' | 'fill' | 'fillGradientOriginX' | 'fillGradientOriginY' | 'fillGradientDestinationX' | 'fillGradientDestinationY' | 'x' | 'y' | 'radius' | 'rotation' | 'width' | 'height' | 'stroke' | 'strokeGradientOriginX' | 'strokeGradientOriginY' | 'strokeGradientDestinationX' | 'strokeGradientDestinationY' | 'dashOffset' | 'dashArrayWidth' | 'dashArrayGap' | 'strokeWidth' | 'shadowColor' | 'shadowOffsetX' | 'shadowOffsetY' | 'shadowBlur' | 'opacity' | 'fontSize' | 'lineHeight' | 'fromX' | 'fromY' | 'toX' | 'toY';

  type TweenPropMap = { [K in TweenProp]: boolean; }

  type LayerType = 'Group' | 'Shape' | 'Page' | 'Artboard' | 'Text' | 'Image';

  type BlendMode = 'normal' | 'darken' | 'multiply' | 'color-burn' | 'lighten' | 'screen' | 'color-dodge' | 'overlay' | 'soft-light' | 'hard-light' | 'difference' | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity' | 'add' | 'subtract' | 'average' | 'pin-light' | 'negation' | 'source-over' | 'source-in' | 'source-out' | 'source-atop' | 'destination-over' | 'destination-in' | 'destination-out' | 'destination-atop' | 'lighter' | 'darker' | 'copy' | 'xor';

  type ColorEditorProp = 'fillColor' | 'strokeColor' | 'shadowColor';

  type StrokeCap = 'round' | 'square' | 'butt';

  type StrokeJoin = 'miter' | 'round' | 'bevel';

  type Jusftification = 'left' | 'center' | 'right';

  type FontWeight = 'normal' | 'italic' | 'bold' | 'bold italic';

  type AppleiPhoneDevice = 'iPhone 8' | 'iPhone 8 Plus' | 'iPhone SE' | 'iPhone 11 Pro' | 'iPhone 11' | 'iPhone 11 Pro Max';

  type AppleiPadDevice = '7.9" iPad mini' | '10.2" iPad' | '10.5" iPad Air' | '11" iPad Pro' | '12.9" iPad Pro';

  type AppleWatchDevice = 'Apple Watch 38mm' | 'Apple Watch 40mm' | 'Apple Watch 42mm' | 'Apple Watch 44mm';

  type AppleTVDevice = 'Apple TV';

  type AppleMacDevice = 'Touch Bar';

  type AppleDeviceType = AppleiPhoneDevice | AppleiPadDevice | AppleWatchDevice | AppleTVDevice | AppleMacDevice;

  type AppleDeviceCategory = 'iPhone' | 'iPad' | 'Mac' | 'Apple TV' | 'Apple Watch';

  type AndroidMobileDevice = 'Android' | 'Pixel 2' | 'Pixel 2 XL' | 'Pixel 3' | 'Pixel 3 XL' | 'Galaxy S10e' | 'Galaxy S10' | 'Galaxy S10+';

  type AndroidTabletDevice = 'Nexus 7' | 'Nexus 9' | 'Nexus 10';

  type AndroidChromebookDevice = 'Pixel State' | 'Pixelbook';

  type AndroidDeviceType = AndroidMobileDevice | AndroidTabletDevice | AndroidChromebookDevice;

  type AndroidDeviceCategory = 'Common Mobile' | 'Common Tablet' | 'Chromebook';

  type ResponsiveWebMobileDevice = 'Mobile';

  type ResponsiveWebTabletDevice = 'Tablet';

  type ResponsiveWebDesktopDevice = 'Desktop' | 'Desktop HD';

  type ResponsiveWebDeviceType = ResponsiveWebMobileDevice | ResponsiveWebTabletDevice | ResponsiveWebDesktopDevice;

  type ResponsiveWebDeviceCategory = 'Mobile' | 'Tablet' | 'Desktop';

  type DeviceType = AppleDevice | AndroidDevice | ResponsiveWebDevice;

  type DeviceCategoryType = AppleDeviceCategory | AndroidDeviceCategory | ResponsiveWebDeviceCategory | 'Custom';

  type DevicePlatformType = 'Apple' | 'Android' | 'Responsive Web' | 'Custom';

  type DeviceOrientationType = 'Landscape' | 'Portrait';

  type BooleanOperation = 'unite' | 'intersect' | 'subtract' | 'exclude' | 'divide';

  type TweenEventSort = 'none' | 'layer-asc' | 'layer-dsc' | 'event-asc' | 'event-dsc' | 'artboard-asc' | 'artboard-dsc' | 'destinationArtboard-asc' | 'destinationArtboard-dsc';

  type FillStrokeTween = 'colorToColor' | 'nullToColor' | 'colorToNull' | 'gradientToGradient' | 'gradientToColor' | 'colorToGradient' | 'gradientToNull' | 'nullToGradient';

  interface Icon {
    name: string;
    fill: string;
    opacity: string;
  }

  interface Color {
    h: number;
    s: number;
    l: number;
    v: number;
    a: number;
  }

  interface PaperGradientFill extends paper.Color {
    origin: paper.Point;
    destination: paper.Point;
    gradient: paper.Gradient;
  }

  interface Device {
    type: DeviceType;
    category: DevicePlatformType;
    width: number;
    height: number;
  }

  interface DeviceCategory {
    type: DeviceCategoryType;
    devices: em.Device[];
  }

  interface DevicePlatform {
    type: DevicePlatformType;
    categories: em.DeviceCategory[];
  }

  interface Style {
    fill: Fill;
    stroke: Stroke;
    strokeOptions: StrokeOptions;
    shadow: Shadow;
    opacity: number;
    blendMode: BlendMode;
  }

  interface TextStyle {
    fontSize: number;
    leading: number;
    fontWeight: FontWeight;
    fontFamily: string;
    justification: Jusftification;
  }

  type FillType = 'color' | 'gradient';

  interface Fill {
    fillType: FillType;
    enabled: boolean;
    color: em.Color;
    gradient: Gradient;
  }

  type GradientType = 'linear' | 'radial';

  interface Gradient {
    gradientType: GradientType;
    origin: Point;
    destination: Point;
    activeStopIndex: number;
    stops: GradientStop[];
  }

  interface GradientStop {
    position: number;
    color: em.Color;
  }

  interface Stroke {
    fillType: FillType;
    enabled: boolean;
    color: em.Color;
    width: number;
    gradient: Gradient;
  }

  interface StrokeOptions {
    cap: StrokeCap;
    join: StrokeJoin;
    dashArray: number[];
    dashOffset: number;
  }

  interface Shadow {
    fillType: FillType;
    enabled: boolean;
    color: em.Color;
    blur: number;
    offset: Point;
  }

  interface Layer {
    type: LayerType;
    id: string;
    name: string;
    frame: em.Frame;
    parent: string;
    selected: boolean;
    children: string[] | null;
    tweenEvents: string[];
    tweens: string[];
    style: Style;
    transform: Transform;
    masked: boolean;
    mask: boolean;
  }

  type ClipboardType = 'layers' | 'style';

  interface ClipboardLayers {
    type: ClipboardType;
    main: string[];
    allIds: string[];
    byId: {
      [id: string]: Layer;
    };
    images: {
      [id: string]: DocumentImage;
    };
  }

  interface Group extends Layer {
    type: 'Group';
    children: string[];
    showChildren: boolean;
    clipped: boolean;
  }

  interface Artboard extends Layer {
    type: 'Artboard';
    children: string[];
    showChildren: boolean;
  }

  interface Page extends Layer {
    type: 'Page';
    children: string[];
  }

  interface Text extends Layer {
    type: 'Text';
    text: string;
    children: null;
    textStyle: TextStyle;
  }

  interface Shape extends Layer {
    type: 'Shape';
    shapeType: ShapeType;
    children: null;
    pathData: string;
    sides?: number;
    points?: number;
    radius?: number;
    from?: Point;
    to?: Point;
  }

  interface CurvePoint {
    point: Point;
    handleIn: Point;
    handleOut: Point;
  }

  interface Polygon extends Shape {
    sides: number;
  }

  interface Star extends Shape {
    points: number;
    radius: number;
  }

  interface Rounded extends Shape {
    radius: number;
  }

  interface Line extends Shape {
    from: Point;
    to: Point;
  }

  interface Image extends Layer {
    type: 'Image';
    imageId: string;
    children: null;
  }

  interface DocumentImage {
    id: string;
    buffer: Buffer;
  }

  interface TweenEvent {
    id: string;
    name: string;
    layer: string;
    event: TweenEventType;
    artboard: string;
    destinationArtboard: string;
    tweens: string[];
  }

  interface Tween {
    id: string;
    prop: TweenProp;
    layer: string;
    destinationLayer: string;
    event: string;
    ease: CubicBezier;
    power: CubicBezierType;
    duration: number;
    delay: number;
    frozen: boolean;
  }

  type Dropzone = 'Top' | 'Center' | 'Bottom';

  interface Frame {
    x: number;
    y: number;
    width: number;
    height: number;
    innerWidth: number;
    innerHeight: number;
  }

  interface Transform {
    rotation: number;
    horizontalFlip: boolean;
    verticalFlip: boolean;
  }

  interface ArtboardPreset {
    id: string;
    category: 'Custom';
    type: string;
    width: number;
    height: number;
  }

  interface Palette {
    primary: string;
    primaryHover: string;
    accent: string;
    accentHover: string;
    recording: string;
    recordingHover: string;
  }

  interface BackgroundScale {
    z6: string;
    z5: string;
    z4: string;
    z3: string;
    z2: string;
    z1: string;
    z0: string;
  }

  interface TextScale {
    base: string;
    light: string;
    lighter: string;
    lightest: string;
    onPrimary: string;
    onAccent: string;
  }

  type ThemeName = 'light' | 'dark';

  interface Theme {
    name: ThemeName;
    palette: Palette;
    background: BackgroundScale;
    backgroundInverse: BackgroundScale;
    text: TextScale;
    unit: number;
  }

  type ShapeType = 'Rectangle' | 'Ellipse' | 'Rounded' | 'Polygon' | 'Star' | 'Line' | 'Custom';

  interface SnapPoint {
    id: string;
    axis: 'x' | 'y';
    side: 'left' | 'right' | 'center' | 'top' | 'bottom';
    point: number;
    breakThreshold?: number;
    boundsSide?: 'left' | 'right' | 'center' | 'top' | 'bottom';
  }

  interface SnapBound {
    side: 'left' | 'right' | 'center' | 'top' | 'bottom';
    point: number;
  }

  interface Point {
    x: number;
    y: number;
  }
}