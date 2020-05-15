export const ADD_PAGE = 'ADD_PAGE';
export const ADD_GROUP = 'ADD_GROUP';
export const ADD_SHAPE = 'ADD_SHAPE';
export const ADD_ARTBOARD = 'ADD_ARTBOARD';

export const REMOVE_LAYER = 'REMOVE_LAYER';
export const REMOVE_LAYERS = 'REMOVE_LAYERS';

export const SELECT_LAYER = 'SELECT_LAYER';
export const DEEP_SELECT_LAYER = 'DEEP_SELECT_LAYER';
export const SELECT_LAYERS = 'SELECT_LAYERS';
export const DESELECT_LAYER = 'DESELECT_LAYER';
export const DESELECT_LAYERS = 'DESELECT_LAYERS';
export const DESELECT_ALL_LAYERS = 'DESELECT_ALL_LAYERS';

export const SET_LAYER_HOVER = 'SET_LAYER_HOVER';
export const ENABLE_LAYER_HOVER = 'ENABLE_LAYER_HOVER';
export const DISABLE_LAYER_HOVER = 'DISABLE_LAYER_HOVER';

export const ADD_LAYER_CHILD = 'ADD_LAYER_CHILD';
export const INSERT_LAYER_CHILD = 'INSERT_LAYER_CHILD';
export const SHOW_LAYER_CHILDREN = 'SHOW_LAYER_CHILDREN';
export const HIDE_LAYER_CHILDREN = 'HIDE_LAYER_CHILDREN';

export const INSERT_LAYER_ABOVE = 'INSERT_LAYER_ABOVE';
export const INSERT_LAYER_BELOW = 'INSERT_LAYER_BELOW';

export const INCREASE_LAYER_SCOPE = 'INCREASE_LAYER_SCOPE';
export const DECREASE_LAYER_SCOPE = 'DECREASE_LAYER_SCOPE';
export const CLEAR_LAYER_SCOPE = 'CLEAR_LAYER_SCOPE';
export const NEW_LAYER_SCOPE = 'NEW_LAYER_SCOPE';
export const ESCAPE_LAYER_SCOPE = 'ESCAPE_LAYER_SCOPE';

export const GROUP_LAYERS = 'GROUP_LAYERS';
export const UNGROUP_LAYER = 'UNGROUP_LAYER';
export const UNGROUP_LAYERS = 'UNGROUP_LAYERS';
export const SET_GROUP_SCOPE = 'SET_GROUP_SCOPE';

export const COPY_LAYER_TO_CLIPBOARD = 'COPY_LAYER_TO_CLIPBOARD';
export const COPY_LAYERS_TO_CLIPBOARD = 'COPY_LAYERS_TO_CLIPBOARD';
export const PASTE_LAYERS_FROM_CLIPBOARD = 'PASTE_LAYERS_FROM_CLIPBOARD';

export const MOVE_LAYER = 'MOVE_LAYER';
export const MOVE_LAYERS = 'MOVE_LAYERS';
export const MOVE_LAYER_TO = 'MOVE_LAYER_TO';
export const MOVE_LAYER_BY = 'MOVE_LAYER_BY';
export const MOVE_LAYERS_TO = 'MOVE_LAYERS_TO';
export const MOVE_LAYERS_BY = 'MOVE_LAYERS_BY';

export const ENABLE_LAYER_DRAG = 'ENABLE_LAYER_DRAG';
export const DISABLE_LAYER_DRAG = 'DISABLE_LAYER_DRAG';

export const SET_LAYER_NAME = 'SET_LAYER_NAME';

export const SET_ACTIVE_ARTBOARD = 'SET_ACTIVE_ARTBOARD';

export const ADD_LAYER_TWEEN_EVENT = 'ADD_LAYER_TWEEN_EVENT';
export const REMOVE_LAYER_TWEEN_EVENT = 'REMOVE_LAYER_TWEEN_EVENT';

export const ADD_LAYER_TWEEN = 'ADD_LAYER_TWEEN';
export const REMOVE_LAYER_TWEEN = 'REMOVE_LAYER_TWEEN';
export const SET_LAYER_TWEEN_DURATION = 'SET_LAYER_TWEEN_DURATION';
export const INCREMENT_LAYER_TWEEN_DURATION = 'INCREMENT_LAYER_TWEEN_DURATION';
export const DECREMENT_LAYER_TWEEN_DURATION = 'DECREMENT_LAYER_TWEEN_DURATION';
export const SET_LAYER_TWEEN_DELAY = 'SET_LAYER_TWEEN_DELAY';
export const INCREMENT_LAYER_TWEEN_DELAY = 'INCREMENT_LAYER_TWEEN_DELAY';
export const DECREMENT_LAYER_TWEEN_DELAY = 'DECREMENT_LAYER_TWEEN_DELAY';
export const SET_LAYER_TWEEN_EASE = 'SET_LAYER_TWEEN_EASE';
export const SET_LAYER_TWEEN_POWER = 'SET_LAYER_TWEEN_POWER';

