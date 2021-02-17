import {
  SET_FILE_NEW,
  SET_FILE_SAVE,
  SET_FILE_SAVE_AS,
  SET_FILE_OPEN,
  SET_EDIT_UNDO,
  SET_EDIT_REDO,
  SET_EDIT_CUT,
  SET_EDIT_COPY_COPY,
  SET_EDIT_COPY_STYLE,
  SET_EDIT_COPY_SVG,
  SET_EDIT_PASTE_PASTE,
  SET_EDIT_PASTE_OVER_SELECTION,
  SET_EDIT_PASTE_STYLE,
  SET_EDIT_PASTE_SVG,
  SET_EDIT_DELETE,
  SET_EDIT_DUPLICATE,
  SET_EDIT_SELECT_SELECT_ALL,
  SET_EDIT_SELECT_SELECT_ALL_ARTBOARDS,
  SET_EDIT_FIND,
  SET_EDIT_RENAME,
  SET_INSERT_ARTBOARD,
  SET_INSERT_SHAPE_RECTANGLE,
  SET_INSERT_SHAPE_ROUNDED,
  SET_INSERT_SHAPE_ELLIPSE,
  SET_INSERT_SHAPE_POLYGON,
  SET_INSERT_SHAPE_STAR,
  SET_INSERT_SHAPE_LINE,
  SET_INSERT_TEXT,
  SET_INSERT_IMAGE,
  SET_LAYER_STYLE_FILL,
  SET_LAYER_STYLE_STROKE,
  SET_LAYER_STYLE_SHADOW,
  SET_LAYER_TRANSFORM_FLIP_HORIZONTALLY,
  SET_LAYER_TRANSFORM_FLIP_VERTICALLY,
  SET_LAYER_COMBINE_UNION,
  SET_LAYER_COMBINE_SUBTRACT,
  SET_LAYER_COMBINE_INTERSECT,
  SET_LAYER_COMBINE_DIFFERENCE,
  SET_LAYER_IMAGE_ORIGINAL_DIMENSIONS,
  SET_LAYER_IMAGE_REPLACE,
  SET_LAYER_MASK_USE_AS_MASK,
  SET_LAYER_MASK_IGNORE_UNDERLYING_MASK,
  SET_ARRANGE_BRING_FORWARD,
  SET_ARRANGE_BRING_TO_FRONT,
  SET_ARRANGE_SEND_BACKWARD,
  SET_ARRANGE_SEND_TO_BACK,
  SET_ARRANGE_ALIGN_LEFT,
  SET_ARRANGE_ALIGN_CENTER,
  SET_ARRANGE_ALIGN_RIGHT,
  SET_ARRANGE_ALIGN_TOP,
  SET_ARRANGE_ALIGN_MIDDLE,
  SET_ARRANGE_ALIGN_BOTTOM,
  SET_ARRANGE_DISTRIBUTE_HORIZONTALLY,
  SET_ARRANGE_DISTRIBUTE_VERTICALLY,
  SET_ARRANGE_GROUP,
  SET_ARRANGE_UNGROUP,
  SET_VIEW_ZOOM_IN,
  SET_VIEW_ZOOM_OUT,
  SET_VIEW_ZOOM_FIT_CANVAS,
  SET_VIEW_ZOOM_FIT_SELECTED,
  SET_VIEW_ZOOM_FIT_ACTIVE_ARTBOARD,
  SET_VIEW_CENTER_SELECTED,
  SET_VIEW_SHOW_LAYERS,
  SET_VIEW_SHOW_STYLES,
  SET_VIEW_SHOW_EVENTS,
  KeyBindingsTypes
} from '../actionTypes/keyBindings';

import { remote } from 'electron';

const DEFAULT_MAC_FILE_NEW = 'Cmd+N';
const DEFAULT_MAC_FILE_SAVE = 'Cmd+S';
const DEFAULT_MAC_FILE_SAVE_AS = 'Cmd+Shift+S';
const DEFAULT_MAC_FILE_OPEN = 'Cmd+O';

const DEFAULT_MAC_FILE = [
  DEFAULT_MAC_FILE_NEW, DEFAULT_MAC_FILE_SAVE, DEFAULT_MAC_FILE_SAVE_AS, DEFAULT_MAC_FILE_OPEN,
];

const DEFAULT_MAC_EDIT_UNDO = 'Cmd+Z';
const DEFAULT_MAC_EDIT_REDO = 'Cmd+Shift+Z';
const DEFAULT_MAC_EDIT_CUT = '';
const DEFAULT_MAC_EDIT_COPY_COPY = 'Cmd+C';
const DEFAULT_MAC_EDIT_COPY_STYLE = 'Cmd+Alt+C';
const DEFAULT_MAC_EDIT_COPY_SVG = '';
const DEFAULT_MAC_EDIT_PASTE_PASTE = 'Cmd+V';
const DEFAULT_MAC_EDIT_PASTE_OVER_SELECTION = 'Cmd+Shift+V';
const DEFAULT_MAC_EDIT_PASTE_STYLE = 'Cmd+Alt+V';
const DEFAULT_MAC_EDIT_PASTE_SVG = '';
const DEFAULT_MAC_EDIT_DELETE = 'Backspace';
const DEFAULT_MAC_EDIT_DUPLICATE = 'Cmd+D';
const DEFAULT_MAC_EDIT_SELECT_SELECT_ALL = 'Cmd+A';
const DEFAULT_MAC_EDIT_SELECT_SELECT_ALL_ARTBOARDS = 'Cmd+Shift+A';
const DEFAULT_MAC_EDIT_FIND = 'Cmd+F';
const DEFAULT_MAC_EDIT_RENAME = 'Cmd+R';

const DEFAULT_MAC_EDIT = [
  DEFAULT_MAC_EDIT_UNDO, DEFAULT_MAC_EDIT_REDO, DEFAULT_MAC_EDIT_CUT, DEFAULT_MAC_EDIT_COPY_COPY,
  DEFAULT_MAC_EDIT_COPY_STYLE, DEFAULT_MAC_EDIT_COPY_SVG, DEFAULT_MAC_EDIT_PASTE_PASTE,
  DEFAULT_MAC_EDIT_PASTE_OVER_SELECTION, DEFAULT_MAC_EDIT_PASTE_STYLE, DEFAULT_MAC_EDIT_PASTE_SVG,
  DEFAULT_MAC_EDIT_DELETE, DEFAULT_MAC_EDIT_DUPLICATE, DEFAULT_MAC_EDIT_SELECT_SELECT_ALL,
  DEFAULT_MAC_EDIT_SELECT_SELECT_ALL_ARTBOARDS, DEFAULT_MAC_EDIT_FIND, DEFAULT_MAC_EDIT_RENAME,
];

const DEFAULT_MAC_INSERT_ARTBOARD = 'A';
const DEFAULT_MAC_INSERT_SHAPE_RECTANGLE = 'R';
const DEFAULT_MAC_INSERT_SHAPE_ROUNDED = 'U';
const DEFAULT_MAC_INSERT_SHAPE_ELLIPSE = 'O';
const DEFAULT_MAC_INSERT_SHAPE_POLYGON = '';
const DEFAULT_MAC_INSERT_SHAPE_STAR = '';
const DEFAULT_MAC_INSERT_SHAPE_LINE = 'L';
const DEFAULT_MAC_INSERT_TEXT = 'T';
const DEFAULT_MAC_INSERT_IMAGE = '';

const DEFAULT_MAC_INSERT = [
  DEFAULT_MAC_INSERT_ARTBOARD, DEFAULT_MAC_INSERT_SHAPE_RECTANGLE, DEFAULT_MAC_INSERT_SHAPE_ROUNDED,
  DEFAULT_MAC_INSERT_SHAPE_ELLIPSE, DEFAULT_MAC_INSERT_SHAPE_POLYGON, DEFAULT_MAC_INSERT_SHAPE_STAR,
  DEFAULT_MAC_INSERT_SHAPE_LINE, DEFAULT_MAC_INSERT_TEXT, DEFAULT_MAC_INSERT_IMAGE,
];

