import { LayerTypes } from './layer';
import { SelectionTypes } from './selection';
import { DrawToolTypes } from './drawTool';
import { SelectionToolTypes } from './selectionTool';
import { HoverTypes } from './hover';

export type RootAction = LayerTypes | SelectionTypes | DrawToolTypes | SelectionToolTypes | HoverTypes;