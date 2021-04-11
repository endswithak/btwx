import { addItem, removeItem } from '../utils/general';

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
  RESET_ALL_KEY_BINDINGS,
  HYDRATE_KEY_BINDINGS,
  KeyBindingsTypes
} from '../actionTypes/keyBindings';

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

export interface KeyBindingsState {
  allBindings: string[];
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

export const initialMacState: KeyBindingsState = {
  allBindings: ALL_MAC_KEY_BINDINGS,
  file: {
    new: DEFAULT_MAC_FILE_NEW,
    save: DEFAULT_MAC_FILE_SAVE,
    saveAs: DEFAULT_MAC_FILE_SAVE_AS,
    open: DEFAULT_MAC_FILE_OPEN,
  },
  edit: {
    undo: DEFAULT_MAC_EDIT_UNDO,
    redo: DEFAULT_MAC_EDIT_REDO,
    cut: DEFAULT_MAC_EDIT_CUT,
    copy: {
      copy: DEFAULT_MAC_EDIT_COPY_COPY,
      style: DEFAULT_MAC_EDIT_COPY_STYLE,
      svg: DEFAULT_MAC_EDIT_COPY_SVG,
    },
    paste: {
      paste: DEFAULT_MAC_EDIT_PASTE_PASTE,
      overSelection: DEFAULT_MAC_EDIT_PASTE_OVER_SELECTION,
      style: DEFAULT_MAC_EDIT_PASTE_STYLE,
      svg: DEFAULT_MAC_EDIT_PASTE_SVG,
    },
    delete: DEFAULT_MAC_EDIT_DELETE,
    duplicate: DEFAULT_MAC_EDIT_DUPLICATE,
    select: {
      selectAll: DEFAULT_MAC_EDIT_SELECT_SELECT_ALL,
      selectAllArtboards: DEFAULT_MAC_EDIT_SELECT_SELECT_ALL_ARTBOARDS,
    },
    find: DEFAULT_MAC_EDIT_FIND,
    rename: DEFAULT_MAC_EDIT_RENAME,
  },
  insert: {
    artboard: DEFAULT_MAC_INSERT_ARTBOARD,
    shape: {
      rectangle: DEFAULT_MAC_INSERT_SHAPE_RECTANGLE,
      rounded: DEFAULT_MAC_INSERT_SHAPE_ROUNDED,
      ellipse: DEFAULT_MAC_INSERT_SHAPE_ELLIPSE,
      polygon: DEFAULT_MAC_INSERT_SHAPE_POLYGON,
      star: DEFAULT_MAC_INSERT_SHAPE_STAR,
      line: DEFAULT_MAC_INSERT_SHAPE_LINE,
    },
    text: DEFAULT_MAC_INSERT_TEXT,
    image: DEFAULT_MAC_INSERT_IMAGE,
  },
  layer: {
    style: {
      fill: DEFAULT_MAC_LAYER_STYLE_FILL,
      stroke: DEFAULT_MAC_LAYER_STYLE_STROKE,
      shadow: DEFAULT_MAC_LAYER_STYLE_SHADOW,
    },
    transform: {
      flipHorizontally: DEFAULT_MAC_LAYER_TRANSFORM_FLIP_HORIZONTALLY,
      flipVertically: DEFAULT_MAC_LAYER_TRANSFORM_FLIP_VERTICALLY,
    },
    combine: {
      union: DEFAULT_MAC_LAYER_COMBINE_UNION,
      subtract: DEFAULT_MAC_LAYER_COMBINE_SUBTRACT,
      intersect: DEFAULT_MAC_LAYER_COMBINE_INTERSECT,
      difference: DEFAULT_MAC_LAYER_COMBINE_DIFFERENCE,
    },
    image: {
      originalDimensions: DEFAULT_MAC_LAYER_IMAGE_ORIGINAL_DIMENSIONS,
      replace: DEFAULT_MAC_LAYER_IMAGE_REPLACE,
    },
    mask: {
      useAsMask: DEFAULT_MAC_LAYER_MASK_USE_AS_MASK,
      ignoreUnderlyingMask: DEFAULT_MAC_LAYER_MASK_IGNORE_UNDERLYING_MASK,
    },
  },
  arrange: {
    bringForward: DEFAULT_MAC_ARRANGE_BRING_FORWARD,
    bringToFront: DEFAULT_MAC_ARRANGE_BRING_TO_FRONT,
    sendBackward: DEFAULT_MAC_ARRANGE_SEND_BACKWARD,
    sendToBack: DEFAULT_MAC_ARRANGE_SEND_TO_BACK,
    align: {
      left: DEFAULT_MAC_ARRANGE_ALIGN_LEFT,
      center: DEFAULT_MAC_ARRANGE_ALIGN_CENTER,
      right: DEFAULT_MAC_ARRANGE_ALIGN_RIGHT,
      top: DEFAULT_MAC_ARRANGE_ALIGN_TOP,
      middle: DEFAULT_MAC_ARRANGE_ALIGN_MIDDLE,
      bottom: DEFAULT_MAC_ARRANGE_ALIGN_BOTTOM,
    },
    distribute: {
      horizontally: DEFAULT_MAC_ARRANGE_DISTRIBUTE_HORIZONTALLY,
      vertically: DEFAULT_MAC_ARRANGE_DISTRIBUTE_VERTICALLY,
    },
    group: DEFAULT_MAC_ARRANGE_GROUP,
    ungroup: DEFAULT_MAC_ARRANGE_UNGROUP,
  },
  view: {
    zoomIn: DEFAULT_MAC_VIEW_ZOOM_IN,
    zoomOut: DEFAULT_MAC_VIEW_ZOOM_OUT,
    zoomFit: {
      canvas: DEFAULT_MAC_VIEW_ZOOM_FIT_CANVAS,
      selected: DEFAULT_MAC_VIEW_ZOOM_FIT_SELECTED,
      activeArtboard: DEFAULT_MAC_VIEW_ZOOM_FIT_ACTIVE_ARTBOARD,
    },
    centerSelected: DEFAULT_MAC_VIEW_CENTER_SELECTED,
    showLayers: DEFAULT_MAC_VIEW_SHOW_LAYERS,
    showStyles: DEFAULT_MAC_VIEW_SHOW_STYLES,
    showEvents: DEFAULT_MAC_VIEW_SHOW_EVENTS,
  }
}

export const initialWindowsState: KeyBindingsState = {
  allBindings: ALL_WINDOWS_KEY_BINDINGS,
  file: {
    new: DEFAULT_WINDOWS_FILE_NEW,
    save: DEFAULT_WINDOWS_FILE_SAVE,
    saveAs: DEFAULT_WINDOWS_FILE_SAVE_AS,
    open: DEFAULT_WINDOWS_FILE_OPEN,
  },
  edit: {
    undo: DEFAULT_WINDOWS_EDIT_UNDO,
    redo: DEFAULT_WINDOWS_EDIT_REDO,
    cut: DEFAULT_WINDOWS_EDIT_CUT,
    copy: {
      copy: DEFAULT_WINDOWS_EDIT_COPY_COPY,
      style: DEFAULT_WINDOWS_EDIT_COPY_STYLE,
      svg: DEFAULT_WINDOWS_EDIT_COPY_SVG,
    },
    paste: {
      paste: DEFAULT_WINDOWS_EDIT_PASTE_PASTE,
      overSelection: DEFAULT_WINDOWS_EDIT_PASTE_OVER_SELECTION,
      style: DEFAULT_WINDOWS_EDIT_PASTE_STYLE,
      svg: DEFAULT_WINDOWS_EDIT_PASTE_SVG,
    },
    delete: DEFAULT_WINDOWS_EDIT_DELETE,
    duplicate: DEFAULT_WINDOWS_EDIT_DUPLICATE,
    select: {
      selectAll: DEFAULT_WINDOWS_EDIT_SELECT_SELECT_ALL,
      selectAllArtboards: DEFAULT_WINDOWS_EDIT_SELECT_SELECT_ALL_ARTBOARDS,
    },
    find: DEFAULT_WINDOWS_EDIT_FIND,
    rename: DEFAULT_WINDOWS_EDIT_RENAME,
  },
  insert: {
    artboard: DEFAULT_WINDOWS_INSERT_ARTBOARD,
    shape: {
      rectangle: DEFAULT_WINDOWS_INSERT_SHAPE_RECTANGLE,
      rounded: DEFAULT_WINDOWS_INSERT_SHAPE_ROUNDED,
      ellipse: DEFAULT_WINDOWS_INSERT_SHAPE_ELLIPSE,
      polygon: DEFAULT_WINDOWS_INSERT_SHAPE_POLYGON,
      star: DEFAULT_WINDOWS_INSERT_SHAPE_STAR,
      line: DEFAULT_WINDOWS_INSERT_SHAPE_LINE,
    },
    text: DEFAULT_WINDOWS_INSERT_TEXT,
    image: DEFAULT_WINDOWS_INSERT_IMAGE,
  },
  layer: {
    style: {
      fill: DEFAULT_WINDOWS_LAYER_STYLE_FILL,
      stroke: DEFAULT_WINDOWS_LAYER_STYLE_STROKE,
      shadow: DEFAULT_WINDOWS_LAYER_STYLE_SHADOW,
    },
    transform: {
      flipHorizontally: DEFAULT_WINDOWS_LAYER_TRANSFORM_FLIP_HORIZONTALLY,
      flipVertically: DEFAULT_WINDOWS_LAYER_TRANSFORM_FLIP_VERTICALLY,
    },
    combine: {
      union: DEFAULT_WINDOWS_LAYER_COMBINE_UNION,
      subtract: DEFAULT_WINDOWS_LAYER_COMBINE_SUBTRACT,
      intersect: DEFAULT_WINDOWS_LAYER_COMBINE_INTERSECT,
      difference: DEFAULT_WINDOWS_LAYER_COMBINE_DIFFERENCE,
    },
    image: {
      originalDimensions: DEFAULT_WINDOWS_LAYER_IMAGE_ORIGINAL_DIMENSIONS,
      replace: DEFAULT_WINDOWS_LAYER_IMAGE_REPLACE,
    },
    mask: {
      useAsMask: DEFAULT_WINDOWS_LAYER_MASK_USE_AS_MASK,
      ignoreUnderlyingMask: DEFAULT_WINDOWS_LAYER_MASK_IGNORE_UNDERLYING_MASK,
    },
  },
  arrange: {
    bringForward: DEFAULT_WINDOWS_ARRANGE_BRING_FORWARD,
    bringToFront: DEFAULT_WINDOWS_ARRANGE_BRING_TO_FRONT,
    sendBackward: DEFAULT_WINDOWS_ARRANGE_SEND_BACKWARD,
    sendToBack: DEFAULT_WINDOWS_ARRANGE_SEND_TO_BACK,
    align: {
      left: DEFAULT_WINDOWS_ARRANGE_ALIGN_LEFT,
      center: DEFAULT_WINDOWS_ARRANGE_ALIGN_CENTER,
      right: DEFAULT_WINDOWS_ARRANGE_ALIGN_RIGHT,
      top: DEFAULT_WINDOWS_ARRANGE_ALIGN_TOP,
      middle: DEFAULT_WINDOWS_ARRANGE_ALIGN_MIDDLE,
      bottom: DEFAULT_WINDOWS_ARRANGE_ALIGN_BOTTOM,
    },
    distribute: {
      horizontally: DEFAULT_WINDOWS_ARRANGE_DISTRIBUTE_HORIZONTALLY,
      vertically: DEFAULT_WINDOWS_ARRANGE_DISTRIBUTE_VERTICALLY,
    },
    group: DEFAULT_WINDOWS_ARRANGE_GROUP,
    ungroup: DEFAULT_WINDOWS_ARRANGE_UNGROUP,
  },
  view: {
    zoomIn: DEFAULT_WINDOWS_VIEW_ZOOM_IN,
    zoomOut: DEFAULT_WINDOWS_VIEW_ZOOM_OUT,
    zoomFit: {
      canvas: DEFAULT_WINDOWS_VIEW_ZOOM_FIT_CANVAS,
      selected: DEFAULT_WINDOWS_VIEW_ZOOM_FIT_SELECTED,
      activeArtboard: DEFAULT_WINDOWS_VIEW_ZOOM_FIT_ACTIVE_ARTBOARD,
    },
    centerSelected: DEFAULT_WINDOWS_VIEW_CENTER_SELECTED,
    showLayers: DEFAULT_WINDOWS_VIEW_SHOW_LAYERS,
    showStyles: DEFAULT_WINDOWS_VIEW_SHOW_STYLES,
    showEvents: DEFAULT_WINDOWS_VIEW_SHOW_EVENTS,
  }
}

const replaceBinding = (state: KeyBindingsState, currentbinding: string, binding: string, index: number) => {
  let currentState = state;
  const allBindings = [...currentState.allBindings];
  allBindings.splice(index, 1, binding);
  currentState = {
    ...currentState,
    allBindings: allBindings
  }
  return currentState;
}

export default (state = initialMacState, action: KeyBindingsTypes): KeyBindingsState => {
  switch (action.type) {
    case SET_FILE_NEW: {
      let currentState = replaceBinding(state, state.file.new, action.payload.binding, 0);
      return {
        ...currentState,
        file: {
          ...currentState.file,
          new: action.payload.binding
        }
      }
    }
    case SET_FILE_SAVE: {
      let currentState = replaceBinding(state, state.file.save, action.payload.binding, 1);
      return {
        ...currentState,
        file: {
          ...currentState.file,
          save: action.payload.binding
        }
      }
    }
    case SET_FILE_SAVE_AS: {
      let currentState = replaceBinding(state, state.file.saveAs, action.payload.binding, 2);
      return {
        ...currentState,
        file: {
          ...currentState.file,
          saveAs: action.payload.binding
        }
      }
    }
    case SET_FILE_OPEN: {
      let currentState = replaceBinding(state, state.file.open, action.payload.binding, 3);
      return {
        ...currentState,
        file: {
          ...currentState.file,
          open: action.payload.binding
        }
      }
    }
    case SET_EDIT_UNDO: {
      let currentState = replaceBinding(state, state.edit.undo, action.payload.binding, 4);
      return {
        ...currentState,
        edit: {
          ...currentState.edit,
          undo: action.payload.binding
        }
      }
    }
    case SET_EDIT_REDO: {
      let currentState = replaceBinding(state, state.edit.redo, action.payload.binding, 5);
      return {
        ...currentState,
        edit: {
          ...currentState.edit,
          redo: action.payload.binding
        }
      }
    }
    case SET_EDIT_CUT: {
      let currentState = replaceBinding(state, state.edit.cut, action.payload.binding, 6);
      return {
        ...currentState,
        edit: {
          ...currentState.edit,
          cut: action.payload.binding
        }
      }
    }
    case SET_EDIT_COPY_COPY: {
      let currentState = replaceBinding(state, state.edit.copy.copy, action.payload.binding, 7);
      return {
        ...currentState,
        edit: {
          ...currentState.edit,
          copy: {
            ...currentState.edit.copy,
            copy: action.payload.binding
          }
        }
      }
    }
    case SET_EDIT_COPY_STYLE: {
      let currentState = replaceBinding(state, state.edit.copy.style, action.payload.binding, 8);
      return {
        ...currentState,
        edit: {
          ...currentState.edit,
          copy: {
            ...currentState.edit.copy,
            style: action.payload.binding
          }
        }
      }
    }
    case SET_EDIT_COPY_SVG: {
      let currentState = replaceBinding(state, state.edit.copy.svg, action.payload.binding, 9);
      return {
        ...currentState,
        edit: {
          ...currentState.edit,
          copy: {
            ...currentState.edit.copy,
            svg: action.payload.binding
          }
        }
      }
    }
    case SET_EDIT_PASTE_PASTE: {
      let currentState = replaceBinding(state, state.edit.paste.paste, action.payload.binding, 10);
      return {
        ...currentState,
        edit: {
          ...currentState.edit,
          paste: {
            ...currentState.edit.paste,
            paste: action.payload.binding
          }
        }
      }
    }
    case SET_EDIT_PASTE_OVER_SELECTION: {
      let currentState = replaceBinding(state, state.edit.paste.overSelection, action.payload.binding, 11);
      return {
        ...currentState,
        edit: {
          ...currentState.edit,
          paste: {
            ...currentState.edit.paste,
            overSelection: action.payload.binding
          }
        }
      }
    }
    case SET_EDIT_PASTE_STYLE: {
      let currentState = replaceBinding(state, state.edit.paste.style, action.payload.binding, 12);
      return {
        ...currentState,
        edit: {
          ...currentState.edit,
          paste: {
            ...currentState.edit.paste,
            style: action.payload.binding
          }
        }
      }
    }
    case SET_EDIT_PASTE_SVG: {
      let currentState = replaceBinding(state, state.edit.paste.svg, action.payload.binding, 13);
      return {
        ...currentState,
        edit: {
          ...currentState.edit,
          paste: {
            ...currentState.edit.paste,
            svg: action.payload.binding
          }
        }
      }
    }
    case SET_EDIT_DELETE: {
      let currentState = replaceBinding(state, state.edit.delete, action.payload.binding, 14);
      return {
        ...currentState,
        edit: {
          ...currentState.edit,
          delete: action.payload.binding
        }
      }
    }
    case SET_EDIT_DUPLICATE: {
      let currentState = replaceBinding(state, state.edit.duplicate, action.payload.binding, 15);
      return {
        ...currentState,
        edit: {
          ...currentState.edit,
          duplicate: action.payload.binding
        }
      }
    }
    case SET_EDIT_SELECT_SELECT_ALL: {
      let currentState = replaceBinding(state, state.edit.select.selectAll, action.payload.binding, 16);
      return {
        ...currentState,
        edit: {
          ...currentState.edit,
          select: {
            ...currentState.edit.select,
            selectAll: action.payload.binding
          }
        }
      }
    }
    case SET_EDIT_SELECT_SELECT_ALL_ARTBOARDS: {
      let currentState = replaceBinding(state, state.edit.select.selectAllArtboards, action.payload.binding, 17);
      return {
        ...currentState,
        edit: {
          ...currentState.edit,
          select: {
            ...currentState.edit.select,
            selectAllArtboards: action.payload.binding
          }
        }
      }
    }
    case SET_EDIT_FIND: {
      let currentState = replaceBinding(state, state.edit.find, action.payload.binding, 18);
      return {
        ...currentState,
        edit: {
          ...currentState.edit,
          find: action.payload.binding
        }
      }
    }
    case SET_EDIT_RENAME: {
      let currentState = replaceBinding(state, state.edit.rename, action.payload.binding, 19);
      return {
        ...currentState,
        edit: {
          ...currentState.edit,
          rename: action.payload.binding
        }
      }
    }
    case SET_INSERT_ARTBOARD: {
      let currentState = replaceBinding(state, state.insert.artboard, action.payload.binding, 20);
      return {
        ...currentState,
        insert: {
          ...currentState.insert,
          artboard: action.payload.binding
        }
      }
    }
    case SET_INSERT_SHAPE_RECTANGLE: {
      let currentState = replaceBinding(state, state.insert.shape.rectangle, action.payload.binding, 21);
      return {
        ...currentState,
        insert: {
          ...currentState.insert,
          shape: {
            ...currentState.insert.shape,
            rectangle: action.payload.binding
          }
        }
      }
    }
    case SET_INSERT_SHAPE_ROUNDED: {
      let currentState = replaceBinding(state, state.insert.shape.rounded, action.payload.binding, 22);
      return {
        ...currentState,
        insert: {
          ...currentState.insert,
          shape: {
            ...currentState.insert.shape,
            rounded: action.payload.binding
          }
        }
      }
    }
    case SET_INSERT_SHAPE_ELLIPSE: {
      let currentState = replaceBinding(state, state.insert.shape.ellipse, action.payload.binding, 23);
      return {
        ...currentState,
        insert: {
          ...currentState.insert,
          shape: {
            ...currentState.insert.shape,
            ellipse: action.payload.binding
          }
        }
      }
    }
    case SET_INSERT_SHAPE_POLYGON: {
      let currentState = replaceBinding(state, state.insert.shape.polygon, action.payload.binding, 24);
      return {
        ...currentState,
        insert: {
          ...currentState.insert,
          shape: {
            ...currentState.insert.shape,
            polygon: action.payload.binding
          }
        }
      }
    }
    case SET_INSERT_SHAPE_STAR: {
      let currentState = replaceBinding(state, state.insert.shape.star, action.payload.binding, 25);
      return {
        ...currentState,
        insert: {
          ...currentState.insert,
          shape: {
            ...currentState.insert.shape,
            star: action.payload.binding
          }
        }
      }
    }
    case SET_INSERT_SHAPE_LINE: {
      let currentState = replaceBinding(state, state.insert.shape.line, action.payload.binding, 26);
      return {
        ...currentState,
        insert: {
          ...currentState.insert,
          shape: {
            ...currentState.insert.shape,
            line: action.payload.binding
          }
        }
      }
    }
    case SET_INSERT_TEXT: {
      let currentState = replaceBinding(state, state.insert.text, action.payload.binding, 27);
      return {
        ...currentState,
        insert: {
          ...currentState.insert,
          text: action.payload.binding
        }
      }
    }
    case SET_INSERT_IMAGE: {
      let currentState = replaceBinding(state, state.insert.image, action.payload.binding, 28);
      return {
        ...currentState,
        insert: {
          ...currentState.insert,
          image: action.payload.binding
        }
      }
    }
    case SET_LAYER_STYLE_FILL: {
      let currentState = replaceBinding(state, state.layer.style.fill, action.payload.binding, 29);
      return {
        ...currentState,
        layer: {
          ...currentState.layer,
          style: {
            ...currentState.layer.style,
            fill: action.payload.binding
          }
        }
      }
    }
    case SET_LAYER_STYLE_STROKE: {
      let currentState = replaceBinding(state, state.layer.style.stroke, action.payload.binding, 30);
      return {
        ...currentState,
        layer: {
          ...currentState.layer,
          style: {
            ...currentState.layer.style,
            stroke: action.payload.binding
          }
        }
      }
    }
    case SET_LAYER_STYLE_SHADOW: {
      let currentState = replaceBinding(state, state.layer.style.shadow, action.payload.binding, 31);
      return {
        ...currentState,
        layer: {
          ...currentState.layer,
          style: {
            ...currentState.layer.style,
            shadow: action.payload.binding
          }
        }
      }
    }
    case SET_LAYER_TRANSFORM_FLIP_HORIZONTALLY: {
      let currentState = replaceBinding(state, state.layer.transform.flipHorizontally, action.payload.binding, 32);
      return {
        ...currentState,
        layer: {
          ...currentState.layer,
          transform: {
            ...currentState.layer.transform,
            flipHorizontally: action.payload.binding
          }
        }
      }
    }
    case SET_LAYER_TRANSFORM_FLIP_VERTICALLY: {
      let currentState = replaceBinding(state, state.layer.transform.flipVertically, action.payload.binding, 33);
      return {
        ...currentState,
        layer: {
          ...currentState.layer,
          transform: {
            ...currentState.layer.transform,
            flipVertically: action.payload.binding
          }
        }
      }
    }
    case SET_LAYER_COMBINE_UNION: {
      let currentState = replaceBinding(state, state.layer.combine.union, action.payload.binding, 34);
      return {
        ...currentState,
        layer: {
          ...currentState.layer,
          combine: {
            ...currentState.layer.combine,
            union: action.payload.binding
          }
        }
      }
    }
    case SET_LAYER_COMBINE_SUBTRACT: {
      let currentState = replaceBinding(state, state.layer.combine.subtract, action.payload.binding, 35);
      return {
        ...currentState,
        layer: {
          ...currentState.layer,
          combine: {
            ...currentState.layer.combine,
            subtract: action.payload.binding
          }
        }
      }
    }
    case SET_LAYER_COMBINE_INTERSECT: {
      let currentState = replaceBinding(state, state.layer.combine.intersect, action.payload.binding, 36);
      return {
        ...currentState,
        layer: {
          ...currentState.layer,
          combine: {
            ...currentState.layer.combine,
            intersect: action.payload.binding
          }
        }
      }
    }
    case SET_LAYER_COMBINE_DIFFERENCE: {
      let currentState = replaceBinding(state, state.layer.combine.difference, action.payload.binding, 37);
      return {
        ...currentState,
        layer: {
          ...currentState.layer,
          combine: {
            ...currentState.layer.combine,
            difference: action.payload.binding
          }
        }
      }
    }
    case SET_LAYER_IMAGE_ORIGINAL_DIMENSIONS: {
      let currentState = replaceBinding(state, state.layer.image.originalDimensions, action.payload.binding, 38);
      return {
        ...currentState,
        layer: {
          ...currentState.layer,
          image: {
            ...currentState.layer.image,
            originalDimensions: action.payload.binding
          }
        }
      }
    }
    case SET_LAYER_IMAGE_REPLACE: {
      let currentState = replaceBinding(state, state.layer.image.replace, action.payload.binding, 39);
      return {
        ...currentState,
        layer: {
          ...currentState.layer,
          image: {
            ...currentState.layer.image,
            replace: action.payload.binding
          }
        }
      }
    }
    case SET_LAYER_MASK_USE_AS_MASK: {
      let currentState = replaceBinding(state, state.layer.mask.useAsMask, action.payload.binding, 40);
      return {
        ...currentState,
        layer: {
          ...currentState.layer,
          mask: {
            ...currentState.layer.mask,
            useAsMask: action.payload.binding
          }
        }
      }
    }
    case SET_LAYER_MASK_IGNORE_UNDERLYING_MASK: {
      let currentState = replaceBinding(state, state.layer.mask.ignoreUnderlyingMask, action.payload.binding, 41);
      return {
        ...currentState,
        layer: {
          ...currentState.layer,
          mask: {
            ...currentState.layer.mask,
            ignoreUnderlyingMask: action.payload.binding
          }
        }
      }
    }
    case SET_ARRANGE_BRING_FORWARD: {
      let currentState = replaceBinding(state, state.arrange.bringForward, action.payload.binding, 42);
      return {
        ...currentState,
        arrange: {
          ...currentState.arrange,
          bringForward: action.payload.binding
        }
      }
    }
    case SET_ARRANGE_BRING_TO_FRONT: {
      let currentState = replaceBinding(state, state.arrange.bringToFront, action.payload.binding, 43);
      return {
        ...currentState,
        arrange: {
          ...currentState.arrange,
          bringToFront: action.payload.binding
        }
      }
    }
    case SET_ARRANGE_SEND_BACKWARD: {
      let currentState = replaceBinding(state, state.arrange.sendBackward, action.payload.binding, 44);
      return {
        ...currentState,
        arrange: {
          ...currentState.arrange,
          sendBackward: action.payload.binding
        }
      }
    }
    case SET_ARRANGE_SEND_TO_BACK: {
      let currentState = replaceBinding(state, state.arrange.sendToBack, action.payload.binding, 45);
      return {
        ...currentState,
        arrange: {
          ...currentState.arrange,
          sendToBack: action.payload.binding
        }
      }
    }
    case SET_ARRANGE_ALIGN_LEFT: {
      let currentState = replaceBinding(state, state.arrange.align.left, action.payload.binding, 46);
      return {
        ...currentState,
        arrange: {
          ...currentState.arrange,
          align: {
            ...currentState.arrange.align,
            left: action.payload.binding
          }
        }
      }
    }
    case SET_ARRANGE_ALIGN_CENTER: {
      let currentState = replaceBinding(state, state.arrange.align.center, action.payload.binding, 47);
      return {
        ...currentState,
        arrange: {
          ...currentState.arrange,
          align: {
            ...currentState.arrange.align,
            center: action.payload.binding
          }
        }
      }
    }
    case SET_ARRANGE_ALIGN_RIGHT: {
      let currentState = replaceBinding(state, state.arrange.align.right, action.payload.binding, 48);
      return {
        ...currentState,
        arrange: {
          ...currentState.arrange,
          align: {
            ...currentState.arrange.align,
            right: action.payload.binding
          }
        }
      }
    }
    case SET_ARRANGE_ALIGN_TOP: {
      let currentState = replaceBinding(state, state.arrange.align.top, action.payload.binding, 49);
      return {
        ...currentState,
        arrange: {
          ...currentState.arrange,
          align: {
            ...currentState.arrange.align,
            top: action.payload.binding
          }
        }
      }
    }
    case SET_ARRANGE_ALIGN_MIDDLE: {
      let currentState = replaceBinding(state, state.arrange.align.middle, action.payload.binding, 50);
      return {
        ...currentState,
        arrange: {
          ...currentState.arrange,
          align: {
            ...currentState.arrange.align,
            middle: action.payload.binding
          }
        }
      }
    }
    case SET_ARRANGE_ALIGN_BOTTOM: {
      let currentState = replaceBinding(state, state.arrange.align.bottom, action.payload.binding, 51);
      return {
        ...currentState,
        arrange: {
          ...currentState.arrange,
          align: {
            ...currentState.arrange.align,
            bottom: action.payload.binding
          }
        }
      }
    }
    case SET_ARRANGE_DISTRIBUTE_HORIZONTALLY: {
      let currentState = replaceBinding(state, state.arrange.distribute.horizontally, action.payload.binding, 52);
      return {
        ...currentState,
        arrange: {
          ...currentState.arrange,
          distribute: {
            ...currentState.arrange.distribute,
            horizontally: action.payload.binding
          }
        }
      }
    }
    case SET_ARRANGE_DISTRIBUTE_VERTICALLY: {
      let currentState = replaceBinding(state, state.arrange.distribute.vertically, action.payload.binding, 53);
      return {
        ...currentState,
        arrange: {
          ...currentState.arrange,
          distribute: {
            ...currentState.arrange.distribute,
            vertically: action.payload.binding
          }
        }
      }
    }
    case SET_ARRANGE_GROUP: {
      let currentState = replaceBinding(state, state.arrange.group, action.payload.binding, 54);
      return {
        ...currentState,
        arrange: {
          ...currentState.arrange,
          group: action.payload.binding
        }
      }
    }
    case SET_ARRANGE_UNGROUP: {
      let currentState = replaceBinding(state, state.arrange.ungroup, action.payload.binding, 55);
      return {
        ...currentState,
        arrange: {
          ...currentState.arrange,
          ungroup: action.payload.binding
        }
      }
    }
    case SET_VIEW_ZOOM_IN: {
      let currentState = replaceBinding(state, state.view.zoomIn, action.payload.binding, 56);
      return {
        ...currentState,
        view: {
          ...currentState.view,
          zoomIn: action.payload.binding
        }
      }
    }
    case SET_VIEW_ZOOM_OUT: {
      let currentState = replaceBinding(state, state.view.zoomOut, action.payload.binding, 57);
      return {
        ...currentState,
        view: {
          ...currentState.view,
          zoomOut: action.payload.binding
        }
      }
    }
    case SET_VIEW_ZOOM_FIT_CANVAS: {
      let currentState = replaceBinding(state, state.view.zoomFit.canvas, action.payload.binding, 58);
      return {
        ...currentState,
        view: {
          ...currentState.view,
          zoomFit: {
            ...currentState.view.zoomFit,
            canvas: action.payload.binding
          }
        }
      }
    }
    case SET_VIEW_ZOOM_FIT_SELECTED: {
      let currentState = replaceBinding(state, state.view.zoomFit.selected, action.payload.binding, 59);
      return {
        ...currentState,
        view: {
          ...currentState.view,
          zoomFit: {
            ...currentState.view.zoomFit,
            selected: action.payload.binding
          }
        }
      }
    }
    case SET_VIEW_ZOOM_FIT_ACTIVE_ARTBOARD: {
      let currentState = replaceBinding(state, state.view.zoomFit.activeArtboard, action.payload.binding, 60);
      return {
        ...currentState,
        view: {
          ...currentState.view,
          zoomFit: {
            ...currentState.view.zoomFit,
            activeArtboard: action.payload.binding
          }
        }
      }
    }
    case SET_VIEW_CENTER_SELECTED: {
      let currentState = replaceBinding(state, state.view.centerSelected, action.payload.binding, 61);
      return {
        ...currentState,
        view: {
          ...currentState.view,
          centerSelected: action.payload.binding
        }
      }
    }
    case SET_VIEW_SHOW_LAYERS: {
      let currentState = replaceBinding(state, state.view.showLayers, action.payload.binding, 62);
      return {
        ...currentState,
        view: {
          ...currentState.view,
          showLayers: action.payload.binding
        }
      }
    }
    case SET_VIEW_SHOW_STYLES: {
      let currentState = replaceBinding(state, state.view.showStyles, action.payload.binding, 63);
      return {
        ...currentState,
        view: {
          ...currentState.view,
          showStyles: action.payload.binding
        }
      }
    }
    case SET_VIEW_SHOW_EVENTS: {
      let currentState = replaceBinding(state, state.view.showEvents, action.payload.binding, 64);
      return {
        ...currentState,
        view: {
          ...currentState.view,
          showEvents: action.payload.binding
        }
      }
    }
    case RESET_ALL_KEY_BINDINGS: {
      return {
        ...state,
        ...action.payload
      }
    }
    case HYDRATE_KEY_BINDINGS: {
      return {
        ...state,
        ...action.payload
      }
    }
    default:
      return state;
  }
}
