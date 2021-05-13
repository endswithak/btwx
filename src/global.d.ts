declare module 'lodash.debounce';
declare module 'lodash.clonedeep';
declare module 'react-scroll-sync';
declare module 'string.prototype.replaceall';
declare var MediaRecorder: any;

declare namespace Btwx {

  type EventTweenHandle = 'delay' | 'duration' | 'both';

  type ButtonType = 'submit' | 'reset' | 'button' | 'checkbox' | 'radio';

  type AspectRatio = '1x1' | '4x3' | '16x9' | '21x9';

  type ColorVariant = 'primary' | 'accent' | 'success' | 'error' | 'warn' | 'info';

  type TextColorVariant = ColorVariant |
                          'base' |
                          'light' |
                          'lighter' |
                          'lightest' |
                          'base-on-primary' |
                          'base-on-accent' |
                          'base-on-success' |
                          'base-on-error' |
                          'base-on-info' |
                          'base-on-warn' |
                          'base-on-recording' |
                          'light-on-primary' |
                          'light-on-accent' |
                          'light-on-success' |
                          'light-on-error' |
                          'light-on-info' |
                          'light-on-warn' |
                          'light-on-recording' |
                          'lighter-on-primary' |
                          'lighter-on-accent' |
                          'lighter-on-success' |
                          'lighter-on-error' |
                          'lighter-on-info' |
                          'lighter-on-warn' |
                          'lighter-on-recording' |
                          'lightest-on-primary' |
                          'lightest-on-accent' |
                          'lightest-on-success' |
                          'lightest-on-error' |
                          'lightest-on-info' |
                          'lightest-on-warn' |
                          'lightest-on-recording';

  type ThemeTextStyle = 'body-1' | 'body-2' | 'detail' | 'cap' | 'small-cap';

  type WindowType = 'document' | 'preview' | 'preferences';

  type PreferencesTab = 'general' | 'bindings';

  type SizeVariant = 'small' | 'large';

  type TextSizeVariant = 'small' | 'large' | 'extra-small';

  type ResizeHandle = 'topLeft' | 'topCenter' | 'topRight' | 'bottomLeft' | 'bottomCenter' | 'bottomRight' | 'leftCenter' | 'rightCenter';

  type LineHandle = 'lineFrom' | 'lineTo' | 'lineMove';

  type PaperScope = 'main' | 'preview';

  type SelectionFrameHandle = ResizeHandle | LineHandle | 'move' | 'none' | 'all';

  type GradientHandle = 'origin' | 'destination' | 'connector';

  type GradientProp = 'fill' | 'stroke';

  type ResizeType = 'n' | 'e' | 's' | 'w' | 'ne' | 'nw' | 'se' | 'sw' | 'ew' | 'ns' | 'nesw' | 'nwses';

  type CanvasCursor = 'n-resize' | 'e-resize' | 's-resize' | 'w-resize' | 'ne-resize' | 'nw-resize' | 'se-resize' | 'sw-resize' | 'ew-resize' | 'ns-resize' | 'nesw-resize' | 'nwses-resize' | 'nwse-resize' | 'move' | 'pointer' | 'zoom-in' | 'zoom-out' | 'crosshair' | 'text' | 'auto';

  type ZoomType = 'in' | 'out';

  type ToolType = 'Shape' | 'Selection' | 'Artboard' | 'Text' | 'Drag' | 'AreaSelect' | 'Resize' | 'Line' | 'Gradient' | 'Translate' | 'Zoom';

  type Orientation = 'Portrait' | 'Landscape';

  type EventType = 'mousedown' | 'mouseup' | 'mousedrag' | 'click' | 'rightclick' | 'doubleclick' | 'mousemove' | 'mouseenter' | 'mouseleave';

  type UIElement = 'SelectionFrame' | 'HoverFrame' | 'DragFrame' | 'GradientFrame' | 'ActiveArtboardFrame' | 'EventsFrame';

  type CubicBezier = 'linear' | 'power1' | 'power2' | 'power3' | 'power4' | 'back' | 'elastic' | 'bounce' | 'circ' | 'expo' | 'sine' | 'rough' | 'slow' | 'steps' | 'customBounce' | 'customWiggle';

  type CubicBezierType = 'in' | 'inOut' | 'out';

  type MenuType = 'default' | 'input';

  type ContextMenuType = 'layer' | 'event' | 'artboardPreset' | 'tweenLayer';

  type ColorFormat = 'rgb' | 'hsl';