const DEFAULT_MAC_LAYER_STYLE_FILL = '';
const DEFAULT_MAC_LAYER_STYLE_STROKE = '';
const DEFAULT_MAC_LAYER_STYLE_SHADOW = '';
const DEFAULT_MAC_LAYER_TRANSFORM_FLIP_HORIZONTALLY = '';
const DEFAULT_MAC_LAYER_TRANSFORM_FLIP_VERTICALLY = '';
const DEFAULT_MAC_LAYER_COMBINE_UNION = 'Cmd+Alt+U';
const DEFAULT_MAC_LAYER_COMBINE_SUBTRACT = 'Cmd+Alt+S';
const DEFAULT_MAC_LAYER_COMBINE_INTERSECT = 'Cmd+Alt+I';
const DEFAULT_MAC_LAYER_COMBINE_DIFFERENCE = 'Cmd+Alt+X';
const DEFAULT_MAC_LAYER_IMAGE_ORIGINAL_DIMENSIONS = '';
const DEFAULT_MAC_LAYER_IMAGE_REPLACE = '';
const DEFAULT_MAC_LAYER_MASK_USE_AS_MASK = 'Cmd+M';
const DEFAULT_MAC_LAYER_MASK_IGNORE_UNDERLYING_MASK = 'Cmd+Shift+M';

const DEFAULT_MAC_LAYER = [
  DEFAULT_MAC_LAYER_STYLE_FILL, DEFAULT_MAC_LAYER_STYLE_STROKE, DEFAULT_MAC_LAYER_STYLE_SHADOW,
  DEFAULT_MAC_LAYER_TRANSFORM_FLIP_HORIZONTALLY, DEFAULT_MAC_LAYER_TRANSFORM_FLIP_VERTICALLY,
  DEFAULT_MAC_LAYER_COMBINE_UNION, DEFAULT_MAC_LAYER_COMBINE_SUBTRACT, DEFAULT_MAC_LAYER_COMBINE_INTERSECT,
  DEFAULT_MAC_LAYER_COMBINE_DIFFERENCE, DEFAULT_MAC_LAYER_IMAGE_ORIGINAL_DIMENSIONS,
  DEFAULT_MAC_LAYER_IMAGE_REPLACE, DEFAULT_MAC_LAYER_MASK_USE_AS_MASK,
  DEFAULT_MAC_LAYER_MASK_IGNORE_UNDERLYING_MASK,
];

const DEFAULT_MAC_ARRANGE_BRING_FORWARD = 'Cmd+]';
const DEFAULT_MAC_ARRANGE_BRING_TO_FRONT = 'Cmd+Alt+]';
const DEFAULT_MAC_ARRANGE_SEND_BACKWARD = 'Cmd+[';
const DEFAULT_MAC_ARRANGE_SEND_TO_BACK = 'Cmd+Alt+[';
const DEFAULT_MAC_ARRANGE_ALIGN_LEFT = '';
const DEFAULT_MAC_ARRANGE_ALIGN_CENTER = '';
const DEFAULT_MAC_ARRANGE_ALIGN_RIGHT = '';
const DEFAULT_MAC_ARRANGE_ALIGN_TOP = '';
const DEFAULT_MAC_ARRANGE_ALIGN_MIDDLE = '';
const DEFAULT_MAC_ARRANGE_ALIGN_BOTTOM = '';
const DEFAULT_MAC_ARRANGE_DISTRIBUTE_HORIZONTALLY = 'Ctrl+Cmd+H';
const DEFAULT_MAC_ARRANGE_DISTRIBUTE_VERTICALLY = 'Ctrl+Cmd+V';
const DEFAULT_MAC_ARRANGE_GROUP = 'Cmd+G';
const DEFAULT_MAC_ARRANGE_UNGROUP = 'Cmd+Shift+G';

const DEFAULT_MAC_ARRANGE = [
  DEFAULT_MAC_ARRANGE_BRING_FORWARD, DEFAULT_MAC_ARRANGE_BRING_TO_FRONT, DEFAULT_MAC_ARRANGE_SEND_BACKWARD,
  DEFAULT_MAC_ARRANGE_SEND_TO_BACK, DEFAULT_MAC_ARRANGE_ALIGN_LEFT, DEFAULT_MAC_ARRANGE_ALIGN_CENTER,
  DEFAULT_MAC_ARRANGE_ALIGN_RIGHT, DEFAULT_MAC_ARRANGE_ALIGN_TOP, DEFAULT_MAC_ARRANGE_ALIGN_MIDDLE,
  DEFAULT_MAC_ARRANGE_ALIGN_BOTTOM, DEFAULT_MAC_ARRANGE_DISTRIBUTE_HORIZONTALLY,
  DEFAULT_MAC_ARRANGE_DISTRIBUTE_VERTICALLY, DEFAULT_MAC_ARRANGE_GROUP, DEFAULT_MAC_ARRANGE_UNGROUP
];

const DEFAULT_MAC_VIEW_ZOOM_IN = 'Cmd+=';
const DEFAULT_MAC_VIEW_ZOOM_OUT = 'Cmd+-';
const DEFAULT_MAC_VIEW_ZOOM_FIT_CANVAS = 'Cmd+1';
const DEFAULT_MAC_VIEW_ZOOM_FIT_SELECTED = 'Cmd+2';
const DEFAULT_MAC_VIEW_ZOOM_FIT_ACTIVE_ARTBOARD = 'Cmd+4';
const DEFAULT_MAC_VIEW_CENTER_SELECTED = 'Cmd+3';
const DEFAULT_MAC_VIEW_SHOW_LAYERS = 'Cmd+Alt+1';
const DEFAULT_MAC_VIEW_SHOW_STYLES = 'Cmd+Alt+3';
const DEFAULT_MAC_VIEW_SHOW_EVENTS = 'Cmd+Alt+2';

const DEFAULT_MAC_VIEW = [
  DEFAULT_MAC_VIEW_ZOOM_IN, DEFAULT_MAC_VIEW_ZOOM_OUT, DEFAULT_MAC_VIEW_ZOOM_FIT_CANVAS,
  DEFAULT_MAC_VIEW_ZOOM_FIT_SELECTED, DEFAULT_MAC_VIEW_ZOOM_FIT_ACTIVE_ARTBOARD,
  DEFAULT_MAC_VIEW_CENTER_SELECTED, DEFAULT_MAC_VIEW_SHOW_LAYERS, DEFAULT_MAC_VIEW_SHOW_STYLES,
  DEFAULT_MAC_VIEW_SHOW_EVENTS,
];

const ALL_MAC_KEY_BINDINGS = [
  ...DEFAULT_MAC_FILE, ...DEFAULT_MAC_EDIT, ...DEFAULT_MAC_INSERT, ...DEFAULT_MAC_LAYER,
  ...DEFAULT_MAC_ARRANGE, ...DEFAULT_MAC_VIEW
];

const DEFAULT_WINDOWS_FILE_NEW = 'Ctrl+N';
const DEFAULT_WINDOWS_FILE_SAVE = 'Ctrl+S';
const DEFAULT_WINDOWS_FILE_SAVE_AS = 'Ctrl+Shift+S';
const DEFAULT_WINDOWS_FILE_OPEN = 'Ctrl+O';

const DEFAULT_WINDOWS_FILE = [
  DEFAULT_WINDOWS_FILE_NEW, DEFAULT_WINDOWS_FILE_SAVE, DEFAULT_WINDOWS_FILE_SAVE_AS, DEFAULT_WINDOWS_FILE_OPEN,
];

