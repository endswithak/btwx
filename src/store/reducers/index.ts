import { combineReducers } from 'redux';
import undoable, { includeAction, excludeAction } from 'redux-undo';
import layer from './layer';
import tool from './tool';
import contextMenu from './contextMenu';
import tweenDrawer from './tweenDrawer';
import easeEditor from './easeEditor';

import {
  ADD_ARTBOARD,
  ADD_GROUP,
  ADD_SHAPE,
  REMOVE_LAYER,
  REMOVE_LAYERS,
  ADD_LAYER_CHILD,
  INSERT_LAYER_CHILD,
  INSERT_LAYER_ABOVE,
  INSERT_LAYER_BELOW,
  GROUP_LAYERS,
  UNGROUP_LAYER,
  UNGROUP_LAYERS,
  COPY_LAYER_TO_CLIPBOARD,
  COPY_LAYERS_TO_CLIPBOARD,
  PASTE_LAYERS_FROM_CLIPBOARD,
  MOVE_LAYER_TO,
  MOVE_LAYER_BY,
  MOVE_LAYERS_TO,
  MOVE_LAYERS_BY,
  SET_LAYER_NAME,
  ADD_LAYER_TWEEN_EVENT,
  REMOVE_LAYER_TWEEN_EVENT,
  ADD_LAYER_TWEEN,
  REMOVE_LAYER_TWEEN,
  SET_LAYER_TWEEN_EASE,
  SET_LAYER_TWEEN_POWER
} from '../actionTypes/layer';

const rootReducer = combineReducers({
  layer: undoable(layer, { filter: includeAction([
    ADD_ARTBOARD,
    ADD_GROUP,
    ADD_SHAPE,
    REMOVE_LAYER,
    REMOVE_LAYERS,
    ADD_LAYER_CHILD,
    INSERT_LAYER_CHILD,
    INSERT_LAYER_ABOVE,
    INSERT_LAYER_BELOW,
    GROUP_LAYERS,
    UNGROUP_LAYER,
    UNGROUP_LAYERS,
    COPY_LAYER_TO_CLIPBOARD,
    COPY_LAYERS_TO_CLIPBOARD,
    PASTE_LAYERS_FROM_CLIPBOARD,
    MOVE_LAYER_TO,
    MOVE_LAYER_BY,
    MOVE_LAYERS_TO,
    MOVE_LAYERS_BY,
    SET_LAYER_NAME,
    ADD_LAYER_TWEEN_EVENT,
    REMOVE_LAYER_TWEEN_EVENT,
    ADD_LAYER_TWEEN,
    REMOVE_LAYER_TWEEN,
    SET_LAYER_TWEEN_EASE,
    SET_LAYER_TWEEN_POWER
  ])}),
  tool,
  contextMenu,
  tweenDrawer,
  easeEditor
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;