  // type TweenProp = 'image' | 'shape' | 'fill' | 'fillGradientOriginX' | 'fillGradientOriginY' | 'fillGradientDestinationX' | 'fillGradientDestinationY' | 'x' | 'y' | 'radius' | 'rotation' | 'width' | 'height' | 'stroke' | 'strokeGradientOriginX' | 'strokeGradientOriginY' | 'strokeGradientDestinationX' | 'strokeGradientDestinationY' | 'dashOffset' | 'dashArrayWidth' | 'dashArrayGap' | 'strokeWidth' | 'shadowColor' | 'shadowOffsetX' | 'shadowOffsetY' | 'shadowBlur' | 'opacity' | 'fontSize' | 'lineHeight' | 'paragraph' | 'fontWeight' | 'letterSpacing' | 'oblique' | 'justification' | 'text' | 'fromX' | 'fromY' | 'toX' | 'toY' | 'pointX' | 'pointY' | 'blur';
  type TweenProp = 'shape' | 'fill' | 'fillGradientOriginX' | 'fillGradientOriginY' | 'fillGradientDestinationX' | 'fillGradientDestinationY' | 'x' | 'y' | 'radius' | 'rotation' | 'width' | 'height' | 'stroke' | 'strokeGradientOriginX' | 'strokeGradientOriginY' | 'strokeGradientDestinationX' | 'strokeGradientDestinationY' | 'dashOffset' | 'dashArrayWidth' | 'dashArrayGap' | 'strokeWidth' | 'shadowColor' | 'shadowOffsetX' | 'shadowOffsetY' | 'shadowBlur' | 'opacity' | 'fontSize' | 'lineHeight' | 'fontWeight' | 'letterSpacing' | 'text' | 'blur' | 'scaleX' | 'scaleY';

  type TweenPropMap = { [K in TweenProp]: boolean; }

  type LayerType = 'Root' | 'Group' | 'Shape' | 'Artboard' | 'Text' | 'Image';

  type BlendMode = 'normal' | 'darken' | 'multiply' | 'color-burn' | 'lighten' | 'screen' | 'color-dodge' | 'overlay' | 'soft-light' | 'hard-light' | 'difference' | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity' | 'add' | 'subtract' | 'average' | 'pin-light' | 'negation' | 'source-over' | 'source-in' | 'source-out' | 'source-atop' | 'destination-over' | 'destination-in' | 'destination-out' | 'destination-atop' | 'lighter' | 'darker' | 'copy' | 'xor';

  type ColorEditorProp = 'fillColor' | 'strokeColor' | 'shadowColor';

  type StrokeCap = 'round' | 'square' | 'butt';

  type StrokeJoin = 'miter' | 'round' | 'bevel';

  type Jusftification = 'left' | 'center' | 'right';

  type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900; // 'normal' | 'italic' | 'bold' | 'bold italic';

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

  type DeviceType = any;

  type DeviceCategoryType = AppleDeviceCategory | AndroidDeviceCategory | ResponsiveWebDeviceCategory | 'Custom';

  type DevicePlatformType = 'Apple' | 'Android' | 'Responsive Web' | 'Custom';

  type DeviceOrientationType = 'Landscape' | 'Portrait';

  type BooleanOperation = 'unite' | 'intersect' | 'subtract' | 'exclude' | 'divide';

  type EventSortBy = 'layer' | 'event' | 'artboard' | 'destinationArtboard';

  type EventSort = 'none' | 'layer-asc' | 'layer-dsc' | 'event-asc' | 'event-dsc' | 'artboard-asc' | 'artboard-dsc' | 'destinationArtboard-asc' | 'destinationArtboard-dsc';

  type FillStrokeTween = 'colorToColor' | 'nullToColor' | 'colorToNull' | 'gradientToGradient' | 'gradientToColor' | 'colorToGradient' | 'gradientToNull' | 'nullToGradient';

  type SnapZoneType = 'left' | 'right' | 'top' | 'bottom' | 'center' | 'middle';

  interface SnapZones {
    top: paper.Rectangle;
    middle: paper.Rectangle;
    bottom: paper.Rectangle;
    left: paper.Rectangle;
    center: paper.Rectangle;
    right: paper.Rectangle;
  }

  interface SnapPoint {
    snapZone: SnapZoneType;
    layerSnapZone: SnapZoneType;
    layerBounds: paper.Rectangle;
    layerId: string;
    x?: number;
    y?: number;
  }

  interface SnapState {
    snapPoint: SnapPoint;
    breakThreshold: number;
  }

  interface SnapToLayer {
    layer: paper.Item;
    snapPoint: SnapPoint;
    snapBoundsPoint: SnapPoint;
    distance: number;
  }

  interface SnapZoneSnapToLayers {
    snapZone: SnapZoneType;
    layers: SnapToLayer[];
    bounds: paper.Rectangle;
  }

  interface Document {
    layer: any;
    documentSettings: any;
    viewSettings: any;
  }

