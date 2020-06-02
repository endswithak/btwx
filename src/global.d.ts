declare namespace em {

  type TweenEventType = 'click' | 'doubleclick' | 'mouseenter' | 'mouseleave';

  type CubicBezier = 'linear' | 'power1' | 'power2' | 'power3' | 'power4' | 'back' | 'elastic' | 'bounce' | 'rough' | 'slow' | 'steps' | 'circ' | 'expo' | 'sine' | 'custom';

  type CubicBezierType = 'in' | 'inOut' | 'out';

  type ContextMenu = 'TweenEvent' | 'TweenEventDestination';

  type TweenProp = 'shape' | 'fillColor' | 'x' | 'y' | 'rotation' | 'width' | 'height' | 'strokeColor' | 'strokeWidth' | 'shadowColor' | 'shadowOffsetX' | 'shadowOffsetY' | 'shadowBlur' | 'opacity' | 'fontSize';

  type TweenPropMap = { [K in TweenProp]: boolean; }

  type LayerType = 'Group' | 'Shape' | 'Page' | 'Artboard' | 'ArtboardBackground' | 'Text';

  type ColorEditorProp = 'fillColor' | 'strokeColor' | 'shadowColor';

  type StrokeCap = 'round' | 'square' | 'butt';

  type StrokeJoin = 'miter' | 'round' | 'bevel';

  type Jusftification = 'left' | 'center' | 'right';

  type FontWeight = 'normal' | 'italic' | 'bold' | 'bold italic';

  interface Style {
    fill: Fill;
    stroke: Stroke;
    strokeOptions: StrokeOptions;
    opacity: number;
    rotation: number;
    horizontalFlip: boolean;
    verticalFlip: boolean;
    shadow: Shadow;
  }

  interface TextStyle {
    fontSize: number;
    leading: number;
    fontWeight: FontWeight;
    fontFamily: string;
    justification: Jusftification;
  }

  interface Fill {
    enabled: boolean;
    color: string;
  }

  interface Stroke {
    enabled: boolean;
    color: string;
    width: number;
  }

  interface StrokeOptions {
    cap: StrokeCapTypes;
    join: StrokeJoinTypes;
    dashArray: number[];
    miterLimit: number;
  }

  interface Shadow {
    enabled: boolean;
    color: string;
    blur: number;
    offset: {
      x: number;
      y: number;
    };
  }

  interface Layer {
    type: LayerType;
    id: string;
    frame: em.Frame;
    name: string;
    parent: string;
    selected: boolean;
    children: string[] | null;
    tweenEvents: string[];
    tweens: string[];
    points: {
      closed: boolean;
    };
    style: Style;
  }

  interface ClipboardLayer {
    type: LayerType;
    id: string;
    name: string;
    parent: string;
    paperLayer: string;
    selected: boolean;
    children: string[] | null;
  }

  interface Group extends Layer {
    type: 'Group';
    children: string[];
    showChildren: boolean;
  }

  interface Artboard extends Layer {
    type: 'Artboard';
    children: string[];
    showChildren: boolean;
  }

  interface ArtboardBackground extends Layer {
    type: 'ArtboardBackground';
    children: null;
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
    pathData: string;
    children: null;
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
  }

  interface Palette {
    primary: string;
    primaryHover: string;
    accent: string;
    accentHover: string;
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

  type ShapeType = 'Rectangle' | 'Ellipse' | 'Rounded' | 'Polygon' | 'Star';
}