// Page

export interface AddPagePayload {
  type?: 'Page';
  id?: string;
  name?: string;
  parent?: string;
  paperLayer?: paper.Item;
  selected?: boolean;
  hover?: boolean;
  children?: string[];
  tweenEvents?: [];
  tweens?: [];
  frozen?: boolean;
  showTweens: boolean;
}

export interface AddPage {
  type: typeof ADD_PAGE;
  payload: AddPagePayload;
}

// Artboard

export interface AddArtboardPayload {
  type?: 'Artboard';
  id?: string;
  frame?: em.Frame;
  name?: string;
  parent?: string;
  paperLayer?: paper.Item;
  selected?: boolean;
  hover?: boolean;
  children?: string[];
  showChildren?: boolean;
  tweenEvents?: [];
  tweens?: [];
  frozen?: boolean;
  showTweens: boolean;
}

export interface AddArtboard {
  type: typeof ADD_ARTBOARD;
  payload: AddArtboardPayload;
}

// Group

export interface AddGroupPayload {
  type?: 'Group';
  id?: string;
  frame?: em.Frame;
  name?: string;
  parent?: string;
  paperLayer?: paper.Item;
  selected?: boolean;
  hover?: boolean;
  children?: string[];
  showChildren?: boolean;
  tweenEvents?: [];
  tweens?: [];
  frozen?: boolean;
  showTweens: boolean;
}

export interface AddGroup {
  type: typeof ADD_GROUP;
  payload: AddGroupPayload;
}

// Shape

export interface AddShapePayload {
  type?: 'Shape';
  id?: string;
  frame?: em.Frame;
  name?: string;
  parent?: string;
  shapeType?: em.ShapeType;
  pathData?: string;
  paperLayer?: paper.Item;
  selected?: boolean;
  hover?: boolean;
  tweenEvents?: [];
  tweens?: [];
  frozen?: boolean;
  showTweens: boolean;
}

export interface AddShape {
  type: typeof ADD_SHAPE;
  payload: AddShapePayload;
}

// Remove

export interface RemoveLayerPayload {
  id: string;
}

export interface RemoveLayer {
  type: typeof REMOVE_LAYER;
  payload: RemoveLayerPayload;
}

export interface RemoveLayersPayload {
  layers: string[];
}

export interface RemoveLayers {
  type: typeof REMOVE_LAYERS;
  payload: RemoveLayersPayload;
}

// Select

export interface SelectLayerPayload {
  id: string;
  newSelection?: boolean;
}

export interface SelectLayer {
  type: typeof SELECT_LAYER;
  payload: SelectLayerPayload;
}

export interface DeepSelectLayerPayload {
  id: string;
}

export interface DeepSelectLayer {
  type: typeof DEEP_SELECT_LAYER;
  payload: DeepSelectLayerPayload;
}

export interface SelectLayersPayload {
  layers: string[];
  newSelection?: boolean;
}

export interface SelectLayers {
  type: typeof SELECT_LAYERS;
  payload: SelectLayersPayload;
}

export interface DeselectLayerPayload {
  id: string;
}

export interface DeselectLayer {
  type: typeof DESELECT_LAYER;
  payload: DeselectLayerPayload;
}

export interface DeselectLayersPayload {
  layers: string[];
}

export interface DeselectLayers {
  type: typeof DESELECT_LAYERS;
  payload: DeselectLayersPayload;
}

export interface DeselectAllLayers {
  type: typeof DESELECT_ALL_LAYERS;
}

// Hover

export interface SetLayerHoverPayload {
  id: string;
}

export interface SetLayerHover {
  type: typeof SET_LAYER_HOVER;
  payload: SetLayerHoverPayload;
}

export interface EnableLayerHoverPayload {
  id: string;
}

export interface EnableLayerHover {
  type: typeof ENABLE_LAYER_HOVER;
  payload: EnableLayerHoverPayload;
}

export interface DisableLayerHoverPayload {
  id: string;
}

export interface DisableLayerHover {
  type: typeof DISABLE_LAYER_HOVER;
  payload: DisableLayerHoverPayload;
}

// Children

export interface AddLayerChildPayload {
  id: string;
  child: string;
}

export interface AddLayerChild {
  type: typeof ADD_LAYER_CHILD;
  payload: AddLayerChildPayload;
}

export interface InsertLayerChildPayload {
  id: string;
  child: string;
  index: number;
}

export interface InsertLayerChild {
  type: typeof INSERT_LAYER_CHILD;
  payload: InsertLayerChildPayload;
}

export interface ShowLayerChildrenPayload {
  id: string;
}