  interface HitResult {
    type: 'Layer' | 'UIElement' | 'Empty';
    event: paper.ToolEvent;
    layerProps: {
      layerItem: Layer;
      nearestScopeAncestor: Layer;
      deepSelectItem: Layer;
    };
    uiElementProps: {
      elementId: UIElement;
      interactive: boolean;
      interactiveType: string;
    };
  }

  interface Icon {
    name: string;
    fill: string;
    opacity: string;
  }

  interface Color {
    h: number;
    s: number;
    l: number;
    a: number;
  }

  interface PaperGradientFill extends paper.Color {
    origin: paper.Point;
    destination: paper.Point;
    gradient: paper.Gradient;
  }

  interface DeviceColor {
    id: string;
    type: string;
  }

  interface Device {
    id: string;
    type: DeviceType;
    category: DevicePlatformType;
    width: number;
    height: number;
    frame?: {
      width: number;
      height: number;
    };
    colors?: DeviceColor[];
  }

  interface DeviceCategory {
    type: DeviceCategoryType;
    devices: Device[];
  }

  interface DevicePlatform {
    type: DevicePlatformType;
    categories: DeviceCategory[];
  }

  interface BlurStyle {
    enabled: boolean;
    radius: number;
  }

  interface Style {
    fill: Fill;
    stroke: Stroke;
    strokeOptions: StrokeOptions;
    shadow: Shadow;
    opacity: number;
    blur: BlurStyle;
    blendMode: BlendMode;
  }

  type TextTransform = 'uppercase' | 'lowercase' | 'none';

  type VerticalAlignment = 'top' | 'middle' | 'bottom';

  type FontStyle = 'normal' | 'italic';

  interface TextStyle {
    fontSize: number;
    leading: number | 'auto';
    fontWeight: FontWeight;
    fontFamily: string;
    fontStyle: FontStyle;
    justification: Jusftification;
    letterSpacing: number;
    textTransform: TextTransform;
    verticalAlignment: VerticalAlignment;
    textResize: TextResize;
  }

  type FillType = 'color' | 'gradient';

  interface Fill {
    fillType: FillType;
    enabled: boolean;
    color: Color;
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
    color: Color;
  }

  interface Stroke {
    fillType: FillType;
    enabled: boolean;
    color: Color;
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
    color: Color;
    blur: number;
    offset: Point;
  }

  interface Layer {
    type: LayerType;
    id: string;
    // index: number;
    name: string;
    artboard: string;
    parent: string;
    children: string[];
    scope: string[];
    frame: Frame;
    showChildren: boolean;
    selected: boolean;
    hover: boolean;
    events: string[];
    tweens: {
      allIds: string[];
      asOrigin: string[];
      asDestination: string[];
      byProp: {
        [prop: string]: string[];
      };
    };
    transform: Transform;
    style: Style;
  }

  interface Root extends Layer {
    type: 'Root';
    id: 'root';
    parent: null;
    children: string[];
    scope: string[];
  }

  interface Artboard extends Layer {
    type: 'Artboard';
    originArtboardForEvents: string[];
    destinationArtboardForEvents: string[];
    projectIndex: number;
  }

  interface MaskableLayer extends Layer {
    underlyingMask: string;
    ignoreUnderlyingMask: boolean;
    masked: boolean;
  }

  interface Group extends MaskableLayer {
    type: 'Group';
  }

  type TextResize = 'autoWidth' | 'autoHeight' | 'fixed';

  interface Text extends MaskableLayer {
    type: 'Text';
    text: string;
    lines: TextLine[];
    paragraphs: string[][];
    point: Btwx.Point;
    textStyle: TextStyle;
  }

  interface TextLine {
    text: string;
    frame: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    anchor: Point;
  }

  interface Image extends MaskableLayer {
    type: 'Image';
    imageId: string;
    originalDimensions: {
      width: number;
      height: number;
    };
  }

  interface Shape extends MaskableLayer {
    type: 'Shape';
    shapeType: ShapeType;
    closed: boolean;
    pathData: string;
    mask: boolean;
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

  interface CurvePoint {
    point: Point;
    handleIn: Point;
    handleOut: Point;
  }

  interface DocumentImage {
    id: string;
    buffer: Buffer;
    ext: string;
  }

  type ClipboardType = 'layers' | 'style' | 'sketch-layers';

  interface ClipboardLayers {
    type: ClipboardType;
    compiledIds: string[];
    main: string[];
    topScopeChildren: string[];
    topScopeArtboards: {
      allIds: string[];
      byId: {
        [id: string]: Artboard;
      };
    };
    allIds: string[];
    allArtboardIds: string[];
    allShapeIds: string[];
    allGroupIds: string[];
    allTextIds: string[];
    allImageIds: string[];
    byId: {
      [id: string]: Layer;
    };
    images: {
      [id: string]: DocumentImage;
    };
    bounds: paper.Rectangle | number[];
    events?: {
      allIds: string[];
      byId: {
        [id: string]: Event;
      };
    };
    shapeIcons: {
      [id: string]: string;
    };
    tweens?: {
      allIds: string[];
      byId: {
        [id: string]: Tween;
      };
    }
  }