const DEFAULT_WINDOWS_EDIT_UNDO = 'Ctrl+Z';
const DEFAULT_WINDOWS_EDIT_REDO = 'Ctrl+Shift+Z';
const DEFAULT_WINDOWS_EDIT_CUT = '';
const DEFAULT_WINDOWS_EDIT_COPY_COPY = 'Ctrl+C';
const DEFAULT_WINDOWS_EDIT_COPY_STYLE = 'Ctrl+Alt+C';
const DEFAULT_WINDOWS_EDIT_COPY_SVG = '';
const DEFAULT_WINDOWS_EDIT_PASTE_PASTE = 'Ctrl+V';
const DEFAULT_WINDOWS_EDIT_PASTE_OVER_SELECTION = 'Ctrl+Shift+V';
const DEFAULT_WINDOWS_EDIT_PASTE_STYLE = 'Ctrl+Alt+V';
const DEFAULT_WINDOWS_EDIT_PASTE_SVG = '';
const DEFAULT_WINDOWS_EDIT_DELETE = 'Backspace';
const DEFAULT_WINDOWS_EDIT_DUPLICATE = 'Ctrl+D';
const DEFAULT_WINDOWS_EDIT_SELECT_SELECT_ALL = 'Ctrl+A';
const DEFAULT_WINDOWS_EDIT_SELECT_SELECT_ALL_ARTBOARDS = 'Ctrl+Shift+A';
const DEFAULT_WINDOWS_EDIT_FIND = 'Ctrl+F';
const DEFAULT_WINDOWS_EDIT_RENAME = 'Ctrl+R';

const DEFAULT_WINDOWS_EDIT = [
  DEFAULT_WINDOWS_EDIT_UNDO, DEFAULT_WINDOWS_EDIT_REDO, DEFAULT_WINDOWS_EDIT_CUT, DEFAULT_WINDOWS_EDIT_COPY_COPY,
  DEFAULT_WINDOWS_EDIT_COPY_STYLE, DEFAULT_WINDOWS_EDIT_COPY_SVG, DEFAULT_WINDOWS_EDIT_PASTE_PASTE,
  DEFAULT_WINDOWS_EDIT_PASTE_OVER_SELECTION, DEFAULT_WINDOWS_EDIT_PASTE_STYLE, DEFAULT_WINDOWS_EDIT_PASTE_SVG,
  DEFAULT_WINDOWS_EDIT_DELETE, DEFAULT_WINDOWS_EDIT_DUPLICATE, DEFAULT_WINDOWS_EDIT_SELECT_SELECT_ALL,
  DEFAULT_WINDOWS_EDIT_SELECT_SELECT_ALL_ARTBOARDS, DEFAULT_WINDOWS_EDIT_FIND, DEFAULT_WINDOWS_EDIT_RENAME,
];

const DEFAULT_WINDOWS_INSERT_ARTBOARD = 'A';
const DEFAULT_WINDOWS_INSERT_SHAPE_RECTANGLE = 'R';
const DEFAULT_WINDOWS_INSERT_SHAPE_ROUNDED = 'U';
const DEFAULT_WINDOWS_INSERT_SHAPE_ELLIPSE = 'O';
const DEFAULT_WINDOWS_INSERT_SHAPE_POLYGON = '';
const DEFAULT_WINDOWS_INSERT_SHAPE_STAR = '';
const DEFAULT_WINDOWS_INSERT_SHAPE_LINE = 'L';
const DEFAULT_WINDOWS_INSERT_TEXT = 'T';
const DEFAULT_WINDOWS_INSERT_IMAGE = '';

const DEFAULT_WINDOWS_INSERT = [
  DEFAULT_WINDOWS_INSERT_ARTBOARD, DEFAULT_WINDOWS_INSERT_SHAPE_RECTANGLE, DEFAULT_WINDOWS_INSERT_SHAPE_ROUNDED,
  DEFAULT_WINDOWS_INSERT_SHAPE_ELLIPSE, DEFAULT_WINDOWS_INSERT_SHAPE_POLYGON, DEFAULT_WINDOWS_INSERT_SHAPE_STAR,
  DEFAULT_WINDOWS_INSERT_SHAPE_LINE, DEFAULT_WINDOWS_INSERT_TEXT, DEFAULT_WINDOWS_INSERT_IMAGE,
];

const DEFAULT_WINDOWS_LAYER_STYLE_FILL = '';
const DEFAULT_WINDOWS_LAYER_STYLE_STROKE = '';
const DEFAULT_WINDOWS_LAYER_STYLE_SHADOW = '';
const DEFAULT_WINDOWS_LAYER_TRANSFORM_FLIP_HORIZONTALLY = '';
const DEFAULT_WINDOWS_LAYER_TRANSFORM_FLIP_VERTICALLY = '';
const DEFAULT_WINDOWS_LAYER_COMBINE_UNION = 'Ctrl+Alt+U';
const DEFAULT_WINDOWS_LAYER_COMBINE_SUBTRACT = 'Ctrl+Alt+S';
const DEFAULT_WINDOWS_LAYER_COMBINE_INTERSECT = 'Ctrl+Alt+I';
const DEFAULT_WINDOWS_LAYER_COMBINE_DIFFERENCE = 'Ctrl+Alt+X';
const DEFAULT_WINDOWS_LAYER_IMAGE_ORIGINAL_DIMENSIONS = '';
const DEFAULT_WINDOWS_LAYER_IMAGE_REPLACE = '';
const DEFAULT_WINDOWS_LAYER_MASK_USE_AS_MASK = 'Ctrl+M';
const DEFAULT_WINDOWS_LAYER_MASK_IGNORE_UNDERLYING_MASK = 'Ctrl+Shift+M';

const DEFAULT_WINDOWS_LAYER = [
  DEFAULT_WINDOWS_LAYER_STYLE_FILL, DEFAULT_WINDOWS_LAYER_STYLE_STROKE, DEFAULT_WINDOWS_LAYER_STYLE_SHADOW,
  DEFAULT_WINDOWS_LAYER_TRANSFORM_FLIP_HORIZONTALLY, DEFAULT_WINDOWS_LAYER_TRANSFORM_FLIP_VERTICALLY,
  DEFAULT_WINDOWS_LAYER_COMBINE_UNION, DEFAULT_WINDOWS_LAYER_COMBINE_SUBTRACT, DEFAULT_WINDOWS_LAYER_COMBINE_INTERSECT,
  DEFAULT_WINDOWS_LAYER_COMBINE_DIFFERENCE, DEFAULT_WINDOWS_LAYER_IMAGE_ORIGINAL_DIMENSIONS,
  DEFAULT_WINDOWS_LAYER_IMAGE_REPLACE, DEFAULT_WINDOWS_LAYER_MASK_USE_AS_MASK,
  DEFAULT_WINDOWS_LAYER_MASK_IGNORE_UNDERLYING_MASK,
];

const DEFAULT_WINDOWS_ARRANGE_BRING_FORWARD = 'Ctrl+]';
const DEFAULT_WINDOWS_ARRANGE_BRING_TO_FRONT = 'Ctrl+Alt+]';
const DEFAULT_WINDOWS_ARRANGE_SEND_BACKWARD = 'Ctrl+[';
const DEFAULT_WINDOWS_ARRANGE_SEND_TO_BACK = 'Ctrl+Alt+[';
const DEFAULT_WINDOWS_ARRANGE_ALIGN_LEFT = '';
const DEFAULT_WINDOWS_ARRANGE_ALIGN_CENTER = '';
const DEFAULT_WINDOWS_ARRANGE_ALIGN_RIGHT = '';
const DEFAULT_WINDOWS_ARRANGE_ALIGN_TOP = '';
const DEFAULT_WINDOWS_ARRANGE_ALIGN_MIDDLE = '';
const DEFAULT_WINDOWS_ARRANGE_ALIGN_BOTTOM = '';
const DEFAULT_WINDOWS_ARRANGE_DISTRIBUTE_HORIZONTALLY = 'Ctrl+Shift+H';
const DEFAULT_WINDOWS_ARRANGE_DISTRIBUTE_VERTICALLY = '';
const DEFAULT_WINDOWS_ARRANGE_GROUP = 'Ctrl+G';
const DEFAULT_WINDOWS_ARRANGE_UNGROUP = 'Ctrl+Shift+G';

