declare namespace em {

  type TweenEventType = 'click' | 'doubleclick' | 'mouseenter' | 'mouseleave';

  type TweenEaseTypes = 'linear' | 'power1' | 'power2' | 'power3' | 'power4' | 'back' | 'elastic' | 'bounce' | 'rough' | 'slow' | 'steps' | 'circ' | 'expo' | 'sine' | 'custom';

  type TweenEasePowerTypes = 'in' | 'inOut' | 'out';

  type ContextMenu = 'TweenEvent' | 'TweenEventDestination';

  type TweenPropTypes = 'shapePath' | 'fillColor' | 'x' | 'y' | 'rotation' | 'width' | 'height' | 'strokeColor' | 'strokeWidth' | 'shadowColor' | 'shadowOffsetX' | 'shadowOffsetY' | 'shadowBlur' | 'opacity';

  type LayerTypes = 'Group' | 'Shape' | 'Page' | 'Artboard' | 'ArtboardBackground';

  interface Layer {
    type: LayerTypes;
    id: string;
    frame: em.Frame;
    name: string;
    parent: string;
    //paperLayer: string;
    selected: boolean;
    children: string[] | null;
    tweenEvents: string[];
    tweens: string[];
  }

  interface ClipboardLayer {
    type: LayerTypes;
    id: string;
    name: string;
    parent: string;
    paperLayer: paper.Item;
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
    //background: string;
  }

  interface ArtboardBackground extends Layer {
    type: 'ArtboardBackground';
    children: null;
  }

  interface Page extends Layer {
    type: 'Page';
    children: string[];
  }

  interface Shape extends Layer {
    type: 'Shape';
    shapeType: em.ShapeType;
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
    prop: TweenPropTypes;
    layer: string;
    destinationLayer: string;
    event: string;
    ease: TweenEaseTypes;
    power: TweenEasePowerTypes;
    duration: number;
    delay: number;
    frozen: boolean;
  }

  interface TweenPropMap {
    shapePath: boolean;
    fillColor: boolean;
    x: boolean;
    y: boolean;
    rotation: boolean;
    width: boolean;
    height: boolean;
    strokeColor: boolean;
    strokeWidth: boolean;
    shadowColor: boolean;
    shadowOffsetX: boolean;
    shadowOffsetY: boolean;
    shadowBlur: boolean;
    opacity: boolean;
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

  // Models / Style

  interface Style {
    // opacity: number;
    // blendingMode: BlendingMode;
    // blur: Blur;
    fills: Fill[];
    // borders: Border[];
    // borderOptions: BorderOptions;
    // shadows: Shadow[];
    // innerShadows: Shadow[];
  }

  interface TextStyle {
    alignment: Alignment;
    verticalAlignment: VerticalAlignment;
    kerning: number | null;
    lineHeight: number | null;
    paragraphSpacing: number;
    textColor: string;
    fontSize: number;
    textTransform: TextTransform;
    fontFamily: string;
    fontWeight: FontWeight;
    fontStyle: FontStyle;
    fontVariant: FontVariant;
    fontStretch: FontStretch;
    textUnderline: TextUnderline;
    textStrikethrough: TextStrikethrough;
    fontAxes: FontAxes[];
  }

  // Models / Style / BlendingMode

  type BlendingMode = 'Normal' | 'Darken' | 'Multiply' | 'ColorBurn' | 'Lighten' | 'Screen' | 'ColorDodge' | 'Overlay' | 'SoftLight' | 'HardLight' | 'Difference' | 'Exclusion' | 'Hue' | 'Saturation' | 'Color' | 'Luminosity';

  // Models / Style / Blur

  interface Blur {
    blurType: BlurType;
    radius: number;
    motionAngle: number;
    center: BlurCenter;
    enabled: boolean;
  }

  // Models / Style / Blur / BlurType

  type BlurType = 'Gaussian' | 'Motion' | 'Zoom' | 'Background';

  // Models / Style / Blur / BlurCenter

  interface BlurCenter {
    x: number;
    y: number;
  }

  // Models / Style / Border

  interface Border {
    fillType: FillType;
    color: string;
    gradient: Gradient;
    enabled: boolean;
    position: BorderPosition;
    thickness: number;
  }

  // Models / Style / Border / BorderPosition

  type BorderPosition = 'Center' | 'Inside' | 'Outside';

  // Models / Style / BorderOptions

  interface BorderOptions {
    dashPattern: number[];
    lineEnd: LineEnd;
    lineJoin: LineJoin;
  }

  // Models / Style / BorderOptions / ArrowHead

  type ArrowHead = 'None' | 'OpenArrow' | 'FilledArrow' | 'Line' | 'OpenCircle' | 'FilledCircle' | 'OpenSquare' | 'FilledSquare';

  // Models / Style / BorderOptions / LineEnd

  type LineEnd = 'Butt' | 'Round' | 'Projecting';

  // Models / Style / BorderOptions / LineJoin

  type LineJoin = 'Miter' | 'Round' | 'Bevel';

  // Models / Style / Fill

  interface Fill {
    fillType?: FillType;
    color?: string;
    gradient?: Gradient;
    pattern?: Pattern;
    enabled?: boolean;
  }

  // Models / Style / Fill / FillType

  type FillType = 'Color' | 'Gradient' | 'Pattern';

  // Models / Style / Fill / Gradient

  interface Gradient {
    gradientType: GradientType;
    from: Point;
    to: Point;
    aspectRatio: number;
    stops: GradientStop[];
  }

  // Models / Style / Fill / Gradient / GradientType

  type GradientType = 'Linear' | 'Radial' | 'Angular';

  // Models / Style / Fill / Gradient / GradientStop

  interface GradientStop {
    position: number;
    color: string;
  }

  // Models / Style / Fill / Pattern

  interface Pattern {
    patternType: PatternFillType;
    image: string;
    tileScale: number;
  }

  // Models / Style / Fill / Pattern / PatternFillType

  type PatternFillType = 'Tile' | 'Fill' | 'Stretch' | 'Fit';

  // Models / Style / Shadow

  interface Shadow {
    color: string;
    blur: number;
    x: number;
    y: number;
    spread: number;
    enabled: boolean;
  }

  // Models / Style / Alignment

  type Alignment = 'left' | 'right' | 'center' | 'justified';

  // Models / Style / VerticalAlignment

  type VerticalAlignment = 'top' | 'center' | 'bottom';

  // Models / Style / TextTransform

  type TextTransform = 'none' | 'uppercase' | 'lowercase';

  // Models / Style / FontWeight

  type FontWeight = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

  // Models / Style / FontStyle

  type FontStyle = 'italic' | undefined;

  // Models / Style / FontVariant

  type FontVariant = 'small-caps' | undefined;

  // Models / Style / FontStretch

  type FontStretch = 'compressed' | 'condensed' | 'narrow' | 'expanded' | 'poster' | undefined;

  // Models / Style / TextUnderline

  type TextUnderline = 'single' | 'thick' | 'double' | 'dot' | 'dash' | 'dash-dot' | 'dash-dot-dot';

  // Models / Style / TextStrikethrough

  type TextStrikethrough = 'single' | 'thick' | 'double' | 'dot' | 'dash' | 'dash-dot' | 'dash-dot-dot';
}