export interface ShowLayerChildren {
  type: typeof SHOW_LAYER_CHILDREN;
  payload: ShowLayerChildrenPayload;
}

export interface HideLayerChildrenPayload {
  id: string;
}

export interface HideLayerChildren {
  type: typeof HIDE_LAYER_CHILDREN;
  payload: HideLayerChildrenPayload;
}

// Insert

export interface InsertLayerAbovePayload {
  id: string;
  above: string;
}

export interface InsertLayerAbove {
  type: typeof INSERT_LAYER_ABOVE;
  payload: InsertLayerAbovePayload;
}

export interface InsertLayerBelowPayload {
  id: string;
  below: string;
}

export interface InsertLayerBelow {
  type: typeof INSERT_LAYER_BELOW;
  payload: InsertLayerBelowPayload;
}

// Scope

export interface IncreaseLayerScopePayload {
  id: string;
}

export interface IncreaseLayerScope {
  type: typeof INCREASE_LAYER_SCOPE;
  payload: IncreaseLayerScopePayload;
}

export interface DecreaseLayerScope {
  type: typeof DECREASE_LAYER_SCOPE;
}

export interface ClearLayerScope {
  type: typeof CLEAR_LAYER_SCOPE;
}

export interface NewLayerScopePayload {
  id: string;
}

export interface NewLayerScope {
  type: typeof NEW_LAYER_SCOPE;
  payload: NewLayerScopePayload;
}

export interface EscapeLayerScope {
  type: typeof ESCAPE_LAYER_SCOPE;
}

// Group

export interface GroupLayersPayload {
  layers: string[];
}

export interface GroupLayers {
  type: typeof GROUP_LAYERS;
  payload: GroupLayersPayload;
}

export interface UngroupLayerPayload {
  id: string;
}

export interface UngroupLayer {
  type: typeof UNGROUP_LAYER;
  payload: UngroupLayerPayload;
}

export interface UngroupLayersPayload {
  layers: string[];
}

export interface UngroupLayers {
  type: typeof UNGROUP_LAYERS;
  payload: UngroupLayersPayload;
}

export interface SetGroupScopePayload {
  id: string;
}

export interface SetGroupScope {
  type: typeof SET_GROUP_SCOPE;
  payload: SetGroupScopePayload;
}

// Clipboard

export interface CopyLayerToClipboardPayload {
  id: string;
}

export interface CopyLayerToClipboard {
  type: typeof COPY_LAYER_TO_CLIPBOARD;
  payload: CopyLayerToClipboardPayload;
}

export interface CopyLayersToClipboardPayload {
  layers: string[];
}

export interface CopyLayersToClipboard {
  type: typeof COPY_LAYERS_TO_CLIPBOARD;
  payload: CopyLayersToClipboardPayload;
}

export interface PasteLayersFromClipboardPayload {
  overSelection?: boolean;
}

export interface PasteLayersFromClipboard {
  type: typeof PASTE_LAYERS_FROM_CLIPBOARD;
  payload: PasteLayersFromClipboardPayload;
}

// Move

export interface MoveLayerPayload {
  id: string;
}

export interface MoveLayer {
  type: typeof MOVE_LAYER;
  payload: MoveLayerPayload;
}

export interface MoveLayersPayload {
  layers: string[];
}

export interface MoveLayers {
  type: typeof MOVE_LAYERS;
  payload: MoveLayersPayload;
}

export interface MoveLayerToPayload {
  id: string;
  x: number;
  y: number;
}

export interface MoveLayerTo {
  type: typeof MOVE_LAYER_TO;
  payload: MoveLayerToPayload;
}

export interface MoveLayerByPayload {
  id: string;
  x: number;
  y: number;
}

export interface MoveLayerBy {
  type: typeof MOVE_LAYER_BY;
  payload: MoveLayerByPayload;
}

export interface MoveLayersToPayload {
  layers: string[];
  x: number;
  y: number;
}

export interface MoveLayersTo {
  type: typeof MOVE_LAYERS_TO;
  payload: MoveLayersToPayload;
}

export interface MoveLayersByPayload {
  layers: string[];
  x: number;
  y: number;
}

export interface MoveLayersBy {
  type: typeof MOVE_LAYERS_BY;
  payload: MoveLayersByPayload;
}

// Drag

export interface EnableLayerDrag {
  type: typeof ENABLE_LAYER_DRAG;
}

export interface DisableLayerDrag {
  type: typeof DISABLE_LAYER_DRAG;
}

// Set layer name

export interface SetLayerNamePayload {
  id: string;
  name: string;
}

export interface SetLayerName {
  type: typeof SET_LAYER_NAME;
  payload: SetLayerNamePayload;
}

// Artboard

export interface SetActiveArtboardPayload {
  id: string;
}

export interface SetActiveArtboard {
  type: typeof SET_ACTIVE_ARTBOARD;
  payload: SetActiveArtboardPayload;
}