const DEFAULT_WINDOWS_ARRANGE = [
  DEFAULT_WINDOWS_ARRANGE_BRING_FORWARD, DEFAULT_WINDOWS_ARRANGE_BRING_TO_FRONT, DEFAULT_WINDOWS_ARRANGE_SEND_BACKWARD,
  DEFAULT_WINDOWS_ARRANGE_SEND_TO_BACK, DEFAULT_WINDOWS_ARRANGE_ALIGN_LEFT, DEFAULT_WINDOWS_ARRANGE_ALIGN_CENTER,
  DEFAULT_WINDOWS_ARRANGE_ALIGN_RIGHT, DEFAULT_WINDOWS_ARRANGE_ALIGN_TOP, DEFAULT_WINDOWS_ARRANGE_ALIGN_MIDDLE,
  DEFAULT_WINDOWS_ARRANGE_ALIGN_BOTTOM, DEFAULT_WINDOWS_ARRANGE_DISTRIBUTE_HORIZONTALLY,
  DEFAULT_WINDOWS_ARRANGE_DISTRIBUTE_VERTICALLY, DEFAULT_WINDOWS_ARRANGE_GROUP, DEFAULT_WINDOWS_ARRANGE_UNGROUP
];

const DEFAULT_WINDOWS_VIEW_ZOOM_IN = 'Ctrl+=';
const DEFAULT_WINDOWS_VIEW_ZOOM_OUT = 'Ctrl+-';
const DEFAULT_WINDOWS_VIEW_ZOOM_FIT_CANVAS = 'Ctrl+1';
const DEFAULT_WINDOWS_VIEW_ZOOM_FIT_SELECTED = 'Ctrl+2';
const DEFAULT_WINDOWS_VIEW_ZOOM_FIT_ACTIVE_ARTBOARD = 'Ctrl+4';
const DEFAULT_WINDOWS_VIEW_CENTER_SELECTED = 'Ctrl+3';
const DEFAULT_WINDOWS_VIEW_SHOW_LAYERS = 'Ctrl+Alt+1';
const DEFAULT_WINDOWS_VIEW_SHOW_STYLES = 'Ctrl+Alt+3';
const DEFAULT_WINDOWS_VIEW_SHOW_EVENTS = 'Ctrl+Alt+2';

const DEFAULT_WINDOWS_VIEW = [
  DEFAULT_WINDOWS_VIEW_ZOOM_IN, DEFAULT_WINDOWS_VIEW_ZOOM_OUT, DEFAULT_WINDOWS_VIEW_ZOOM_FIT_CANVAS,
  DEFAULT_WINDOWS_VIEW_ZOOM_FIT_SELECTED, DEFAULT_WINDOWS_VIEW_ZOOM_FIT_ACTIVE_ARTBOARD,
  DEFAULT_WINDOWS_VIEW_CENTER_SELECTED, DEFAULT_WINDOWS_VIEW_SHOW_LAYERS, DEFAULT_WINDOWS_VIEW_SHOW_STYLES,
  DEFAULT_WINDOWS_VIEW_SHOW_EVENTS,
];

const ALL_WINDOWS_KEY_BINDINGS = [
  ...DEFAULT_WINDOWS_FILE, ...DEFAULT_WINDOWS_EDIT, ...DEFAULT_WINDOWS_INSERT, ...DEFAULT_WINDOWS_LAYER,
  ...DEFAULT_WINDOWS_ARRANGE, ...DEFAULT_WINDOWS_VIEW
];

const DEFAULT_FILE_NEW = remote.process.platform === 'darwin' ? DEFAULT_MAC_FILE_NEW : DEFAULT_WINDOWS_FILE_NEW;
const DEFAULT_FILE_SAVE = remote.process.platform === 'darwin' ? DEFAULT_MAC_FILE_SAVE : DEFAULT_WINDOWS_FILE_SAVE;
const DEFAULT_FILE_SAVE_AS = remote.process.platform === 'darwin' ? DEFAULT_MAC_FILE_SAVE_AS : DEFAULT_WINDOWS_FILE_SAVE_AS;
const DEFAULT_FILE_OPEN = remote.process.platform === 'darwin' ? DEFAULT_MAC_FILE_OPEN : DEFAULT_WINDOWS_FILE_OPEN;

const DEFAULT_EDIT_UNDO = remote.process.platform === 'darwin' ? DEFAULT_MAC_EDIT_UNDO : DEFAULT_WINDOWS_EDIT_UNDO;
const DEFAULT_EDIT_REDO = remote.process.platform === 'darwin' ? DEFAULT_MAC_EDIT_REDO : DEFAULT_WINDOWS_EDIT_REDO;
const DEFAULT_EDIT_CUT = remote.process.platform === 'darwin' ? DEFAULT_MAC_EDIT_CUT : DEFAULT_WINDOWS_EDIT_CUT;
const DEFAULT_EDIT_COPY_COPY = remote.process.platform === 'darwin' ? DEFAULT_MAC_EDIT_COPY_COPY : DEFAULT_WINDOWS_EDIT_COPY_COPY;
const DEFAULT_EDIT_COPY_STYLE = remote.process.platform === 'darwin' ? DEFAULT_MAC_EDIT_COPY_STYLE : DEFAULT_WINDOWS_EDIT_COPY_STYLE;
const DEFAULT_EDIT_COPY_SVG = remote.process.platform === 'darwin' ? DEFAULT_MAC_EDIT_COPY_SVG : DEFAULT_WINDOWS_EDIT_COPY_SVG;
const DEFAULT_EDIT_PASTE_PASTE = remote.process.platform === 'darwin' ? DEFAULT_MAC_EDIT_PASTE_PASTE : DEFAULT_WINDOWS_EDIT_PASTE_PASTE;
const DEFAULT_EDIT_PASTE_OVER_SELECTION = remote.process.platform === 'darwin' ? DEFAULT_MAC_EDIT_PASTE_OVER_SELECTION : DEFAULT_WINDOWS_EDIT_PASTE_OVER_SELECTION;
const DEFAULT_EDIT_PASTE_STYLE = remote.process.platform === 'darwin' ? DEFAULT_MAC_EDIT_PASTE_STYLE : DEFAULT_WINDOWS_EDIT_PASTE_STYLE;
const DEFAULT_EDIT_PASTE_SVG = remote.process.platform === 'darwin' ? DEFAULT_MAC_EDIT_PASTE_SVG : DEFAULT_WINDOWS_EDIT_PASTE_SVG;
const DEFAULT_EDIT_DELETE = remote.process.platform === 'darwin' ? DEFAULT_MAC_EDIT_DELETE : DEFAULT_WINDOWS_EDIT_DELETE;
const DEFAULT_EDIT_DUPLICATE = remote.process.platform === 'darwin' ? DEFAULT_MAC_EDIT_DUPLICATE : DEFAULT_WINDOWS_EDIT_DUPLICATE;
const DEFAULT_EDIT_SELECT_SELECT_ALL = remote.process.platform === 'darwin' ? DEFAULT_MAC_EDIT_SELECT_SELECT_ALL : DEFAULT_WINDOWS_EDIT_SELECT_SELECT_ALL;
const DEFAULT_EDIT_SELECT_SELECT_ALL_ARTBOARDS = remote.process.platform === 'darwin' ? DEFAULT_MAC_EDIT_SELECT_SELECT_ALL_ARTBOARDS : DEFAULT_WINDOWS_EDIT_SELECT_SELECT_ALL_ARTBOARDS;
const DEFAULT_EDIT_FIND = remote.process.platform === 'darwin' ? DEFAULT_MAC_EDIT_FIND : DEFAULT_WINDOWS_EDIT_FIND;
const DEFAULT_EDIT_RENAME = remote.process.platform === 'darwin' ? DEFAULT_MAC_EDIT_RENAME : DEFAULT_WINDOWS_EDIT_RENAME;

