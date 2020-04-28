import { LayersTypes } from './layers';
import { SelectionTypes } from './selection';
import { DrawToolTypes } from './drawTool';
import { SelectionToolTypes } from './selectionTool';
import { HoverTypes } from './hover';

export type RootAction = LayersTypes | SelectionTypes | DrawToolTypes | SelectionToolTypes | HoverTypes;