// Tween Event

export interface AddLayerTweenEventPayload {
  layer?: string;
  name?: string;
  id?: string;
  event?: em.TweenEvent;
  artboard?: string;
  destinationArtboard?: string;
  tweens: string[];
}

export interface AddLayerTweenEvent {
  type: typeof ADD_LAYER_TWEEN_EVENT;
  payload: AddLayerTweenEventPayload;
}

export interface RemoveLayerTweenEventPayload {
  id: string;
}

export interface RemoveLayerTweenEvent {
  type: typeof REMOVE_LAYER_TWEEN_EVENT;
  payload: RemoveLayerTweenEventPayload;
}

// Tween

export interface AddLayerTweenPayload {
  id?: string;
  prop?: em.TweenPropTypes;
  layer?: string;
  destinationLayer?: string;
  event?: string;
  ease?: em.TweenEaseTypes;
  power?: em.TweenEasePowerTypes;
  custom?: string;
  duration?: number;
  delay?: number;
  frozen?: boolean;
}

export interface AddLayerTween {
  type: typeof ADD_LAYER_TWEEN;
  payload: em.Tween;
}

export interface RemoveLayerTweenPayload {
  id: string;
}

export interface RemoveLayerTween {
  type: typeof REMOVE_LAYER_TWEEN;
  payload: RemoveLayerTweenPayload;
}

export interface SetLayerTweenDurationPayload {
  id: string;
  duration: number;
}

export interface SetLayerTweenDuration {
  type: typeof SET_LAYER_TWEEN_DURATION;
  payload: SetLayerTweenDurationPayload;
}

export interface IncrementLayerTweenDurationPayload {
  id: string;
  factor?: number;
}

export interface IncrementLayerTweenDuration {
  type: typeof INCREMENT_LAYER_TWEEN_DURATION;
  payload: IncrementLayerTweenDurationPayload;
}

export interface DecrementLayerTweenDurationPayload {
  id: string;
  factor?: number;
}

export interface DecrementLayerTweenDuration {
  type: typeof DECREMENT_LAYER_TWEEN_DURATION;
  payload: DecrementLayerTweenDurationPayload;
}

export interface SetLayerTweenDelayPayload {
  id: string;
  delay: number;
}

export interface SetLayerTweenDelay {
  type: typeof SET_LAYER_TWEEN_DELAY;
  payload: SetLayerTweenDelayPayload;
}

export interface IncrementLayerTweenDelayPayload {
  id: string;
  factor?: number;
}

export interface IncrementLayerTweenDelay {
  type: typeof INCREMENT_LAYER_TWEEN_DELAY;
  payload: IncrementLayerTweenDelayPayload;
}

export interface DecrementLayerTweenDelayPayload {
  id: string;
  factor?: number;
}

export interface DecrementLayerTweenDelay {
  type: typeof DECREMENT_LAYER_TWEEN_DELAY;
  payload: DecrementLayerTweenDelayPayload;
}

export interface SetLayerTweenEasePayload {
  id: string;
  ease: em.TweenEaseTypes;
  custom?: string;
}

export interface SetLayerTweenEase {
  type: typeof SET_LAYER_TWEEN_EASE;
  payload: SetLayerTweenEasePayload;
}

export interface SetLayerTweenPowerPayload {
  id: string;
  power: em.TweenEasePowerTypes;
}

export interface SetLayerTweenPower {
  type: typeof SET_LAYER_TWEEN_POWER;
  payload: SetLayerTweenPowerPayload;
}


export type LayerTypes = AddPage | AddArtboard | AddGroup | AddShape | RemoveLayer | RemoveLayers | SelectLayer | DeepSelectLayer | SelectLayers | DeselectLayer | DeselectLayers | DeselectAllLayers | SetLayerHover | EnableLayerHover | DisableLayerHover | AddLayerChild | InsertLayerChild | ShowLayerChildren | HideLayerChildren | InsertLayerAbove | InsertLayerBelow | IncreaseLayerScope | DecreaseLayerScope | NewLayerScope | ClearLayerScope | EscapeLayerScope | GroupLayers | UngroupLayer | UngroupLayers | CopyLayerToClipboard | CopyLayersToClipboard | PasteLayersFromClipboard | MoveLayer | MoveLayers | MoveLayerTo | MoveLayersTo | MoveLayerBy | MoveLayersBy | EnableLayerDrag | DisableLayerDrag | SetLayerName | SetActiveArtboard | AddLayerTweenEvent | RemoveLayerTweenEvent | AddLayerTween | RemoveLayerTween | SetLayerTweenDuration | IncrementLayerTweenDuration | DecrementLayerTweenDuration | SetLayerTweenDelay | IncrementLayerTweenDelay | DecrementLayerTweenDelay | SetLayerTweenEase | SetLayerTweenPower;