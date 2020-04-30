import { LayerTypes } from './layer';
import { DrawToolTypes } from './drawTool';
import { SelectionToolTypes } from './selectionTool';
import { HoverTypes } from './hover';

export type RootAction = LayerTypes | DrawToolTypes | SelectionToolTypes | HoverTypes;