const DEFAULT_INSERT_ARTBOARD = remote.process.platform === 'darwin' ? DEFAULT_MAC_INSERT_ARTBOARD : DEFAULT_WINDOWS_INSERT_ARTBOARD;
const DEFAULT_INSERT_SHAPE_RECTANGLE = remote.process.platform === 'darwin' ? DEFAULT_MAC_INSERT_SHAPE_RECTANGLE : DEFAULT_WINDOWS_INSERT_SHAPE_RECTANGLE;
const DEFAULT_INSERT_SHAPE_ROUNDED = remote.process.platform === 'darwin' ? DEFAULT_MAC_INSERT_SHAPE_ROUNDED : DEFAULT_WINDOWS_INSERT_SHAPE_ROUNDED;
const DEFAULT_INSERT_SHAPE_ELLIPSE = remote.process.platform === 'darwin' ? DEFAULT_MAC_INSERT_SHAPE_ELLIPSE : DEFAULT_WINDOWS_INSERT_SHAPE_ELLIPSE;
const DEFAULT_INSERT_SHAPE_POLYGON = remote.process.platform === 'darwin' ? DEFAULT_MAC_INSERT_SHAPE_POLYGON : DEFAULT_WINDOWS_INSERT_SHAPE_POLYGON;
const DEFAULT_INSERT_SHAPE_STAR = remote.process.platform === 'darwin' ? DEFAULT_MAC_INSERT_SHAPE_STAR : DEFAULT_WINDOWS_INSERT_SHAPE_STAR;
const DEFAULT_INSERT_SHAPE_LINE = remote.process.platform === 'darwin' ? DEFAULT_MAC_INSERT_SHAPE_LINE : DEFAULT_WINDOWS_INSERT_SHAPE_LINE;
const DEFAULT_INSERT_TEXT = remote.process.platform === 'darwin' ? DEFAULT_MAC_INSERT_TEXT : DEFAULT_WINDOWS_INSERT_TEXT;
const DEFAULT_INSERT_IMAGE = remote.process.platform === 'darwin' ? DEFAULT_MAC_INSERT_IMAGE : DEFAULT_WINDOWS_INSERT_IMAGE;

const DEFAULT_LAYER_STYLE_FILL = remote.process.platform === 'darwin' ? DEFAULT_MAC_LAYER_STYLE_FILL : DEFAULT_WINDOWS_LAYER_STYLE_FILL;
const DEFAULT_LAYER_STYLE_STROKE = remote.process.platform === 'darwin' ? DEFAULT_MAC_LAYER_STYLE_STROKE : DEFAULT_WINDOWS_LAYER_STYLE_STROKE;
const DEFAULT_LAYER_STYLE_SHADOW = remote.process.platform === 'darwin' ? DEFAULT_MAC_LAYER_STYLE_SHADOW : DEFAULT_WINDOWS_LAYER_STYLE_SHADOW;
const DEFAULT_LAYER_TRANSFORM_FLIP_HORIZONTALLY = remote.process.platform === 'darwin' ? DEFAULT_MAC_LAYER_TRANSFORM_FLIP_HORIZONTALLY : DEFAULT_WINDOWS_LAYER_TRANSFORM_FLIP_HORIZONTALLY;
const DEFAULT_LAYER_TRANSFORM_FLIP_VERTICALLY = remote.process.platform === 'darwin' ? DEFAULT_MAC_LAYER_TRANSFORM_FLIP_VERTICALLY : DEFAULT_WINDOWS_LAYER_TRANSFORM_FLIP_VERTICALLY;
const DEFAULT_LAYER_COMBINE_UNION = remote.process.platform === 'darwin' ? DEFAULT_MAC_LAYER_COMBINE_UNION : DEFAULT_WINDOWS_LAYER_COMBINE_UNION;
const DEFAULT_LAYER_COMBINE_SUBTRACT = remote.process.platform === 'darwin' ? DEFAULT_MAC_LAYER_COMBINE_SUBTRACT : DEFAULT_WINDOWS_LAYER_COMBINE_SUBTRACT;
const DEFAULT_LAYER_COMBINE_INTERSECT = remote.process.platform === 'darwin' ? DEFAULT_MAC_LAYER_COMBINE_INTERSECT : DEFAULT_WINDOWS_LAYER_COMBINE_INTERSECT;
const DEFAULT_LAYER_COMBINE_DIFFERENCE = remote.process.platform === 'darwin' ? DEFAULT_MAC_LAYER_COMBINE_DIFFERENCE : DEFAULT_WINDOWS_LAYER_COMBINE_DIFFERENCE;
const DEFAULT_LAYER_IMAGE_ORIGINAL_DIMENSIONS = remote.process.platform === 'darwin' ? DEFAULT_MAC_LAYER_IMAGE_ORIGINAL_DIMENSIONS : DEFAULT_WINDOWS_LAYER_IMAGE_ORIGINAL_DIMENSIONS;
const DEFAULT_LAYER_IMAGE_REPLACE = remote.process.platform === 'darwin' ? DEFAULT_MAC_LAYER_IMAGE_REPLACE : DEFAULT_WINDOWS_LAYER_IMAGE_REPLACE;
const DEFAULT_LAYER_MASK_USE_AS_MASK = remote.process.platform === 'darwin' ? DEFAULT_MAC_LAYER_MASK_USE_AS_MASK : DEFAULT_WINDOWS_LAYER_MASK_USE_AS_MASK;
const DEFAULT_LAYER_MASK_IGNORE_UNDERLYING_MASK = remote.process.platform === 'darwin' ? DEFAULT_MAC_LAYER_MASK_IGNORE_UNDERLYING_MASK : DEFAULT_WINDOWS_LAYER_MASK_IGNORE_UNDERLYING_MASK;

const DEFAULT_ARRANGE_BRING_FORWARD = remote.process.platform === 'darwin' ? DEFAULT_MAC_ARRANGE_BRING_FORWARD : DEFAULT_WINDOWS_ARRANGE_BRING_FORWARD;
const DEFAULT_ARRANGE_BRING_TO_FRONT = remote.process.platform === 'darwin' ? DEFAULT_MAC_ARRANGE_BRING_TO_FRONT : DEFAULT_WINDOWS_ARRANGE_BRING_TO_FRONT;
const DEFAULT_ARRANGE_SEND_BACKWARD = remote.process.platform === 'darwin' ? DEFAULT_MAC_ARRANGE_SEND_BACKWARD : DEFAULT_WINDOWS_ARRANGE_SEND_BACKWARD;
const DEFAULT_ARRANGE_SEND_TO_BACK = remote.process.platform === 'darwin' ? DEFAULT_MAC_ARRANGE_SEND_TO_BACK : DEFAULT_WINDOWS_ARRANGE_SEND_TO_BACK;
const DEFAULT_ARRANGE_ALIGN_LEFT = remote.process.platform === 'darwin' ? DEFAULT_MAC_ARRANGE_ALIGN_LEFT : DEFAULT_WINDOWS_ARRANGE_ALIGN_LEFT;
const DEFAULT_ARRANGE_ALIGN_CENTER = remote.process.platform === 'darwin' ? DEFAULT_MAC_ARRANGE_ALIGN_CENTER : DEFAULT_WINDOWS_ARRANGE_ALIGN_CENTER;
const DEFAULT_ARRANGE_ALIGN_RIGHT = remote.process.platform === 'darwin' ? DEFAULT_MAC_ARRANGE_ALIGN_RIGHT : DEFAULT_WINDOWS_ARRANGE_ALIGN_RIGHT;
const DEFAULT_ARRANGE_ALIGN_TOP = remote.process.platform === 'darwin' ? DEFAULT_MAC_ARRANGE_ALIGN_TOP : DEFAULT_WINDOWS_ARRANGE_ALIGN_TOP;
const DEFAULT_ARRANGE_ALIGN_MIDDLE = remote.process.platform === 'darwin' ? DEFAULT_MAC_ARRANGE_ALIGN_MIDDLE : DEFAULT_WINDOWS_ARRANGE_ALIGN_MIDDLE;
const DEFAULT_ARRANGE_ALIGN_BOTTOM = remote.process.platform === 'darwin' ? DEFAULT_MAC_ARRANGE_ALIGN_BOTTOM : DEFAULT_WINDOWS_ARRANGE_ALIGN_BOTTOM;
const DEFAULT_ARRANGE_DISTRIBUTE_HORIZONTALLY = remote.process.platform === 'darwin' ? DEFAULT_MAC_ARRANGE_DISTRIBUTE_HORIZONTALLY : DEFAULT_WINDOWS_ARRANGE_DISTRIBUTE_HORIZONTALLY;
const DEFAULT_ARRANGE_DISTRIBUTE_VERTICALLY = remote.process.platform === 'darwin' ? DEFAULT_MAC_ARRANGE_DISTRIBUTE_VERTICALLY : DEFAULT_WINDOWS_ARRANGE_DISTRIBUTE_VERTICALLY;
const DEFAULT_ARRANGE_GROUP = remote.process.platform === 'darwin' ? DEFAULT_MAC_ARRANGE_GROUP : DEFAULT_WINDOWS_ARRANGE_GROUP;
const DEFAULT_ARRANGE_UNGROUP = remote.process.platform === 'darwin' ? DEFAULT_MAC_ARRANGE_UNGROUP : DEFAULT_WINDOWS_ARRANGE_UNGROUP;