  interface ClipboardStyle {
    type: ClipboardType;
    style: Style;
    textStyle: TextStyle;
  }

  interface Event {
    id: string;
    name: string;
    layer: string;
    event: EventType;
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
    repeat: number;
    repeatDelay: number;
    yoyo: boolean;
    yoyoEase: boolean | string;
    frozen: boolean;
    text: TextTween;
    scrambleText: ScrambleTextTween;
    customBounce: CustomBounceTween;
    customWiggle: CustomWiggleTween;
    steps: StepsTween;
    rough: RoughTween;
    slow: SlowTween;
  }

  // type ShapeTweenType = 'linear' | 'rotational';

  // interface ShapeTween {
  //   type: ShapeTweenType;
  //   origin: string;
  // }

  interface TextTween {
    delimiter: string;
    speed: number;
    diff: boolean;
    scramble: boolean;
  }

  type ScrambleTextTweenCharacters = 'upperCase' | 'lowerCase' | 'upperAndLowerCase' | 'custom';

  interface ScrambleTextTween {
    characters: ScrambleTextTweenCharacters;
    customCharacters: string;
    revealDelay: number;
    speed: number;
    delimiter: string;
    rightToLeft: boolean;
  }

  interface StepsTween {
    steps: number;
  }

  type EaseEditorTab = 'ease' | 'text';

  interface ParamInfo {
    type: string;
    description: string;
  }

  type RoughTweenTaper = 'in' | 'out' | 'both' | 'none';

  interface RoughTween {
    clamp: boolean;
    points: number;
    randomize: boolean;
    strength: number;
    taper: RoughTweenTaper;
    template: string;
    ref: string;
  }

  interface SlowTween {
    linearRatio: number;
    power: number;
    yoyoMode: boolean;
  }

  interface CustomBounceTween {
    strength: number;
    endAtStart: boolean;
    squash: number;
  }

  type CustomWiggleTweenType = 'easeOut' | 'easeInOut' | 'anticipate' | 'uniform' | 'random';

  interface CustomWiggleTween {
    strength: any;
    wiggles: number;
    type: CustomWiggleTweenType;
  }

  type Dropzone = 'top' | 'center' | 'bottom';

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
    error: string;
    errorHover: string;
    warn: string;
    warnHover: string;
    success: string;
    successHover: string;
  }

  interface BackgroundScale {
    z8: string;
    z7: string;
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
    onError: string;
    onRecording: string;
    onWarn: string;
    onSuccess: string;
  }

  type ThemeName = 'light' | 'dark';

  type CanvasTheme = 'btwx-default' | 'light' | 'dark';

  interface Theme {
    name: ThemeName;
    palette: {
      primary: string;
      primaryActive: string;
      accent: string;
      accentActive: string;
      gray: string;
      grayActive: string;
      success: string;
      successActive: string;
      info: string;
      infoActive: string;
      error: string;
      errorActive: string;
      recording: string;
      recordingActive: string;
      warn: string;
      warnActive: string;
    };
    text: {
      base: string;
      light: string;
      lighter: string;
      lightest: string;
      onPalette: {
        primary: string;
        accent: string;
        success: string;
        info: string;
        error: string;
        recording: string;
        warn: string;
      };
    };
    background: BackgroundScale;
    foreground: BackgroundScale;
    buttonBackground: string;
    buttonBorder: string;
    buttonBorderActive: string;
    controlBackground: string;
    controlBorder: string;
    controlBorderActive: string;
    sidebarBackground: string;
    sidebarBorder: string;
    topbarBackground: string;
    topbarBorder: string;
    listItemRootBackground: string;
    eventFrameInactiveColor: string;
    unit: number;
  }

  type ShapeType = 'Rectangle' | 'Ellipse' | 'Rounded' | 'Polygon' | 'Star' | 'Line' | 'Custom';

  interface SnapBound {
    side: 'left' | 'right' | 'center' | 'top' | 'bottom';
    point: number;
  }

  interface Point {
    x: number;
    y: number;
  }

  interface DocumentWindows {
    [id: number]: DocumentWindow;
  }

  interface DocumentWindow {
    document: number;
    preview: number;
  }

  interface Tree {
    stickyArtboard: string;
    byId: any;
    scroll: string;
  }

  interface Edit {
    id?: string;
    selectedEdit?: string;
    actionType: string;
    payload: any;
    detail: string;
    treeEdit?: boolean;
    undoable: boolean;
  }
}