const DEFAULT_VIEW_ZOOM_IN = remote.process.platform === 'darwin' ? DEFAULT_MAC_VIEW_ZOOM_IN : DEFAULT_WINDOWS_VIEW_ZOOM_IN;
const DEFAULT_VIEW_ZOOM_OUT = remote.process.platform === 'darwin' ? DEFAULT_MAC_VIEW_ZOOM_OUT : DEFAULT_WINDOWS_VIEW_ZOOM_OUT;
const DEFAULT_VIEW_ZOOM_FIT_CANVAS = remote.process.platform === 'darwin' ? DEFAULT_MAC_VIEW_ZOOM_FIT_CANVAS : DEFAULT_WINDOWS_VIEW_ZOOM_FIT_CANVAS;
const DEFAULT_VIEW_ZOOM_FIT_SELECTED = remote.process.platform === 'darwin' ? DEFAULT_MAC_VIEW_ZOOM_FIT_SELECTED : DEFAULT_WINDOWS_VIEW_ZOOM_FIT_SELECTED;
const DEFAULT_VIEW_ZOOM_FIT_ACTIVE_ARTBOARD = remote.process.platform === 'darwin' ? DEFAULT_MAC_VIEW_ZOOM_FIT_ACTIVE_ARTBOARD : DEFAULT_WINDOWS_VIEW_ZOOM_FIT_ACTIVE_ARTBOARD;
const DEFAULT_VIEW_CENTER_SELECTED = remote.process.platform === 'darwin' ? DEFAULT_MAC_VIEW_CENTER_SELECTED : DEFAULT_WINDOWS_VIEW_CENTER_SELECTED;
const DEFAULT_VIEW_SHOW_LAYERS = remote.process.platform === 'darwin' ? DEFAULT_MAC_VIEW_SHOW_LAYERS : DEFAULT_WINDOWS_VIEW_SHOW_LAYERS;
const DEFAULT_VIEW_SHOW_STYLES = remote.process.platform === 'darwin' ? DEFAULT_MAC_VIEW_SHOW_STYLES : DEFAULT_WINDOWS_VIEW_SHOW_STYLES;
const DEFAULT_VIEW_SHOW_EVENTS = remote.process.platform === 'darwin' ? DEFAULT_MAC_VIEW_SHOW_EVENTS : DEFAULT_WINDOWS_VIEW_SHOW_EVENTS;

export interface KeyBindingsState {
  allMacBindings: string[];
  allWindowsBindings: string[];
  file: {
    new: string;
    save: string;
    saveAs: string;
    open: string;
  };
  edit: {
    undo: string;
    redo: string;
    cut: string;
    copy: {
      copy: string;
      style: string;
      svg: string;
    };
    paste: {
      paste: string;
      overSelection: string;
      style: string;
      svg: string;
    };
    delete: string;
    duplicate: string;
    select: {
      selectAll: string;
      selectAllArtboards: string;
    };
    find: string;
    rename: string;
  };
  insert: {
    artboard: string;
    shape: {
      rectangle: string;
      rounded: string;
      ellipse: string;
      polygon: string;
      star: string;
      line: string;
    };
    text: string;
    image: string;
  };
  layer: {
    style: {
      fill: string;
      stroke: string;
      shadow: string;
    };
    transform: {
      flipHorizontally: string;
      flipVertically: string;
    };
    combine: {
      union: string;
      subtract: string;
      intersect: string;
      difference: string;
    };
    image: {
      originalDimensions: string;
      replace: string;
    };
    mask: {
      useAsMask: string;
      ignoreUnderlyingMask: string;
    };
  };
  arrange: {
    bringForward: string;
    bringToFront: string;
    sendBackward: string;
    sendToBack: string;
    align: {
      left: string;
      center: string;
      right: string;
      top: string;
      middle: string;
      bottom: string;
    };
    distribute: {
      horizontally: string;
      vertically: string;
    };
    group: string;
    ungroup: string;
  };
  view: {
    zoomIn: string;
    zoomOut: string;
    zoomFit: {
      canvas: string;
      selected: string;
      activeArtboard: string;
    };
    centerSelected: string;
    showLayers: string;
    showStyles: string;
    showEvents: string;
  };
}

const initialState: KeyBindingsState = {
  allMacBindings: ALL_MAC_KEY_BINDINGS,
  allWindowsBindings: ALL_WINDOWS_KEY_BINDINGS,
  file: {
    new: DEFAULT_FILE_NEW,
    save: DEFAULT_FILE_SAVE,
    saveAs: DEFAULT_FILE_SAVE_AS,
    open: DEFAULT_FILE_OPEN,
  },
  edit: {
    undo: DEFAULT_EDIT_UNDO,
    redo: DEFAULT_EDIT_REDO,
    cut: DEFAULT_EDIT_CUT,
    copy: {
      copy: DEFAULT_EDIT_COPY_COPY,
      style: DEFAULT_EDIT_COPY_STYLE,
      svg: DEFAULT_EDIT_COPY_SVG,
    },
    paste: {
      paste: DEFAULT_EDIT_PASTE_PASTE,
      overSelection: DEFAULT_EDIT_PASTE_OVER_SELECTION,
      style: DEFAULT_EDIT_PASTE_STYLE,
      svg: DEFAULT_EDIT_PASTE_SVG,
    },
    delete: DEFAULT_EDIT_DELETE,
    duplicate: DEFAULT_EDIT_DUPLICATE,
    select: {
      selectAll: DEFAULT_EDIT_SELECT_SELECT_ALL,
      selectAllArtboards: DEFAULT_EDIT_SELECT_SELECT_ALL_ARTBOARDS,
    },
    find: DEFAULT_EDIT_FIND,
    rename: DEFAULT_EDIT_RENAME,
  },
  insert: {
    artboard: DEFAULT_INSERT_ARTBOARD,
    shape: {
      rectangle: DEFAULT_INSERT_SHAPE_RECTANGLE,
      rounded: DEFAULT_INSERT_SHAPE_ROUNDED,
      ellipse: DEFAULT_INSERT_SHAPE_ELLIPSE,
      polygon: DEFAULT_INSERT_SHAPE_POLYGON,
      star: DEFAULT_INSERT_SHAPE_STAR,
      line: DEFAULT_INSERT_SHAPE_LINE,
    },
    text: DEFAULT_INSERT_TEXT,
    image: DEFAULT_INSERT_IMAGE,
  },
  layer: {
    style: {
      fill: DEFAULT_LAYER_STYLE_FILL,
      stroke: DEFAULT_LAYER_STYLE_STROKE,
      shadow: DEFAULT_LAYER_STYLE_SHADOW,
    },
    transform: {
      flipHorizontally: DEFAULT_LAYER_TRANSFORM_FLIP_HORIZONTALLY,
      flipVertically: DEFAULT_LAYER_TRANSFORM_FLIP_VERTICALLY,
    },
    combine: {
      union: DEFAULT_LAYER_COMBINE_UNION,
      subtract: DEFAULT_LAYER_COMBINE_SUBTRACT,
      intersect: DEFAULT_LAYER_COMBINE_INTERSECT,
      difference: DEFAULT_LAYER_COMBINE_DIFFERENCE,
    },
    image: {
      originalDimensions: DEFAULT_LAYER_IMAGE_ORIGINAL_DIMENSIONS,
      replace: DEFAULT_LAYER_IMAGE_REPLACE,
    },
    mask: {
      useAsMask: DEFAULT_LAYER_MASK_USE_AS_MASK,
      ignoreUnderlyingMask: DEFAULT_LAYER_MASK_IGNORE_UNDERLYING_MASK,
    },
  },
  arrange: {
    bringForward: DEFAULT_ARRANGE_BRING_FORWARD,
    bringToFront: DEFAULT_ARRANGE_BRING_TO_FRONT,
    sendBackward: DEFAULT_ARRANGE_SEND_BACKWARD,
    sendToBack: DEFAULT_ARRANGE_SEND_TO_BACK,
    align: {
      left: DEFAULT_ARRANGE_ALIGN_LEFT,
      center: DEFAULT_ARRANGE_ALIGN_CENTER,
      right: DEFAULT_ARRANGE_ALIGN_RIGHT,
      top: DEFAULT_ARRANGE_ALIGN_TOP,
      middle: DEFAULT_ARRANGE_ALIGN_MIDDLE,
      bottom: DEFAULT_ARRANGE_ALIGN_BOTTOM,
    },
    distribute: {
      horizontally: DEFAULT_ARRANGE_DISTRIBUTE_HORIZONTALLY,
      vertically: DEFAULT_ARRANGE_DISTRIBUTE_VERTICALLY,
    },
    group: DEFAULT_ARRANGE_GROUP,
    ungroup: DEFAULT_ARRANGE_UNGROUP,
  },
  view: {
    zoomIn: DEFAULT_VIEW_ZOOM_IN,
    zoomOut: DEFAULT_VIEW_ZOOM_OUT,
    zoomFit: {
      canvas: DEFAULT_VIEW_ZOOM_FIT_CANVAS,
      selected: DEFAULT_VIEW_ZOOM_FIT_SELECTED,
      activeArtboard: DEFAULT_VIEW_ZOOM_FIT_ACTIVE_ARTBOARD,
    },
    centerSelected: DEFAULT_VIEW_CENTER_SELECTED,
    showLayers: DEFAULT_VIEW_SHOW_LAYERS,
    showStyles: DEFAULT_VIEW_SHOW_STYLES,
    showEvents: DEFAULT_VIEW_SHOW_EVENTS,
  }
}

export default (state = initialState, action: KeyBindingsTypes): KeyBindingsState => {
  switch (action.type) {
    case SET_FILE_NEW: {
      return {
        ...state,
        file: {
          ...state.file,
          new: action.payload.binding
        }
      }
    }
    case SET_FILE_SAVE: {
      return {
        ...state,
        file: {
          ...state.file,
          save: action.payload.binding
        }
      }
    }
    case SET_FILE_SAVE_AS: {
      return {
        ...state,
        file: {
          ...state.file,
          saveAs: action.payload.binding
        }
      }
    }
    case SET_FILE_OPEN: {
      return {
        ...state,
        file: {
          ...state.file,
          open: action.payload.binding
        }
      }
    }
    case SET_EDIT_UNDO: {
      return {
        ...state,
        edit: {
          ...state.edit,
          undo: action.payload.binding
        }
      }
    }
    case SET_EDIT_REDO: {
      return {
        ...state,
        edit: {
          ...state.edit,
          redo: action.payload.binding
        }
      }
    }
    case SET_EDIT_CUT: {
      return {
        ...state,
        edit: {
          ...state.edit,
          cut: action.payload.binding
        }
      }
    }
    case SET_EDIT_COPY_COPY: {
      return {
        ...state,
        edit: {
          ...state.edit,
          copy: {
            ...state.edit.copy,
            copy: action.payload.binding
          }
        }
      }
    }
    case SET_EDIT_COPY_STYLE: {
      return {
        ...state,
        edit: {
          ...state.edit,
          copy: {
            ...state.edit.copy,
            style: action.payload.binding
          }
        }
      }
    }
    case SET_EDIT_COPY_SVG: {
      return {
        ...state,
        edit: {
          ...state.edit,
          copy: {
            ...state.edit.copy,
            svg: action.payload.binding
          }
        }
      }
    }
    case SET_EDIT_PASTE_PASTE: {
      return {
        ...state,
        edit: {
          ...state.edit,
          paste: {
            ...state.edit.paste,
            paste: action.payload.binding
          }
        }
      }
    }
    case SET_EDIT_PASTE_OVER_SELECTION: {
      return {
        ...state,
        edit: {
          ...state.edit,
          paste: {
            ...state.edit.paste,
            overSelection: action.payload.binding
          }
        }
      }
    }
    case SET_EDIT_PASTE_STYLE: {
      return {
        ...state,
        edit: {
          ...state.edit,
          paste: {
            ...state.edit.paste,
            style: action.payload.binding
          }
        }
      }
    }
    case SET_EDIT_PASTE_SVG: {
      return {
        ...state,
        edit: {
          ...state.edit,
          paste: {
            ...state.edit.paste,
            svg: action.payload.binding
          }
        }
      }
    }
    case SET_EDIT_DELETE: {
      return {
        ...state,
        edit: {
          ...state.edit,
          delete: action.payload.binding
        }
      }
    }
    case SET_EDIT_DUPLICATE: {
      return {
        ...state,
        edit: {
          ...state.edit,
          duplicate: action.payload.binding
        }
      }
    }
    case SET_EDIT_SELECT_SELECT_ALL: {
      return {
        ...state,
        edit: {
          ...state.edit,
          select: {
            ...state.edit.select,
            selectAll: action.payload.binding
          }
        }
      }
    }
    case SET_EDIT_SELECT_SELECT_ALL_ARTBOARDS: {
      return {
        ...state,
        edit: {
          ...state.edit,
          select: {
            ...state.edit.select,
            selectAllArtboards: action.payload.binding
          }
        }
      }
    }
    case SET_EDIT_FIND: {
      return {
        ...state,
        edit: {
          ...state.edit,
          find: action.payload.binding
        }
      }
    }
    case SET_EDIT_RENAME: {
      return {
        ...state,
        edit: {
          ...state.edit,
          rename: action.payload.binding
        }
      }
    }
    case SET_INSERT_ARTBOARD: {
      return {
        ...state,
        insert: {
          ...state.insert,
          artboard: action.payload.binding
        }
      }
    }
    case SET_INSERT_SHAPE_RECTANGLE: {
      return {
        ...state,
        insert: {
          ...state.insert,
          shape: {
            ...state.insert.shape,
            rectangle: action.payload.binding
          }
        }
      }
    }
    case SET_INSERT_SHAPE_ROUNDED: {
      return {
        ...state,
        insert: {
          ...state.insert,
          shape: {
            ...state.insert.shape,
            rounded: action.payload.binding
          }
        }
      }
    }
    case SET_INSERT_SHAPE_ELLIPSE: {
      return {
        ...state,
        insert: {
          ...state.insert,
          shape: {
            ...state.insert.shape,
            ellipse: action.payload.binding
          }
        }
      }
    }
    case SET_INSERT_SHAPE_POLYGON: {
      return {
        ...state,
        insert: {
          ...state.insert,
          shape: {
            ...state.insert.shape,
            polygon: action.payload.binding
          }
        }
      }
    }
    case SET_INSERT_SHAPE_STAR: {
      return {
        ...state,
        insert: {
          ...state.insert,
          shape: {
            ...state.insert.shape,
            star: action.payload.binding
          }
        }
      }
    }
    case SET_INSERT_SHAPE_LINE: {
      return {
        ...state,
        insert: {
          ...state.insert,
          shape: {
            ...state.insert.shape,
            line: action.payload.binding
          }
        }
      }
    }
    case SET_INSERT_TEXT: {
      return {
        ...state,
        insert: {
          ...state.insert,
          text: action.payload.binding
        }
      }
    }
    case SET_INSERT_IMAGE: {
      return {
        ...state,
        insert: {
          ...state.insert,
          image: action.payload.binding
        }
      }
    }
    case SET_LAYER_STYLE_FILL: {
      return {
        ...state,
        layer: {
          ...state.layer,
          style: {
            ...state.layer.style,
            fill: action.payload.binding
          }
        }
      }
    }
    case SET_LAYER_STYLE_STROKE: {
      return {
        ...state,
        layer: {
          ...state.layer,
          style: {
            ...state.layer.style,
            stroke: action.payload.binding
          }
        }
      }
    }
    case SET_LAYER_STYLE_SHADOW: {
      return {
        ...state,
        layer: {
          ...state.layer,
          style: {
            ...state.layer.style,
            shadow: action.payload.binding
          }
        }
      }
    }
    case SET_LAYER_TRANSFORM_FLIP_HORIZONTALLY: {
      return {
        ...state,
        layer: {
          ...state.layer,
          transform: {
            ...state.layer.transform,
            flipHorizontally: action.payload.binding
          }
        }
      }
    }
    case SET_LAYER_TRANSFORM_FLIP_VERTICALLY: {
      return {
        ...state,
        layer: {
          ...state.layer,
          transform: {
            ...state.layer.transform,
            flipVertically: action.payload.binding
          }
        }
      }
    }
    case SET_LAYER_COMBINE_UNION: {
      return {
        ...state,
        layer: {
          ...state.layer,
          combine: {
            ...state.layer.combine,
            union: action.payload.binding
          }
        }
      }
    }
    case SET_LAYER_COMBINE_SUBTRACT: {
      return {
        ...state,
        layer: {
          ...state.layer,
          combine: {
            ...state.layer.combine,
            subtract: action.payload.binding
          }
        }
      }
    }
    case SET_LAYER_COMBINE_INTERSECT: {
      return {
        ...state,
        layer: {
          ...state.layer,
          combine: {
            ...state.layer.combine,
            intersect: action.payload.binding
          }
        }
      }
    }
    case SET_LAYER_COMBINE_DIFFERENCE: {
      return {
        ...state,
        layer: {
          ...state.layer,
          combine: {
            ...state.layer.combine,
            difference: action.payload.binding
          }
        }
      }
    }
    case SET_LAYER_IMAGE_ORIGINAL_DIMENSIONS: {
      return {
        ...state,
        layer: {
          ...state.layer,
          image: {
            ...state.layer.image,
            originalDimensions: action.payload.binding
          }
        }
      }
    }
    case SET_LAYER_IMAGE_REPLACE: {
      return {
        ...state,
        layer: {
          ...state.layer,
          image: {
            ...state.layer.image,
            replace: action.payload.binding
          }
        }
      }
    }
    case SET_LAYER_MASK_USE_AS_MASK: {
      return {
        ...state,
        layer: {
          ...state.layer,
          mask: {
            ...state.layer.mask,
            useAsMask: action.payload.binding
          }
        }
      }
    }
    case SET_LAYER_MASK_IGNORE_UNDERLYING_MASK: {
      return {
        ...state,
        layer: {
          ...state.layer,
          mask: {
            ...state.layer.mask,
            ignoreUnderlyingMask: action.payload.binding
          }
        }
      }
    }
    case SET_ARRANGE_BRING_FORWARD: {
      return {
        ...state,
        arrange: {
          ...state.arrange,
          bringForward: action.payload.binding
        }
      }
    }
    case SET_ARRANGE_BRING_TO_FRONT: {
      return {
        ...state,
        arrange: {
          ...state.arrange,
          bringToFront: action.payload.binding
        }
      }
    }
    case SET_ARRANGE_SEND_BACKWARD: {
      return {
        ...state,
        arrange: {
          ...state.arrange,
          sendBackward: action.payload.binding
        }
      }
    }
    case SET_ARRANGE_SEND_TO_BACK: {
      return {
        ...state,
        arrange: {
          ...state.arrange,
          sendToBack: action.payload.binding
        }
      }
    }
    case SET_ARRANGE_ALIGN_LEFT: {
      return {
        ...state,
        arrange: {
          ...state.arrange,
          align: {
            ...state.arrange.align,
            left: action.payload.binding
          }
        }
      }
    }
    case SET_ARRANGE_ALIGN_CENTER: {
      return {
        ...state,
        arrange: {
          ...state.arrange,
          align: {
            ...state.arrange.align,
            center: action.payload.binding
          }
        }
      }
    }
    case SET_ARRANGE_ALIGN_RIGHT: {
      return {
        ...state,
        arrange: {
          ...state.arrange,
          align: {
            ...state.arrange.align,
            right: action.payload.binding
          }
        }
      }
    }
    case SET_ARRANGE_ALIGN_TOP: {
      return {
        ...state,
        arrange: {
          ...state.arrange,
          align: {
            ...state.arrange.align,
            top: action.payload.binding
          }
        }
      }
    }
    case SET_ARRANGE_ALIGN_MIDDLE: {
      return {
        ...state,
        arrange: {
          ...state.arrange,
          align: {
            ...state.arrange.align,
            middle: action.payload.binding
          }
        }
      }
    }
    case SET_ARRANGE_ALIGN_BOTTOM: {
      return {
        ...state,
        arrange: {
          ...state.arrange,
          align: {
            ...state.arrange.align,
            bottom: action.payload.binding
          }
        }
      }
    }
    case SET_ARRANGE_DISTRIBUTE_HORIZONTALLY: {
      return {
        ...state,
        arrange: {
          ...state.arrange,
          distribute: {
            ...state.arrange.distribute,
            horizontally: action.payload.binding
          }
        }
      }
    }
    case SET_ARRANGE_DISTRIBUTE_VERTICALLY: {
      return {
        ...state,
        arrange: {
          ...state.arrange,
          distribute: {
            ...state.arrange.distribute,
            vertically: action.payload.binding
          }
        }
      }
    }
    case SET_ARRANGE_GROUP: {
      return {
        ...state,
        arrange: {
          ...state.arrange,
          group: action.payload.binding
        }
      }
    }
    case SET_ARRANGE_UNGROUP: {
      return {
        ...state,
        arrange: {
          ...state.arrange,
          ungroup: action.payload.binding
        }
      }
    }
    case SET_VIEW_ZOOM_IN: {
      return {
        ...state,
        view: {
          ...state.view,
          zoomIn: action.payload.binding
        }
      }
    }
    case SET_VIEW_ZOOM_OUT: {
      return {
        ...state,
        view: {
          ...state.view,
          zoomOut: action.payload.binding
        }
      }
    }
    case SET_VIEW_ZOOM_FIT_CANVAS: {
      return {
        ...state,
        view: {
          ...state.view,
          zoomFit: {
            ...state.view.zoomFit,
            canvas: action.payload.binding
          }
        }
      }
    }
    case SET_VIEW_ZOOM_FIT_SELECTED: {
      return {
        ...state,
        view: {
          ...state.view,
          zoomFit: {
            ...state.view.zoomFit,
            selected: action.payload.binding
          }
        }
      }
    }
    case SET_VIEW_ZOOM_FIT_ACTIVE_ARTBOARD: {
      return {
        ...state,
        view: {
          ...state.view,
          zoomFit: {
            ...state.view.zoomFit,
            activeArtboard: action.payload.binding
          }
        }
      }
    }
    case SET_VIEW_CENTER_SELECTED: {
      return {
        ...state,
        view: {
          ...state.view,
          centerSelected: action.payload.binding
        }
      }
    }
    case SET_VIEW_SHOW_LAYERS: {
      return {
        ...state,
        view: {
          ...state.view,
          showLayers: action.payload.binding
        }
      }
    }
    case SET_VIEW_SHOW_STYLES: {
      return {
        ...state,
        view: {
          ...state.view,
          showStyles: action.payload.binding
        }
      }
    }
    case SET_VIEW_SHOW_EVENTS: {
      return {
        ...state,
        view: {
          ...state.view,
          showEvents: action.payload.binding
        }
      }
    }
    default:
      return state;
  }
}
