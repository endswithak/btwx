/* eslint-disable @typescript-eslint/no-use-before-define */
import { v4 as uuidv4 } from 'uuid';
import capitalize from 'lodash.capitalize';
import paper from 'paper';
import tinyColor from 'tinycolor2';
import layer, { LayerState } from '../reducers/layer';
import * as layerActions from '../actions/layer';
import { addItem, removeItem, insertItem, moveItemAbove, moveItemBelow } from './general';
import { paperMain } from '../../canvas';
import {
  ARTBOARDS_PER_PROJECT, TWEEN_PROPS_MAP, DEFAULT_TWEEN_DURATION, DEFAULT_TWEEN_DELAY,
  DEFAULT_TWEEN_EASE, DEFAULT_TWEEN_POWER, DEFAULT_SCRAMBLE_TEXT_TWEEN_CHARACTERS, DEFAULT_SCRAMBLE_TEXT_TWEEN_DELIMITER,
  DEFAULT_SCRAMBLE_TEXT_TWEEN_REVEAL_DELAY, DEFAULT_SCRAMBLE_TEXT_TWEEN_SPEED, DEFAULT_SCRAMBLE_TEXT_TWEEN_RIGHT_TO_LEFT,
  DEFAULT_CUSTOM_BOUNCE_TWEEN_END_AT_START, DEFAULT_CUSTOM_BOUNCE_TWEEN_SQUASH, DEFAULT_CUSTOM_BOUNCE_TWEEN_STRENGTH,
  DEFAULT_CUSTOM_WIGGLE_TWEEN_TYPE, DEFAULT_CUSTOM_WIGGLE_TWEEN_WIGGLES, DEFAULT_STEPS_TWEEN_STEPS, DEFAULT_ROUGH_TWEEN_CLAMP,
  DEFAULT_ROUGH_TWEEN_POINTS, DEFAULT_ROUGH_TWEEN_RANDOMIZE, DEFAULT_ROUGH_TWEEN_STRENGTH, DEFAULT_ROUGH_TWEEN_TAPER,
  DEFAULT_ROUGH_TWEEN_TEMPLATE, DEFAULT_SLOW_TWEEN_LINEAR_POWER, DEFAULT_SLOW_TWEEN_LINEAR_RATIO, DEFAULT_SLOW_TWEEN_LINEAR_YOYO_MODE,
  DEFAULT_TEXT_TWEEN_DELIMITER, DEFAULT_TEXT_TWEEN_SPEED, DEFAULT_TEXT_TWEEN_DIFF, DEFAULT_TEXT_TWEEN_SCRAMBLE
} from '../../constants';

import {
  AddGroup, AddShape, SelectLayer, DeselectLayer, RemoveLayer,
  AddLayerChild, InsertLayerChild, InsertLayerAbove, InsertLayerBelow, GroupLayers, UngroupLayers, UngroupLayer,
  DeselectAllLayers, RemoveLayers, HideLayerChildren, ShowLayerChildren,
  DecreaseLayerScope, NewLayerScope, SetLayerHover, ClearLayerScope, IncreaseLayerScope, SelectLayers,
  DeselectLayers, MoveLayerTo, MoveLayerBy, MoveLayersTo, MoveLayersBy, DeepSelectLayer, EscapeLayerScope,
  MoveLayer, MoveLayers, AddArtboard, SetLayerName, SetActiveArtboard, AddLayerTween, RemoveLayerTween,
  AddLayerTweenEvent, RemoveLayerTweenEvent, SetLayerTweenDuration, SetLayerTweenDelay, SetLayerTweenEase,
  SetLayerTweenPower, SetLayerX, SetLayerY, SetLayerWidth, SetLayerHeight, SetLayerOpacity, SetLayerFillColor,
  SetLayerStrokeColor, SetLayerStrokeWidth, SetLayerShadowColor, SetLayerShadowBlur, SetLayerShadowXOffset,
  SetLayerShadowYOffset, SetLayerRotation, EnableLayerFill, DisableLayerFill, EnableLayerStroke,
  DisableLayerStroke, DisableLayerShadow, EnableLayerShadow, SetLayerStrokeCap, SetLayerStrokeJoin, ScaleLayer,
  ScaleLayers, EnableLayerHorizontalFlip, DisableLayerHorizontalFlip, EnableLayerVerticalFlip, DisableLayerVerticalFlip,
  AddText, SetLayerText, SetLayerFontSize, SetLayerFontWeight, SetLayerFontFamily, SetLayerLeading, SetLayerJustification,
  SetLayerFillType, SetLayerStrokeFillType, AddLayersMask, RemoveLayersMask, SetLayerFill,
  AlignLayersToLeft, AlignLayersToRight, AlignLayersToTop, AlignLayersToBottom, AlignLayersToCenter, AlignLayersToMiddle,
  DistributeLayersHorizontally, DistributeLayersVertically, DuplicateLayer, DuplicateLayers, RemoveDuplicatedLayers,
  BringLayerForward, SendLayerBackward, BringLayersForward, SendLayersBackward, BringLayerToFront, BringLayersToFront,
  SendLayerToBack, SendLayersToBack, AddImage, InsertLayersAbove, InsertLayersBelow, AddLayerChildren, SetLayerBlendMode,
  UniteLayers, SetRoundedRadius, SetPolygonSides, SetStarPoints, IntersectLayers, SubtractLayers, ExcludeLayers, DivideLayers,
  SetStarRadius, SetLayerStrokeDashOffset, SetLayersOpacity, SetLayersBlendMode, SetLayersX, SetLayersY, SetLayersWidth,
  SetLayersHeight, SetLayersRotation, SetLayersFillColor, SetLayersStrokeColor, SetLayersShadowColor, EnableLayersFill,
  DisableLayersFill, EnableLayersStroke, DisableLayersStroke, EnableLayersShadow, DisableLayersShadow, SetLayersFillType,
  SetLayersStrokeFillType, SetLayersStrokeWidth, SetLayersStrokeCap, SetLayersStrokeJoin, SetLayersStrokeDashOffset,
  SetLayerStrokeDashArray, SetLayersStrokeDashArray, SetLayerStrokeDashArrayWidth, SetLayersStrokeDashArrayWidth, SetLayerStrokeDashArrayGap,
  SetLayersStrokeDashArrayGap, SetLayerGradient, SetLayersGradient, SetLayerGradientType, SetLayersGradientType,
  SetLayerGradientOrigin, SetLayersGradientOrigin, SetLayerGradientDestination, SetLayersGradientDestination, SetLayerGradientStopColor,
  SetLayersGradientStopColor, SetLayerGradientStopPosition, SetLayersGradientStopPosition, AddLayerGradientStop, AddLayersGradientStop,
  RemoveLayerGradientStop, RemoveLayersGradientStop, SetLayerActiveGradientStop, SetLayersShadowBlur, SetLayersShadowXOffset,
  SetLayersShadowYOffset, SetLayersFontSize, SetLayersFontWeight, SetLayersFontFamily, SetLayersLeading, SetLayersJustification,
  SetLayerTweenTiming, SetRoundedRadii, SetPolygonsSides, SetStarsPoints, SetStarsRadius, SetLayerEdit, AddLayers, SetLineFromX,
  SetLineFromY, SetLineFrom, SetLineToX, SetLineToY, SetLineTo, SetLinesFromX, SetLinesFromY, SetLinesToX, SetLinesToY, SelectAllLayers,
  SetLayerStyle, SetLayersStyle, EnableLayersHorizontalFlip, DisableLayersHorizontalFlip, DisableLayersVerticalFlip, EnableLayersVerticalFlip,
  SetLayerScope, SetLayersScope, SetGlobalScope, SetLayerUnderlyingMask, SetLayersUnderlyingMask, SetLayerMasked, SetLayersMasked, ToggleLayerMask,
  ToggleLayersMask, ToggleLayersIgnoreUnderlyingMask, ToggleLayerIgnoreUnderlyingMask, AreaSelectLayers, SetLayersGradientOD, ResetImagesDimensions,
  ResetImageDimensions, ReplaceImage, ReplaceImages, PasteLayersFromClipboard, SetLayerOblique, SetLayersOblique, SetLayerPointX, SetLayersPointX, SetLayerPointY, SetLayersPointY, SetLayerScrambleTextTweenCharacters, SetLayerScrambleTextTweenRevealDelay, SetLayerScrambleTextTweenSpeed, SetLayerScrambleTextTweenDelimiter, SetLayerScrambleTextTweenRightToLeft, SetLayerCustomBounceTweenStrength, SetLayerCustomBounceTweenEndAtStart, SetLayerCustomBounceTweenSquash, SetLayerCustomWiggleTweenWiggles, SetLayerCustomWiggleTweenType, SetLayerStepsTweenSteps, SetLayerRoughTweenClamp, SetLayerRoughTweenPoints, SetLayerRoughTweenRandomize, SetLayerRoughTweenStrength, SetLayerRoughTweenTaper, SetLayerRoughTweenTemplate, SetLayerSlowTweenLinearRatio, SetLayerSlowTweenPower, SetLayerSlowTweenYoYoMode, SetLayerTextTweenDelimiter, SetLayerTextTweenSpeed, SetLayerTextTweenDiff, SetLayerTextTweenScramble, SetLayerLeft, SetLayerCenter, SetLayersLeft, SetLayersCenter, SetLayerRight, SetLayersRight, SetLayerTop, SetLayersTop, SetLayerMiddle, SetLayersMiddle, SetLayerBottom, SetLayersBottom, SetLayerLetterSpacing, SetLayersLetterSpacing
} from '../actionTypes/layer';

import {
  getLayerIndex, getLayer, isScopeLayer, isScopeGroupLayer, getNearestScopeAncestor, getPaperLayer,
  getClipboardCenter, getLayerAndDescendants, getLayerDescendants, getDestinationEquivalent, getEquivalentTweenProps,
  getDeepSelectItem, getLayersBounds, getLayersRelativeBounds, getGradientOriginPoint, getGradientDestinationPoint, getGradientStops,
  orderLayersByDepth, orderLayersByLeft, orderLayersByTop, getEquivalentTweenProp,
  getPaperProp, getArtboardsTopTop, getLineFromPoint, getLineToPoint, getLineVector, getParentPaperLayer,
  getLayerYoungerSiblings, getMaskableSiblings, getSiblingLayersWithUnderlyingMask, getItemLayers,
  getAbsolutePosition, getGradientDestination, getGradientOrigin, getLayerOlderSibling, getLayerYoungestChild,
  getLayerYoungerSibling, getCanvasBounds, getLayerBounds, hasFillTween, getSelectedBounds, getLayerProjectIndices,
  savePaperJSON, orderLayersByCenter, orderLayersByRight, orderLayersByMiddle, orderLayersByBottom, getLayerRelativeBounds
} from '../selectors/layer';

export const addArtboard = (state: LayerState, action: AddArtboard): LayerState => {
  let currentState = state;
  const groupParents = ['root'];
  currentState = {
    ...currentState,
    allIds: addItem(currentState.allIds, action.payload.layer.id),
    allArtboardIds: addItem(currentState.allArtboardIds, action.payload.layer.id),
    byId: {
      ...currentState.byId,
      [action.payload.layer.id]: action.payload.layer as Btwx.Artboard,
      [action.payload.layer.parent]: {
        ...currentState.byId[action.payload.layer.parent],
        children: addItem((currentState.byId[action.payload.layer.parent] as Btwx.Root).children, action.payload.layer.id),
      } as Btwx.Root
    }
  }
  if (groupParents.length > 0) {
    currentState = groupParents.reduce((result, current) => {
      const groupItem = result.byId[current];
      const layersBounds = getLayersRelativeBounds(result, groupItem.children);
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            frame: {
              ...result.byId[current].frame,
              x: layersBounds.center.x,
              y: layersBounds.center.y,
              width: layersBounds.width,
              height: layersBounds.height,
              innerWidth: layersBounds.width,
              innerHeight: layersBounds.height
            }
          }
        }
      }
      return result;
    }, currentState);
  }
  if (!action.payload.batch) {
    currentState = selectLayers(currentState, layerActions.selectLayers({layers: [action.payload.layer.id], newSelection: true}) as SelectLayers);
    currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
      edit: {
        actionType: action.type,
        payload: action.payload,
        detail: 'Add Artboard',
        projects: [action.payload.layer.id],
        treeEdit: true
      }
    }) as SetLayerEdit);
  }
  return currentState;
};

export const addShape = (state: LayerState, action: AddShape): LayerState => {
  let currentState = state;
  const parentItem = state.byId[action.payload.layer.parent];
  const groupParents = action.payload.layer.scope.filter((id, index) => index !== 0 && index !== 1);
  // add shape
  currentState = {
    ...currentState,
    allIds: addItem(currentState.allIds, action.payload.layer.id),
    byId: {
      ...currentState.byId,
      [action.payload.layer.id]: action.payload.layer as Btwx.Shape,
      [action.payload.layer.parent]: {
        ...currentState.byId[action.payload.layer.parent],
        children: addItem((currentState.byId[action.payload.layer.parent] as Btwx.Group).children, action.payload.layer.id),
      } as Btwx.Group
    },
    allShapeIds: addItem(state.allShapeIds, action.payload.layer.id)
  }
  currentState = setShapeIcon(currentState, action.payload.layer.id, action.payload.layer.pathData);
  currentState = updateLayerTweensByProps(currentState, action.payload.layer.id, 'all');
  if (groupParents.length > 0) {
    currentState = groupParents.reduce((result, current) => {
      const groupItem = result.byId[current];
      const layersBounds = getLayersRelativeBounds(result, groupItem.children);
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            frame: {
              ...result.byId[current].frame,
              x: layersBounds.center.x,
              y: layersBounds.center.y,
              width: layersBounds.width,
              height: layersBounds.height,
              innerWidth: layersBounds.width,
              innerHeight: layersBounds.height
            }
          }
        }
      }
      return result;
    }, currentState);
  }
  if (!action.payload.batch) {
    if (!(parentItem as Btwx.Group | Btwx.Artboard).showChildren) {
      currentState = showLayerChildren(currentState, layerActions.showLayerChildren({id: action.payload.layer.parent}) as ShowLayerChildren);
    }
    currentState = selectLayers(currentState, layerActions.selectLayers({layers: [action.payload.layer.id], newSelection: true}) as SelectLayers);
    currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
      edit: {
        actionType: action.type,
        payload: action.payload,
        detail: 'Add Shape',
        projects: [action.payload.layer.artboard],
        treeEdit: true
      }
    }) as SetLayerEdit);
  }
  return currentState;
};

export const addGroup = (state: LayerState, action: AddGroup): LayerState => {
  let currentState = state;
  const parentItem = state.byId[action.payload.layer.parent];
  const groupParents = action.payload.layer.scope.filter((id, index) => index !== 0 && index !== 1);
  currentState = {
    ...currentState,
    allIds: addItem(currentState.allIds, action.payload.layer.id),
    byId: {
      ...currentState.byId,
      [action.payload.layer.id]: action.payload.layer as Btwx.Group,
      [action.payload.layer.parent]: {
        ...currentState.byId[action.payload.layer.parent],
        children: addItem((currentState.byId[action.payload.layer.parent] as Btwx.Group).children, action.payload.layer.id),
      } as Btwx.Group
    },
    allGroupIds: addItem(state.allGroupIds, action.payload.layer.id)
  }
  if (groupParents.length > 0) {
    currentState = groupParents.reduce((result, current) => {
      const groupItem = result.byId[current];
      const layersBounds = getLayersRelativeBounds(result, groupItem.children);
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            frame: {
              ...result.byId[current].frame,
              x: layersBounds.center.x,
              y: layersBounds.center.y,
              width: layersBounds.width,
              height: layersBounds.height,
              innerWidth: layersBounds.width,
              innerHeight: layersBounds.height
            }
          }
        }
      }
      return result;
    }, currentState);
  }
  if (!action.payload.batch) {
    if (!(parentItem as Btwx.Group | Btwx.Artboard).showChildren) {
      currentState = showLayerChildren(currentState, layerActions.showLayerChildren({id: action.payload.layer.parent}) as ShowLayerChildren);
    }
    currentState = selectLayers(currentState, layerActions.selectLayers({layers: [action.payload.layer.id], newSelection: true}) as SelectLayers);
    currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
      edit: {
        actionType: action.type,
        payload: action.payload,
        detail: 'Add Group',
        projects: [action.payload.layer.artboard],
        treeEdit: true
      }
    }) as SetLayerEdit);
  }
  return currentState;
};

export const addText = (state: LayerState, action: AddText): LayerState => {
  let currentState = state;
  const parentItem = state.byId[action.payload.layer.parent];
  const groupParents = action.payload.layer.scope.filter((id, index) => index !== 0 && index !== 1);
  currentState = {
    ...currentState,
    allIds: addItem(currentState.allIds, action.payload.layer.id),
    byId: {
      ...currentState.byId,
      [action.payload.layer.id]: action.payload.layer as Btwx.Text,
      [action.payload.layer.parent]: {
        ...currentState.byId[action.payload.layer.parent],
        children: addItem((currentState.byId[action.payload.layer.parent] as Btwx.Group).children, action.payload.layer.id),
        // showChildren: true
      } as Btwx.Group
    },
    allTextIds: addItem(state.allTextIds, action.payload.layer.id)
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.layer.id, 'all');
  if (groupParents.length > 0) {
    currentState = groupParents.reduce((result, current) => {
      const groupItem = result.byId[current];
      const layersBounds = getLayersRelativeBounds(result, groupItem.children);
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            frame: {
              ...result.byId[current].frame,
              x: layersBounds.center.x,
              y: layersBounds.center.y,
              width: layersBounds.width,
              height: layersBounds.height,
              innerWidth: layersBounds.width,
              innerHeight: layersBounds.height
            }
          }
        }
      }
      return result;
    }, currentState);
  }
  if (!action.payload.batch) {
    if (!(parentItem as Btwx.Group | Btwx.Artboard).showChildren) {
      currentState = showLayerChildren(currentState, layerActions.showLayerChildren({id: action.payload.layer.parent}) as ShowLayerChildren);
    }
    currentState = selectLayers(currentState, layerActions.selectLayers({layers: [action.payload.layer.id], newSelection: true}) as SelectLayers);
    currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
      edit: {
        actionType: action.type,
        payload: action.payload,
        detail: 'Add Text',
        projects: [action.payload.layer.artboard],
        treeEdit: true
      }
    }) as SetLayerEdit);
  }
  return currentState;
};

export const addImage = (state: LayerState, action: AddImage): LayerState => {
  let currentState = state;
  const parentItem = state.byId[action.payload.layer.parent];
  const groupParents = action.payload.layer.scope.filter((id, index) => index !== 0 && index !== 1);
  currentState = {
    ...currentState,
    allIds: addItem(currentState.allIds, action.payload.layer.id),
    byId: {
      ...currentState.byId,
      [action.payload.layer.id]: action.payload.layer as Btwx.Image,
      [action.payload.layer.parent]: {
        ...currentState.byId[action.payload.layer.parent],
        children: addItem((currentState.byId[action.payload.layer.parent] as Btwx.Group).children, action.payload.layer.id),
      } as Btwx.Group
    },
    allImageIds: addItem(state.allImageIds, action.payload.layer.id)
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.layer.id, 'all');
  if (groupParents.length > 0) {
    currentState = groupParents.reduce((result, current) => {
      const groupItem = result.byId[current];
      const layersBounds = getLayersRelativeBounds(result, groupItem.children);
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            frame: {
              ...result.byId[current].frame,
              x: layersBounds.center.x,
              y: layersBounds.center.y,
              width: layersBounds.width,
              height: layersBounds.height,
              innerWidth: layersBounds.width,
              innerHeight: layersBounds.height
            }
          }
        }
      }
      return result;
    }, currentState);
  }
  if (!action.payload.batch) {
    if (!(parentItem as Btwx.Group | Btwx.Artboard).showChildren) {
      currentState = showLayerChildren(currentState, layerActions.showLayerChildren({id: action.payload.layer.parent}) as ShowLayerChildren);
    }
    currentState = selectLayers(currentState, layerActions.selectLayers({layers: [action.payload.layer.id], newSelection: true}) as SelectLayers);
    currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
      edit: {
        actionType: action.type,
        payload: action.payload,
        detail: 'Add Image',
        projects: [action.payload.layer.artboard],
        treeEdit: true
      }
    }) as SetLayerEdit);
  }
  return currentState;
};

export const addLayers = (state: LayerState, action: AddLayers): LayerState => {
  let currentState = state;
  // const layers: string[] = [];
  // currentState = action.payload.layers.reduce((result: LayerState, current) => {
  //   layers.push(current.id);
  //   switch(current.type) {
  //     case 'Artboard':
  //       result = addArtboard(result, layerActions.addArtboard({layer: current as Btwx.Artboard, batch: true}) as AddArtboard);
  //       break;
  //     case 'Shape':
  //       result = addShape(result, layerActions.addShape({layer: current as Btwx.Shape, batch: true}) as AddShape);
  //       break;
  //     case 'Image':
  //       result = addImage(result, layerActions.addImage({layer: current as Btwx.Image, batch: true}) as AddImage);
  //       break;
  //     case 'Group':
  //       result = addGroup(result, layerActions.addGroup({layer: current as Btwx.Group, batch: true}) as AddGroup);
  //       break;
  //     case 'Text':
  //       result = addText(result, layerActions.addText({layer: current as Btwx.Text, batch: true}) as AddText);
  //       break;
  //   }
  //   return result;
  // }, currentState);
  // currentState = action.payload.layers.reduce((result: LayerState, current) => {
  //   result = {
  //     ...result,
  //     childrenById: {
  //       ...result.childrenById,
  //       [current.id]: current.children,
  //       [current.parent]: addItem(result.childrenById[current.parent], current.id)
  //     },
  //     showChildrenById: {
  //       ...result.showChildrenById,
  //       [current.id]: current.showChildren,
  //     },
  //     scopeById: {
  //       ...result.scopeById,
  //       [current.id]: current.scope
  //     },
  //     nameById: {
  //       ...result.nameById,
  //       [current.id]: current.name
  //     }
  //   }
  //   return result;
  // }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Add Layers',
      projects: action.payload.layers.reduce((result, current) => {
        const layerProject = current.artboard;
        if (!result.includes(layerProject)) {
          result = [...result, layerProject]
        }
        return result;
      }, []),
      treeEdit: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const removeLayer = (state: LayerState, action: RemoveLayer): LayerState => {
  let currentState = state;
  // const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  const layerItem = currentState.byId[action.payload.id];
  const groupParents = layerItem.type === 'Artboard' ? ['root'] : layerItem.scope.filter((id, index) => index !== 0 && index !== 1);
  const rm = (cs: LayerState, id: string): LayerState => {
    const li = cs.byId[id];
    const isMask = li.type === 'Shape' && (li as Btwx.Shape).mask;
    switch(li.type) {
      case 'Artboard': {
        cs = {
          ...cs,
          allArtboardIds: removeItem(cs.allArtboardIds, id)
        }
        break;
      }
      case 'Shape':
        cs = {
          ...cs,
          allShapeIds: removeItem(cs.allShapeIds, id)
        }
        break;
      case 'Group':
        cs = {
          ...cs,
          allGroupIds: removeItem(cs.allGroupIds, id)
        }
        break;
      case 'Text':
        cs = {
          ...cs,
          allTextIds: removeItem(cs.allTextIds, id)
        }
        break;
      case 'Image':
        cs = {
          ...cs,
          allImageIds: removeItem(cs.allImageIds, id)
        }
        break;
    }
    // check hover
    if (cs.hover === id) {
      cs = {
        ...cs,
        hover: null
      } // setLayerHover(cs, layerActions.setLayerHover({id: null}) as SetLayerHover);
    }
    // if layer is the active artboard, set active artboard to null
    if (cs.activeArtboard === id) {
      cs = setActiveArtboard(cs, layerActions.setActiveArtboard({id: cs.allArtboardIds.length > 0 ? cs.allArtboardIds[0] : null}) as SetActiveArtboard);
    }
    // if layer is a destination layer for any tween, remove that tween
    if (li.tweens.allIds) {
      cs = li.tweens.allIds.reduce((tweenResult, tweenCurrent) => {
        return removeLayerTween(tweenResult, layerActions.removeLayerTween({id: tweenCurrent}) as RemoveLayerTween);
      }, cs);
    }
    // if layer has any tween events, remove those events
    if (li.events.length > 0 && li.type !== 'Artboard') {
      cs = li.events.reduce((tweenResult, tweenCurrent) => {
        return removeLayerTweenEvent(tweenResult, layerActions.removeLayerTweenEvent({id: tweenCurrent}) as RemoveLayerTweenEvent);
      }, cs);
    }
    // if artboard, remove any tween events with artboard as origin or destination
    if (li.type === 'Artboard' && ((li as Btwx.Artboard).originArtboardForEvents.length > 0 || (li as Btwx.Artboard).destinationArtboardForEvents.length > 0)) {
      const tweenEventsWithArtboard = [...(li as Btwx.Artboard).originArtboardForEvents, ...(li as Btwx.Artboard).destinationArtboardForEvents];
      cs = tweenEventsWithArtboard.reduce((tweenResult, tweenCurrent) => {
        return removeLayerTweenEvent(tweenResult, layerActions.removeLayerTweenEvent({id: tweenCurrent}) as RemoveLayerTweenEvent);
      }, cs);
    }
    // if ignoring underlying mask
    if (li.type !== 'Artboard' && (li as Btwx.MaskableLayer).ignoreUnderlyingMask) {
      cs = toggleLayerIgnoreUnderlyingMask(cs, layerActions.toggleLayerIgnoreUnderlyingMask({id: id}) as ToggleLayerIgnoreUnderlyingMask);
    }
    // if layer mask
    if (isMask) {
      cs = toggleLayerMask(cs, layerActions.toggleLayerMask({id: id}) as ToggleLayerMask);
    }
    // if selection includes layer, remove layer from selection
    if (cs.selected.includes(id)) {
      cs = deselectLayers(cs, layerActions.deselectLayers({layers: [id]}) as DeselectLayers);
    }
    cs = {
      ...cs,
      allIds: removeItem(cs.allIds, id),
      byId: Object.keys(cs.byId).reduce((byIdResult: any, key) => {
        if (key !== id) {
          if (li.parent === key) {
            byIdResult[key] = {
              ...cs.byId[key],
              children: removeItem(cs.byId[key].children, action.payload.id)
            }
          } else {
            byIdResult[key] = cs.byId[key];
          }
        }
        return byIdResult;
      }, {})
    }
    return cs;
  }
  switch(layerItem.type) {
    case 'Artboard':
    case 'Group': {
      const layerAndDescendants = getLayerAndDescendants(currentState, action.payload.id);
      currentState = layerAndDescendants.reduce((result, current) => {
        return rm(result, current);
      }, currentState);
      break;
    }
    default: {
      currentState = rm(currentState, action.payload.id);
      break;
    }
  }
  if (layerItem.scope.includes(action.payload.id)) {
    currentState = setGlobalScope(currentState, layerActions.setGlobalScope({
      scope: layerItem.scope
    }) as SetGlobalScope);
  }
  if (groupParents.length > 0) {
    currentState = groupParents.reduce((result, current) => {
      const groupItem = result.byId[current];
      if (groupItem.children.length > 0) {
        const layersBounds = getLayersRelativeBounds(result, groupItem.children);
        result = {
          ...result,
          byId: {
            ...result.byId,
            [current]: {
              ...result.byId[current],
              frame: {
                ...result.byId[current].frame,
                x: layersBounds.center.x,
                y: layersBounds.center.y,
                width: layersBounds.width,
                height: layersBounds.height,
                innerWidth: layersBounds.width,
                innerHeight: layersBounds.height
              }
            }
          }
        }
      } else {
        result = {
          ...result,
          byId: {
            ...result.byId,
            [current]: {
              ...result.byId[current],
              frame: {
                ...result.byId[current].frame,
                x: 0,
                y: 0,
                width: 0,
                height: 0,
                innerWidth: 0,
                innerHeight: 0
              }
            }
          }
        }
      }
      return result;
    }, currentState);
  }
  return currentState;
};

export const removeLayers = (state: LayerState, action: RemoveLayers): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return removeLayer(result, layerActions.removeLayer({id: current}) as RemoveLayer);
  }, currentState);
  if (!action.payload.batch) {
    currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
      edit: {
        actionType: action.type,
        payload: action.payload,
        detail: 'Remove Layers',
        projects,
        treeEdit: true
      }
    }) as SetLayerEdit);
  }
  return currentState;
}

export const deselectLayer = (state: LayerState, action: DeselectLayer): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        selected: false
      }
    },
    selected: currentState.selected.filter((id) => id !== action.payload.id),
    selectedEdit: action.payload.selectedEdit
  }
  return currentState;
};

export const deselectLayers = (state: LayerState, action: DeselectLayers): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return deselectLayer(result, layerActions.deselectLayer({id: current}) as DeselectLayer);
  }, currentState);
  return currentState;
};

export const selectAllLayers = (state: LayerState, action: SelectAllLayers): LayerState => {
  const pageItem = state.byId['root'];
  return selectLayers(state, layerActions.selectLayers({layers: pageItem.children, newSelection: true}) as SelectLayers);
};

export const deselectAllLayers = (state: LayerState, action: DeselectAllLayers): LayerState => {
  let currentState = state;
  currentState = deselectLayers(currentState, layerActions.deselectLayers({layers: currentState.selected}) as DeselectLayers);
  currentState = clearLayerScope(currentState, layerActions.clearLayerScope() as ClearLayerScope);
  return currentState;
};

export const selectLayer = (state: LayerState, action: SelectLayer): LayerState => {
  let currentState = state;
  // const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  const layerItem = currentState.byId[action.payload.id];
  // if layer is an artboard or group and current selection includes...
  // any of its descendants, deselect those descendants
  if (layerItem.type === 'Artboard' || layerItem.type === 'Group') {
    if (state.selected.some((selectedItem) => currentState.byId[selectedItem].scope.includes(action.payload.id))) {
      const layersToDeselect = state.selected.filter((selectedItem) => currentState.byId[selectedItem].scope.includes(action.payload.id));
      currentState = deselectLayers(currentState, layerActions.deselectLayers({layers:layersToDeselect }) as DeselectLayers);
    }
  }
  // if any parents selected, deselect them
  if (currentState.selected.some((id) => layerItem.scope.includes(id))) {
    const deselectParents = currentState.selected.filter((id) => layerItem.scope.includes(id));
    currentState = deselectLayers(currentState, layerActions.deselectLayers({layers: deselectParents }) as DeselectLayers);
  }
  // if layer is an artboard, make it the active artboard
  if (layerItem.type === 'Artboard' && currentState.activeArtboard !== action.payload.id) {
    currentState = setActiveArtboard(currentState, layerActions.setActiveArtboard({id: action.payload.id}) as SetActiveArtboard);
  }
  // if layer scope root is an artboard, make the layer scope root the active artboard
  if (layerItem.type !== 'Artboard' && currentState.activeArtboard !== layerItem.scope[1]) {
    currentState = setActiveArtboard(currentState, layerActions.setActiveArtboard({id: layerItem.scope[1]}) as SetActiveArtboard);
  }
  // handle hover
  // if (layerItem.id !== currentState.hover) {
  //   currentState = setLayerHover(currentState, layerActions.setLayerHover({id: action.payload.id}) as SetLayerHover);
  // }
  // if new selection, create selection with just that layer
  if (action.payload.newSelection) {
    const deselectAll = deselectAllLayers(currentState, layerActions.deselectAllLayers() as DeselectAllLayers)
    currentState = {
      ...deselectAll,
      byId: {
        ...deselectAll.byId,
        [action.payload.id]: {
          ...deselectAll.byId[action.payload.id],
          selected: true
        }
      },
      selected: [action.payload.id]
    }
  }
  // else, add layer to current selection
  else {
    if (!currentState.selected.includes(action.payload.id)) {
      currentState = {
        ...currentState,
        byId: {
          ...currentState.byId,
          [action.payload.id]: {
            ...currentState.byId[action.payload.id],
            selected: true
          }
        },
        selected: addItem(currentState.selected, action.payload.id)
      }
    }
  }
  // update scope
  if (layerItem.scope[layerItem.scope.length - 1] !== currentState.scope[currentState.scope.length - 1]) {
    currentState = setGlobalScope(currentState, layerActions.setGlobalScope({scope: layerItem.scope}) as SetGlobalScope);
  }
  // order selected by depth
  const orderedSelected = orderLayersByDepth(currentState, currentState.selected);
  currentState = {
    ...currentState,
    selected: orderedSelected,
    selectedEdit: action.payload.selectedEdit
  }
  // return final state
  return currentState;
};

export const deepSelectLayer = (state: LayerState, action: DeepSelectLayer): LayerState => {
  let currentState = state;
  const layerItem = state.byId[action.payload.id];
  const nearestScopeAncestor = getNearestScopeAncestor(currentState, action.payload.id);
  const deepSelectItem = getDeepSelectItem(currentState, action.payload.id);
  if ((nearestScopeAncestor.type === 'Group' || nearestScopeAncestor.type === 'Artboard') && !(nearestScopeAncestor as Btwx.Group | Btwx.Artboard).showChildren) {
    currentState = showLayerChildren(currentState, layerActions.showLayerChildren({id: nearestScopeAncestor.id}) as ShowLayerChildren);
  }
  currentState = selectLayers(currentState, layerActions.selectLayers({layers: [deepSelectItem.id], newSelection: true}) as SelectLayers);
  currentState = setLayerHover(currentState, layerActions.setLayerHover({id: deepSelectItem.id}) as SetLayerHover);
  return currentState;
};

export const selectLayers = (state: LayerState, action: SelectLayers): LayerState => {
  let currentState = state;
  if (action.payload.newSelection) {
    currentState = deselectAllLayers(currentState, layerActions.deselectAllLayers() as DeselectAllLayers);
  }
  currentState = action.payload.layers.reduce((result, current) => {
    return selectLayer(result, layerActions.selectLayer({id: current}) as SelectLayer);
  }, currentState);
  return currentState;
};

export const areaSelectLayers = (state: LayerState, action: AreaSelectLayers): LayerState => {
  let currentState = state;
  const shiftModifier = action.payload.shiftModifier;
  if (shiftModifier) {
    currentState = action.payload.layers.reduce((result, current) => {
      const layerItem = result.byId[current];
      if (layerItem.selected) {
        result = deselectLayer(result, layerActions.deselectLayer({id: current}) as DeselectLayer);
      } else {
        result = selectLayer(result, layerActions.selectLayer({id: current}) as SelectLayer);
      }
      return result;
    }, currentState);
  } else {
    currentState = selectLayers(currentState, layerActions.selectLayers({layers: action.payload.layers, newSelection: true}) as SelectLayers);
  }
  return currentState;
};

export const setLayerHover = (state: LayerState, action: SetLayerHover): LayerState => {
  let currentState = state;
  const currentHover = state.hover;
  const nextHover = action.payload.id;
  if (currentHover !==  null) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [currentHover]: {
          ...currentState.byId[currentHover],
          hover: false
        }
      }
    };
  }
  if (nextHover !== null) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [nextHover]: {
          ...currentState.byId[nextHover],
          hover: true
        }
      }
    };
  }
  currentState = {
    ...currentState,
    hover: action.payload.id
  };
  return currentState;
};

export const setShapeIcon = (state: LayerState, id: string, pathData: string): LayerState => {
  let currentState = state;
  const layerIcon = new paperMain.CompoundPath({
    pathData: pathData,
    insert: false
  });
  layerIcon.fitBounds(new paperMain.Rectangle({
    point: new paperMain.Point(0,0),
    size: new paperMain.Size(24,24)
  }));
  currentState = {
    ...currentState,
    shapeIcons: {
      ...currentState.shapeIcons,
      [id]: layerIcon.pathData
    }
  };
  return currentState;
};

export const addLayerChild = (state: LayerState, action: AddLayerChild): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const childItem = currentState.byId[action.payload.child];
  const isChildMask = childItem.type === 'Shape' && (childItem as Btwx.Shape).mask;
  // const paperLayer = getParentPaperLayer(state, action.payload.id);
  // const childPaperLayer = isChildMask ? childItemLayers.paperLayer.parent : childItemLayers.paperLayer;
  const youngestChild = layerItem.children[layerItem.children.length - 1];
  const aboveId = youngestChild && youngestChild !== action.payload.child ? youngestChild : null;
  // const aboveItemLayers = aboveId ? getItemLayers(currentState, aboveId) as { layerItem: Btwx.MaskableLayer; paperLayer: paper.Item } : null;
  const aboveItem = aboveId ? currentState.byId[aboveId] as Btwx.MaskableLayer : null;
  const isAboveMask = aboveItem && aboveItem.type === 'Shape' && (aboveItem as Btwx.Shape).mask;
  // const abovePaperLayer = aboveItem ? (isAboveMask ? aboveItemLayers.paperLayer.parent : aboveItemLayers.paperLayer) : null;
  const childItemParents = childItem.scope.filter((id, index) => index !== 0 && index !== 1);
  const layerItemParents = layerItem.scope.filter((id, index) => index !== 0 && index !== 1);
  const groupParents = [...childItemParents, ...layerItemParents].reduce((result, current) => {
    if (!result.includes(current)) {
      result = [...result, current];
    }
    return result;
  }, layerItem.type === 'Group' ? [action.payload.id] : []);
  // if mask, handle previous underlying siblings
  if (isChildMask) {
    const maskSiblings = getMaskableSiblings(currentState, action.payload.child);
    if (maskSiblings.length > 0) {
      currentState = maskSiblings.reduce((result: LayerState, current) => {
        // const siblingLayerItems = getItemLayers(currentState, current) as { layerItem: Btwx.MaskableLayer; paperLayer: paper.Item };
        const siblingItem = (result.byId[current] as Btwx.MaskableLayer);
        // const isShape = siblingItem.type === 'Shape';
        // const isMask = isShape && (siblingItem as Btwx.Shape).mask;
        // const siblingPaperLayer = isMask ? siblingLayerItems.paperLayer.parent : siblingLayerItems.paperLayer;
        // siblingPaperLayer.insertAbove(childPaperLayer);
        if (siblingItem.underlyingMask === action.payload.child) {
          result = setLayerUnderlyingMask(result, layerActions.setLayerUnderlyingMask({id: current, underlyingMask: (childItem as Btwx.MaskableLayer).underlyingMask}) as SetLayerUnderlyingMask);
        }
        if (!(childItem as Btwx.MaskableLayer).masked) {
          result = setLayerMasked(result, layerActions.setLayerMasked({id: current, masked: false}) as SetLayerMasked);
        }
        return result;
      }, currentState);
    }
  }
  // move child
  // if (childItem.type !== 'Artboard') {
  //   isAboveMask ? abovePaperLayer.insertChild(0, childPaperLayer) : paperLayer.addChild(childPaperLayer);
  // }
  // handle parents / children
  if (childItem.parent !== action.payload.id) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [childItem.parent]: {
          ...currentState.byId[childItem.parent],
          children: removeItem((currentState.byId[childItem.parent] as Btwx.Group).children, action.payload.child)
        } as Btwx.Group,
        [action.payload.child]: {
          ...currentState.byId[action.payload.child],
          parent: action.payload.id
        },
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          children: addItem((currentState.byId[action.payload.id] as Btwx.Group).children, action.payload.child)
        } as Btwx.Group
      }
    };
    currentState = setLayerScope(currentState, layerActions.setLayerScope({id: action.payload.child, scope: [...layerItem.scope, action.payload.id]}) as SetLayerScope);
    if (childItem.type === 'Group') {
      currentState = updateNestedScopes(currentState, action.payload.child);
    }
  } else {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          children: addItem(removeItem((currentState.byId[action.payload.id] as Btwx.Group).children, action.payload.child), action.payload.child)
        } as Btwx.Group
      }
    };
  }
  if (childItem.type !== 'Artboard') {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.child]: {
          ...currentState.byId[action.payload.child],
          underlyingMask: aboveItem ? isAboveMask ? aboveItem.id : aboveItem.underlyingMask : null,
          masked: aboveItem ? (aboveItem.masked || isAboveMask) && !(childItem as Btwx.MaskableLayer).ignoreUnderlyingMask : false
        } as Btwx.MaskableLayer
      }
    };
    // currentState = updateLayerBounds(currentState, action.payload.child);
  }
  if (groupParents.length > 0) {
    currentState = groupParents.reduce((result, current) => {
      const groupItem = result.byId[current];
      const layersBounds = getLayersRelativeBounds(result, groupItem.children);
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            frame: {
              ...result.byId[current].frame,
              x: layersBounds.center.x,
              y: layersBounds.center.y,
              width: layersBounds.width,
              height: layersBounds.height,
              innerWidth: layersBounds.width,
              innerHeight: layersBounds.height
            }
          }
        }
      }
      return result;
    }, currentState);
  }
  return currentState;
};

export const addLayerChildren = (state: LayerState, action: AddLayerChildren): LayerState => {
  let currentState = state;
  const projects: string[] = [currentState.byId[action.payload.id].artboard];
  currentState = action.payload.children.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return addLayerChild(result, layerActions.addLayerChild({id: action.payload.id, child: current}) as AddLayerChild);
  }, currentState);
  currentState = selectLayers(currentState, layerActions.selectLayers({layers: action.payload.children, newSelection: true}) as SelectLayers);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Add Layer Children',
      projects,
      treeEdit: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const showLayerChildren = (state: LayerState, action: ShowLayerChildren): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        showChildren: true
      } as Btwx.Group
    }
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Show Layer Children',
      projects: null,
      treeEdit: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const hideLayerChildren = (state: LayerState, action: HideLayerChildren): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        showChildren: false
      } as Btwx.Group
    }
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Hide Layer Children',
      projects: null,
      treeEdit: true
    }
  }) as SetLayerEdit);
  return currentState;
};

const updateMaskStuff = (state: LayerState, layers: string[]): LayerState => {
  let underlyingMask: string = null;
  let ignoreMaskChain = false;
  return layers.reduce((result, current) => {
    const layerItem = result.byId[current];
    if (underlyingMask && layerItem.type !== 'Artboard' && (layerItem as Btwx.MaskableLayer).underlyingMask !== underlyingMask) {
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            underlyingMask: underlyingMask
          } as Btwx.MaskableLayer
        }
      }
    }
    if (layerItem.type !== 'Artboard' && (ignoreMaskChain || (layerItem as Btwx.MaskableLayer).ignoreUnderlyingMask) && (layerItem as Btwx.MaskableLayer).masked) {
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            masked: false
          } as Btwx.MaskableLayer
        }
      }
    }
    if (layerItem.type === 'Shape' && (layerItem as Btwx.Shape).mask) {
      underlyingMask = current;
    }
    if (layerItem.type !== 'Artboard' && (layerItem as Btwx.MaskableLayer).ignoreUnderlyingMask) {
      ignoreMaskChain = true;
    }
    return result;
  }, state);
}

export const insertLayerBelow = (state: LayerState, action: InsertLayerBelow): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const belowItem = currentState.byId[action.payload.below];
  const layerParent = currentState.byId[layerItem.parent] as Btwx.Group | Btwx.Artboard;
  const layerIndex = layerParent.children.indexOf(action.payload.id);
  const isLayerMask = layerItem.type === 'Shape' && (layerItem as Btwx.Shape).mask;
  const isLayerIgnoringUnderlyingMask = layerItem.type !== 'Artboard' && (layerItem as Btwx.MaskableLayer).ignoreUnderlyingMask;
  const belowParent = currentState.byId[belowItem.parent] as Btwx.Group | Btwx.Artboard;
  const belowIndex = belowParent.children.indexOf(action.payload.below);
  const isBelowMask = belowItem.type === 'Shape' && (belowItem as Btwx.Shape).mask;
  const isBelowIgnoringUnderlyingMask = belowItem.type !== 'Artboard' && (layerItem as Btwx.MaskableLayer).ignoreUnderlyingMask;
  // const paperLayer = layerItemLayers.paperLayer;
  // const belowPaperLayer = belowItemLayers.paperLayer;
  const belowItemParents = belowItem.scope.filter((id, index) => index !== 0 && index !== 1);
  const layerItemParents = layerItem.scope.filter((id, index) => index !== 0 && index !== 1);
  const groupParents = [...belowItemParents, ...layerItemParents].reduce((result, current) => {
    if (!result.includes(current)) {
      result = [...result, current];
    }
    return result;
  }, []);
  // turn off masks
  if (isLayerIgnoringUnderlyingMask) {
    currentState = toggleLayerIgnoreUnderlyingMask(currentState, layerActions.toggleLayerIgnoreUnderlyingMask({id: action.payload.id}) as ToggleLayerIgnoreUnderlyingMask);
  }
  if (isLayerMask) {
    currentState = toggleLayerMask(currentState, layerActions.toggleLayerMask({id: action.payload.id}) as ToggleLayerMask);
  }
  if (isBelowIgnoringUnderlyingMask) {
    currentState = toggleLayerIgnoreUnderlyingMask(currentState, layerActions.toggleLayerIgnoreUnderlyingMask({id: action.payload.below}) as ToggleLayerIgnoreUnderlyingMask);
  }
  if (isBelowMask) {
    currentState = toggleLayerMask(currentState, layerActions.toggleLayerMask({id: action.payload.below}) as ToggleLayerMask);
  }
  // const newLayerItem = currentState.byId[action.payload.id];
  // const newBelowItem = currentState.byId[action.payload.below];
  // move item
  if (layerItem.parent !== belowItem.parent) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          parent: belowItem.parent
        },
        [layerItem.parent]: {
          ...currentState.byId[layerItem.parent],
          children: removeItem((currentState.byId[layerItem.parent] as Btwx.Group).children, action.payload.id)
        } as Btwx.Group,
        [belowItem.parent]: {
          ...currentState.byId[belowItem.parent],
          children: insertItem((currentState.byId[belowItem.parent] as Btwx.Group).children, action.payload.id, belowIndex)
        } as Btwx.Group
      }
    };
    currentState = setLayerScope(currentState, layerActions.setLayerScope({id: action.payload.id, scope: [...belowParent.scope, belowItem.parent]}) as SetLayerScope);
    if (layerItem.type === 'Group') {
      currentState = updateNestedScopes(currentState, action.payload.id);
    }
  } else {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [layerItem.parent]: {
          ...currentState.byId[layerItem.parent],
          children: moveItemAbove(currentState.byId[layerItem.parent].children, layerIndex, belowIndex)
        } as Btwx.Group
      }
    };
  }
  // update item underlyingMask and masked
  if (layerItem.type !== 'Artboard') {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          underlyingMask: (currentState.byId[action.payload.below] as Btwx.MaskableLayer).underlyingMask,
          masked: (currentState.byId[action.payload.below] as Btwx.MaskableLayer).masked && !isLayerIgnoringUnderlyingMask // !(newLayerItem as Btwx.MaskableLayer).ignoreUnderlyingMask
        } as Btwx.MaskableLayer
      }
    };
  }
  if (isLayerIgnoringUnderlyingMask) {
    currentState = toggleLayerIgnoreUnderlyingMask(currentState, layerActions.toggleLayerIgnoreUnderlyingMask({id: action.payload.id}) as ToggleLayerIgnoreUnderlyingMask);
  }
  if (isLayerMask) {
    currentState = toggleLayerMask(currentState, layerActions.toggleLayerMask({id: action.payload.id}) as ToggleLayerMask);
  }
  if (isBelowIgnoringUnderlyingMask) {
    currentState = toggleLayerIgnoreUnderlyingMask(currentState, layerActions.toggleLayerIgnoreUnderlyingMask({id: action.payload.below}) as ToggleLayerIgnoreUnderlyingMask);
  }
  if (isBelowMask) {
    currentState = toggleLayerMask(currentState, layerActions.toggleLayerMask({id: action.payload.below}) as ToggleLayerMask);
  }
  if (groupParents.length > 0) {
    currentState = groupParents.reduce((result, current) => {
      const groupItem = result.byId[current] as Btwx.Group;
      if (groupItem.children.length > 0) {
        const layersBounds = getLayersRelativeBounds(result, groupItem.children);
        result = {
          ...result,
          byId: {
            ...result.byId,
            [current]: {
              ...result.byId[current],
              frame: {
                ...result.byId[current].frame,
                x: layersBounds.center.x,
                y: layersBounds.center.y,
                width: layersBounds.width,
                height: layersBounds.height,
                innerWidth: layersBounds.width,
                innerHeight: layersBounds.height
              }
            }
          }
        }
        return result;
      } else {
        result = {
          ...result,
          byId: {
            ...result.byId,
            [current]: {
              ...result.byId[current],
              frame: {
                ...result.byId[current].frame,
                x: result.byId[current].frame.x,
                y: result.byId[current].frame.y,
                width: 0,
                height: 0,
                innerWidth: 0,
                innerHeight: 0
              }
            }
          }
        }
        return result;
      }
    }, currentState);
  }
  return currentState;
};

export const insertLayersBelow = (state: LayerState, action: InsertLayersBelow) => {
  let currentState = state;
  // const orderedLayers = orderLayersByDepth(currentState, action.payload.layers);
  const projects: string[] = [currentState.byId[action.payload.below].artboard];
  currentState = action.payload.layers.reverse().reduce((result, current) => {
    const layerItem = result.byId[current];
    const layerProject = layerItem.artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return insertLayerBelow(result, layerActions.insertLayerBelow({id: current, below: action.payload.below}) as InsertLayerBelow);
  }, currentState);
  currentState = selectLayers(currentState, layerActions.selectLayers({layers: action.payload.layers, newSelection: true}) as SelectLayers);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Insert Layers Below',
      projects,
      treeEdit: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const insertLayerAbove = (state: LayerState, action: InsertLayerAbove): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const aboveItem = currentState.byId[action.payload.above];
  const layerParent = currentState.byId[layerItem.parent] as Btwx.Group | Btwx.Artboard;
  const layerIndex = layerParent.children.indexOf(action.payload.id);
  const isLayerMask = layerItem.type === 'Shape' && (layerItem as Btwx.Shape).mask;
  const isLayerIgnoringUnderlyingMask = layerItem.type !== 'Artboard' && (layerItem as Btwx.MaskableLayer).ignoreUnderlyingMask;
  const aboveParentItem = currentState.byId[aboveItem.parent];
  const aboveIndex = aboveParentItem.children.indexOf(action.payload.above);
  const isAboveMask = aboveItem.type === 'Shape' && (aboveItem as Btwx.Shape).mask;
  const isAboveIgnoringUnderlyingMask = aboveItem.type !== 'Artboard' && (aboveItem as Btwx.MaskableLayer).ignoreUnderlyingMask;
  // const paperLayer = layerItemLayers.paperLayer;
  // const abovePaperLayer = aboveItemLayers.paperLayer;
  const aboveItemParents = aboveItem.scope.filter((id, index) => index !== 0 && index !== 1);
  const layerItemParents = layerItem.scope.filter((id, index) => index !== 0 && index !== 1);
  const groupParents = [...aboveItemParents, ...layerItemParents].reduce((result, current) => {
    if (!result.includes(current)) {
      result = [...result, current];
    }
    return result;
  }, []);
  if (isAboveIgnoringUnderlyingMask) {
    currentState = toggleLayerIgnoreUnderlyingMask(currentState, layerActions.toggleLayerIgnoreUnderlyingMask({id: action.payload.above}) as ToggleLayerIgnoreUnderlyingMask);
  }
  if (isAboveMask) {
    currentState = toggleLayerMask(currentState, layerActions.toggleLayerMask({id: action.payload.above}) as ToggleLayerMask);
  }
  if (isLayerIgnoringUnderlyingMask) {
    currentState = toggleLayerIgnoreUnderlyingMask(currentState, layerActions.toggleLayerIgnoreUnderlyingMask({id: action.payload.id}) as ToggleLayerIgnoreUnderlyingMask);
  }
  if (isLayerMask) {
    currentState = toggleLayerMask(currentState, layerActions.toggleLayerMask({id: action.payload.id}) as ToggleLayerMask);
  }
  // const newLayerItem = currentState.byId[action.payload.id];
  // const newAboveItem = currentState.byId[action.payload.above];
  // if (layerItem.type !== 'Artboard') {
  //   paperLayer.insertAbove(abovePaperLayer);
  // }
  if (layerItem.parent !== aboveItem.parent) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          parent: aboveItem.parent
        },
        [layerItem.parent]: {
          ...currentState.byId[layerItem.parent],
          children: removeItem((currentState.byId[layerItem.parent] as Btwx.Group).children, action.payload.id)
        } as Btwx.Group,
        [aboveItem.parent]: {
          ...currentState.byId[aboveItem.parent],
          children: insertItem((currentState.byId[aboveItem.parent] as Btwx.Group).children, action.payload.id, aboveIndex + 1)
        } as Btwx.Group
      }
    };
    currentState = setLayerScope(currentState, layerActions.setLayerScope({id: action.payload.id, scope: [...aboveParentItem.scope, aboveItem.parent]}) as SetLayerScope);
    if (layerItem.type === 'Group') {
      currentState = updateNestedScopes(currentState, action.payload.id);
    }
  } else {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [layerItem.parent]: {
          ...currentState.byId[layerItem.parent],
          children: moveItemBelow(currentState.byId[layerItem.parent].children, layerIndex, aboveIndex)
        } as Btwx.Group
      }
    }
  }
  if (layerItem.type !== 'Artboard') {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          underlyingMask: (currentState.byId[action.payload.above] as Btwx.MaskableLayer).underlyingMask,
          masked: (currentState.byId[action.payload.above] as Btwx.MaskableLayer).masked && !isLayerIgnoringUnderlyingMask // !(newLayerItem as Btwx.MaskableLayer).ignoreUnderlyingMask
        } as Btwx.MaskableLayer
      }
    };
  }
  if (isAboveIgnoringUnderlyingMask) {
    currentState = toggleLayerIgnoreUnderlyingMask(currentState, layerActions.toggleLayerIgnoreUnderlyingMask({id: action.payload.above}) as ToggleLayerIgnoreUnderlyingMask);
  }
  if (isAboveMask) {
    currentState = toggleLayerMask(currentState, layerActions.toggleLayerMask({id: action.payload.above}) as ToggleLayerMask);
  }
  if (isLayerIgnoringUnderlyingMask) {
    currentState = toggleLayerIgnoreUnderlyingMask(currentState, layerActions.toggleLayerIgnoreUnderlyingMask({id: action.payload.id}) as ToggleLayerIgnoreUnderlyingMask);
  }
  if (isLayerMask) {
    currentState = toggleLayerMask(currentState, layerActions.toggleLayerMask({id: action.payload.id}) as ToggleLayerMask);
  }
  if (groupParents.length > 0) {
    currentState = groupParents.reduce((result, current) => {
      const groupItem = result.byId[current] as Btwx.Group;
      if (groupItem.children.length > 0) {
        const layersBounds = getLayersRelativeBounds(result, groupItem.children);
        result = {
          ...result,
          byId: {
            ...result.byId,
            [current]: {
              ...result.byId[current],
              frame: {
                ...result.byId[current].frame,
                x: layersBounds.center.x,
                y: layersBounds.center.y,
                width: layersBounds.width,
                height: layersBounds.height,
                innerWidth: layersBounds.width,
                innerHeight: layersBounds.height
              }
            }
          }
        }
        return result;
      } else {
        result = {
          ...result,
          byId: {
            ...result.byId,
            [current]: {
              ...result.byId[current],
              frame: {
                ...result.byId[current].frame,
                x: result.byId[current].frame.x,
                y: result.byId[current].frame.y,
                width: 0,
                height: 0,
                innerWidth: 0,
                innerHeight: 0
              }
            }
          }
        }
        return result;
      }
    }, currentState);
  }
  return currentState;
};

export const insertLayersAbove = (state: LayerState, action: InsertLayersAbove): LayerState => {
  let currentState = state;
  // const orderedLayers = orderLayersByDepth(state, action.payload.layers);
  const projects: string[] = [currentState.byId[action.payload.above].artboard];
  currentState = action.payload.layers.reverse().reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return insertLayerAbove(result, layerActions.insertLayerAbove({id: current, above: action.payload.above}) as InsertLayerAbove);
  }, currentState);
  currentState = selectLayers(currentState, layerActions.selectLayers({layers: action.payload.layers, newSelection: true}) as SelectLayers);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Insert Layers Above',
      projects,
      treeEdit: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const increaseLayerScope = (state: LayerState, action: IncreaseLayerScope): LayerState => {
  if (isScopeLayer(state, action.payload.id) && isScopeGroupLayer(state, action.payload.id)) {
    return {
      ...showLayerChildren(state, layerActions.showLayerChildren({id: action.payload.id}) as ShowLayerChildren),
      scope: addItem(state.scope, action.payload.id)
    }
  } else {
    return state;
  }
};

export const decreaseLayerScope = (state: LayerState, action: DecreaseLayerScope): LayerState => ({
  ...state,
  scope: state.scope.filter((id, index) => index !== state.scope.length - 1)
});

export const clearLayerScope = (state: LayerState, action: ClearLayerScope): LayerState => ({
  ...state,
  scope: ['root'],
  activeProjectIndex: null
});

export const newLayerScope = (state: LayerState, action: NewLayerScope): LayerState => ({
  ...state,
  scope: state.byId[action.payload.id].scope
});

export const escapeLayerScope = (state: LayerState, action: EscapeLayerScope): LayerState => {
  const nextScope = state.scope.filter((id, index) => index !== state.scope.length - 1);
  let currentState = state;
  if (state.scope.length > 1) {
    currentState = selectLayers(state, layerActions.selectLayers({layers: [state.scope[state.scope.length - 1]], newSelection: true}) as SelectLayers);
  } else {
    currentState = deselectAllLayers(state, layerActions.deselectAllLayers() as DeselectAllLayers);
  }
  return {
    ...currentState,
    scope: nextScope
  }
};

export const setLayerScope = (state: LayerState, action: SetLayerScope): LayerState => {
  let currentState = state;
  const currentLayerItem = currentState.byId[action.payload.id];
  if (currentLayerItem.type !== 'Artboard' && currentLayerItem.artboard !== action.payload.scope[1]) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          artboard: action.payload.scope[1]
        }
      }
    }
  }
  // const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  // paperLayer.data.scope = action.payload.scope;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        scope: [...action.payload.scope]
      }
    }
  }
  return currentState;
};

export const setLayersScope = (state: LayerState, action: SetLayersScope): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerScope(result, layerActions.setLayerScope({id: current, scope: action.payload.scope}) as SetLayerScope);
  }, state);
  return currentState;
};

export const setGlobalScope = (state: LayerState, action: SetGlobalScope): LayerState => {
  let currentState = state;
  const hasArtboard = action.payload.scope.length > 1 && currentState.byId[action.payload.scope[1]].type === 'Artboard';
  currentState = {
    ...currentState,
    scope: [...action.payload.scope],
    activeProjectIndex: hasArtboard ? (currentState.byId[action.payload.scope[1]] as Btwx.Artboard).projectIndex : null
  }
  return currentState;
};

export const updateNestedScopes = (state: LayerState, id: string): LayerState => {
  let currentState = state;
  const layerItem = state.byId[id];
  const groups: string[] = [id];
  let i = 0;
  const currentScope = [...layerItem.scope, id];
  while(i < groups.length) {
    const groupLayer = state.byId[groups[i]];
    if (groupLayer.children) {
      groupLayer.children.forEach((child) => {
        const childLayerItem = state.byId[child];
        if (childLayerItem.children && childLayerItem.children.length > 0) {
          groups.push(child);
          currentScope.push(child);
        }
        currentState = setLayerScope(currentState, layerActions.setLayerScope({id: child, scope: currentScope}) as SetLayerScope);
      });
    }
    i++;
  }
  return currentState;
}

export const groupLayers = (state: LayerState, action: GroupLayers): LayerState => {
  let currentState = state;
  const orderedLayersByDepth = orderLayersByDepth(currentState, action.payload.layers);
  // move group above top layer
  currentState = insertLayerBelow(currentState, layerActions.insertLayerBelow({id: action.payload.group.id, below: action.payload.layers[0]}) as InsertLayerBelow);
  // add layers to group
  const projects: string[] = [];
  currentState = orderedLayersByDepth.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    result = addLayerChild(result, layerActions.addLayerChild({id: action.payload.group.id, child: current}) as AddLayerChild);
    return result;
  }, currentState);
  // select final group
  currentState = selectLayers(currentState, layerActions.selectLayers({layers: [action.payload.group.id], newSelection: true}) as SelectLayers);
  //
  const groupBounds = getLayersRelativeBounds(currentState, action.payload.layers);
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.group.id]: {
        ...currentState.byId[action.payload.group.id],
        frame: {
          ...currentState.byId[action.payload.group.id].frame,
          x: groupBounds.center.x,
          y: groupBounds.center.y,
          innerWidth: groupBounds.width,
          innerHeight: groupBounds.height,
          width: groupBounds.width,
          height: groupBounds.height,
        }
      }
    }
  }
  // set layer edit
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Group Layers',
      projects,
      treeEdit: true
    }
  }) as SetLayerEdit);
  // return final state
  return currentState;
};

export const ungroupLayer = (state: LayerState, action: UngroupLayer): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  // const masks: string[] = [];
  if (layerItem.type === 'Group') {
    // move children out of group
    currentState = layerItem.children.reduce((result: LayerState, current: string) => {
      // const layerItem = result.byId[current];
      // if (layerItem.type === 'Shape' && (layerItem as Btwx.Shape).mask) {
      //   masks.push(current);
      //   result = toggleLayerMask(result, layerActions.toggleLayerMask({id: current}) as ToggleLayerMask);
      // }
      return insertLayerBelow(result, layerActions.insertLayerBelow({id: current, below: action.payload.id}) as InsertLayerBelow);
    }, currentState);
    //
    // if (masks.length > 0) {
    //   currentState = masks.reduce((result: LayerState, current: string) => {
    //     return toggleLayerMask(result, layerActions.toggleLayerMask({id: current}) as ToggleLayerMask);
    //   }, currentState);
    // }
    // select ungrouped children
    currentState = selectLayers(currentState, layerActions.selectLayers({layers: layerItem.children, newSelection: true}) as SelectLayers);
    // remove group
    currentState = removeLayer(currentState, layerActions.removeLayer({id: action.payload.id}) as RemoveLayer);
  } else {
    currentState = selectLayers(state, layerActions.selectLayers({layers: [action.payload.id], newSelection: true}) as SelectLayers);
  }
  return currentState;
};

export const ungroupLayers = (state: LayerState, action: UngroupLayers): LayerState => {
  let currentState = state;
  const newSelection: string[] = [];
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    // ungroup layer
    result = ungroupLayer(result, layerActions.ungroupLayer({id: current}) as UngroupLayer);
    // push ungrouped selection to newSelection
    newSelection.push(...result.selected);
    // return result
    return result;
  }, currentState);
  // select newSelection
  currentState = selectLayers(currentState, layerActions.selectLayers({layers: newSelection, newSelection: true}) as SelectLayers);
  // return final state
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Ungroup Layers',
      projects,
      treeEdit: true
    }
  }) as SetLayerEdit);
  return currentState;
};

// export const updateLayerBounds = (state: LayerState, id: string): LayerState => {
//   let currentState = state;
//   const { layerItem, paperLayer } = getItemLayers(currentState, id);
//   const artboardItems = getItemLayers(currentState, layerItem.artboard);
//   const isShape = layerItem.type === 'Shape';
//   const isLine = isShape && (layerItem as Btwx.Shape).shapeType === 'Line';
//   const hasRotation = layerItem.transform.rotation !== 0;
//   const isArtboard = layerItem.type === 'Artboard';
//   const isText = layerItem.type === 'Text';
//   const isGroup = layerItem.type === 'Group';
//   if (isShape) {
//     currentState = setShapeIcon(currentState, id, (paperLayer as paper.PathItem).pathData);
//     currentState = {
//       ...currentState,
//       byId: {
//         ...currentState.byId,
//         [id]: {
//           ...currentState.byId[id],
//           pathData: (paperLayer as paper.PathItem).pathData
//         } as Btwx.Shape
//       }
//     }
//   }
//   if (isLine) {
//     const fromPoint = (paperLayer as paper.Path).firstSegment.point.round();
//     const toPoint = (paperLayer as paper.Path).lastSegment.point.round();
//     const vector = toPoint.subtract(fromPoint).round();
//     currentState = {
//       ...currentState,
//       byId: {
//         ...currentState.byId,
//         [id]: {
//           ...currentState.byId[id],
//           frame: {
//             ...currentState.byId[id].frame,
//             innerWidth: Math.round(vector.length),
//             innerHeight: 0
//           },
//           from: {
//             x: fromPoint.x - artboardItems.paperLayer.position.x,
//             y: fromPoint.y - artboardItems.paperLayer.position.y
//           },
//           to: {
//             x: toPoint.x - artboardItems.paperLayer.position.x,
//             y: toPoint.y - artboardItems.paperLayer.position.y
//           },
//           transform: {
//             ...currentState.byId[id].transform,
//             rotation: vector.angle
//           }
//         } as Btwx.Line
//       }
//     }
//   }
//   if (isText) {
//     const ogTextContent = paperLayer.getItem({data: {id: 'textContent'}}) as paper.PointText;
//     const clone = paperLayer.clone({insert: false});
//     clone.rotation = -layerItem.transform.rotation;
//     const textContent = clone.getItem({data: {id: 'textContent'}}) as paper.PointText;
//     const textLines = clone.getItem({data: {id: 'textLines'}});
//     const textBackground = clone.getItem({data: {id: 'textBackground'}});
//     // get lines width
//     const lines = (layerItem as Btwx.Text).lines.reduce((result, current, index) => {
//       const paperLine = textLines.children[index] as paper.PointText;
//       paperLine.leading = (layerItem as Btwx.Text).textStyle.fontSize;
//       paperLine.skew(new paperMain.Point((layerItem as Btwx.Text).textStyle.oblique, 0));
//       return [...result, {...current, width: paperLine.bounds.width}];
//     }, (layerItem as Btwx.Text).lines);
//     // get point
//     const pointInArtboard = (() => {
//       switch((layerItem as Btwx.Text).textStyle.justification) {
//         case 'left':
//           return textContent.point.subtract(artboardItems.paperLayer.position);
//         case 'center':
//           return new paperMain.Point(textContent.point.x - (textContent.bounds.width / 2), textContent.point.y).subtract(artboardItems.paperLayer.position);
//         case 'right':
//           return new paperMain.Point(textContent.point.x - textContent.bounds.width, textContent.point.y).subtract(artboardItems.paperLayer.position);
//       }
//     })();
//     // get x and y
//     const positionInArtboard = textContent.position.subtract(artboardItems.paperLayer.position);
//     currentState = {
//       ...currentState,
//       byId: {
//         ...currentState.byId,
//         [id]: {
//           ...currentState.byId[id],
//           frame: {
//             ...currentState.byId[id].frame,
//             x: positionInArtboard.x,
//             y: positionInArtboard.y,
//             width: ogTextContent.bounds.width,
//             height: ogTextContent.bounds.height,
//             innerWidth: textBackground.bounds.width, // textContent.bounds.width,
//             innerHeight: textBackground.bounds.height // textContent.bounds.height
//           },
//           point: {
//             x: pointInArtboard.x,
//             y: pointInArtboard.y
//           },
//           lines: lines
//         } as Btwx.Text
//       }
//     }
//   }
//   if (hasRotation && !isLine && !isGroup && !isText) {
//     const clone = paperLayer.clone({insert: false});
//     clone.rotation = -layerItem.transform.rotation;
//     currentState = {
//       ...currentState,
//       byId: {
//         ...currentState.byId,
//         [id]: {
//           ...currentState.byId[id],
//           frame: {
//             ...currentState.byId[id].frame,
//             innerWidth: clone.bounds.width,
//             innerHeight: clone.bounds.height
//           }
//         }
//       }
//     }
//   }
//   if ((!hasRotation && !isLine && !isText) || isGroup) {
//     currentState = {
//       ...currentState,
//       byId: {
//         ...currentState.byId,
//         [id]: {
//           ...currentState.byId[id],
//           frame: {
//             ...currentState.byId[id].frame,
//             innerWidth: paperLayer.bounds.width,
//             innerHeight: paperLayer.bounds.height
//           }
//         }
//       }
//     }
//   }
//   if (isArtboard) {
//     const artboardBackground = paperLayer.getItem({data: {id: 'artboardBackground'}});
//     currentState = {
//       ...currentState,
//       byId: {
//         ...currentState.byId,
//         [id]: {
//           ...currentState.byId[id],
//           frame: {
//             ...currentState.byId[id].frame,
//             x: paperLayer.position.x,
//             y: paperLayer.position.y,
//             width: artboardBackground.bounds.width,
//             height: artboardBackground.bounds.height,
//             innerWidth: artboardBackground.bounds.width,
//             innerHeight: artboardBackground.bounds.height
//           }
//         }
//       }
//     }
//   }
//   if (!isArtboard && !isText) {
//     const positionInArtboard = paperLayer.position.subtract(artboardItems.paperLayer.position);
//     currentState = {
//       ...currentState,
//       byId: {
//         ...currentState.byId,
//         [id]: {
//           ...currentState.byId[id],
//           frame: {
//             ...currentState.byId[id].frame,
//             x: positionInArtboard.x,
//             y: positionInArtboard.y,
//             width: paperLayer.bounds.width,
//             height: paperLayer.bounds.height
//           }
//         }
//       }
//     }
//   }
//   // if (layerItem.parent !== layerItem.artboard) {
//   //   currentState = updateParentBounds(currentState, id);
//   // }
//   // if (isGroup) {
//   //   currentState = updateChildrenPositions(currentState, id);
//   // }
//   if (isArtboard) {
//     const prevBounds = layerItem.frame;
//     const newBounds = currentState.byId[id].frame;
//     if (prevBounds.width !== newBounds.width || prevBounds.height !== newBounds.height) {
//       currentState = updateChildrenPositions(currentState, id);
//     }
//   }
//   return currentState;
// };

export const updateChildrenPositions = (state: LayerState, id: string): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[id];
  const layerDescendants = getLayerDescendants(currentState, id);
  const artboardItem = currentState.byId[layerItem.artboard];
  const artboardPosition = new paperMain.Point(artboardItem.frame.x, artboardItem.frame.y);
  currentState = layerDescendants.reduce((result, current) => {
    const { layerItem, paperLayer } = getItemLayers(result, current);
    const position = paperLayer.position.subtract(artboardPosition);
    return {
      ...result,
      byId: {
        ...result.byId,
        [current]: {
          ...result.byId[current],
          frame: {
            ...result.byId[current].frame,
            x: position.x,
            y: position.y
          }
        }
      }
    }
  }, currentState);
  return currentState;
};

export const updateParentBounds = (state: LayerState, id: string, idAsParent?: boolean): LayerState => {
  let currentState = state;
  const parent = idAsParent ? id : currentState.byId[id].parent;
  const parentItem = currentState.byId[parent] as Btwx.Root | Btwx.Artboard | Btwx.Group;
  if (parentItem.type !== 'Artboard') {
    let layerBounds;
    let position;
    if (parentItem.children.length > 0) {
      layerBounds = getLayersBounds(currentState, parentItem.children);
    } else {
      layerBounds = new paperMain.Rectangle({
        from: new paperMain.Point(0,0),
        to: new paperMain.Point(0,0)
      });
    }
    if (parentItem.type === 'Group') {
      const artboardItem = currentState.byId[parentItem.artboard];
      const artboardPosition = new paperMain.Point(artboardItem.frame.x, artboardItem.frame.y);
      position = layerBounds.center.subtract(artboardPosition);
    } else {
      position = layerBounds.center;
    }
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [parent]: {
          ...currentState.byId[parent],
          frame: {
            ...currentState.byId[parent].frame,
            x: position.x,
            y: position.y,
            width: layerBounds.width,
            height: layerBounds.height,
            innerWidth: layerBounds.width,
            innerHeight: layerBounds.height,
          }
        } as Btwx.Root
      }
    }
  }
  return currentState;
};

// export const updateChildrenPositions = (state: LayerState, id: string): LayerState => {
//   let currentState = state;
//   const { layerItem, paperLayer } = getItemLayers(currentState, id);
//   const artboardItems = getItemLayers(currentState, layerItem.artboard);
//   const positionInArtboard = paperLayer.position.subtract(artboardItems.paperLayer.position);
//   currentState = {
//     ...currentState,
//     byId: {
//       ...currentState.byId,
//       [id]: {
//         ...currentState.byId[id],
//         frame: {
//           ...currentState.byId[id].frame,
//           x: positionInArtboard.x,
//           y: positionInArtboard.y
//         }
//       }
//     }
//   }
//   return currentState;
// };

export const moveLayer = (state: LayerState, action: MoveLayer): LayerState => {
  let currentState = state;
  const layerItem = state.byId[action.payload.id];
  const isLine = layerItem.type === 'Shape' && (layerItem as Btwx.Shape).shapeType === 'Line';
  // const groupParents = layerItem.scope.filter((id, index) => index !== 0 && index !== 1);
  // currentState = updateLayerBounds(currentState, action.payload.id);
  // if (groupParents.length > 0) {
  //   currentState = groupParents.reduce((result, current) => {
  //     result = updateLayerBounds(result, current);
  //     return result;
  //   }, currentState);
  // }
  if (layerItem.type === 'Group') {
    const layerDescendants = getLayerDescendants(currentState, action.payload.id);
    currentState = layerDescendants.reduce((result, current) => {
      const descendantItem = result.byId[current];
      const descendantLine = descendantItem.type === 'Shape' && (descendantItem as Btwx.Shape).shapeType === 'Line';
      // result = updateLayerBounds(result, current);
      if (descendantItem.type !== 'Group') {
        result = updateLayerTweensByProps(result, current, descendantLine ? ['x', 'y', 'fromX', 'fromY', 'toX', 'toY'] : ['x', 'y']);
      }
      return result;
    }, currentState);
  } else {
    currentState = updateLayerTweensByProps(currentState, action.payload.id, isLine ? ['x', 'y', 'fromX', 'fromY', 'toX', 'toY'] : ['x', 'y']);
  }
  return currentState;
};

export const moveLayers = (state: LayerState, action: MoveLayers): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerItem = currentState.byId[current];
    const layerProject = layerItem.artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return moveLayer(result, layerActions.moveLayer({id: current}) as MoveLayer);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Move Layers',
      projects: projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const moveLayerTo = (state: LayerState, action: MoveLayerTo): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        frame: {
          ...currentState.byId[action.payload.id].frame,
          x: action.payload.x,
          y: action.payload.y
        }
      }
    }
  }
  return currentState;
};

export const moveLayersTo = (state: LayerState, action: MoveLayersTo): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return moveLayerTo(result, layerActions.moveLayerTo({id: current, x: action.payload.x, y: action.payload.y}) as MoveLayerTo);
  }, state);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Move Layers To',
      projects: projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const moveLayerBy = (state: LayerState, action: MoveLayerBy): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const groupParents = layerItem.type === 'Artboard' ? ['root'] : layerItem.scope.filter((id, index) => index !== 0 && index !== 1);
  const ml = (cs: LayerState, id: string): LayerState => {
    const li = cs.byId[id];
    const isLine = li.type === 'Shape' && (li as Btwx.Shape).shapeType === 'Line';
    const isText = li.type === 'Text';
    if (isLine) {
      cs = {
        ...cs,
        byId: {
          ...cs.byId,
          [id]: {
            ...cs.byId[id],
            from: {
              x: (cs.byId[id] as Btwx.Line).from.x + action.payload.x,
              y: (cs.byId[id] as Btwx.Line).from.y + action.payload.y
            },
            to: {
              x: (cs.byId[id] as Btwx.Line).to.x + action.payload.x,
              y: (cs.byId[id] as Btwx.Line).to.y + action.payload.y
            }
          } as Btwx.Line
        }
      }
    }
    if (isText) {
      cs = {
        ...cs,
        byId: {
          ...cs.byId,
          [id]: {
            ...cs.byId[id],
            point: {
              x: (cs.byId[id] as Btwx.Text).point.x + action.payload.x,
              y: (cs.byId[id] as Btwx.Text).point.y + action.payload.y
            }
          } as Btwx.Text
        }
      }
    }
    cs = {
      ...cs,
      byId: {
        ...cs.byId,
        [id]: {
          ...cs.byId[id],
          frame: {
            ...cs.byId[id].frame,
            x: cs.byId[id].frame.x + action.payload.x,
            y: cs.byId[id].frame.y + action.payload.y
          }
        } as Btwx.Text
      }
    }
    if (li.type !== 'Group' && li.type !== 'Artboard') {
      if (isLine) {
        cs = updateLayerTweensByProps(cs, id, ['fromX', 'fromY', 'toX', 'toY']);
      } else if (isText) {
        cs = updateLayerTweensByProps(cs, id, ['pointX', 'pointY']);
      } else {
        cs = updateLayerTweensByProps(cs, id, ['x', 'y']);
      }
    }
    return cs;
  }
  // update layer bounds
  if (layerItem.type === 'Group') {
    const layerAndDescendants = getLayerAndDescendants(currentState, action.payload.id);
    currentState = layerAndDescendants.reduce((result, current) => {
      return ml(result, current);
    }, currentState);
  } else {
    currentState = ml(currentState, action.payload.id);
  }
  // update parent layer bounds
  if (groupParents.length > 0) {
    currentState = groupParents.reduce((result, current) => {
      const groupItem = result.byId[current];
      const layersBounds = getLayersRelativeBounds(result, groupItem.children);
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            frame: {
              ...result.byId[current].frame,
              x: layersBounds.center.x,
              y: layersBounds.center.y,
              innerWidth: layersBounds.width,
              innerHeight: layersBounds.height,
              width: layersBounds.width,
              height: layersBounds.height
            }
          }
        }
      }
      return result;
    }, currentState);
  }
  return currentState;
};

export const moveLayersBy = (state: LayerState, action: MoveLayersBy): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return moveLayerBy(result, layerActions.moveLayerBy({id: current, x: action.payload.x, y: action.payload.y}) as MoveLayerBy);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Move Layers By',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerName = (state: LayerState, action: SetLayerName): LayerState => {
  let currentState = state;
  // const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  const layerItem = currentState.byId[action.payload.id];
  // paperLayer.name = action.payload.name;
  // remove existing tweens
  if (layerItem.scope.length > 1 && state.byId[layerItem.scope[1]].type === 'Artboard' && action.payload.name !== layerItem.name) {
    // const tweensWithLayer = getTweensWithLayer(currentState, action.payload.id);
    currentState = layerItem.tweens.allIds.reduce((result: LayerState, current) => {
      result = removeLayerTween(result, layerActions.removeLayerTween({id: current}) as RemoveLayerTween);
      return result;
    }, currentState);
  }
  // update layer name
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        name: action.payload.name
      }
    }
  }
  // add new tweens
  currentState = updateLayerTweensByProps(currentState, action.payload.id, 'all');
  // set layer edit
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Rename Layer',
      projects: [layerItem.artboard]
    }
  }) as SetLayerEdit);
  // return final state
  return currentState;
};

export const setActiveArtboard = (state: LayerState, action: SetActiveArtboard): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    activeArtboard: action.payload.id
  }
  return currentState;
};

export const addLayerTweenEvent = (state: LayerState, action: AddLayerTweenEvent): LayerState => {
  const artboardChildren = getLayerDescendants(state, action.payload.artboard);
  let currentState = state;
  // if an event doesnt already exist with the same layer, event, and destination
  // add tween event
  if (!currentState.events.allIds.some((id: string) => {
    return (
      currentState.events.byId[id].layer === action.payload.layer &&
      currentState.events.byId[id].event === action.payload.event &&
      currentState.events.byId[id].destinationArtboard === action.payload.destinationArtboard
    )
  })) {
    // add animation event
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.layer]: {
          ...currentState.byId[action.payload.layer],
          events: addItem(currentState.byId[action.payload.layer].events, action.payload.id)
        }
      },
      events: {
        ...currentState.events,
        allIds: addItem(currentState.events.allIds, action.payload.id),
        byId: {
          ...currentState.events.byId,
          [action.payload.id]: action.payload as Btwx.TweenEvent
        }
      }
    }
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.artboard]: {
          ...currentState.byId[action.payload.artboard],
          originArtboardForEvents: addItem((currentState.byId[action.payload.artboard] as Btwx.Artboard).originArtboardForEvents, action.payload.id)
        } as Btwx.Artboard,
        [action.payload.destinationArtboard]: {
          ...currentState.byId[action.payload.destinationArtboard],
          destinationArtboardForEvents: addItem((currentState.byId[action.payload.destinationArtboard] as Btwx.Artboard).destinationArtboardForEvents, action.payload.id)
        } as Btwx.Artboard
      }
    }
    // add background tween
    if (hasFillTween(currentState.byId[action.payload.artboard], currentState.byId[action.payload.destinationArtboard])) {
      const equivalentTweenProps = getEquivalentTweenProps(currentState.byId[action.payload.artboard], currentState.byId[action.payload.destinationArtboard]);
      currentState = Object.keys(equivalentTweenProps).reduce((result, key: Btwx.TweenProp) => {
        if (equivalentTweenProps[key]) {
          result = addLayerTween(result, layerActions.addLayerTween({
            layer: action.payload.artboard,
            destinationLayer: action.payload.destinationArtboard,
            prop: key,
            event: action.payload.id,
            ease: DEFAULT_TWEEN_EASE,
            power: DEFAULT_TWEEN_POWER,
            duration: DEFAULT_TWEEN_DURATION,
            delay: DEFAULT_TWEEN_DELAY,
            frozen: false,
            text: {
              delimiter: DEFAULT_TEXT_TWEEN_DELIMITER,
              speed: DEFAULT_TEXT_TWEEN_SPEED,
              diff: DEFAULT_TEXT_TWEEN_DIFF,
              scramble: DEFAULT_TEXT_TWEEN_SCRAMBLE
            },
            scrambleText: {
              characters: DEFAULT_SCRAMBLE_TEXT_TWEEN_CHARACTERS,
              customCharacters: null,
              revealDelay: DEFAULT_SCRAMBLE_TEXT_TWEEN_REVEAL_DELAY,
              speed: DEFAULT_SCRAMBLE_TEXT_TWEEN_SPEED,
              delimiter: DEFAULT_SCRAMBLE_TEXT_TWEEN_DELIMITER,
              rightToLeft: DEFAULT_SCRAMBLE_TEXT_TWEEN_RIGHT_TO_LEFT
            },
            customBounce: {
              strength: DEFAULT_CUSTOM_BOUNCE_TWEEN_STRENGTH,
              endAtStart: DEFAULT_CUSTOM_BOUNCE_TWEEN_END_AT_START,
              squash: DEFAULT_CUSTOM_BOUNCE_TWEEN_SQUASH
            },
            customWiggle: {
              wiggles: DEFAULT_CUSTOM_WIGGLE_TWEEN_WIGGLES,
              type: DEFAULT_CUSTOM_WIGGLE_TWEEN_TYPE
            },
            steps: {
              steps: DEFAULT_STEPS_TWEEN_STEPS
            },
            rough: {
              clamp: DEFAULT_ROUGH_TWEEN_CLAMP,
              points: DEFAULT_ROUGH_TWEEN_POINTS,
              randomize: DEFAULT_ROUGH_TWEEN_RANDOMIZE,
              strength: DEFAULT_ROUGH_TWEEN_STRENGTH,
              taper: DEFAULT_ROUGH_TWEEN_TAPER,
              template: DEFAULT_ROUGH_TWEEN_TEMPLATE
            },
            slow: {
              linearRatio: DEFAULT_SLOW_TWEEN_LINEAR_RATIO,
              power: DEFAULT_SLOW_TWEEN_LINEAR_POWER,
              yoyoMode: DEFAULT_SLOW_TWEEN_LINEAR_YOYO_MODE
            }
          }) as AddLayerTween);
        }
        return result;
      }, currentState);
    }
    // add animation event tweens
    currentState = artboardChildren.reduce((result, current) => {
      if (state.byId[current].type !== 'Group') {
        return addTweenEventLayerTweens(result, action.payload.id, current);
      } else {
        return result;
      }
    }, currentState);
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Add Layer Event',
      projects: null
    }
  }) as SetLayerEdit);
  return currentState;
};

export const addTweenEventLayerTweens = (state: LayerState, eventId: string, layerId: string): LayerState => {
  let currentState = state;
  const tweenEvent = currentState.events.byId[eventId];
  const destinationArtboardChildren = getLayerDescendants(currentState, tweenEvent.destinationArtboard);
  const destinationEquivalent = getDestinationEquivalent(currentState, layerId, destinationArtboardChildren);
  if (destinationEquivalent) {
    const currentLayerItem = state.byId[layerId];
    const equivalentLayerItem = state.byId[destinationEquivalent.id];
    const equivalentTweenProps = getEquivalentTweenProps(currentLayerItem, equivalentLayerItem);
    currentState = Object.keys(equivalentTweenProps).reduce((result, key: Btwx.TweenProp) => {
      if (equivalentTweenProps[key]) {
        result = addLayerTween(result, layerActions.addLayerTween({
          layer: layerId,
          destinationLayer: destinationEquivalent.id,
          prop: key,
          event: eventId,
          ease: DEFAULT_TWEEN_EASE,
          power: DEFAULT_TWEEN_POWER,
          duration: DEFAULT_TWEEN_DURATION,
          delay: DEFAULT_TWEEN_DELAY,
          frozen: false,
          text: {
            delimiter: DEFAULT_TEXT_TWEEN_DELIMITER,
            speed: DEFAULT_TEXT_TWEEN_SPEED,
            diff: DEFAULT_TEXT_TWEEN_DIFF,
            scramble: DEFAULT_TEXT_TWEEN_SCRAMBLE
          },
          scrambleText: {
            characters: DEFAULT_SCRAMBLE_TEXT_TWEEN_CHARACTERS,
            customCharacters: null,
            revealDelay: DEFAULT_SCRAMBLE_TEXT_TWEEN_REVEAL_DELAY,
            speed: DEFAULT_SCRAMBLE_TEXT_TWEEN_SPEED,
            delimiter: DEFAULT_SCRAMBLE_TEXT_TWEEN_DELIMITER,
            rightToLeft: DEFAULT_SCRAMBLE_TEXT_TWEEN_RIGHT_TO_LEFT
          },
          customBounce: {
            strength: DEFAULT_CUSTOM_BOUNCE_TWEEN_STRENGTH,
            endAtStart: DEFAULT_CUSTOM_BOUNCE_TWEEN_END_AT_START,
            squash: DEFAULT_CUSTOM_BOUNCE_TWEEN_SQUASH
          },
          customWiggle: {
            wiggles: DEFAULT_CUSTOM_WIGGLE_TWEEN_WIGGLES,
            type: DEFAULT_CUSTOM_WIGGLE_TWEEN_TYPE
          },
          steps: {
            steps: DEFAULT_STEPS_TWEEN_STEPS
          },
          rough: {
            clamp: DEFAULT_ROUGH_TWEEN_CLAMP,
            points: DEFAULT_ROUGH_TWEEN_POINTS,
            randomize: DEFAULT_ROUGH_TWEEN_RANDOMIZE,
            strength: DEFAULT_ROUGH_TWEEN_STRENGTH,
            taper: DEFAULT_ROUGH_TWEEN_TAPER,
            template: DEFAULT_ROUGH_TWEEN_TEMPLATE
          },
          slow: {
            linearRatio: DEFAULT_SLOW_TWEEN_LINEAR_RATIO,
            power: DEFAULT_SLOW_TWEEN_LINEAR_POWER,
            yoyoMode: DEFAULT_SLOW_TWEEN_LINEAR_YOYO_MODE
          }
        }) as AddLayerTween);
      }
      return result;
    }, currentState);
  }
  return currentState;
};

export const removeLayerTweenEvent = (state: LayerState, action: RemoveLayerTweenEvent): LayerState => {
  let currentState = state;
  const animEvent = state.events.byId[action.payload.id];
  // remove animation event tweens
  currentState = animEvent.tweens.reduce((result, current) => {
    return removeLayerTween(result, layerActions.removeLayerTween({id: current}) as RemoveLayerTween);
  }, currentState);
  // remove animation event
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [animEvent.layer]: {
        ...currentState.byId[animEvent.layer],
        events: removeItem(currentState.byId[animEvent.layer].events, action.payload.id)
      }
    },
    events: {
      ...currentState.events,
      allIds: removeItem(currentState.events.allIds, action.payload.id),
      byId: Object.keys(currentState.events.byId).reduce((result: any, key) => {
        if (key !== action.payload.id) {
          result[key] = currentState.events.byId[key];
        }
        return result;
      }, {})
    }
  }
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [animEvent.artboard]: {
        ...currentState.byId[animEvent.artboard],
        originArtboardForEvents: removeItem((currentState.byId[animEvent.artboard] as Btwx.Artboard).originArtboardForEvents, action.payload.id)
      } as Btwx.Artboard,
      [animEvent.destinationArtboard]: {
        ...currentState.byId[animEvent.destinationArtboard],
        destinationArtboardForEvents: removeItem((currentState.byId[animEvent.destinationArtboard] as Btwx.Artboard).destinationArtboardForEvents, action.payload.id)
      } as Btwx.Artboard
    }
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Remove Layer Event',
      projects: null
    }
  }) as SetLayerEdit);
  return currentState;
};

export const addLayerTween = (state: LayerState, action: AddLayerTween): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    events: {
      ...currentState.events,
      byId: {
        ...currentState.events.byId,
        [action.payload.event]: {
          ...currentState.events.byId[action.payload.event],
          tweens: addItem(currentState.events.byId[action.payload.event].tweens, action.payload.id)
        }
      }
    },
    byId: {
      ...currentState.byId,
      [action.payload.layer]: {
        ...currentState.byId[action.payload.layer],
        tweens: {
          ...currentState.byId[action.payload.layer].tweens,
          allIds: addItem(currentState.byId[action.payload.layer].tweens.allIds, action.payload.id),
          asOrigin: addItem(currentState.byId[action.payload.layer].tweens.asOrigin, action.payload.id),
          byProp: {
            ...currentState.byId[action.payload.layer].tweens.byProp,
            [action.payload.prop]: addItem(currentState.byId[action.payload.layer].tweens.byProp[action.payload.prop], action.payload.id)
          }
        }
      },
      [action.payload.destinationLayer]: {
        ...currentState.byId[action.payload.destinationLayer],
        tweens: {
          ...currentState.byId[action.payload.destinationLayer].tweens,
          allIds: addItem(currentState.byId[action.payload.destinationLayer].tweens.allIds, action.payload.id),
          asDestination: addItem(currentState.byId[action.payload.destinationLayer].tweens.asDestination, action.payload.id),
          byProp: {
            ...currentState.byId[action.payload.destinationLayer].tweens.byProp,
            [action.payload.prop]: addItem(currentState.byId[action.payload.destinationLayer].tweens.byProp[action.payload.prop], action.payload.id)
          }
        }
      }
    },
    tweens: {
      ...currentState.tweens,
      allIds: addItem(currentState.tweens.allIds, action.payload.id),
      byId: {
        ...currentState.tweens.byId,
        [action.payload.id]: action.payload as Btwx.Tween
      }
    }
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Add Layer Tween',
      projects: null
    }
  }) as SetLayerEdit);
  return currentState;
};

export const removeLayerTween = (state: LayerState, action: RemoveLayerTween): LayerState => {
  const tween = state.tweens.byId[action.payload.id];
  let currentState = state;
  currentState = {
    ...currentState,
    events: {
      ...currentState.events,
      byId: {
        ...currentState.events.byId,
        [tween.event]: {
          ...currentState.events.byId[tween.event],
          tweens: removeItem(currentState.events.byId[tween.event].tweens, action.payload.id)
        }
      }
    },
    byId: {
      ...currentState.byId,
      [tween.layer]: {
        ...currentState.byId[tween.layer],
        tweens: {
          ...currentState.byId[tween.layer].tweens,
          allIds: removeItem(currentState.byId[tween.layer].tweens.allIds, action.payload.id),
          asOrigin: removeItem(currentState.byId[tween.layer].tweens.asOrigin, action.payload.id),
          byProp: {
            ...currentState.byId[tween.layer].tweens.byProp,
            [tween.prop]: removeItem(currentState.byId[tween.layer].tweens.byProp[tween.prop], action.payload.id)
          }
        }
      },
      [tween.destinationLayer]: {
        ...currentState.byId[tween.destinationLayer],
        tweens: {
          ...currentState.byId[tween.destinationLayer].tweens,
          allIds: removeItem(currentState.byId[tween.destinationLayer].tweens.allIds, action.payload.id),
          asDestination: removeItem(currentState.byId[tween.destinationLayer].tweens.asDestination, action.payload.id),
          byProp: {
            ...currentState.byId[tween.destinationLayer].tweens.byProp,
            [tween.prop]: removeItem(currentState.byId[tween.destinationLayer].tweens.byProp[tween.prop], action.payload.id)
          }
        }
      }
    },
    tweens: {
      ...currentState.tweens,
      allIds: removeItem(currentState.tweens.allIds, action.payload.id),
      byId: Object.keys(currentState.tweens.byId).reduce((result: any, key) => {
        if (key !== action.payload.id) {
          result[key] = currentState.tweens.byId[key];
        }
        return result;
      }, {})
    }
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Remove Layer Tween',
      projects: null
    }
  }) as SetLayerEdit);
  return currentState;
};

export const updateLayerTweensByProp = (state: LayerState, layerId: string, prop: Btwx.TweenProp): LayerState => {
  let currentState = state;
  const layerItem = state.byId[layerId];
  if (layerItem.type === 'Artboard' || (layerItem.scope.length > 1 && state.byId[layerItem.scope[1]].type === 'Artboard')) {
    const artboard = layerItem.type === 'Artboard' ? layerId : layerItem.scope[1];
    const artboardItem = state.byId[artboard] as Btwx.Artboard;
    const eventsWithArtboardAsOrigin = artboardItem.originArtboardForEvents;
    const eventsWithArtboardAsDestination = artboardItem.destinationArtboardForEvents;
    const tweensByProp = layerItem.tweens.byProp[prop];
    // filter tweens by prop
    // if new layer prop matches destination prop, remove tween
    // if new destination prop matches layer prop, remove tween
    if (tweensByProp.length > 0) {
      currentState = tweensByProp.reduce((result: LayerState, current: string) => {
        const tween = result.tweens.byId[current];
        const layerItem = result.byId[tween.layer] as Btwx.Layer;
        const destinationLayerItem = result.byId[tween.destinationLayer] as Btwx.Layer;
        const hasTween = getEquivalentTweenProp(layerItem, destinationLayerItem, prop);
        if (!hasTween) {
          result = removeLayerTween(result, layerActions.removeLayerTween({id: current}) as RemoveLayerTween);
        }
        return result;
      }, currentState);
    }
    // add tween to events with artboard as origin
    // if it doesnt already exist
    currentState = eventsWithArtboardAsOrigin.reduce((result: LayerState, current: string) => {
      const tweenEvent = result.events.byId[current];
      const destinationArtboardChildren = layerItem.type === 'Artboard' ? null : getLayerDescendants(result, tweenEvent.destinationArtboard);
      const destinationEquivalent = layerItem.type === 'Artboard' ? result.byId[tweenEvent.destinationArtboard] : getDestinationEquivalent(result, layerId, destinationArtboardChildren);
      if (destinationEquivalent) {
        const layerItem = result.byId[layerId] as Btwx.Layer;
        const equivalentLayerItem = result.byId[destinationEquivalent.id] as Btwx.Layer;
        const hasTween = getEquivalentTweenProp(layerItem, equivalentLayerItem, prop);
        const tweenExists = tweenEvent.tweens.some((id: string) => {
          const tween = result.tweens.byId[id];
          return tween.layer === layerId && tween.prop === prop;
        });
        if (hasTween && !tweenExists) {
          result = addLayerTween(result, layerActions.addLayerTween({
            layer: layerId,
            destinationLayer: destinationEquivalent.id,
            prop: prop,
            event: current,
            ease: DEFAULT_TWEEN_EASE,
            power: DEFAULT_TWEEN_POWER,
            duration: DEFAULT_TWEEN_DURATION,
            delay: DEFAULT_TWEEN_DELAY,
            frozen: false,
            text: {
              delimiter: DEFAULT_TEXT_TWEEN_DELIMITER,
              speed: DEFAULT_TEXT_TWEEN_SPEED,
              diff: DEFAULT_TEXT_TWEEN_DIFF,
              scramble: DEFAULT_TEXT_TWEEN_SCRAMBLE
            },
            scrambleText: {
              characters: DEFAULT_SCRAMBLE_TEXT_TWEEN_CHARACTERS,
              customCharacters: null,
              revealDelay: DEFAULT_SCRAMBLE_TEXT_TWEEN_REVEAL_DELAY,
              speed: DEFAULT_SCRAMBLE_TEXT_TWEEN_SPEED,
              delimiter: DEFAULT_SCRAMBLE_TEXT_TWEEN_DELIMITER,
              rightToLeft: DEFAULT_SCRAMBLE_TEXT_TWEEN_RIGHT_TO_LEFT
            },
            customBounce: {
              strength: DEFAULT_CUSTOM_BOUNCE_TWEEN_STRENGTH,
              endAtStart: DEFAULT_CUSTOM_BOUNCE_TWEEN_END_AT_START,
              squash: DEFAULT_CUSTOM_BOUNCE_TWEEN_SQUASH
            },
            customWiggle: {
              wiggles: DEFAULT_CUSTOM_WIGGLE_TWEEN_WIGGLES,
              type: DEFAULT_CUSTOM_WIGGLE_TWEEN_TYPE
            },
            steps: {
              steps: DEFAULT_STEPS_TWEEN_STEPS
            },
            rough: {
              clamp: DEFAULT_ROUGH_TWEEN_CLAMP,
              points: DEFAULT_ROUGH_TWEEN_POINTS,
              randomize: DEFAULT_ROUGH_TWEEN_RANDOMIZE,
              strength: DEFAULT_ROUGH_TWEEN_STRENGTH,
              taper: DEFAULT_ROUGH_TWEEN_TAPER,
              template: DEFAULT_ROUGH_TWEEN_TEMPLATE
            },
            slow: {
              linearRatio: DEFAULT_SLOW_TWEEN_LINEAR_RATIO,
              power: DEFAULT_SLOW_TWEEN_LINEAR_POWER,
              yoyoMode: DEFAULT_SLOW_TWEEN_LINEAR_YOYO_MODE
            }
          }) as AddLayerTween);
        }
      }
      return result;
    }, currentState);
    // add tween to events with artboard as destination
    // if it doesnt already exist
    currentState = eventsWithArtboardAsDestination.reduce((result: LayerState, current: string) => {
      const tweenEvent = result.events.byId[current];
      const originArtboardChildren = layerItem.type === 'Artboard' ? null : getLayerDescendants(result, tweenEvent.artboard);
      const originEquivalent = layerItem.type === 'Artboard' ? result.byId[tweenEvent.artboard] : getDestinationEquivalent(result, layerId, originArtboardChildren);
      if (originEquivalent) {
        const layerItem = result.byId[layerId] as Btwx.Layer;
        const equivalentLayerItem = result.byId[originEquivalent.id] as Btwx.Layer;
        const hasTween = getEquivalentTweenProp(layerItem, equivalentLayerItem, prop);
        const tweenExists = tweenEvent.tweens.some((id: string) => {
          const tween = result.tweens.byId[id];
          return tween.layer === originEquivalent.id && tween.prop === prop;
        });
        if (hasTween && !tweenExists) {
          result = addLayerTween(result, layerActions.addLayerTween({
            layer: originEquivalent.id,
            destinationLayer: layerId,
            prop: prop,
            event: current,
            ease: DEFAULT_TWEEN_EASE,
            power: DEFAULT_TWEEN_POWER,
            duration: DEFAULT_TWEEN_DURATION,
            delay: DEFAULT_TWEEN_DELAY,
            frozen: false,
            text: {
              delimiter: DEFAULT_TEXT_TWEEN_DELIMITER,
              speed: DEFAULT_TEXT_TWEEN_SPEED,
              diff: DEFAULT_TEXT_TWEEN_DIFF,
              scramble: DEFAULT_TEXT_TWEEN_SCRAMBLE
            },
            scrambleText: {
              characters: DEFAULT_SCRAMBLE_TEXT_TWEEN_CHARACTERS,
              customCharacters: null,
              revealDelay: DEFAULT_SCRAMBLE_TEXT_TWEEN_REVEAL_DELAY,
              speed: DEFAULT_SCRAMBLE_TEXT_TWEEN_SPEED,
              delimiter: DEFAULT_SCRAMBLE_TEXT_TWEEN_DELIMITER,
              rightToLeft: DEFAULT_SCRAMBLE_TEXT_TWEEN_RIGHT_TO_LEFT
            },
            customBounce: {
              strength: DEFAULT_CUSTOM_BOUNCE_TWEEN_STRENGTH,
              endAtStart: DEFAULT_CUSTOM_BOUNCE_TWEEN_END_AT_START,
              squash: DEFAULT_CUSTOM_BOUNCE_TWEEN_SQUASH
            },
            customWiggle: {
              wiggles: DEFAULT_CUSTOM_WIGGLE_TWEEN_WIGGLES,
              type: DEFAULT_CUSTOM_WIGGLE_TWEEN_TYPE
            },
            steps: {
              steps: DEFAULT_STEPS_TWEEN_STEPS
            },
            rough: {
              clamp: DEFAULT_ROUGH_TWEEN_CLAMP,
              points: DEFAULT_ROUGH_TWEEN_POINTS,
              randomize: DEFAULT_ROUGH_TWEEN_RANDOMIZE,
              strength: DEFAULT_ROUGH_TWEEN_STRENGTH,
              taper: DEFAULT_ROUGH_TWEEN_TAPER,
              template: DEFAULT_ROUGH_TWEEN_TEMPLATE
            },
            slow: {
              linearRatio: DEFAULT_SLOW_TWEEN_LINEAR_RATIO,
              power: DEFAULT_SLOW_TWEEN_LINEAR_POWER,
              yoyoMode: DEFAULT_SLOW_TWEEN_LINEAR_YOYO_MODE
            }
          }) as AddLayerTween);
        }
      }
      return result;
    }, currentState);
  }
  return currentState;
};

export const updateLayerTweensByProps = (state: LayerState, layerId: string, props: Btwx.TweenProp[] | 'all'): LayerState => {
  let currentState = state;
  if (props === 'all') {
    currentState = Object.keys(TWEEN_PROPS_MAP).reduce((result: LayerState, current: Btwx.TweenProp) => {
      result = updateLayerTweensByProp(result, layerId, current);
      return result;
    }, currentState);
  } else {
    currentState = (props as Btwx.TweenProp[]).reduce((result: LayerState, current: Btwx.TweenProp) => {
      result = updateLayerTweensByProp(result, layerId, current);
      return result;
    }, currentState);
  }
  return currentState;
}

export const setLayerTweenDuration = (state: LayerState, action: SetLayerTweenDuration): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    tweens: {
      ...currentState.tweens,
      byId: {
        ...currentState.tweens.byId,
        [action.payload.id]: {
          ...currentState.tweens.byId[action.payload.id],
          duration: Math.round((action.payload.duration + Number.EPSILON) * 100) / 100
        }
      }
    }
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layer Tween Duration',
      projects: null
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerTweenDelay = (state: LayerState, action: SetLayerTweenDelay): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    tweens: {
      ...currentState.tweens,
      byId: {
        ...currentState.tweens.byId,
        [action.payload.id]: {
          ...currentState.tweens.byId[action.payload.id],
          delay: Math.round((action.payload.delay + Number.EPSILON) * 100) / 100
        }
      }
    }
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layer Tween Delay',
      projects: null
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerTweenTiming = (state: LayerState, action: SetLayerTweenTiming): LayerState => {
  let currentState = state;
  currentState = setLayerTweenDuration(currentState, layerActions.setLayerTweenDuration({id: action.payload.id, duration: action.payload.duration}) as SetLayerTweenDuration);
  currentState = setLayerTweenDelay(currentState, layerActions.setLayerTweenDelay({id: action.payload.id, delay: action.payload.delay}) as SetLayerTweenDelay);
  return currentState;
};

export const setLayerTweenEase = (state: LayerState, action: SetLayerTweenEase): LayerState => {
  let currentState = state;
  const prevEase = currentState.tweens.byId[action.payload.id].ease;
  currentState = {
    ...currentState,
    tweens: {
      ...currentState.tweens,
      byId: {
        ...currentState.tweens.byId,
        [action.payload.id]: {
          ...currentState.tweens.byId[action.payload.id],
          ease: action.payload.ease
        }
      }
    }
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layer Tween Ease',
      projects: null
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerTweenPower = (state: LayerState, action: SetLayerTweenPower): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    tweens: {
      ...currentState.tweens,
      byId: {
        ...currentState.tweens.byId,
        [action.payload.id]: {
          ...currentState.tweens.byId[action.payload.id],
          power: action.payload.power
        }
      }
    }
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layer Tween Power',
      projects: null
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerStepsTweenSteps = (state: LayerState, action: SetLayerStepsTweenSteps): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    tweens: {
      ...currentState.tweens,
      byId: {
        ...currentState.tweens.byId,
        [action.payload.id]: {
          ...currentState.tweens.byId[action.payload.id],
          steps: {
            ...currentState.tweens.byId[action.payload.id].steps,
            steps: action.payload.steps,
          }
        }
      }
    }
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layer Step Tween Steps',
      projects: null
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerRoughTweenClamp = (state: LayerState, action: SetLayerRoughTweenClamp): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    tweens: {
      ...currentState.tweens,
      byId: {
        ...currentState.tweens.byId,
        [action.payload.id]: {
          ...currentState.tweens.byId[action.payload.id],
          rough: {
            ...currentState.tweens.byId[action.payload.id].rough,
            clamp: action.payload.clamp,
          }
        }
      }
    }
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layer Rough Tween Clamp',
      projects: null
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerRoughTweenPoints = (state: LayerState, action: SetLayerRoughTweenPoints): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    tweens: {
      ...currentState.tweens,
      byId: {
        ...currentState.tweens.byId,
        [action.payload.id]: {
          ...currentState.tweens.byId[action.payload.id],
          rough: {
            ...currentState.tweens.byId[action.payload.id].rough,
            points: action.payload.points,
          }
        }
      }
    }
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layer Rough Tween Points',
      projects: null
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerRoughTweenRandomize = (state: LayerState, action: SetLayerRoughTweenRandomize): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    tweens: {
      ...currentState.tweens,
      byId: {
        ...currentState.tweens.byId,
        [action.payload.id]: {
          ...currentState.tweens.byId[action.payload.id],
          rough: {
            ...currentState.tweens.byId[action.payload.id].rough,
            randomize: action.payload.randomize,
          }
        }
      }
    }
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layer Rough Tween Randomize',
      projects: null
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerRoughTweenStrength = (state: LayerState, action: SetLayerRoughTweenStrength): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    tweens: {
      ...currentState.tweens,
      byId: {
        ...currentState.tweens.byId,
        [action.payload.id]: {
          ...currentState.tweens.byId[action.payload.id],
          rough: {
            ...currentState.tweens.byId[action.payload.id].rough,
            strength: action.payload.strength,
          }
        }
      }
    }
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layer Rough Tween Strength',
      projects: null
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerRoughTweenTaper = (state: LayerState, action: SetLayerRoughTweenTaper): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    tweens: {
      ...currentState.tweens,
      byId: {
        ...currentState.tweens.byId,
        [action.payload.id]: {
          ...currentState.tweens.byId[action.payload.id],
          rough: {
            ...currentState.tweens.byId[action.payload.id].rough,
            taper: action.payload.taper,
          }
        }
      }
    }
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layer Rough Tween Taper',
      projects: null
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerRoughTweenTemplate = (state: LayerState, action: SetLayerRoughTweenTemplate): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    tweens: {
      ...currentState.tweens,
      byId: {
        ...currentState.tweens.byId,
        [action.payload.id]: {
          ...currentState.tweens.byId[action.payload.id],
          rough: {
            ...currentState.tweens.byId[action.payload.id].rough,
            template: action.payload.template,
          }
        }
      }
    }
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layer Rough Tween Template',
      projects: null
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerSlowTweenLinearRatio = (state: LayerState, action: SetLayerSlowTweenLinearRatio): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    tweens: {
      ...currentState.tweens,
      byId: {
        ...currentState.tweens.byId,
        [action.payload.id]: {
          ...currentState.tweens.byId[action.payload.id],
          slow: {
            ...currentState.tweens.byId[action.payload.id].slow,
            linearRatio: action.payload.linearRatio,
          }
        }
      }
    }
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layer Slow Tween Linear Ratio',
      projects: null
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerSlowTweenPower = (state: LayerState, action: SetLayerSlowTweenPower): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    tweens: {
      ...currentState.tweens,
      byId: {
        ...currentState.tweens.byId,
        [action.payload.id]: {
          ...currentState.tweens.byId[action.payload.id],
          slow: {
            ...currentState.tweens.byId[action.payload.id].slow,
            power: action.payload.power,
          }
        }
      }
    }
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layer Slow Tween Power',
      projects: null
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerSlowTweenYoYoMode = (state: LayerState, action: SetLayerSlowTweenYoYoMode): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    tweens: {
      ...currentState.tweens,
      byId: {
        ...currentState.tweens.byId,
        [action.payload.id]: {
          ...currentState.tweens.byId[action.payload.id],
          slow: {
            ...currentState.tweens.byId[action.payload.id].slow,
            yoyoMode: action.payload.yoyoMode,
          }
        }
      }
    }
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layer Slow Tween YoYo Mode',
      projects: null
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerTextTweenDelimiter = (state: LayerState, action: SetLayerTextTweenDelimiter): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    tweens: {
      ...currentState.tweens,
      byId: {
        ...currentState.tweens.byId,
        [action.payload.id]: {
          ...currentState.tweens.byId[action.payload.id],
          text: {
            ...currentState.tweens.byId[action.payload.id].text,
            delimiter: action.payload.delimiter,
          }
        }
      }
    }
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layer Text Tween Delimiter',
      projects: null
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerTextTweenSpeed = (state: LayerState, action: SetLayerTextTweenSpeed): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    tweens: {
      ...currentState.tweens,
      byId: {
        ...currentState.tweens.byId,
        [action.payload.id]: {
          ...currentState.tweens.byId[action.payload.id],
          text: {
            ...currentState.tweens.byId[action.payload.id].text,
            speed: action.payload.speed,
          }
        }
      }
    }
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layer Text Tween Speed',
      projects: null
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerTextTweenDiff = (state: LayerState, action: SetLayerTextTweenDiff): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    tweens: {
      ...currentState.tweens,
      byId: {
        ...currentState.tweens.byId,
        [action.payload.id]: {
          ...currentState.tweens.byId[action.payload.id],
          text: {
            ...currentState.tweens.byId[action.payload.id].text,
            diff: action.payload.diff,
          }
        }
      }
    }
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layer Text Tween Diff',
      projects: null
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerTextTweenScramble = (state: LayerState, action: SetLayerTextTweenScramble): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    tweens: {
      ...currentState.tweens,
      byId: {
        ...currentState.tweens.byId,
        [action.payload.id]: {
          ...currentState.tweens.byId[action.payload.id],
          text: {
            ...currentState.tweens.byId[action.payload.id].text,
            scramble: action.payload.scramble,
          }
        }
      }
    }
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layer Text Tween Scramble',
      projects: null
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerScrambleTextTweenCharacters = (state: LayerState, action: SetLayerScrambleTextTweenCharacters): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    tweens: {
      ...currentState.tweens,
      byId: {
        ...currentState.tweens.byId,
        [action.payload.id]: {
          ...currentState.tweens.byId[action.payload.id],
          scrambleText: {
            ...currentState.tweens.byId[action.payload.id].scrambleText,
            characters: action.payload.characters,
            customCharacters: action.payload.customCharacters ? action.payload.customCharacters : currentState.tweens.byId[action.payload.id].scrambleText.customCharacters
          }
        }
      }
    }
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layer Text Tween Characters',
      projects: null
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerScrambleTextTweenRevealDelay = (state: LayerState, action: SetLayerScrambleTextTweenRevealDelay): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    tweens: {
      ...currentState.tweens,
      byId: {
        ...currentState.tweens.byId,
        [action.payload.id]: {
          ...currentState.tweens.byId[action.payload.id],
          scrambleText: {
            ...currentState.tweens.byId[action.payload.id].scrambleText,
            revealDelay: Math.round((action.payload.revealDelay + Number.EPSILON) * 100) / 100,
          }
        }
      }
    }
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layer Text Tween Reveal Delay',
      projects: null
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerScrambleTextTweenSpeed = (state: LayerState, action: SetLayerScrambleTextTweenSpeed): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    tweens: {
      ...currentState.tweens,
      byId: {
        ...currentState.tweens.byId,
        [action.payload.id]: {
          ...currentState.tweens.byId[action.payload.id],
          scrambleText: {
            ...currentState.tweens.byId[action.payload.id].scrambleText,
            speed: Math.round((action.payload.speed + Number.EPSILON) * 100) / 100
          }
        }
      }
    }
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layer Text Tween Speed',
      projects: null
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerScrambleTextTweenDelimiter = (state: LayerState, action: SetLayerScrambleTextTweenDelimiter): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    tweens: {
      ...currentState.tweens,
      byId: {
        ...currentState.tweens.byId,
        [action.payload.id]: {
          ...currentState.tweens.byId[action.payload.id],
          scrambleText: {
            ...currentState.tweens.byId[action.payload.id].scrambleText,
            delimiter: action.payload.delimiter
          }
        }
      }
    }
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layer Text Tween Delimiter',
      projects: null
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerScrambleTextTweenRightToLeft = (state: LayerState, action: SetLayerScrambleTextTweenRightToLeft): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    tweens: {
      ...currentState.tweens,
      byId: {
        ...currentState.tweens.byId,
        [action.payload.id]: {
          ...currentState.tweens.byId[action.payload.id],
          scrambleText: {
            ...currentState.tweens.byId[action.payload.id].scrambleText,
            rightToLeft: action.payload.rightToLeft,
          }
        }
      }
    }
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layer Text Tween Right To Left',
      projects: null
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerCustomBounceTweenStrength = (state: LayerState, action: SetLayerCustomBounceTweenStrength): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    tweens: {
      ...currentState.tweens,
      byId: {
        ...currentState.tweens.byId,
        [action.payload.id]: {
          ...currentState.tweens.byId[action.payload.id],
          customBounce: {
            ...currentState.tweens.byId[action.payload.id].customBounce,
            strength: action.payload.strength,
          }
        }
      }
    }
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layer Custom Bounce Tween Strength',
      projects: null
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerCustomBounceTweenEndAtStart = (state: LayerState, action: SetLayerCustomBounceTweenEndAtStart): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    tweens: {
      ...currentState.tweens,
      byId: {
        ...currentState.tweens.byId,
        [action.payload.id]: {
          ...currentState.tweens.byId[action.payload.id],
          customBounce: {
            ...currentState.tweens.byId[action.payload.id].customBounce,
            endAtStart: action.payload.endAtStart,
          }
        }
      }
    }
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layer Custom Bounce Tween End At Start',
      projects: null
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerCustomBounceTweenSquash = (state: LayerState, action: SetLayerCustomBounceTweenSquash): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    tweens: {
      ...currentState.tweens,
      byId: {
        ...currentState.tweens.byId,
        [action.payload.id]: {
          ...currentState.tweens.byId[action.payload.id],
          customBounce: {
            ...currentState.tweens.byId[action.payload.id].customBounce,
            squash: action.payload.squash,
          }
        }
      }
    }
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layer Custom Bounce Tween Squash',
      projects: null
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerCustomWiggleTweenWiggles = (state: LayerState, action: SetLayerCustomWiggleTweenWiggles): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    tweens: {
      ...currentState.tweens,
      byId: {
        ...currentState.tweens.byId,
        [action.payload.id]: {
          ...currentState.tweens.byId[action.payload.id],
          customWiggle: {
            ...currentState.tweens.byId[action.payload.id].customWiggle,
            wiggles: action.payload.wiggles,
          }
        }
      }
    }
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layer Custom Wiggle Tween Wiggles',
      projects: null
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerCustomWiggleTweenType = (state: LayerState, action: SetLayerCustomWiggleTweenType): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    tweens: {
      ...currentState.tweens,
      byId: {
        ...currentState.tweens.byId,
        [action.payload.id]: {
          ...currentState.tweens.byId[action.payload.id],
          customWiggle: {
            ...currentState.tweens.byId[action.payload.id].customWiggle,
            type: action.payload.type,
          }
        }
      }
    }
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layer Custom Wiggle Tween Type',
      projects: null
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerX = (state: LayerState, action: SetLayerX): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const isArtboard = layerItem.type === 'Artboard';
  const groupParents = isArtboard ? ['root'] : layerItem.scope.filter((id, index) => index !== 0 && index !== 1);
  const isLine = layerItem.type === 'Shape' && (layerItem as Btwx.Shape).shapeType === 'Line';
  const isText = layerItem.type === 'Text';
  const diff = action.payload.x - layerItem.frame.x;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        frame: {
          ...currentState.byId[action.payload.id].frame,
          x: action.payload.x
        }
      }
    }
  }
  if (isLine) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          from: {
            ...(currentState.byId[action.payload.id] as Btwx.Line).from,
            x: (currentState.byId[action.payload.id] as Btwx.Line).from.x + diff
          },
          to: {
            ...(currentState.byId[action.payload.id] as Btwx.Line).to,
            x: (currentState.byId[action.payload.id] as Btwx.Line).to.x + diff
          }
        } as Btwx.Line
      }
    }
  }
  if (isText) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          point: {
            ...(currentState.byId[action.payload.id] as Btwx.Text).point,
            x: (currentState.byId[action.payload.id] as Btwx.Text).point.x + diff
          }
        } as Btwx.Text
      }
    }
  }
  if (groupParents.length > 0) {
    currentState = groupParents.reduce((result, current) => {
      const groupItem = result.byId[current];
      const layersBounds = getLayersRelativeBounds(result, groupItem.children);
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            frame: {
              ...result.byId[current].frame,
              x: layersBounds.center.x,
              innerWidth: layersBounds.width,
              width: layersBounds.width
            }
          }
        }
      }
      return result;
    }, currentState);
  }
  if (layerItem.type === 'Group') {
    const layerAndDescendants = getLayerDescendants(currentState, action.payload.id);
    currentState = layerAndDescendants.reduce((result, current) => {
      const descendantItem = result.byId[current];
      const isLine = descendantItem.type === 'Shape' && (descendantItem as Btwx.Shape).shapeType === 'Line';
      const isText = descendantItem.type === 'Text';
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            frame: {
              ...result.byId[current].frame,
              x: result.byId[current].frame.x + diff
            }
          }
        }
      }
      if (isLine) {
        result = {
          ...result,
          byId: {
            ...result.byId,
            [current]: {
              ...result.byId[current],
              from: {
                ...(result.byId[current] as Btwx.Line).from,
                x: (result.byId[current] as Btwx.Line).from.x + diff
              },
              to: {
                ...(result.byId[current] as Btwx.Line).to,
                x: (result.byId[current] as Btwx.Line).to.x + diff
              }
            } as Btwx.Line
          }
        }
      }
      if (isText) {
        result = {
          ...result,
          byId: {
            ...result.byId,
            [current]: {
              ...result.byId[current],
              point: {
                ...(result.byId[current] as Btwx.Text).point,
                x: (result.byId[current] as Btwx.Text).point.x + diff
              }
            } as Btwx.Text
          }
        }
      }
      if (descendantItem.type !== 'Group') {
        result = updateLayerTweensByProps(result, current, isLine ? ['x', 'fromX', 'toX'] : ['x']);
      }
      return result;
    }, currentState);
  } else {
    currentState = updateLayerTweensByProps(currentState, action.payload.id, isLine ? ['x', 'fromX', 'toX'] : ['x']);
  }
  return currentState;
};

export const setLayersX = (state: LayerState, action: SetLayersX): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerItem = currentState.byId[current];
    const layerProject = layerItem.artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerX(result, layerActions.setLayerX({id: current, x: action.payload.x}) as SetLayerX);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers X',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerY = (state: LayerState, action: SetLayerY): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const isArtboard = layerItem.type === 'Artboard';
  const groupParents = isArtboard ? ['root'] : layerItem.scope.filter((id, index) => index !== 0 && index !== 1);
  const isLine = layerItem.type === 'Shape' && (layerItem as Btwx.Shape).shapeType === 'Line';
  const isText = layerItem.type === 'Text';
  const diff = action.payload.y - layerItem.frame.y;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        frame: {
          ...currentState.byId[action.payload.id].frame,
          y: action.payload.y
        }
      }
    }
  }
  if (isLine) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          from: {
            ...(currentState.byId[action.payload.id] as Btwx.Line).from,
            y: (currentState.byId[action.payload.id] as Btwx.Line).from.y + diff
          },
          to: {
            ...(currentState.byId[action.payload.id] as Btwx.Line).to,
            y: (currentState.byId[action.payload.id] as Btwx.Line).to.y + diff
          }
        } as Btwx.Line
      }
    }
  }
  if (isText) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          point: {
            ...(currentState.byId[action.payload.id] as Btwx.Text).point,
            y: (currentState.byId[action.payload.id] as Btwx.Text).point.y + diff
          }
        } as Btwx.Text
      }
    }
  }
  if (groupParents.length > 0) {
    currentState = groupParents.reduce((result, current) => {
      const groupItem = result.byId[current];
      const layersBounds = getLayersRelativeBounds(result, groupItem.children);
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            frame: {
              ...result.byId[current].frame,
              y: layersBounds.center.y,
              innerHeight: layersBounds.height,
              height: layersBounds.height
            }
          }
        }
      }
      return result;
    }, currentState);
  }
  if (layerItem.type === 'Group') {
    const layerAndDescendants = getLayerDescendants(currentState, action.payload.id);
    currentState = layerAndDescendants.reduce((result, current) => {
      const descendantItem = result.byId[current];
      const isLine = descendantItem.type === 'Shape' && (descendantItem as Btwx.Shape).shapeType === 'Line';
      const isText = descendantItem.type === 'Text';
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            frame: {
              ...result.byId[current].frame,
              y: result.byId[current].frame.y + diff
            }
          }
        }
      }
      if (isLine) {
        result = {
          ...result,
          byId: {
            ...result.byId,
            [current]: {
              ...result.byId[current],
              from: {
                ...(result.byId[current] as Btwx.Line).from,
                y: (result.byId[current] as Btwx.Line).from.y + diff
              },
              to: {
                ...(result.byId[current] as Btwx.Line).to,
                y: (result.byId[current] as Btwx.Line).to.y + diff
              }
            } as Btwx.Line
          }
        }
      }
      if (isText) {
        result = {
          ...result,
          byId: {
            ...result.byId,
            [current]: {
              ...result.byId[current],
              point: {
                ...(result.byId[current] as Btwx.Text).point,
                y: (result.byId[current] as Btwx.Text).point.y + diff
              }
            } as Btwx.Text
          }
        }
      }
      if (descendantItem.type !== 'Group') {
        result = updateLayerTweensByProps(result, current, isLine ? ['y', 'fromY', 'toY'] : ['y']);
      }
      return result;
    }, currentState);
  } else {
    currentState = updateLayerTweensByProps(currentState, action.payload.id, isLine? ['y', 'fromY', 'toY'] : ['y']);
  }
  return currentState;
};

export const setLayersY = (state: LayerState, action: SetLayersY): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerItem = currentState.byId[current];
    const layerProject = layerItem.artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerY(result, layerActions.setLayerY({id: current, y: action.payload.y}) as SetLayerY);
  }, state);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Y',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerLeft = (state: LayerState, action: SetLayerLeft): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const isArtboard = layerItem.type === 'Artboard';
  const groupParents = isArtboard ? ['root'] : layerItem.scope.filter((id, index) => index !== 0 && index !== 1);
  const isLine = layerItem.type === 'Shape' && (layerItem as Btwx.Shape).shapeType === 'Line';
  const isText = layerItem.type === 'Text';
  const x = action.payload.left + (layerItem.frame.width / 2);
  const diff = x - layerItem.frame.x;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        frame: {
          ...currentState.byId[action.payload.id].frame,
          x: x
        }
      }
    }
  }
  if (isText) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          point: {
            ...(currentState.byId[action.payload.id] as Btwx.Text).point,
            x: (currentState.byId[action.payload.id] as Btwx.Text).point.x + diff
          }
        } as Btwx.Text
      }
    }
  }
  if (isLine) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          from: {
            ...(currentState.byId[action.payload.id] as Btwx.Line).from,
            x: (currentState.byId[action.payload.id] as Btwx.Line).from.x + diff
          },
          to: {
            ...(currentState.byId[action.payload.id] as Btwx.Line).to,
            x: (currentState.byId[action.payload.id] as Btwx.Line).to.x + diff
          }
        } as Btwx.Line
      }
    }
  }
  if (groupParents.length > 0) {
    currentState = groupParents.reduce((result, current) => {
      const groupItem = result.byId[current];
      const layersBounds = getLayersRelativeBounds(result, groupItem.children);
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            frame: {
              ...result.byId[current].frame,
              x: layersBounds.center.x,
              innerWidth: layersBounds.width,
              width: layersBounds.width
            }
          }
        }
      }
      return result;
    }, currentState);
  }
  if (layerItem.type === 'Group') {
    const layerDescendants = getLayerDescendants(currentState, action.payload.id);
    currentState = layerDescendants.reduce((result, current) => {
      const descendantItem = result.byId[current];
      const isLine = descendantItem.type === 'Shape' && (descendantItem as Btwx.Shape).shapeType === 'Line';
      const isText = descendantItem.type === 'Text';
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            frame: {
              ...result.byId[current].frame,
              x: result.byId[current].frame.x + diff
            }
          }
        }
      }
      if (isText) {
        result = {
          ...result,
          byId: {
            ...result.byId,
            [current]: {
              ...result.byId[current],
              point: {
                ...(result.byId[current] as Btwx.Text).point,
                x: (result.byId[current] as Btwx.Text).point.x + diff
              }
            } as Btwx.Text
          }
        }
      }
      if (isLine) {
        result = {
          ...result,
          byId: {
            ...result.byId,
            [current]: {
              ...result.byId[current],
              from: {
                ...(result.byId[current] as Btwx.Line).from,
                x: (result.byId[current] as Btwx.Line).from.x + diff
              },
              to: {
                ...(result.byId[current] as Btwx.Line).to,
                x: (result.byId[current] as Btwx.Line).to.x + diff
              }
            } as Btwx.Line
          }
        }
      }
      if (descendantItem.type !== 'Group') {
        result = updateLayerTweensByProps(result, current, isLine ? ['x', 'fromX', 'toX'] : ['x']);
      }
      return result;
    }, currentState);
  } else {
    currentState = updateLayerTweensByProps(currentState, action.payload.id, isLine ? ['x', 'fromX', 'toX'] : ['x']);
  }
  return currentState;
};

export const setLayersLeft = (state: LayerState, action: SetLayersLeft): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerItem = currentState.byId[current];
    const layerProject = layerItem.artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerLeft(result, layerActions.setLayerLeft({id: current, left: action.payload.left}) as SetLayerLeft);
  }, state);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Left',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerCenter = (state: LayerState, action: SetLayerCenter): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const isArtboard = layerItem.type === 'Artboard';
  const groupParents = isArtboard ? ['root'] : layerItem.scope.filter((id, index) => index !== 0 && index !== 1);
  const isLine = layerItem.type === 'Shape' && (layerItem as Btwx.Shape).shapeType === 'Line';
  const diff = action.payload.center - layerItem.frame.x;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        frame: {
          ...currentState.byId[action.payload.id].frame,
          x: action.payload.center
        }
      }
    }
  }
  if (layerItem.type === 'Text') {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          point: {
            ...(currentState.byId[action.payload.id] as Btwx.Text).point,
            x: (currentState.byId[action.payload.id] as Btwx.Text).point.x + diff
          }
        } as Btwx.Text
      }
    }
  }
  if (isLine) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          from: {
            ...(currentState.byId[action.payload.id] as Btwx.Line).from,
            x: (currentState.byId[action.payload.id] as Btwx.Line).from.x + diff
          },
          to: {
            ...(currentState.byId[action.payload.id] as Btwx.Line).to,
            x: (currentState.byId[action.payload.id] as Btwx.Line).to.x + diff
          }
        } as Btwx.Line
      }
    }
  }
  if (groupParents.length > 0) {
    currentState = groupParents.reduce((result, current) => {
      const groupItem = result.byId[current];
      const layersBounds = getLayersRelativeBounds(result, groupItem.children);
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            frame: {
              ...result.byId[current].frame,
              x: layersBounds.center.x,
              innerWidth: layersBounds.width,
              width: layersBounds.width
            }
          }
        }
      }
      return result;
    }, currentState);
  }
  if (layerItem.type === 'Group') {
    const layerDescendants = getLayerDescendants(currentState, action.payload.id);
    currentState = layerDescendants.reduce((result, current) => {
      const descendantItem = result.byId[current];
      const isLine = descendantItem.type === 'Shape' && (descendantItem as Btwx.Shape).shapeType === 'Line';
      const isText = descendantItem.type === 'Text';
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            frame: {
              ...result.byId[current].frame,
              x: result.byId[current].frame.x + diff
            }
          }
        }
      }
      if (isText) {
        result = {
          ...result,
          byId: {
            ...result.byId,
            [current]: {
              ...result.byId[current],
              point: {
                ...(result.byId[current] as Btwx.Text).point,
                x: (result.byId[current] as Btwx.Text).point.x + diff
              }
            } as Btwx.Text
          }
        }
      }
      if (isLine) {
        result = {
          ...result,
          byId: {
            ...result.byId,
            [current]: {
              ...result.byId[current],
              from: {
                ...(result.byId[current] as Btwx.Line).from,
                x: (result.byId[current] as Btwx.Line).from.x + diff
              },
              to: {
                ...(result.byId[current] as Btwx.Line).to,
                x: (result.byId[current] as Btwx.Line).to.x + diff
              }
            } as Btwx.Line
          }
        }
      }
      if (descendantItem.type !== 'Group') {
        result = updateLayerTweensByProps(result, current, isLine ? ['x', 'fromX', 'toX'] : ['x']);
      }
      return result;
    }, currentState);
  } else {
    currentState = updateLayerTweensByProps(currentState, action.payload.id, isLine ? ['x', 'fromX', 'toX'] : ['x']);
  }
  return currentState;
};

export const setLayersCenter = (state: LayerState, action: SetLayersCenter): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerItem = currentState.byId[current];
    const layerProject = layerItem.artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerCenter(result, layerActions.setLayerCenter({id: current, center: action.payload.center}) as SetLayerCenter);
  }, state);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Center',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerRight = (state: LayerState, action: SetLayerRight): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const isArtboard = layerItem.type === 'Artboard';
  const groupParents = isArtboard ? ['root'] : layerItem.scope.filter((id, index) => index !== 0 && index !== 1);
  const isLine = layerItem.type === 'Shape' && (layerItem as Btwx.Shape).shapeType === 'Line';
  const x = action.payload.right - (layerItem.frame.width / 2);
  const diff = x - layerItem.frame.x;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        frame: {
          ...currentState.byId[action.payload.id].frame,
          x: x
        }
      }
    }
  }
  if (layerItem.type === 'Text') {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          point: {
            ...(currentState.byId[action.payload.id] as Btwx.Text).point,
            x: (currentState.byId[action.payload.id] as Btwx.Text).point.x + diff
          }
        } as Btwx.Text
      }
    }
  }
  if (isLine) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          from: {
            ...(currentState.byId[action.payload.id] as Btwx.Line).from,
            x: (currentState.byId[action.payload.id] as Btwx.Line).from.x + diff
          },
          to: {
            ...(currentState.byId[action.payload.id] as Btwx.Line).to,
            x: (currentState.byId[action.payload.id] as Btwx.Line).to.x + diff
          }
        } as Btwx.Line
      }
    }
  }
  if (groupParents.length > 0) {
    currentState = groupParents.reduce((result, current) => {
      const groupItem = result.byId[current];
      const layersBounds = getLayersRelativeBounds(result, groupItem.children);
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            frame: {
              ...result.byId[current].frame,
              x: layersBounds.center.x,
              innerWidth: layersBounds.width,
              width: layersBounds.width
            }
          }
        }
      }
      return result;
    }, currentState);
  }
  if (layerItem.type === 'Group') {
    const layerDescendants = getLayerDescendants(currentState, action.payload.id);
    currentState = layerDescendants.reduce((result, current) => {
      const descendantItem = result.byId[current];
      const isLine = descendantItem.type === 'Shape' && (descendantItem as Btwx.Shape).shapeType === 'Line';
      const isText = descendantItem.type === 'Text';
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            frame: {
              ...result.byId[current].frame,
              x: result.byId[current].frame.x + diff
            }
          }
        }
      }
      if (isText) {
        result = {
          ...result,
          byId: {
            ...result.byId,
            [current]: {
              ...result.byId[current],
              point: {
                ...(result.byId[current] as Btwx.Text).point,
                x: (result.byId[current] as Btwx.Text).point.x + diff
              }
            } as Btwx.Text
          }
        }
      }
      if (isLine) {
        result = {
          ...result,
          byId: {
            ...result.byId,
            [current]: {
              ...result.byId[current],
              from: {
                ...(result.byId[current] as Btwx.Line).from,
                x: (result.byId[current] as Btwx.Line).from.x + diff
              },
              to: {
                ...(result.byId[current] as Btwx.Line).to,
                x: (result.byId[current] as Btwx.Line).to.x + diff
              }
            } as Btwx.Line
          }
        }
      }
      if (descendantItem.type !== 'Group') {
        result = updateLayerTweensByProps(result, current, isLine ? ['x', 'fromX', 'toX'] : ['x']);
      }
      return result;
    }, currentState);
  } else {
    currentState = updateLayerTweensByProps(currentState, action.payload.id, isLine ? ['x', 'fromX', 'toX'] : ['x']);
  }
  return currentState;
};

export const setLayersRight = (state: LayerState, action: SetLayersRight): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerItem = currentState.byId[current];
    const layerProject = layerItem.artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerRight(result, layerActions.setLayerRight({id: current, right: action.payload.right}) as SetLayerRight);
  }, state);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Right',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerTop = (state: LayerState, action: SetLayerTop): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const isArtboard = layerItem.type === 'Artboard';
  const groupParents = isArtboard ? ['root'] : layerItem.scope.filter((id, index) => index !== 0 && index !== 1);
  const isLine = layerItem.type === 'Shape' && (layerItem as Btwx.Shape).shapeType === 'Line';
  const y = action.payload.top + (layerItem.frame.height / 2);
  const diff = y - layerItem.frame.y;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        frame: {
          ...currentState.byId[action.payload.id].frame,
          y: y
        }
      }
    }
  }
  if (layerItem.type === 'Text') {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          point: {
            ...(currentState.byId[action.payload.id] as Btwx.Text).point,
            y: (currentState.byId[action.payload.id] as Btwx.Text).point.y + diff
          }
        } as Btwx.Text
      }
    }
  }
  if (isLine) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          from: {
            ...(currentState.byId[action.payload.id] as Btwx.Line).from,
            y: (currentState.byId[action.payload.id] as Btwx.Line).from.y + diff
          },
          to: {
            ...(currentState.byId[action.payload.id] as Btwx.Line).to,
            y: (currentState.byId[action.payload.id] as Btwx.Line).to.y + diff
          }
        } as Btwx.Line
      }
    }
  }
  if (groupParents.length > 0) {
    currentState = groupParents.reduce((result, current) => {
      const groupItem = result.byId[current];
      const layersBounds = getLayersRelativeBounds(result, groupItem.children);
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            frame: {
              ...result.byId[current].frame,
              y: layersBounds.center.y,
              innerHeight: layersBounds.height,
              height: layersBounds.height
            }
          }
        }
      }
      return result;
    }, currentState);
  }
  if (layerItem.type === 'Group') {
    const layerDescendants = getLayerDescendants(currentState, action.payload.id);
    currentState = layerDescendants.reduce((result, current) => {
      const descendantItem = result.byId[current];
      const isLine = descendantItem.type === 'Shape' && (descendantItem as Btwx.Shape).shapeType === 'Line';
      const isText = descendantItem.type === 'Text';
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            frame: {
              ...result.byId[current].frame,
              y: result.byId[current].frame.y + diff
            }
          }
        }
      }
      if (isText) {
        result = {
          ...result,
          byId: {
            ...result.byId,
            [current]: {
              ...result.byId[current],
              point: {
                ...(result.byId[current] as Btwx.Text).point,
                y: (result.byId[current] as Btwx.Text).point.y + diff
              }
            } as Btwx.Text
          }
        }
      }
      if (isLine) {
        result = {
          ...result,
          byId: {
            ...result.byId,
            [current]: {
              ...result.byId[current],
              from: {
                ...(result.byId[current] as Btwx.Line).from,
                y: (result.byId[current] as Btwx.Line).from.y + diff
              },
              to: {
                ...(result.byId[current] as Btwx.Line).to,
                y: (result.byId[current] as Btwx.Line).to.y + diff
              }
            } as Btwx.Line
          }
        }
      }
      if (descendantItem.type !== 'Group') {
        result = updateLayerTweensByProps(result, current, isLine ? ['y', 'fromY', 'toY'] : ['y']);
      }
      return result;
    }, currentState);
  } else {
    currentState = updateLayerTweensByProps(currentState, action.payload.id, isLine? ['y', 'fromY', 'toY'] : ['y']);
  }
  return currentState;
};

export const setLayersTop = (state: LayerState, action: SetLayersTop): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerItem = currentState.byId[current];
    const layerProject = layerItem.artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerTop(result, layerActions.setLayerTop({id: current, top: action.payload.top}) as SetLayerTop);
  }, state);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Top',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerMiddle = (state: LayerState, action: SetLayerMiddle): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const isArtboard = layerItem.type === 'Artboard';
  const groupParents = isArtboard ? ['root'] : layerItem.scope.filter((id, index) => index !== 0 && index !== 1);
  const isLine = layerItem.type === 'Shape' && (layerItem as Btwx.Shape).shapeType === 'Line';
  const diff = action.payload.middle - layerItem.frame.y;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        frame: {
          ...currentState.byId[action.payload.id].frame,
          y: action.payload.middle
        }
      }
    }
  }
  if (layerItem.type === 'Text') {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          point: {
            ...(currentState.byId[action.payload.id] as Btwx.Text).point,
            y: (currentState.byId[action.payload.id] as Btwx.Text).point.y + diff
          }
        } as Btwx.Text
      }
    }
  }
  if (isLine) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          from: {
            ...(currentState.byId[action.payload.id] as Btwx.Line).from,
            y: (currentState.byId[action.payload.id] as Btwx.Line).from.y + diff
          },
          to: {
            ...(currentState.byId[action.payload.id] as Btwx.Line).to,
            y: (currentState.byId[action.payload.id] as Btwx.Line).to.y + diff
          }
        } as Btwx.Line
      }
    }
  }
  if (groupParents.length > 0) {
    currentState = groupParents.reduce((result, current) => {
      const groupItem = result.byId[current];
      const layersBounds = getLayersRelativeBounds(result, groupItem.children);
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            frame: {
              ...result.byId[current].frame,
              y: layersBounds.center.y,
              innerHeight: layersBounds.height,
              height: layersBounds.height
            }
          }
        }
      }
      return result;
    }, currentState);
  }
  if (layerItem.type === 'Group') {
    const layerDescendants = getLayerDescendants(currentState, action.payload.id);
    currentState = layerDescendants.reduce((result, current) => {
      const descendantItem = result.byId[current];
      const isLine = descendantItem.type === 'Shape' && (descendantItem as Btwx.Shape).shapeType === 'Line';
      const isText = descendantItem.type === 'Text';
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            frame: {
              ...result.byId[current].frame,
              y: result.byId[current].frame.y + diff
            }
          }
        }
      }
      if (isText) {
        result = {
          ...result,
          byId: {
            ...result.byId,
            [current]: {
              ...result.byId[current],
              point: {
                ...(result.byId[current] as Btwx.Text).point,
                y: (result.byId[current] as Btwx.Text).point.y + diff
              }
            } as Btwx.Text
          }
        }
      }
      if (isLine) {
        result = {
          ...result,
          byId: {
            ...result.byId,
            [current]: {
              ...result.byId[current],
              from: {
                ...(result.byId[current] as Btwx.Line).from,
                y: (result.byId[current] as Btwx.Line).from.y + diff
              },
              to: {
                ...(result.byId[current] as Btwx.Line).to,
                y: (result.byId[current] as Btwx.Line).to.y + diff
              }
            } as Btwx.Line
          }
        }
      }
      if (descendantItem.type !== 'Group') {
        result = updateLayerTweensByProps(result, current, isLine ? ['y', 'fromY', 'toY'] : ['y']);
      }
      return result;
    }, currentState);
  } else {
    currentState = updateLayerTweensByProps(currentState, action.payload.id, isLine? ['y', 'fromY', 'toY'] : ['y']);
  }
  return currentState;
};

export const setLayersMiddle = (state: LayerState, action: SetLayersMiddle): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerItem = currentState.byId[current];
    const layerProject = layerItem.artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerMiddle(result, layerActions.setLayerMiddle({id: current, middle: action.payload.middle}) as SetLayerMiddle);
  }, state);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Top',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerBottom = (state: LayerState, action: SetLayerBottom): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const isArtboard = layerItem.type === 'Artboard';
  const groupParents = isArtboard ? ['root'] : layerItem.scope.filter((id, index) => index !== 0 && index !== 1);
  const isLine = layerItem.type === 'Shape' && (layerItem as Btwx.Shape).shapeType === 'Line';
  const y = action.payload.bottom - (layerItem.frame.height / 2);
  const diff = y - layerItem.frame.y;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        frame: {
          ...currentState.byId[action.payload.id].frame,
          y: currentState.byId[action.payload.id].frame.y + diff
        }
      }
    }
  }
  if (layerItem.type === 'Text') {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          point: {
            ...(currentState.byId[action.payload.id] as Btwx.Text).point,
            y: (currentState.byId[action.payload.id] as Btwx.Text).point.y + diff
          }
        } as Btwx.Text
      }
    }
  }
  if (isLine) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          from: {
            ...(currentState.byId[action.payload.id] as Btwx.Line).from,
            y: (currentState.byId[action.payload.id] as Btwx.Line).from.y + diff
          },
          to: {
            ...(currentState.byId[action.payload.id] as Btwx.Line).to,
            y: (currentState.byId[action.payload.id] as Btwx.Line).to.y + diff
          }
        } as Btwx.Line
      }
    }
  }
  if (groupParents.length > 0) {
    currentState = groupParents.reduce((result, current) => {
      const groupItem = result.byId[current];
      const layersBounds = getLayersRelativeBounds(result, groupItem.children);
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            frame: {
              ...result.byId[current].frame,
              y: layersBounds.center.y,
              innerHeight: layersBounds.height,
              height: layersBounds.height
            }
          }
        }
      }
      return result;
    }, currentState);
  }
  if (layerItem.type === 'Group') {
    const layerDescendants = getLayerDescendants(currentState, action.payload.id);
    currentState = layerDescendants.reduce((result, current) => {
      const descendantItem = result.byId[current];
      const isLine = descendantItem.type === 'Shape' && (descendantItem as Btwx.Shape).shapeType === 'Line';
      const isText = descendantItem.type === 'Text';
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            frame: {
              ...result.byId[current].frame,
              y: result.byId[current].frame.y + diff
            }
          }
        }
      }
      if (isText) {
        result = {
          ...result,
          byId: {
            ...result.byId,
            [current]: {
              ...result.byId[current],
              point: {
                ...(result.byId[current] as Btwx.Text).point,
                y: (result.byId[current] as Btwx.Text).point.y + diff
              }
            } as Btwx.Text
          }
        }
      }
      if (isLine) {
        result = {
          ...result,
          byId: {
            ...result.byId,
            [current]: {
              ...result.byId[current],
              from: {
                ...(result.byId[current] as Btwx.Line).from,
                y: (result.byId[current] as Btwx.Line).from.y + diff
              },
              to: {
                ...(result.byId[current] as Btwx.Line).to,
                y: (result.byId[current] as Btwx.Line).to.y + diff
              }
            } as Btwx.Line
          }
        }
      }
      if (descendantItem.type !== 'Group') {
        result = updateLayerTweensByProps(result, current, isLine ? ['y', 'fromY', 'toY'] : ['y']);
      }
      return result;
    }, currentState);
  } else {
    currentState = updateLayerTweensByProps(currentState, action.payload.id, isLine? ['y', 'fromY', 'toY'] : ['y']);
  }
  return currentState;
};

export const setLayersBottom = (state: LayerState, action: SetLayersBottom): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerItem = currentState.byId[current];
    const layerProject = layerItem.artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerBottom(result, layerActions.setLayerBottom({id: current, bottom: action.payload.bottom}) as SetLayerBottom);
  }, state);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Bottom',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerWidth = (state: LayerState, action: SetLayerWidth): LayerState => {
  let currentState = state;
  // const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  const layerItem = currentState.byId[action.payload.id];
  const isArtboard = layerItem.type === 'Artboard';
  const groupParents = isArtboard ? ['root'] : layerItem.scope.filter((id, index) => index !== 0 && index !== 1);
  // const groupParents = layerItem.scope.filter((id, index) => index !== 0 && index !== 1);
  // const absPosition = getAbsolutePosition(currentState, action.payload.id);
  // if (layerItem.type === 'Artboard') {
  //   const mask = paperLayer.getItem({data: { id: 'artboardLayersMask' }});
  //   const background = paperLayer.getItem({data: { id: 'artboardBackground' }});
  //   mask.bounds.width = action.payload.width;
  //   background.bounds.width = action.payload.width;
  //   mask.position.x = layerItem.frame.x;
  //   mask.position.y = layerItem.frame.y;
  //   background.position.x = layerItem.frame.x;
  //   background.position.y = layerItem.frame.y;
  // } else {
  //   if (layerItem.transform.rotation !== 0) {
  //     paperLayer.rotation = -layerItem.transform.rotation;
  //   }
  //   paperLayer.bounds.width = action.payload.width;
  //   if (layerItem.transform.rotation !== 0) {
  //     paperLayer.rotation = layerItem.transform.rotation;
  //   }
  //   paperLayer.position.x = absPosition.x;
  // }
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        frame: action.payload.bounds ? {
          ...currentState.byId[action.payload.id].frame,
          ...action.payload.bounds,
          innerWidth: action.payload.width
        } : {
          ...currentState.byId[action.payload.id].frame,
          innerWidth: action.payload.width
        }
      }
    }
  }
  if (action.payload.pathData && layerItem.type === 'Shape') {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          pathData: action.payload.pathData
        } as Btwx.Shape
      }
    }
    currentState = setShapeIcon(currentState, action.payload.id, action.payload.pathData);
  }
  if (groupParents.length > 0) {
    currentState = groupParents.reduce((result, current) => {
      const groupItem = result.byId[current];
      const layersBounds = getLayersRelativeBounds(result, groupItem.children);
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            frame: {
              ...result.byId[current].frame,
              y: layersBounds.center.y,
              innerHeight: layersBounds.height,
              height: layersBounds.height
            }
          }
        }
      }
      return result;
    }, currentState);
  }
  if (layerItem.type === 'Group') {
    const layerAndDescendants = getLayerDescendants(currentState, action.payload.id);
    currentState = layerAndDescendants.reduce((result, current) => {
      const descendantItem = result.byId[current];
      if (descendantItem.type !== 'Group') {
        result = updateLayerTweensByProps(result, current, ['width']);
      }
      return result;
    }, currentState);
  } else {
    currentState = updateLayerTweensByProps(currentState, action.payload.id, ['width']);
  }
  return currentState;
};

export const setLayersWidth = (state: LayerState, action: SetLayersWidth): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current, index) => {
    const layerItem = currentState.byId[current];
    const layerProject = layerItem.artboard;
    const pathData = action.payload.pathData ? action.payload.pathData[index] : null;
    const bounds = action.payload.bounds ? action.payload.bounds[index] : null;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerWidth(result, layerActions.setLayerWidth({id: current, width: action.payload.width, pathData, bounds}) as SetLayerWidth);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Width',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerHeight = (state: LayerState, action: SetLayerHeight): LayerState => {
  let currentState = state;
  // const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  const layerItem = currentState.byId[action.payload.id];
  const isArtboard = layerItem.type === 'Artboard';
  const groupParents = isArtboard ? ['root'] : layerItem.scope.filter((id, index) => index !== 0 && index !== 1);
  // const groupParents = layerItem.scope.filter((id, index) => index !== 0 && index !== 1);
  // const absPosition = getAbsolutePosition(currentState, action.payload.id);
  // if (layerItem.type === 'Artboard') {
  //   const mask = paperLayer.getItem({data: { id: 'artboardLayersMask' }});
  //   const background = paperLayer.getItem({data: { id: 'artboardBackground' }});
  //   mask.bounds.height = action.payload.height;
  //   background.bounds.height = action.payload.height;
  //   mask.position.x = layerItem.frame.x;
  //   mask.position.y = layerItem.frame.y;
  //   background.position.x = layerItem.frame.x;
  //   background.position.y = layerItem.frame.y;
  // } else {
  //   if (layerItem.transform.rotation !== 0) {
  //     paperLayer.rotation = -layerItem.transform.rotation;
  //   }
  //   paperLayer.bounds.height = action.payload.height;
  //   if (layerItem.transform.rotation !== 0) {
  //     paperLayer.rotation = layerItem.transform.rotation;
  //   }
  //   paperLayer.position.y = absPosition.y;
  // }
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        frame: action.payload.bounds ? {
          ...currentState.byId[action.payload.id].frame,
          ...action.payload.bounds,
          innerHeight: action.payload.height
        } : {
          ...currentState.byId[action.payload.id].frame,
          innerHeight: action.payload.height
        }
      }
    }
  }
  if (action.payload.pathData && layerItem.type === 'Shape') {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          pathData: action.payload.pathData
        } as Btwx.Shape
      }
    }
    currentState = setShapeIcon(currentState, action.payload.id, action.payload.pathData);
  }
  if (groupParents.length > 0) {
    currentState = groupParents.reduce((result, current) => {
      const groupItem = result.byId[current];
      const layersBounds = getLayersRelativeBounds(result, groupItem.children);
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            frame: {
              ...result.byId[current].frame,
              y: layersBounds.center.y,
              innerHeight: layersBounds.height,
              height: layersBounds.height
            }
          }
        }
      }
      return result;
    }, currentState);
  }
  if (layerItem.type === 'Group') {
    const layerAndDescendants = getLayerDescendants(currentState, action.payload.id);
    currentState = layerAndDescendants.reduce((result, current) => {
      const descendantItem = result.byId[current];
      if (descendantItem.type !== 'Group') {
        result = updateLayerTweensByProps(result, current, ['height']);
      }
      return result;
    }, currentState);
  } else {
    currentState = updateLayerTweensByProps(currentState, action.payload.id, ['height']);
  }
  return currentState;
};

export const setLayersHeight = (state: LayerState, action: SetLayersHeight): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current, index) => {
    const layerItem = currentState.byId[current];
    const layerProject = layerItem.artboard;
    const pathData = action.payload.pathData ? action.payload.pathData[index] : null;
    const bounds = action.payload.bounds ? action.payload.bounds[index] : null;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerHeight(result, layerActions.setLayerHeight({id: current, height: action.payload.height, pathData, bounds}) as SetLayerHeight);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Height',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerOpacity = (state: LayerState, action: SetLayerOpacity): LayerState => {
  let currentState = state;
  // const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  // paperLayer.opacity = action.payload.opacity;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          opacity: action.payload.opacity
        }
      }
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['opacity']);
  return currentState;
};

export const setLayersOpacity = (state: LayerState, action: SetLayersOpacity): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerOpacity(result, layerActions.setLayerOpacity({id: current, opacity: action.payload.opacity}) as SetLayerOpacity);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Opacity',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerRotation = (state: LayerState, action: SetLayerRotation): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const groupParents = layerItem.scope.filter((id, index) => index !== 0 && index !== 1);
  const isShape = layerItem.type === 'Shape';
  const isLine = isShape && (layerItem as Btwx.Shape).shapeType === 'Line';
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        frame: action.payload.bounds ? {
          ...currentState.byId[action.payload.id].frame,
          ...action.payload.bounds
        } : currentState.byId[action.payload.id].frame,
        transform: {
          ...currentState.byId[action.payload.id].transform,
          rotation: action.payload.rotation
        }
      }
    }
  }
  if (action.payload.pathData && layerItem.type === 'Shape') {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          pathData: action.payload.pathData
        } as Btwx.Shape
      }
    }
    currentState = setShapeIcon(currentState, action.payload.id, action.payload.pathData);
  }
  if (groupParents.length > 0) {
    currentState = groupParents.reduce((result, current) => {
      const groupItem = result.byId[current];
      const layersBounds = getLayersRelativeBounds(result, groupItem.children);
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            frame: {
              ...result.byId[current].frame,
              y: layersBounds.center.y,
              innerHeight: layersBounds.height,
              height: layersBounds.height
            }
          }
        }
      }
      return result;
    }, currentState);
  }
  if (layerItem.type !== 'Group') {
    currentState = updateLayerTweensByProps(currentState, action.payload.id, isLine ? ['fromX', 'fromY', 'toX', 'toY'] : ['rotation']);
    // if (layerItem.style.fill.fillType === 'gradient') {
    //   currentState = setLayerGradient(currentState, layerActions.setLayerGradient({id: action.payload.id, prop: 'fill', gradient: layerItem.style.fill.gradient}) as SetLayerGradient);
    // }
    // if (layerItem.style.stroke.fillType === 'gradient') {
    //   currentState = setLayerGradient(currentState, layerActions.setLayerGradient({id: action.payload.id, prop: 'stroke', gradient: layerItem.style.stroke.gradient}) as SetLayerGradient);
    // }
  }
  return currentState;
};

export const setLayersRotation = (state: LayerState, action: SetLayersRotation): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current, index) => {
    const layerItem = currentState.byId[current];
    const layerProject = layerItem.artboard;
    const pathData = action.payload.pathData ? action.payload.pathData[index] : null;
    const bounds = action.payload.bounds ? action.payload.bounds[index] : null;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerRotation(result, layerActions.setLayerRotation({id: current, rotation: action.payload.rotation, pathData, bounds}) as SetLayerRotation);
    // if (layerItem.type === 'Group') {
    //   const layerAndDescendants = getLayerAndDescendants(result, current);
    //   return layerAndDescendants.reduce((lr, lc) => {
    //     return setLayerRotation(lr, layerActions.setLayerRotation({id: lc, rotation: action.payload.rotation, pathData}) as SetLayerRotation);
    //   }, result);
    // } else {
    //   return setLayerRotation(result, layerActions.setLayerRotation({id: current, rotation: action.payload.rotation, pathData}) as SetLayerRotation);
    // }
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Rotation',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const enableLayerHorizontalFlip = (state: LayerState, action: EnableLayerHorizontalFlip): LayerState => {
  let currentState = state;
  // paperLayer.scale(-1, 1);
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        transform: {
          ...currentState.byId[action.payload.id].transform,
          horizontalFlip: true
        }
      }
    }
  }
  // currentState = updateLayerBounds(currentState, action.payload.id);
  return currentState;
};

export const enableLayersHorizontalFlip = (state: LayerState, action: EnableLayersHorizontalFlip): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return enableLayerHorizontalFlip(result, layerActions.enableLayerHorizontalFlip({id: current}) as EnableLayerHorizontalFlip);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Enable Layers Horizontal Flip',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const disableLayerHorizontalFlip = (state: LayerState, action: DisableLayerHorizontalFlip): LayerState => {
  let currentState = state;
  // paperLayer.scale(-1, 1);
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        transform: {
          ...currentState.byId[action.payload.id].transform,
          horizontalFlip: false
        }
      }
    }
  }
  // currentState = updateLayerBounds(currentState, action.payload.id);
  return currentState;
};

export const disableLayersHorizontalFlip = (state: LayerState, action: DisableLayersHorizontalFlip): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return disableLayerHorizontalFlip(result, layerActions.disableLayerHorizontalFlip({id: current}) as DisableLayerHorizontalFlip);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Disable Layers Horizontal Flip',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const enableLayerVerticalFlip = (state: LayerState, action: EnableLayerVerticalFlip): LayerState => {
  let currentState = state;
  // const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  // paperLayer.scale(1, -1);
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        transform: {
          ...currentState.byId[action.payload.id].transform,
          verticalFlip: true
        }
      }
    }
  }
  // currentState = updateLayerBounds(currentState, action.payload.id);
  return currentState;
};

export const enableLayersVerticalFlip = (state: LayerState, action: EnableLayersVerticalFlip): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return enableLayerVerticalFlip(result, layerActions.enableLayerVerticalFlip({id: current}) as EnableLayerVerticalFlip);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Enable Layers Vertical Flip',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const disableLayerVerticalFlip = (state: LayerState, action: DisableLayerVerticalFlip): LayerState => {
  let currentState = state;
  // const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  // paperLayer.scale(1, -1);
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        transform: {
          ...currentState.byId[action.payload.id].transform,
          verticalFlip: false
        }
      }
    }
  }
  // currentState = updateLayerBounds(currentState, action.payload.id);
  return currentState;
};

export const disableLayersVerticalFlip = (state: LayerState, action: DisableLayersVerticalFlip): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return disableLayerVerticalFlip(result, layerActions.disableLayerVerticalFlip({id: current}) as DisableLayerVerticalFlip);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Disable Layers Vertical Flip',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const enableLayerFill = (state: LayerState, action: EnableLayerFill): LayerState => {
  let currentState = state;
  // const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  // let fillPaperLayer = paperLayer;
  // if (layerItem.type === 'Artboard') {
  //   fillPaperLayer = paperLayer.getItem({data: {id: 'artboardBackground'}});
  // }
  // if (layerItem.type === 'Text') {
  //   fillPaperLayer = paperLayer.getItem({data: {id: 'textLines'}});
  // }
  // const fill = currentState.byId[action.payload.id].style.fill;
  // switch(fill.fillType) {
  //   case 'color':
  //     fillPaperLayer.fillColor = { hue: fill.color.h, saturation: fill.color.s, lightness: fill.color.l, alpha: fill.color.a } as paper.Color;
  //     break;
  //   case 'gradient':
  //     fillPaperLayer.fillColor = {
  //       gradient: {
  //         stops: getGradientStops(fill.gradient.stops),
  //         radial: fill.gradient.gradientType === 'radial'
  //       },
  //       origin: getGradientOriginPoint(currentState, action.payload.id, 'fill'),
  //       destination: getGradientDestinationPoint(currentState, action.payload.id, 'fill')
  //     } as any
  //     break;
  // }
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          fill: {
            ...currentState.byId[action.payload.id].style.fill,
            enabled: true
          }
        }
      }
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['fill', 'fillGradientOriginX', 'fillGradientOriginY', 'fillGradientDestinationX', 'fillGradientDestinationY']);
  return currentState;
};

export const enableLayersFill = (state: LayerState, action: EnableLayersFill): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return enableLayerFill(result, layerActions.enableLayerFill({id: current}) as EnableLayerFill);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Enable Layers Fill',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const disableLayerFill = (state: LayerState, action: DisableLayerFill): LayerState => {
  let currentState = state;
  // const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  // let fillPaperLayer = paperLayer;
  // if (layerItem.type === 'Artboard') {
  //   fillPaperLayer = paperLayer.getItem({data: {id: 'artboardBackground'}});
  // }
  // if (layerItem.type === 'Text') {
  //   fillPaperLayer = paperLayer.getItem({data: {id: 'textLines'}});
  // }
  // fillPaperLayer.fillColor = null;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          fill: {
            ...currentState.byId[action.payload.id].style.fill,
            enabled: false
          }
        }
      }
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['fill', 'fillGradientOriginX', 'fillGradientOriginY', 'fillGradientDestinationX', 'fillGradientDestinationY']);
  return currentState;
};

export const disableLayersFill = (state: LayerState, action: DisableLayersFill): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return disableLayerFill(result, layerActions.disableLayerFill({id: current}) as DisableLayerFill);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Disable Layers Fill',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerFillColor = (state: LayerState, action: SetLayerFillColor): LayerState => {
  let currentState = state;
  // const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  // const fillColor = action.payload.fillColor;
  // const newFill = { ...layerItem.style.fill.color, ...fillColor } as Btwx.Color;
  // const paperFill = { hue: newFill.h, saturation: newFill.s, lightness: newFill.l, alpha: newFill.a } as paper.Color;
  // let fillPaperLayer = paperLayer;
  // if (layerItem.type === 'Artboard') {
  //   fillPaperLayer = paperLayer.getItem({data: {id: 'artboardBackground'}});
  // }
  // if (layerItem.type === 'Text') {
  //   fillPaperLayer = paperLayer.getItem({data: {id: 'textLines'}});
  // }
  // fillPaperLayer.fillColor = paperFill;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          fill: {
            ...currentState.byId[action.payload.id].style.fill,
            color: {
              ...currentState.byId[action.payload.id].style.fill.color,
              ...action.payload.fillColor
            }
          }
        }
      }
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['fill', 'fillGradientOriginX', 'fillGradientOriginY', 'fillGradientDestinationX', 'fillGradientDestinationY']);
  return currentState;
};

export const setLayersFillColor = (state: LayerState, action: SetLayersFillColor): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerFillColor(result, layerActions.setLayerFillColor({id: current, fillColor: action.payload.fillColor}) as SetLayerFillColor);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Fill Color',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerFill = (state: LayerState, action: SetLayerFill): LayerState => {
  let currentState = state;
  // const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  const layerItem = state.byId[action.payload.id];
  // let fillPaperLayer = paperLayer;
  // if (layerItem.type === 'Artboard') {
  //   fillPaperLayer = paperLayer.getItem({data: {id: 'artboardBackground'}});
  // }
  // if (layerItem.type === 'Text') {
  //   fillPaperLayer = paperLayer.getItem({data: {id: 'textLines'}});
  // }
  // const fill = action.payload.fill;
  // switch(fill.fillType) {
  //   case 'color':
  //     fillPaperLayer.fillColor = {hue: fill.color.h, saturation: fill.color.s, lightness: fill.color.l, alpha: fill.color.a} as paper.Color;
  //     break;
  //   case 'gradient':
  //     fillPaperLayer.fillColor = {
  //       gradient: {
  //         stops: getGradientStops(fill.gradient.stops),
  //         radial: layerItem.style.fill.gradient.gradientType === 'radial'
  //       },
  //       origin: getGradientOriginPoint(currentState, action.payload.id, 'fill'),
  //       destination: getGradientDestinationPoint(currentState, action.payload.id, 'fill')
  //     } as any
  //     break;
  // }
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          fill: action.payload.fill
        }
      }
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['fill', 'fillGradientOriginX', 'fillGradientOriginY', 'fillGradientDestinationX', 'fillGradientDestinationY']);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Fill',
      projects: [layerItem.artboard]
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerFillType = (state: LayerState, action: SetLayerFillType): LayerState => {
  let currentState = state;
  // const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  // let fillPaperLayer = paperLayer;
  // if (layerItem.type === 'Artboard') {
  //   fillPaperLayer = paperLayer.getItem({data: {id: 'artboardBackground'}});
  // }
  // if (layerItem.type === 'Text') {
  //   fillPaperLayer = paperLayer.getItem({data: {id: 'textLines'}});
  // }
  // const fill = layerItem.style.fill;
  // const gradientType = action.payload.gradientType ? action.payload.gradientType : layerItem.style.fill.gradient.gradientType;
  // switch(action.payload.fillType) {
  //   case 'color':
  //     fillPaperLayer.fillColor = {hue: fill.color.h, saturation: fill.color.s, lightness: fill.color.l, alpha: fill.color.a} as paper.Color;
  //     break;
  //   case 'gradient':
  //     fillPaperLayer.fillColor = {
  //       gradient: {
  //         stops: getGradientStops(fill.gradient.stops),
  //         radial: gradientType === 'radial'
  //       },
  //       origin: getGradientOriginPoint(currentState, action.payload.id, 'fill'),
  //       destination: getGradientDestinationPoint(currentState, action.payload.id, 'fill')
  //     } as any
  //     break;
  // }
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          fill: {
            ...currentState.byId[action.payload.id].style.fill,
            fillType: action.payload.fillType
          }
        }
      }
    }
  }
  if (action.payload.gradientType) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          style: {
            ...currentState.byId[action.payload.id].style,
            fill: {
              ...currentState.byId[action.payload.id].style.fill,
              gradient: {
                ...currentState.byId[action.payload.id].style.fill.gradient,
                gradientType: action.payload.gradientType
              }
            }
          }
        }
      }
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['fill', 'fillGradientOriginX', 'fillGradientOriginY', 'fillGradientDestinationX', 'fillGradientDestinationY']);
  return currentState;
};

export const setLayersFillType = (state: LayerState, action: SetLayersFillType): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerFillType(result, layerActions.setLayerFillType({id: current, fillType: action.payload.fillType, gradientType: action.payload.gradientType}) as SetLayerFillType);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Fill Type',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerGradient = (state: LayerState, action: SetLayerGradient): LayerState => {
  let currentState = state;
  // const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          [action.payload.prop]: {
            ...currentState.byId[action.payload.id].style[action.payload.prop],
            gradient: action.payload.gradient
          }
        }
      }
    }
  }
  // let fillPaperLayer = paperLayer;
  // if (layerItem.type === 'Artboard') {
  //   fillPaperLayer = paperLayer.getItem({data: {id: 'artboardBackground'}});
  // }
  // if (layerItem.type === 'Text') {
  //   fillPaperLayer = paperLayer.getItem({data: {id: 'textLines'}});
  // }
  // fillPaperLayer[action.payload.prop === 'fill' ? 'fillColor' : 'strokeColor'] = {
  //   gradient: {
  //     stops: getGradientStops(action.payload.gradient.stops),
  //     radial: action.payload.gradient.gradientType === 'radial'
  //   },
  //   origin: getGradientOriginPoint(currentState, action.payload.id, action.payload.prop),
  //   destination: getGradientDestinationPoint(currentState, action.payload.id, action.payload.prop)
  // } as any
  currentState = updateLayerTweensByProps(currentState, action.payload.id, [action.payload.prop, `${action.payload.prop}GradientOriginX`, `${action.payload.prop}GradientOriginY`, `${action.payload.prop}GradientDestinationX`, `${action.payload.prop}GradientDestinationY`] as any);
  return currentState;
};

export const setLayersGradient = (state: LayerState, action: SetLayersGradient): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerGradient(result, layerActions.setLayerGradient({id: current, prop: action.payload.prop, gradient: action.payload.gradient}) as SetLayerGradient);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Gradient',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerGradientType = (state: LayerState, action: SetLayerGradientType): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          [action.payload.prop]: {
            ...currentState.byId[action.payload.id].style[action.payload.prop],
            gradient: {
              ...currentState.byId[action.payload.id].style[action.payload.prop].gradient,
              gradientType: action.payload.gradientType
            }
          }
        }
      }
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, [action.payload.prop]);
  return currentState;
};

export const setLayersGradientType = (state: LayerState, action: SetLayersGradientType): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerGradientType(result, layerActions.setLayerGradientType({id: current, prop: action.payload.prop, gradientType: action.payload.gradientType}) as SetLayerGradientType);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Gradient Type',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerGradientOrigin = (state: LayerState, action: SetLayerGradientOrigin): LayerState => {
  let currentState = state;
  const origin = getGradientOrigin(currentState, action.payload.id, action.payload.origin);
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          [action.payload.prop]: {
            ...currentState.byId[action.payload.id].style[action.payload.prop],
            gradient: {
              ...currentState.byId[action.payload.id].style[action.payload.prop].gradient,
              origin: {
                x: origin.x,
                y: origin.y
              }
            }
          }
        }
      }
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, [action.payload.prop, `${action.payload.prop}GradientOriginX`, `${action.payload.prop}GradientOriginY`] as any);
  return currentState;
};

export const setLayersGradientOrigin = (state: LayerState, action: SetLayersGradientOrigin): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerGradientOrigin(result, layerActions.setLayerGradientOrigin({id: current, prop: action.payload.prop, origin: action.payload.origin}) as SetLayerGradientOrigin);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Gradient Origin',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerGradientDestination = (state: LayerState, action: SetLayerGradientDestination): LayerState => {
  let currentState = state;
  // const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  const destination = getGradientDestination(currentState, action.payload.id, action.payload.destination);
  // const gradient = layerItem.style[action.payload.prop].gradient;
  // const paperProp = getPaperProp(action.payload.prop);
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          [action.payload.prop]: {
            ...currentState.byId[action.payload.id].style[action.payload.prop],
            gradient: {
              ...currentState.byId[action.payload.id].style[action.payload.prop].gradient,
              destination: {
                x: destination.x,
                y: destination.y
              }
            }
          }
        }
      }
    }
  }
  // let fillPaperLayer = paperLayer;
  // if (layerItem.type === 'Artboard') {
  //   fillPaperLayer = paperLayer.getItem({data: {id: 'artboardBackground'}});
  // }
  // if (layerItem.type === 'Text') {
  //   fillPaperLayer = paperLayer.getItem({data: {id: 'textLines'}});
  // }
  // fillPaperLayer[paperProp] = {
  //   gradient: {
  //     stops: getGradientStops(gradient.stops),
  //     radial: gradient.gradientType === 'radial'
  //   },
  //   origin: getGradientOriginPoint(currentState, action.payload.id, action.payload.prop),
  //   destination: getGradientDestinationPoint(currentState, action.payload.id, action.payload.prop)
  // } as any
  currentState = updateLayerTweensByProps(currentState, action.payload.id, [action.payload.prop, `${action.payload.prop}GradientDestinationX`, `${action.payload.prop}GradientDestinationY`] as any);
  return currentState;
};

export const setLayersGradientDestination = (state: LayerState, action: SetLayersGradientDestination): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerGradientDestination(result, layerActions.setLayerGradientDestination({id: current, prop: action.payload.prop, destination: action.payload.destination}) as SetLayerGradientDestination);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Gradient Destination',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayersGradientOD = (state: LayerState, action: SetLayersGradientOD): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    result = setLayerGradientOrigin(result, layerActions.setLayerGradientOrigin({id: current, prop: action.payload.prop, origin: action.payload.origin}) as SetLayerGradientOrigin);
    result = setLayerGradientDestination(result, layerActions.setLayerGradientDestination({id: current, prop: action.payload.prop, destination: action.payload.destination}) as SetLayerGradientDestination);
    return result;
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: `Set Layers Gradient ${capitalize(action.payload.handle)}`,
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerGradientStopColor = (state: LayerState, action: SetLayerGradientStopColor): LayerState => {
  let currentState = state;
  // const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  const layerItem = currentState.byId[action.payload.id];
  const gradient = layerItem.style[action.payload.prop].gradient;
  // const paperProp = getPaperProp(action.payload.prop);
  const newStops = gradient.stops.reduce((result, current, index) => {
    if (index === action.payload.stopIndex) {
      result = [...result, {
        ...current,
        color: {
          ...current.color,
          ...action.payload.color
        }
      }]
    } else {
      result = [...result, current];
    }
    return result;
  }, []);
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          [action.payload.prop]: {
            ...currentState.byId[action.payload.id].style[action.payload.prop],
            gradient: {
              ...currentState.byId[action.payload.id].style[action.payload.prop].gradient,
              stops: newStops
            }
          }
        }
      }
    }
  }
  // let fillPaperLayer = paperLayer;
  // if (layerItem.type === 'Artboard') {
  //   fillPaperLayer = paperLayer.getItem({data: {id: 'artboardBackground'}});
  // }
  // if (layerItem.type === 'Text') {
  //   fillPaperLayer = paperLayer.getItem({data: {id: 'textLines'}});
  // }
  // fillPaperLayer[paperProp] = {
  //   gradient: {
  //     stops: getGradientStops(newStops),
  //     radial: gradient.gradientType === 'radial'
  //   },
  //   origin: getGradientOriginPoint(currentState, action.payload.id, action.payload.prop),
  //   destination: getGradientDestinationPoint(currentState, action.payload.id, action.payload.prop)
  // } as any
  currentState = updateLayerTweensByProps(currentState, action.payload.id, [action.payload.prop]);
  return currentState;
};

export const updateGradients = (state: LayerState, layers: string[], prop: 'fill' | 'stroke') => {
  let currentState = state;
  if (layers.length > 1) {
    const originLayer = currentState.byId[layers[0]];
    const originGradient = {...originLayer.style[prop].gradient};
    const nonOriginLayers = layers.filter((id) => id !== layers[0]);
    currentState = setLayersGradient(currentState, layerActions.setLayersGradient({layers: nonOriginLayers, prop: prop, gradient: originGradient}) as SetLayersGradient);
    switch(prop) {
      case 'fill':
        return enableLayersFill(currentState, layerActions.enableLayersFill({layers: nonOriginLayers}) as EnableLayersFill);
      case 'stroke':
        return enableLayersStroke(currentState, layerActions.enableLayersStroke({layers: nonOriginLayers}) as EnableLayersStroke);
    }
  }
  return currentState;
}

export const setLayersGradientStopColor = (state: LayerState, action: SetLayersGradientStopColor): LayerState => {
  let currentState = state;
  currentState = setLayerGradientStopColor(currentState, layerActions.setLayerGradientStopColor({id: action.payload.layers[0], prop: action.payload.prop, stopIndex: action.payload.stopIndex, color: action.payload.color}) as SetLayerGradientStopColor);
  currentState = updateGradients(currentState, action.payload.layers, action.payload.prop);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Gradient Stop Color',
      projects: action.payload.layers.reduce((result, current) => {
        const layerProject = currentState.byId[current].artboard;
        if (!result.includes(layerProject)) {
          result = [...result, layerProject];
        }
        return result;
      }, [])
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerGradientStopPosition = (state: LayerState, action: SetLayerGradientStopPosition): LayerState => {
  let currentState = state;
  // const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  const layerItem = currentState.byId[action.payload.id];
  const gradient = layerItem.style[action.payload.prop].gradient;
  // const paperProp = getPaperProp(action.payload.prop);
  const newStops = gradient.stops.reduce((result: Btwx.GradientStop[], current, index) => {
    if (index === action.payload.stopIndex) {
      result = [...result, {
        ...current,
        position: action.payload.position
      }]
    } else {
      result = [...result, current];
    }
    return result;
  }, []);
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          [action.payload.prop]: {
            ...currentState.byId[action.payload.id].style[action.payload.prop],
            gradient: {
              ...currentState.byId[action.payload.id].style[action.payload.prop].gradient,
              stops: newStops
            }
          }
        }
      }
    }
  }
  // let fillPaperLayer = paperLayer;
  // if (layerItem.type === 'Artboard') {
  //   fillPaperLayer = paperLayer.getItem({data: {id: 'artboardBackground'}});
  // }
  // if (layerItem.type === 'Text') {
  //   fillPaperLayer = paperLayer.getItem({data: {id: 'textLines'}});
  // }
  // fillPaperLayer[paperProp] = {
  //   gradient: {
  //     stops: getGradientStops(newStops),
  //     radial: gradient.gradientType === 'radial'
  //   },
  //   origin: getGradientOriginPoint(currentState, action.payload.id, action.payload.prop),
  //   destination: getGradientDestinationPoint(currentState, action.payload.id, action.payload.prop)
  // } as any
  currentState = updateLayerTweensByProps(currentState, action.payload.id, [action.payload.prop]);
  return currentState;
};

export const setLayersGradientStopPosition = (state: LayerState, action: SetLayersGradientStopPosition): LayerState => {
  let currentState = state;
  currentState = setLayerGradientStopPosition(currentState, layerActions.setLayerGradientStopPosition({id: action.payload.layers[0], prop: action.payload.prop, stopIndex: action.payload.stopIndex, position: action.payload.position}) as SetLayerGradientStopPosition);
  currentState = updateGradients(currentState, action.payload.layers, action.payload.prop);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Gradient Stop Position',
      projects: action.payload.layers.reduce((result, current) => {
        const layerProject = currentState.byId[current].artboard;
        if (!result.includes(layerProject)) {
          result = [...result, layerProject];
        }
        return result;
      }, [])
    }
  }) as SetLayerEdit);
  return currentState;
};

export const addLayerGradientStop = (state: LayerState, action: AddLayerGradientStop): LayerState => {
  let currentState = state;
  // const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  const layerItem = currentState.byId[action.payload.id];
  const gradient = layerItem.style[action.payload.prop].gradient;
  // const paperProp = getPaperProp(action.payload.prop);
  const newStops = [...gradient.stops, action.payload.gradientStop];
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          [action.payload.prop]: {
            ...currentState.byId[action.payload.id].style[action.payload.prop],
            gradient: {
              ...currentState.byId[action.payload.id].style[action.payload.prop].gradient,
              stops: newStops
            }
          }
        }
      }
    }
  }
  // let fillPaperLayer = paperLayer;
  // if (layerItem.type === 'Artboard') {
  //   fillPaperLayer = paperLayer.getItem({data: {id: 'artboardBackground'}});
  // }
  // if (layerItem.type === 'Text') {
  //   fillPaperLayer = paperLayer.getItem({data: {id: 'textLines'}});
  // }
  // fillPaperLayer[paperProp] = {
  //   gradient: {
  //     stops: getGradientStops(newStops),
  //     radial: gradient.gradientType === 'radial'
  //   },
  //   origin: getGradientOriginPoint(currentState, action.payload.id, action.payload.prop),
  //   destination: getGradientDestinationPoint(currentState, action.payload.id, action.payload.prop)
  // } as any
  currentState = setLayerActiveGradientStop(currentState, layerActions.setLayerActiveGradientStop({
    id: action.payload.id,
    stopIndex: newStops.length - 1,
    prop: action.payload.prop
  }) as SetLayerActiveGradientStop);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, [action.payload.prop]);
  return currentState;
};

export const addLayersGradientStop = (state: LayerState, action: AddLayersGradientStop): LayerState => {
  let currentState = state;
  currentState = addLayerGradientStop(currentState, layerActions.addLayerGradientStop({id: action.payload.layers[0], prop: action.payload.prop, gradientStop: action.payload.gradientStop}) as AddLayerGradientStop);
  currentState = updateGradients(currentState, action.payload.layers, action.payload.prop);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Add Layers Gradient Stop',
      projects: action.payload.layers.reduce((result, current) => {
        const layerProject = currentState.byId[current].artboard;
        if (!result.includes(layerProject)) {
          result = [...result, layerProject];
        }
        return result;
      }, [])
    }
  }) as SetLayerEdit);
  return currentState;
};

export const removeLayerGradientStop = (state: LayerState, action: RemoveLayerGradientStop): LayerState => {
  let currentState = state;
  // const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  const layerItem = currentState.byId[action.payload.id];
  // const paperProp = getPaperProp(action.payload.prop);
  const gradient = layerItem.style[action.payload.prop].gradient;
  const newStops = gradient.stops.filter((id, index) => index !== action.payload.stopIndex);
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          [action.payload.prop]: {
            ...currentState.byId[action.payload.id].style[action.payload.prop],
            gradient: {
              ...currentState.byId[action.payload.id].style[action.payload.prop].gradient,
              stops: newStops
            }
          }
        }
      }
    }
  }
  // let fillPaperLayer = paperLayer;
  // if (layerItem.type === 'Artboard') {
  //   fillPaperLayer = paperLayer.getItem({data: {id: 'artboardBackground'}});
  // }
  // if (layerItem.type === 'Text') {
  //   fillPaperLayer = paperLayer.getItem({data: {id: 'textLines'}});
  // }
  // fillPaperLayer[paperProp] = {
  //   gradient: {
  //     stops: getGradientStops(newStops),
  //     radial: gradient.gradientType === 'radial'
  //   },
  //   origin: getGradientOriginPoint(currentState, action.payload.id, action.payload.prop),
  //   destination: getGradientDestinationPoint(currentState, action.payload.id, action.payload.prop)
  // } as any
  currentState = setLayerActiveGradientStop(currentState, layerActions.setLayerActiveGradientStop({id: action.payload.id, prop: action.payload.prop, stopIndex: 0}) as SetLayerActiveGradientStop);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, [action.payload.prop]);
  return currentState;
};

export const removeLayersGradientStop = (state: LayerState, action: RemoveLayersGradientStop): LayerState => {
  let currentState = state;
  currentState = removeLayerGradientStop(currentState, layerActions.removeLayerGradientStop({id: action.payload.layers[0], prop: action.payload.prop, stopIndex: action.payload.stopIndex}) as RemoveLayerGradientStop);
  currentState = updateGradients(currentState, action.payload.layers, action.payload.prop);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Remove Layers Gradient Stop',
      projects: action.payload.layers.reduce((result, current) => {
        const layerProject = currentState.byId[current].artboard;
        if (!result.includes(layerProject)) {
          result = [...result, layerProject];
        }
        return result;
      }, [])
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerActiveGradientStop = (state: LayerState, action: SetLayerActiveGradientStop): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          [action.payload.prop]: {
            ...currentState.byId[action.payload.id].style[action.payload.prop],
            gradient: {
              ...currentState.byId[action.payload.id].style[action.payload.prop].gradient,
              activeStopIndex: action.payload.stopIndex
            }
          }
        }
      }
    }
  }
  return currentState;
};

export const enableLayerStroke = (state: LayerState, action: EnableLayerStroke): LayerState => {
  let currentState = state;
  // const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  // const stroke = currentState.byId[action.payload.id].style.stroke;
  // let fillPaperLayer = paperLayer;
  // if (layerItem.type === 'Text') {
  //   fillPaperLayer = paperLayer.getItem({data: {id: 'textLines'}});
  // }
  // switch(stroke.fillType) {
  //   case 'color':
  //     fillPaperLayer.strokeColor = { hue: stroke.color.h, saturation: stroke.color.s, lightness: stroke.color.l, alpha: stroke.color.a } as paper.Color;
  //     break;
  //   case 'gradient':
  //     fillPaperLayer.strokeColor = {
  //       gradient: {
  //         stops: getGradientStops(stroke.gradient.stops),
  //         radial: stroke.gradient.gradientType === 'radial'
  //       },
  //       origin: getGradientOriginPoint(currentState, action.payload.id, 'stroke'),
  //       destination: getGradientDestinationPoint(currentState, action.payload.id, 'stroke')
  //     } as any
  //     break;
  // }
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          stroke: {
            ...currentState.byId[action.payload.id].style.stroke,
            enabled: true
          }
        }
      }
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['stroke', 'strokeGradientOriginX', 'strokeGradientOriginY', 'strokeGradientDestinationX', 'strokeGradientDestinationY', 'strokeWidth', 'dashOffset', 'dashArrayWidth', 'dashArrayGap']);
  return currentState;
};

export const enableLayersStroke = (state: LayerState, action: EnableLayersStroke): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return enableLayerStroke(result, layerActions.enableLayerStroke({id: current}) as EnableLayerStroke);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Enable Layers Stroke',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const disableLayerStroke = (state: LayerState, action: DisableLayerStroke): LayerState => {
  let currentState = state;
  // const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  // let fillPaperLayer = paperLayer;
  // if (layerItem.type === 'Text') {
  //   fillPaperLayer = paperLayer.getItem({data: {id: 'textLines'}});
  // }
  // fillPaperLayer.strokeColor = null;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          stroke: {
            ...currentState.byId[action.payload.id].style.stroke,
            enabled: false
          }
        }
      }
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['stroke', 'strokeGradientOriginX', 'strokeGradientOriginY', 'strokeGradientDestinationX', 'strokeGradientDestinationY', 'strokeWidth', 'dashOffset', 'dashArrayWidth', 'dashArrayGap']);
  return currentState;
};

export const disableLayersStroke = (state: LayerState, action: DisableLayersStroke): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return disableLayerStroke(result, layerActions.disableLayerStroke({id: current}) as DisableLayerStroke);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Disable Layers Stroke',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerStrokeColor = (state: LayerState, action: SetLayerStrokeColor): LayerState => {
  let currentState = state;
  // const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  // const strokeColor = action.payload.strokeColor;
  // const newStroke = { ...layerItem.style.stroke.color, ...strokeColor } as Btwx.Color;
  // let fillPaperLayer = paperLayer;
  // if (layerItem.type === 'Text') {
  //   fillPaperLayer = paperLayer.getItem({data: {id: 'textLines'}});
  // }
  // fillPaperLayer.strokeColor = { hue: newStroke.h, saturation: newStroke.s, lightness: newStroke.l, alpha: newStroke.a } as paper.Color;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          stroke: {
            ...currentState.byId[action.payload.id].style.stroke,
            color: {
              ...currentState.byId[action.payload.id].style.stroke.color,
              ...action.payload.strokeColor
            }
          }
        }
      }
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['stroke', 'strokeGradientOriginX', 'strokeGradientOriginY', 'strokeGradientDestinationX', 'strokeGradientDestinationY', 'strokeGradientOriginX', 'strokeGradientOriginY', 'strokeGradientDestinationX', 'strokeGradientDestinationY']);
  return currentState;
};

export const setLayersStrokeColor = (state: LayerState, action: SetLayersStrokeColor): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerStrokeColor(result, layerActions.setLayerStrokeColor({id: current, strokeColor: action.payload.strokeColor}) as SetLayerStrokeColor);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Stroke Color',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerStrokeFillType = (state: LayerState, action: SetLayerStrokeFillType): LayerState => {
  let currentState = state;
  // const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  // const stroke = layerItem.style.stroke;
  // const gradientType = action.payload.gradientType ? action.payload.gradientType : layerItem.style.stroke.gradient.gradientType;
  // let fillPaperLayer = paperLayer;
  // if (layerItem.type === 'Text') {
  //   fillPaperLayer = paperLayer.getItem({data: {id: 'textLines'}});
  // }
  // switch(action.payload.fillType) {
  //   case 'color':
  //     fillPaperLayer.strokeColor = { hue: stroke.color.h, saturation: stroke.color.s, lightness: stroke.color.l, alpha: stroke.color.a } as paper.Color;
  //     break;
  //   case 'gradient':
  //     fillPaperLayer.strokeColor = {
  //       gradient: {
  //         stops: getGradientStops(stroke.gradient.stops),
  //         radial: gradientType === 'radial'
  //       },
  //       origin: getGradientOriginPoint(currentState, action.payload.id, 'stroke'),
  //       destination: getGradientDestinationPoint(currentState, action.payload.id, 'stroke')
  //     } as any
  //     break;
  // }
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          stroke: {
            ...currentState.byId[action.payload.id].style.stroke,
            fillType: action.payload.fillType
          }
        }
      }
    }
  }
  if (action.payload.gradientType) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          style: {
            ...currentState.byId[action.payload.id].style,
            stroke: {
              ...currentState.byId[action.payload.id].style.stroke,
              gradient: {
                ...currentState.byId[action.payload.id].style.stroke.gradient,
                gradientType: action.payload.gradientType
              }
            }
          }
        }
      }
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['stroke', 'strokeGradientOriginX', 'strokeGradientOriginY', 'strokeGradientDestinationX', 'strokeGradientDestinationY', 'strokeGradientOriginX', 'strokeGradientOriginY', 'strokeGradientDestinationX', 'strokeGradientDestinationY']);
  return currentState;
};

export const setLayersStrokeFillType = (state: LayerState, action: SetLayersStrokeFillType): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerStrokeFillType(result, layerActions.setLayerStrokeFillType({id: current, fillType: action.payload.fillType, gradientType: action.payload.gradientType}) as SetLayerStrokeFillType);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Stroke Fill Type',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerStrokeWidth = (state: LayerState, action: SetLayerStrokeWidth): LayerState => {
  let currentState = state;
  // const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  // let strokeLayer = paperLayer;
  // if (layerItem.type === 'Text') {
  //   strokeLayer = paperLayer.getItem({data: {id: 'textLines'}});
  // }
  // strokeLayer.strokeWidth = action.payload.strokeWidth;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          stroke: {
            ...currentState.byId[action.payload.id].style.stroke,
            width: action.payload.strokeWidth
          }
        }
      }
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['strokeWidth']);
  return currentState;
};

export const setLayersStrokeWidth = (state: LayerState, action: SetLayersStrokeWidth): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerStrokeWidth(result, layerActions.setLayerStrokeWidth({id: current, strokeWidth: action.payload.strokeWidth}) as SetLayerStrokeWidth);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Stroke Width',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerStrokeCap = (state: LayerState, action: SetLayerStrokeCap): LayerState => {
  let currentState = state;
  // const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  // let strokeLayer = paperLayer;
  // if (layerItem.type === 'Text') {
  //   strokeLayer = paperLayer.getItem({data: {id: 'textLines'}});
  // }
  // strokeLayer.strokeCap = action.payload.strokeCap;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          strokeOptions: {
            ...currentState.byId[action.payload.id].style.strokeOptions,
            cap: action.payload.strokeCap
          }
        }
      }
    }
  }
  return currentState;
};

export const setLayersStrokeCap = (state: LayerState, action: SetLayersStrokeCap): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerStrokeCap(result, layerActions.setLayerStrokeCap({id: current, strokeCap: action.payload.strokeCap}) as SetLayerStrokeCap);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Stroke Cap',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerStrokeJoin = (state: LayerState, action: SetLayerStrokeJoin): LayerState => {
  let currentState = state;
  // const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  // let strokeLayer = paperLayer;
  // if (layerItem.type === 'Text') {
  //   strokeLayer = paperLayer.getItem({data: {id: 'textLines'}});
  // }
  // strokeLayer.strokeJoin = action.payload.strokeJoin;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          strokeOptions: {
            ...currentState.byId[action.payload.id].style.strokeOptions,
            join: action.payload.strokeJoin
          }
        }
      }
    }
  }
  return currentState;
};

export const setLayersStrokeJoin = (state: LayerState, action: SetLayersStrokeJoin): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerStrokeJoin(result, layerActions.setLayerStrokeJoin({id: current, strokeJoin: action.payload.strokeJoin}) as SetLayerStrokeJoin);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Stroke Join',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerStrokeDashOffset = (state: LayerState, action: SetLayerStrokeDashOffset): LayerState => {
  let currentState = state;
  // const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  // let strokeLayer = paperLayer;
  // if (layerItem.type === 'Text') {
  //   strokeLayer = paperLayer.getItem({data: {id: 'textLines'}});
  // }
  // strokeLayer.dashOffset = action.payload.strokeDashOffset;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          strokeOptions: {
            ...currentState.byId[action.payload.id].style.strokeOptions,
            dashOffset: action.payload.strokeDashOffset
          }
        }
      }
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['dashOffset']);
  return currentState;
};

export const setLayersStrokeDashOffset = (state: LayerState, action: SetLayersStrokeDashOffset): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerStrokeDashOffset(result, layerActions.setLayerStrokeDashOffset({id: current, strokeDashOffset: action.payload.strokeDashOffset}) as SetLayerStrokeDashOffset);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Stroke Dash Offset',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerStrokeDashArray = (state: LayerState, action: SetLayerStrokeDashArray): LayerState => {
  let currentState = state;
  // const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  // let strokeLayer = paperLayer;
  // if (layerItem.type === 'Text') {
  //   strokeLayer = paperLayer.getItem({data: {id: 'textLines'}});
  // }
  // strokeLayer.dashArray = action.payload.strokeDashArray;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          strokeOptions: {
            ...currentState.byId[action.payload.id].style.strokeOptions,
            dashArray: action.payload.strokeDashArray
          }
        }
      }
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['dashArrayWidth', 'dashArrayGap']);
  return currentState;
};

export const setLayersStrokeDashArray = (state: LayerState, action: SetLayersStrokeDashArray): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerStrokeDashArray(result, layerActions.setLayerStrokeDashArray({id: current, strokeDashArray: action.payload.strokeDashArray}) as SetLayerStrokeDashArray);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Stroke Dash Array',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerStrokeDashArrayWidth = (state: LayerState, action: SetLayerStrokeDashArrayWidth): LayerState => {
  let currentState = state;
  // const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  // let strokeLayer = paperLayer;
  // if (layerItem.type === 'Text') {
  //   strokeLayer = paperLayer.getItem({data: {id: 'textLines'}});
  // }
  // const dashArray = layerItem.style.strokeOptions.dashArray;
  // const newDashArray = [action.payload.strokeDashArrayWidth, layerItem.style.strokeOptions.dashArray[1]];
  // strokeLayer.dashArray = newDashArray;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          strokeOptions: {
            ...currentState.byId[action.payload.id].style.strokeOptions,
            dashArray: [action.payload.strokeDashArrayWidth, currentState.byId[action.payload.id].style.strokeOptions.dashArray[1]]
          }
        }
      }
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['dashArrayWidth']);
  return currentState;
};

export const setLayersStrokeDashArrayWidth = (state: LayerState, action: SetLayersStrokeDashArrayWidth): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerStrokeDashArrayWidth(result, layerActions.setLayerStrokeDashArrayWidth({id: current, strokeDashArrayWidth: action.payload.strokeDashArrayWidth}) as SetLayerStrokeDashArrayWidth);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Stroke Dash Array Width',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerStrokeDashArrayGap = (state: LayerState, action: SetLayerStrokeDashArrayGap): LayerState => {
  let currentState = state;
  // const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  // let strokeLayer = paperLayer;
  // if (layerItem.type === 'Text') {
  //   strokeLayer = paperLayer.getItem({data: {id: 'textLines'}});
  // }
  // const dashArray = layerItem.style.strokeOptions.dashArray;
  // const newDashArray = [layerItem.style.strokeOptions.dashArray[0], action.payload.strokeDashArrayGap];
  // strokeLayer.dashArray = newDashArray;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          strokeOptions: {
            ...currentState.byId[action.payload.id].style.strokeOptions,
            dashArray: [currentState.byId[action.payload.id].style.strokeOptions.dashArray[0], action.payload.strokeDashArrayGap]
          }
        }
      }
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['dashArrayGap']);
  return currentState;
};

export const setLayersStrokeDashArrayGap = (state: LayerState, action: SetLayersStrokeDashArrayGap): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerStrokeDashArrayGap(result, layerActions.setLayerStrokeDashArrayGap({id: current, strokeDashArrayGap: action.payload.strokeDashArrayGap}) as SetLayerStrokeDashArrayGap);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Stroke Dash Array Gap',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const enableLayerShadow = (state: LayerState, action: EnableLayerShadow): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          shadow: {
            ...currentState.byId[action.payload.id].style.shadow,
            enabled: true
          }
        }
      }
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['shadowColor', 'shadowOffsetX', 'shadowOffsetY', 'shadowBlur']);
  return currentState;
};

export const enableLayersShadow = (state: LayerState, action: EnableLayersShadow): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return enableLayerShadow(result, layerActions.enableLayerShadow({id: current}) as EnableLayerShadow);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Enable Layers Shadow',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const disableLayerShadow = (state: LayerState, action: DisableLayerShadow): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          shadow: {
            ...currentState.byId[action.payload.id].style.shadow,
            enabled: false
          }
        }
      }
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['shadowColor', 'shadowOffsetX', 'shadowOffsetY', 'shadowBlur']);
  return currentState;
};

export const disableLayersShadow = (state: LayerState, action: DisableLayersShadow): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return disableLayerShadow(result, layerActions.disableLayerShadow({id: current}) as DisableLayerShadow);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Disable Layers Shadow',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerShadowColor = (state: LayerState, action: SetLayerShadowColor): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          shadow: {
            ...currentState.byId[action.payload.id].style.shadow,
            color: action.payload.shadowColor
          }
        }
      }
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['shadowColor']);
  return currentState;
};

export const setLayersShadowColor = (state: LayerState, action: SetLayersShadowColor): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerShadowColor(result, layerActions.setLayerShadowColor({id: current, shadowColor: action.payload.shadowColor}) as SetLayerShadowColor);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Shadow Color',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerShadowBlur = (state: LayerState, action: SetLayerShadowBlur): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          shadow: {
            ...currentState.byId[action.payload.id].style.shadow,
            blur: action.payload.shadowBlur
          }
        }
      }
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['shadowBlur']);
  return currentState;
};

export const setLayersShadowBlur = (state: LayerState, action: SetLayersShadowBlur): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerShadowBlur(result, layerActions.setLayerShadowBlur({id: current, shadowBlur: action.payload.shadowBlur}) as SetLayerShadowBlur);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Shadow Blur',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerShadowXOffset = (state: LayerState, action: SetLayerShadowXOffset): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          shadow: {
            ...currentState.byId[action.payload.id].style.shadow,
            offset: {
              ...currentState.byId[action.payload.id].style.shadow.offset,
              x: action.payload.shadowXOffset
            }
          }
        }
      }
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['shadowOffsetX']);
  return currentState;
};

export const setLayersShadowXOffset = (state: LayerState, action: SetLayersShadowXOffset): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerShadowXOffset(result, layerActions.setLayerShadowXOffset({id: current, shadowXOffset: action.payload.shadowXOffset}) as SetLayerShadowXOffset);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Shadow X Offset',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerShadowYOffset = (state: LayerState, action: SetLayerShadowYOffset): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          shadow: {
            ...currentState.byId[action.payload.id].style.shadow,
            offset: {
              ...currentState.byId[action.payload.id].style.shadow.offset,
              y: action.payload.shadowYOffset
            }
          }
        }
      }
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['shadowOffsetY']);
  return currentState;
};

export const setLayersShadowYOffset = (state: LayerState, action: SetLayersShadowYOffset): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerShadowYOffset(result, layerActions.setLayerShadowYOffset({id: current, shadowYOffset: action.payload.shadowYOffset}) as SetLayerShadowYOffset);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Shadow Y Offset',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const scaleLayer = (state: LayerState, action: ScaleLayer): LayerState => {
  let currentState = state;
  const layerItem = state.byId[action.payload.id];
  const pathData = action.payload.pathData;
  const rotation = action.payload.rotation;
  const bounds = action.payload.bounds;
  const from = action.payload.from;
  const to = action.payload.to;
  const groupParents = layerItem.type === 'Artboard' ? ['root'] : layerItem.scope.filter((id, index) => index !== 0 && index !== 1);
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        transform: {
          ...currentState.byId[action.payload.id].transform,
          horizontalFlip: action.payload.horizontalFlip ? !currentState.byId[action.payload.id].transform.horizontalFlip : currentState.byId[action.payload.id].transform.horizontalFlip,
          verticalFlip: action.payload.verticalFlip ? !currentState.byId[action.payload.id].transform.verticalFlip : currentState.byId[action.payload.id].transform.verticalFlip
        }
      }
    }
  }
  if (pathData) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          pathData: action.payload.pathData
        } as Btwx.Shape
      }
    }
    currentState = setShapeIcon(currentState, action.payload.id, action.payload.pathData);
  }
  if (rotation) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          transform: {
            ...currentState.byId[action.payload.id].transform,
            rotation: rotation
          }
        }
      }
    }
    currentState = updateLayerTweensByProps(currentState, action.payload.id, ['rotation']);
  }
  if (from) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          from: from
        } as Btwx.Line
      }
    }
    currentState = updateLayerTweensByProps(currentState, action.payload.id, ['fromX', 'fromY']);
  }
  if (to) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          to: to
        } as Btwx.Line
      }
    }
    currentState = updateLayerTweensByProps(currentState, action.payload.id, ['toX', 'toY']);
  }
  if (bounds) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          frame: {
            ...currentState.byId[action.payload.id].frame,
            ...bounds
          }
        }
      }
    }
    currentState = updateLayerTweensByProps(currentState, action.payload.id, ['width', 'height', 'x', 'y']);
  }
  if (groupParents.length > 0) {
    currentState = groupParents.reduce((result, current) => {
      const groupItem = result.byId[current];
      const layersBounds = getLayersRelativeBounds(result, groupItem.children);
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            frame: {
              ...result.byId[current].frame,
              x: layersBounds.center.x,
              y: layersBounds.center.y,
              innerWidth: layersBounds.width,
              innerHeight: layersBounds.height,
              width: layersBounds.width,
              height: layersBounds.height,
            }
          }
        }
      }
      return result;
    }, currentState);
  }
  return currentState;
};

export const scaleLayers = (state: LayerState, action: ScaleLayers): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerItem = currentState.byId[current];
    const layerProject = layerItem.artboard;
    const pathData = action.payload.pathData ? action.payload.pathData[current] : null;
    const rotation = action.payload.rotation ? action.payload.rotation[current] : null;
    const bounds = action.payload.bounds ? action.payload.bounds[current] : null;
    const from = action.payload.from ? action.payload.from[current] : null;
    const to = action.payload.to ? action.payload.to[current] : null;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    if (layerItem.type === 'Group') {
      const layerAndDescendants = getLayerAndDescendants(result, current);
      return layerAndDescendants.reduce((lr, lc) => {
        return scaleLayer(lr, layerActions.scaleLayer({
          id: lc,
          scale: action.payload.scale,
          verticalFlip: action.payload.verticalFlip,
          horizontalFlip: action.payload.horizontalFlip,
          pathData, rotation, bounds, from, to
        }) as ScaleLayer);
      }, result);
    } else {
      return scaleLayer(result, layerActions.scaleLayer({
        id: current,
        scale: action.payload.scale,
        verticalFlip: action.payload.verticalFlip,
        horizontalFlip: action.payload.horizontalFlip,
        pathData, rotation, bounds, from, to
      }) as ScaleLayer);
    }
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Resize Layers',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerText = (state: LayerState, action: SetLayerText): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const groupParents = layerItem.scope.filter((id, index) => index !== 0 && index !== 1);
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        frame: action.payload.bounds ? {
          ...currentState.byId[action.payload.id].frame,
          ...action.payload.bounds
        } : currentState.byId[action.payload.id].frame,
        text: action.payload.text,
        lines: action.payload.lines ? action.payload.lines : action.payload.text.split(/\r\n|\r|\n/).reduce((result, current) => {
          return [...result, {
            text: current
          }];
        }, [])
      } as Btwx.Text
    }
  }
  if (groupParents.length > 0) {
    currentState = groupParents.reduce((result, current) => {
      const groupItem = result.byId[current];
      const layersBounds = getLayersRelativeBounds(result, groupItem.children);
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            frame: {
              ...result.byId[current].frame,
              x: layersBounds.center.x,
              y: layersBounds.center.y,
              width: layersBounds.width,
              height: layersBounds.height,
              innerWidth: layersBounds.width,
              innerHeight: layersBounds.height
            }
          }
        }
      }
      return result;
    }, currentState);
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['pointX', 'pointY', 'text']);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layer Text',
      projects: [layerItem.artboard]
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerFontSize = (state: LayerState, action: SetLayerFontSize): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const groupParents = layerItem.scope.filter((id, index) => index !== 0 && index !== 1);
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        frame: action.payload.bounds ? {
          ...currentState.byId[action.payload.id].frame,
          ...action.payload.bounds
        } : currentState.byId[action.payload.id].frame,
        textStyle: {
          ...(currentState.byId[action.payload.id] as Btwx.Text).textStyle,
          fontSize: action.payload.fontSize
        },
        lines: action.payload.lines ? action.payload.lines : (currentState.byId[action.payload.id] as Btwx.Text).lines
      } as Btwx.Text
    }
  }
  if (groupParents.length > 0) {
    currentState = groupParents.reduce((result, current) => {
      const groupItem = result.byId[current];
      const layersBounds = getLayersRelativeBounds(result, groupItem.children);
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            frame: {
              ...result.byId[current].frame,
              x: layersBounds.center.x,
              y: layersBounds.center.y,
              width: layersBounds.width,
              height: layersBounds.height,
              innerWidth: layersBounds.width,
              innerHeight: layersBounds.height
            }
          }
        }
      }
      return result;
    }, currentState);
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['fontSize', 'pointX']);
  return currentState;
};

export const setLayersFontSize = (state: LayerState, action: SetLayersFontSize): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current, index) => {
    const layerProject = currentState.byId[current].artboard;
    const bounds = action.payload.bounds ? action.payload.bounds[index] : null;
    const lines = action.payload.lines ? action.payload.lines[index] : null;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerFontSize(result, layerActions.setLayerFontSize({id: current, fontSize: action.payload.fontSize, bounds: bounds, lines: lines}) as SetLayerFontSize);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Font Size',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerFontWeight = (state: LayerState, action: SetLayerFontWeight): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const groupParents = layerItem.scope.filter((id, index) => index !== 0 && index !== 1);
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        frame: action.payload.bounds ? {
          ...currentState.byId[action.payload.id].frame,
          ...action.payload.bounds
        } : currentState.byId[action.payload.id].frame,
        textStyle: {
          ...(currentState.byId[action.payload.id] as Btwx.Text).textStyle,
          fontWeight: action.payload.fontWeight
        },
        lines: action.payload.lines ? action.payload.lines : (currentState.byId[action.payload.id] as Btwx.Text).lines
      } as Btwx.Text
    }
  }
  if (groupParents.length > 0) {
    currentState = groupParents.reduce((result, current) => {
      const groupItem = result.byId[current];
      const layersBounds = getLayersRelativeBounds(result, groupItem.children);
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            frame: {
              ...result.byId[current].frame,
              x: layersBounds.center.x,
              y: layersBounds.center.y,
              width: layersBounds.width,
              height: layersBounds.height,
              innerWidth: layersBounds.width,
              innerHeight: layersBounds.height
            }
          }
        }
      }
      return result;
    }, currentState);
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['fontWeight', 'pointX']);
  return currentState;
};

export const setLayersFontWeight = (state: LayerState, action: SetLayersFontWeight): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current, index) => {
    const layerProject = currentState.byId[current].artboard;
    const bounds = action.payload.bounds ? action.payload.bounds[index] : null;
    const lines = action.payload.lines ? action.payload.lines[index] : null;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerFontWeight(result, layerActions.setLayerFontWeight({id: current, fontWeight: action.payload.fontWeight, bounds, lines}) as SetLayerFontWeight);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Font Weight',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerLetterSpacing = (state: LayerState, action: SetLayerLetterSpacing): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const groupParents = layerItem.scope.filter((id, index) => index !== 0 && index !== 1);
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        frame: action.payload.bounds ? {
          ...currentState.byId[action.payload.id].frame,
          ...action.payload.bounds
        } : currentState.byId[action.payload.id].frame,
        textStyle: {
          ...(currentState.byId[action.payload.id] as Btwx.Text).textStyle,
          letterSpacing: action.payload.letterSpacing
        },
        lines: action.payload.lines ? action.payload.lines : (currentState.byId[action.payload.id] as Btwx.Text).lines
      } as Btwx.Text
    }
  }
  if (groupParents.length > 0) {
    currentState = groupParents.reduce((result, current) => {
      const groupItem = result.byId[current];
      const layersBounds = getLayersRelativeBounds(result, groupItem.children);
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            frame: {
              ...result.byId[current].frame,
              x: layersBounds.center.x,
              y: layersBounds.center.y,
              width: layersBounds.width,
              height: layersBounds.height,
              innerWidth: layersBounds.width,
              innerHeight: layersBounds.height
            }
          }
        }
      }
      return result;
    }, currentState);
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['letterSpacing']);
  return currentState;
};

export const setLayersLetterSpacing = (state: LayerState, action: SetLayersLetterSpacing): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current, index) => {
    const layerProject = currentState.byId[current].artboard;
    const bounds = action.payload.bounds ? action.payload.bounds[index] : null;
    const lines = action.payload.lines ? action.payload.lines[index] : null;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerLetterSpacing(result, layerActions.setLayerLetterSpacing({id: current, letterSpacing: action.payload.letterSpacing, bounds, lines}) as SetLayerLetterSpacing);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Letter Spacing',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerFontFamily = (state: LayerState, action: SetLayerFontFamily): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const groupParents = layerItem.scope.filter((id, index) => index !== 0 && index !== 1);
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        frame: action.payload.bounds ? {
          ...currentState.byId[action.payload.id].frame,
          ...action.payload.bounds
        } : currentState.byId[action.payload.id].frame,
        textStyle: {
          ...(currentState.byId[action.payload.id] as Btwx.Text).textStyle,
          fontFamily: action.payload.fontFamily
        },
        lines: action.payload.lines ? action.payload.lines : (currentState.byId[action.payload.id] as Btwx.Text).lines
      } as Btwx.Text
    }
  }
  if (groupParents.length > 0) {
    currentState = groupParents.reduce((result, current) => {
      const groupItem = result.byId[current];
      const layersBounds = getLayersRelativeBounds(result, groupItem.children);
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            frame: {
              ...result.byId[current].frame,
              x: layersBounds.center.x,
              y: layersBounds.center.y,
              width: layersBounds.width,
              height: layersBounds.height,
              innerWidth: layersBounds.width,
              innerHeight: layersBounds.height
            }
          }
        }
      }
      return result;
    }, currentState);
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['pointX', 'pointY']);
  return currentState;
};

export const setLayersFontFamily = (state: LayerState, action: SetLayersFontFamily): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current, index) => {
    const layerProject = currentState.byId[current].artboard;
    const bounds = action.payload.bounds ? action.payload.bounds[index] : null;
    const lines = action.payload.lines ? action.payload.lines[index] : null;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerFontFamily(result, layerActions.setLayerFontFamily({id: current, fontFamily: action.payload.fontFamily, bounds, lines}) as SetLayerFontFamily);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Font Family',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerLeading = (state: LayerState, action: SetLayerLeading): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const groupParents = layerItem.scope.filter((id, index) => index !== 0 && index !== 1);
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        frame: action.payload.bounds ? {
          ...currentState.byId[action.payload.id].frame,
          ...action.payload.bounds
        } : currentState.byId[action.payload.id].frame,
        textStyle: {
          ...(currentState.byId[action.payload.id] as Btwx.Text).textStyle,
          leading: action.payload.leading
        }
      } as Btwx.Text
    }
  }
  if (groupParents.length > 0) {
    currentState = groupParents.reduce((result, current) => {
      const groupItem = result.byId[current];
      const layersBounds = getLayersRelativeBounds(result, groupItem.children);
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            frame: {
              ...result.byId[current].frame,
              x: layersBounds.center.x,
              y: layersBounds.center.y,
              width: layersBounds.width,
              height: layersBounds.height,
              innerWidth: layersBounds.width,
              innerHeight: layersBounds.height
            }
          }
        }
      }
      return result;
    }, currentState);
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['lineHeight']);
  return currentState;
};

export const setLayersLeading = (state: LayerState, action: SetLayersLeading): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current, index) => {
    const layerProject = currentState.byId[current].artboard;
    const bounds = action.payload.bounds ? action.payload.bounds[index] : null;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerLeading(result, layerActions.setLayerLeading({id: current, leading: action.payload.leading, bounds}) as SetLayerLeading);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Leading',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerJustification = (state: LayerState, action: SetLayerJustification): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id] as Btwx.Text;
  const oldJustification = layerItem.textStyle.justification;
  const newJustification = action.payload.justification;
  const oldPointX = layerItem.point.x;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        textStyle: {
          ...(currentState.byId[action.payload.id] as Btwx.Text).textStyle,
          justification: action.payload.justification
        },
        point: {
          ...(currentState.byId[action.payload.id] as Btwx.Text).point,
          x: (() => {
            switch(oldJustification) {
              case 'left':
                switch(newJustification) {
                  case 'left':
                    return oldPointX;
                  case 'center':
                    return oldPointX + (layerItem.frame.innerWidth / 2);
                  case 'right':
                    return oldPointX + layerItem.frame.innerWidth;
                }
                break;
              case 'center':
                switch(newJustification) {
                  case 'left':
                    return oldPointX - (layerItem.frame.innerWidth / 2);
                  case 'center':
                    return oldPointX;
                  case 'right':
                    return oldPointX + (layerItem.frame.innerWidth / 2);
                }
                break;
              case 'right':
                switch(newJustification) {
                  case 'left':
                    return oldPointX - layerItem.frame.innerWidth;
                  case 'center':
                    return oldPointX - (layerItem.frame.innerWidth / 2);
                  case 'right':
                    return oldPointX;
                }
                break;
            }
          })()
        }
      } as Btwx.Text
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['pointX', 'justification']);
  return currentState;
};

export const setLayersJustification = (state: LayerState, action: SetLayersJustification): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current, index) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerJustification(result, layerActions.setLayerJustification({id: current, justification: action.payload.justification}) as SetLayerJustification);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Justification',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerOblique = (state: LayerState, action: SetLayerOblique): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const groupParents = layerItem.scope.filter((id, index) => index !== 0 && index !== 1);
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        frame: action.payload.bounds ? {
          ...currentState.byId[action.payload.id].frame,
          ...action.payload.bounds
        } : currentState.byId[action.payload.id].frame,
        textStyle: {
          ...(currentState.byId[action.payload.id] as Btwx.Text).textStyle,
          oblique: action.payload.oblique
        }
      } as Btwx.Text
    }
  }
  if (groupParents.length > 0) {
    currentState = groupParents.reduce((result, current) => {
      const groupItem = result.byId[current];
      const layersBounds = getLayersRelativeBounds(result, groupItem.children);
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            frame: {
              ...result.byId[current].frame,
              x: layersBounds.center.x,
              y: layersBounds.center.y,
              width: layersBounds.width,
              height: layersBounds.height,
              innerWidth: layersBounds.width,
              innerHeight: layersBounds.height
            }
          }
        }
      }
      return result;
    }, currentState);
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['oblique']);
  return currentState;
};

export const setLayersOblique = (state: LayerState, action: SetLayersOblique): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current, index) => {
    const layerProject = currentState.byId[current].artboard;
    const bounds = action.payload.bounds ? action.payload.bounds[index] : null;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerOblique(result, layerActions.setLayerOblique({id: current, oblique: action.payload.oblique, bounds}) as SetLayerOblique);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Oblique',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerPointX = (state: LayerState, action: SetLayerPointX): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id] as Btwx.Text;
  const groupParents = layerItem.scope.filter((id, index) => index !== 0 && index !== 1);
  const diff = action.payload.x - layerItem.point.x;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        frame: {
          ...currentState.byId[action.payload.id].frame,
          x: currentState.byId[action.payload.id].frame.x + diff
        },
        point: {
          ...(currentState.byId[action.payload.id] as Btwx.Text).point,
          x: action.payload.x
        }
      } as Btwx.Text
    }
  }
  if (groupParents.length > 0) {
    currentState = groupParents.reduce((result, current) => {
      const groupItem = result.byId[current];
      const layersBounds = getLayersRelativeBounds(result, groupItem.children);
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            frame: {
              ...result.byId[current].frame,
              x: layersBounds.center.x,
              y: layersBounds.center.y,
              width: layersBounds.width,
              height: layersBounds.height,
              innerWidth: layersBounds.width,
              innerHeight: layersBounds.height
            }
          }
        }
      }
      return result;
    }, currentState);
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['pointX']);
  return currentState;
};

export const setLayersPointX = (state: LayerState, action: SetLayersPointX): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerPointX(result, layerActions.setLayerPointX({id: current, x: action.payload.x}) as SetLayerPointX);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Point X',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerPointY = (state: LayerState, action: SetLayerPointY): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id] as Btwx.Text;
  const groupParents = layerItem.scope.filter((id, index) => index !== 0 && index !== 1);
  const diff = action.payload.y - layerItem.point.y;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        frame: {
          ...currentState.byId[action.payload.id].frame,
          y: currentState.byId[action.payload.id].frame.y + diff
        },
        point: {
          ...(currentState.byId[action.payload.id] as Btwx.Text).point,
          y: action.payload.y
        }
      } as Btwx.Text
    }
  }
  if (groupParents.length > 0) {
    currentState = groupParents.reduce((result, current) => {
      const groupItem = result.byId[current];
      const layersBounds = getLayersRelativeBounds(result, groupItem.children);
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            frame: {
              ...result.byId[current].frame,
              x: layersBounds.center.x,
              y: layersBounds.center.y,
              width: layersBounds.width,
              height: layersBounds.height,
              innerWidth: layersBounds.width,
              innerHeight: layersBounds.height
            }
          }
        }
      }
      return result;
    }, currentState);
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['pointY']);
  return currentState;
};

export const setLayersPointY = (state: LayerState, action: SetLayersPointY): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerPointY(result, layerActions.setLayerPointY({id: current, y: action.payload.y}) as SetLayerPointY);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Point Y',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const addLayersMask = (state: LayerState, action: AddLayersMask): LayerState => {
  let currentState = state;
  const maskId = action.payload.layers[0];
  const maskItem = state.byId[maskId] as Btwx.Shape;
  if (!maskItem.mask) {
    currentState = toggleLayerMask(currentState, layerActions.toggleLayerMask({id: action.payload.layers[0]}) as ToggleLayerMask);
  }
  currentState = groupLayers(currentState, layerActions.groupLayers({layers: action.payload.layers, group: action.payload.group}) as GroupLayers);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Add Layers Mask',
      projects: currentState.edit.projects,
      treeEdit: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const toggleLayerMask = (state: LayerState, action: ToggleLayerMask): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id] as Btwx.MaskableLayer;
  const isMask = layerItem.type === 'Shape' && (layerItem as Btwx.Shape).mask;
  const underlyingSiblings = getLayerYoungerSiblings(currentState, action.payload.id);
  const maskableUnderlyingSiblings = getMaskableSiblings(currentState, action.payload.id, underlyingSiblings);
  const siblingsWithUnderlyingMask = getSiblingLayersWithUnderlyingMask(currentState, action.payload.id, underlyingSiblings);
  if (isMask) {
    underlyingSiblings.forEach((sibling) => {
      if (maskableUnderlyingSiblings.includes(sibling)) {
        if (!layerItem.masked) {
          currentState = setLayerMasked(currentState, layerActions.setLayerMasked({id: sibling, masked: false}) as SetLayerMasked);
        }
      }
      if (siblingsWithUnderlyingMask.includes(sibling)) {
        currentState = setLayerUnderlyingMask(currentState, layerActions.setLayerUnderlyingMask({id: sibling, underlyingMask: layerItem.underlyingMask}) as SetLayerUnderlyingMask);
      }
    });
  } else {
    if (maskableUnderlyingSiblings.length > 0) {
      maskableUnderlyingSiblings.forEach((sibling) => {
        const siblingItem = currentState.byId[sibling] as Btwx.MaskableLayer;
        currentState = setLayerUnderlyingMask(currentState, layerActions.setLayerUnderlyingMask({id: sibling, underlyingMask: action.payload.id}) as SetLayerUnderlyingMask);
        if (!siblingItem.masked) {
          currentState = setLayerMasked(currentState, layerActions.setLayerMasked({id: sibling, masked: true}) as SetLayerMasked);
        }
      });
    }
  }
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        mask: !(currentState.byId[action.payload.id] as Btwx.Shape).mask
      } as Btwx.Shape
    }
  };
  return currentState;
};

export const toggleLayersMask = (state: LayerState, action: ToggleLayersMask): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return toggleLayerMask(result, layerActions.toggleLayerMask({id: current}) as ToggleLayerMask);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Toggle Layers Mask',
      projects,
      treeEdit: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerUnderlyingMask = (state: LayerState, action: SetLayerUnderlyingMask): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        underlyingMask: action.payload.underlyingMask
      } as Btwx.MaskableLayer
    }
  }
  return currentState;
};

export const setLayersUnderlyingMask = (state: LayerState, action: SetLayersUnderlyingMask): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerUnderlyingMask(result, layerActions.setLayerUnderlyingMask({id: current, underlyingMask: action.payload.underlyingMask}) as SetLayerUnderlyingMask);
  }, currentState);
  return currentState;
};

export const toggleLayerIgnoreUnderlyingMask = (state: LayerState, action: ToggleLayerIgnoreUnderlyingMask): LayerState => {
  let currentState = state;
  const layerItemLayers = getItemLayers(currentState, action.payload.id);
  const layerItem = layerItemLayers.layerItem as Btwx.MaskableLayer;
  const isMask = layerItem.type === 'Shape' && (layerItem as Btwx.Shape).mask;
  const parentItem = state.byId[layerItem.parent];
  const layerIndex = parentItem.children.indexOf(action.payload.id);
  const aboveSiblingId = layerIndex !== 0 ? parentItem.children[layerIndex - 1] : null;
  const aboveSiblingItemLayers = aboveSiblingId ? getItemLayers(currentState, aboveSiblingId) as { layerItem: Btwx.MaskableLayer; paperLayer: paper.Item } : null;
  const aboveSiblingItem = aboveSiblingId ? aboveSiblingItemLayers.layerItem : null;
  const isAboveSiblingMask = aboveSiblingItem && aboveSiblingItem.type === 'Shape' && (aboveSiblingItem as Btwx.Shape).mask;
  const isAboveSiblingMasked = aboveSiblingItem && aboveSiblingItem.masked;
  const maskableUnderlyingSiblings = getMaskableSiblings(currentState, action.payload.id);
  if (layerItem.ignoreUnderlyingMask) {
    if (layerItem.underlyingMask && (isAboveSiblingMasked || isAboveSiblingMask)) {
      currentState = setLayersMasked(currentState, layerActions.setLayersMasked({layers: [...maskableUnderlyingSiblings, action.payload.id], masked: true}) as SetLayersMasked);
    }
  } else {
    if (layerItem.underlyingMask && layerItem.masked) {
      if (maskableUnderlyingSiblings.length > 0 && !isMask) {
        maskableUnderlyingSiblings.reverse().forEach((sibling) => {
          currentState = setLayerMasked(currentState, layerActions.setLayerMasked({id: sibling, masked: false}) as SetLayerMasked);
        });
      }
      currentState = setLayerMasked(currentState, layerActions.setLayerMasked({id: action.payload.id, masked: false}) as SetLayerMasked);
    }
  }
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        ignoreUnderlyingMask: !(currentState.byId[action.payload.id] as Btwx.MaskableLayer).ignoreUnderlyingMask
      } as Btwx.MaskableLayer
    }
  }
  return currentState;
};

export const toggleLayersIgnoreUnderlyingMask = (state: LayerState, action: ToggleLayersIgnoreUnderlyingMask): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return toggleLayerIgnoreUnderlyingMask(result, layerActions.toggleLayerIgnoreUnderlyingMask({id: current}) as ToggleLayerIgnoreUnderlyingMask);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Toggle Layers Ignore Underlying Mask',
      projects,
      treeEdit: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerMasked = (state: LayerState, action: SetLayerMasked): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        masked: action.payload.masked
      } as Btwx.MaskableLayer
    }
  }
  return currentState;
};

export const setLayersMasked = (state: LayerState, action: SetLayersMasked): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerMasked(result, layerActions.setLayerMasked({id: current, masked: action.payload.masked}) as SetLayerMasked);
  }, currentState);
  return currentState;
};

export const alignLayersToLeft = (state: LayerState, action: AlignLayersToLeft): LayerState => {
  let currentState = state;
  const orderedLayersByLeft = orderLayersByLeft(currentState, action.payload.layers);
  const leftMostLayer = orderedLayersByLeft[0];
  const leftMostLayerItem = currentState.byId[leftMostLayer];
  const left = leftMostLayerItem.frame.x - (leftMostLayerItem.frame.width / 2);
  const leftMostArtboardItem = currentState.byId[leftMostLayerItem.artboard];
  const leftMostArtboardLeft = leftMostArtboardItem.frame.x - (leftMostArtboardItem.frame.width / 2);
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerItem = result.byId[current];
    const layerProject = layerItem.artboard;
    const artboardItem = result.byId[layerProject];
    const artboardLeft = artboardItem.frame.x - (artboardItem.frame.width / 2);
    const artboardDiff = layerItem.type === 'Artboard' ? 0 : leftMostArtboardLeft - artboardLeft;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    result = setLayerLeft(result, layerActions.setLayerLeft({id: current, left: left + artboardDiff}) as SetLayerLeft);
    return result;
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Align Layers To Left',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const alignLayersToCenter = (state: LayerState, action: AlignLayersToCenter): LayerState => {
  let currentState = state;
  const layerBounds = getLayersBounds(currentState, action.payload.layers);
  const center = layerBounds.center.x;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerItem = result.byId[current];
    const layerProject = layerItem.artboard;
    const artboardItem = result.byId[layerProject];
    const artboardCenter = artboardItem.frame.x;
    const x = layerItem.type === 'Artboard' ? artboardCenter : layerItem.frame.x + artboardCenter;
    const diff = center - x;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    result = setLayerCenter(result, layerActions.setLayerCenter({id: current, center: layerItem.frame.x + diff}) as SetLayerCenter);
    return result;
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Align Layers To Bottom',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const alignLayersToRight = (state: LayerState, action: AlignLayersToRight): LayerState => {
  let currentState = state;
  const orderedLayersByLeft = orderLayersByRight(currentState, action.payload.layers);
  const rightMostLayer = orderedLayersByLeft[0];
  const rightMostLayerItem = currentState.byId[rightMostLayer];
  const right = rightMostLayerItem.frame.x + (rightMostLayerItem.frame.width / 2);
  const rightMostArtboardItem = currentState.byId[rightMostLayerItem.artboard];
  const rightMostArtboardRight = rightMostArtboardItem.frame.x + (rightMostArtboardItem.frame.width / 2);
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerItem = result.byId[current];
    const layerProject = layerItem.artboard;
    const artboardItem = result.byId[layerProject];
    const artboardRight = artboardItem.frame.x + (artboardItem.frame.width / 2);
    const artboardDiff = layerItem.type === 'Artboard' ? 0 : rightMostArtboardRight - artboardRight;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    result = setLayerRight(result, layerActions.setLayerRight({id: current, right: right + artboardDiff}) as SetLayerRight);
    return result;
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Align Layers To Right',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const alignLayersToTop = (state: LayerState, action: AlignLayersToTop): LayerState => {
  let currentState = state;
  const orderedLayersByTop = orderLayersByTop(currentState, action.payload.layers);
  const topMostLayer = orderedLayersByTop[0];
  const topMostLayerItem = currentState.byId[topMostLayer];
  const top = topMostLayerItem.frame.y - (topMostLayerItem.frame.height / 2);
  const topMostArtboardItem = currentState.byId[topMostLayerItem.artboard];
  const topMostArtboardTop = topMostArtboardItem.frame.y - (topMostArtboardItem.frame.height / 2);
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerItem = result.byId[current];
    const layerProject = layerItem.artboard;
    const artboardItem = result.byId[layerProject];
    const artboardTop = artboardItem.frame.y - (artboardItem.frame.height / 2);
    const artboardDiff = layerItem.type === 'Artboard' ? 0 : topMostArtboardTop - artboardTop;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    result = setLayerTop(result, layerActions.setLayerTop({id: current, top: top + artboardDiff}) as SetLayerTop);
    return result;
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Align Layers To Top',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const alignLayersToMiddle = (state: LayerState, action: AlignLayersToMiddle): LayerState => {
  let currentState = state;
  const orderedLayersByMiddle = orderLayersByMiddle(currentState, action.payload.layers);
  const middleMostLayer = orderedLayersByMiddle[0];
  const middleMostLayerItem = currentState.byId[middleMostLayer];
  const middle = middleMostLayerItem.frame.y;
  const middleMostArtboardItem = currentState.byId[middleMostLayerItem.artboard];
  const middleMostArtboardMiddle = middleMostArtboardItem.frame.y;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerItem = result.byId[current];
    const layerProject = layerItem.artboard;
    const artboardItem = result.byId[layerProject];
    const artboardMiddle = artboardItem.frame.y;
    const artboardDiff = layerItem.type === 'Artboard' ? 0 : middleMostArtboardMiddle - artboardMiddle;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    result = setLayerMiddle(result, layerActions.setLayerMiddle({id: current, middle: middle + artboardDiff}) as SetLayerMiddle);
    return result;
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Align Layers To Middle',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const alignLayersToBottom = (state: LayerState, action: AlignLayersToBottom): LayerState => {
  let currentState = state;
  const orderedLayersByBottom = orderLayersByBottom(currentState, action.payload.layers);
  const bottomMostLayer = orderedLayersByBottom[0];
  const bottomMostLayerItem = currentState.byId[bottomMostLayer];
  const bottom = bottomMostLayerItem.frame.y + (bottomMostLayerItem.frame.height / 2);
  const bottomMostArtboardItem = currentState.byId[bottomMostLayerItem.artboard];
  const bottomMostArtboardBottom = bottomMostArtboardItem.frame.y + (bottomMostArtboardItem.frame.height / 2);
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerItem = result.byId[current];
    const layerProject = layerItem.artboard;
    const artboardItem = result.byId[layerProject];
    const artboardBottom = artboardItem.frame.y + (artboardItem.frame.height / 2);
    const artboardDiff = layerItem.type === 'Artboard' ? 0 : bottomMostArtboardBottom - artboardBottom;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    result = setLayerBottom(result, layerActions.setLayerBottom({id: current, bottom: bottom + artboardDiff}) as SetLayerBottom);
    return result;
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Align Layers To Bottom',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const distributeLayersHorizontally = (state: LayerState, action: DistributeLayersHorizontally): LayerState => {
  let currentState = state;
  const layersBounds = getLayersBounds(currentState, action.payload.layers);
  const projects: string[] = [];
  const layersWidth = action.payload.layers.reduce((result, current) => {
    const layerItem = currentState.byId[current];
    const layerProject = layerItem.artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    result = result + layerItem.frame.width;
    return result;
  }, 0);
  const diff = (layersBounds.width - layersWidth) / (action.payload.layers.length - 1);
  const orderedLayers = orderLayersByLeft(currentState, action.payload.layers);
  currentState = orderedLayers.reduce((result: LayerState, current: string, index: number) => {
    if (index !== 0 && index !== orderedLayers.length - 1) {
      const prevLayer = orderedLayers[index - 1];
      const prevItem = result.byId[prevLayer];
      const prevItemRight = prevItem.frame.x + (prevItem.frame.width / 2);
      result = setLayerLeft(result, layerActions.setLayerLeft({id: current, left: prevItemRight + diff}) as SetLayerLeft);
    }
    return result;
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Distribute Layers To Horizontally',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const distributeLayersVertically = (state: LayerState, action: DistributeLayersVertically): LayerState => {
  let currentState = state;
  const layersBounds = getLayersBounds(currentState, action.payload.layers);
  const projects: string[] = [];
  const layersHeight = action.payload.layers.reduce((result, current) => {
    const layerItem = currentState.byId[current];
    const layerProject = layerItem.artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    result = result + layerItem.frame.height;
    return result;
  }, 0);
  const diff = (layersBounds.height - layersHeight) / (action.payload.layers.length - 1);
  const orderedLayers = orderLayersByTop(currentState, action.payload.layers);
  currentState = orderedLayers.reduce((result: LayerState, current: string, index: number) => {
    if (index !== 0 && index !== orderedLayers.length - 1) {
      const prevLayer = orderedLayers[index - 1];
      const prevItem = result.byId[prevLayer];
      const prevItemBottom = prevItem.frame.y + (prevItem.frame.width / 2);
      result = setLayerTop(result, layerActions.setLayerTop({id: current, top: prevItemBottom + diff}) as SetLayerTop);
    }
    return result;
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Distribute Layers To Vertically',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const duplicateLayer = (state: LayerState, action: DuplicateLayer): {
  state: LayerState;
  cloneMap: {
    [id: string]: string;
  };
} => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const groupParents = layerItem.scope.filter((id, index) => index !== 0 && index !== 1);
  const isArtboard = layerItem.type === 'Artboard';
  const layerCloneMap = getLayerAndDescendants(currentState, action.payload.id).reduce((result: { [id: string]: string }, current) => ({
    ...result,
    [current]: uuidv4()
  }), {} as { [id: string]: string });
  const dl = (cs: LayerState, id: string, index: number, offset: Btwx.Point): LayerState => {
    const itemToDuplicate = cs.byId[id];
    const duplicateId = layerCloneMap[id];
    const parent = index === 0 ? itemToDuplicate.parent : layerCloneMap[itemToDuplicate.parent];
    const showChildren = itemToDuplicate.showChildren;
    const parentLayerItem = cs.byId[parent];
    const scope = itemToDuplicate.type === 'Artboard' ? ['root'] : [...parentLayerItem.scope, parent];
    const artboard = itemToDuplicate.type === 'Artboard' ? duplicateId : scope[1];
    const underlyingMask = index === 0
                                ? !isArtboard
                                  ? (itemToDuplicate as Btwx.MaskableLayer).underlyingMask
                                  : null
                                : Object.prototype.hasOwnProperty.call(layerCloneMap, (itemToDuplicate as Btwx.MaskableLayer).underlyingMask)
                                  ? layerCloneMap[(itemToDuplicate as Btwx.MaskableLayer).underlyingMask]
                                  : (itemToDuplicate as Btwx.MaskableLayer).underlyingMask;
    const children = itemToDuplicate.children ? itemToDuplicate.children.reduce((cs, current) => {
        if (Object.prototype.hasOwnProperty.call(layerCloneMap, current)) {
          return [...cs, layerCloneMap[current]];
        } else {
          return [...cs, current];
        }
      }, [])
    : null;
    switch(itemToDuplicate.type) {
      case 'Artboard':
        cs = {
          ...cs,
          allArtboardIds: addItem(cs.allArtboardIds, duplicateId)
        }
        break;
      case 'Shape':
        cs = {
          ...cs,
          allShapeIds: addItem(cs.allShapeIds, duplicateId),
          shapeIcons: {
            ...cs.shapeIcons,
            [duplicateId]: cs.shapeIcons[id]
          }
        }
        break;
      case 'Group':
        cs = {
          ...cs,
          allGroupIds: addItem(cs.allGroupIds, duplicateId)
        }
        break;
      case 'Text':
        cs = {
          ...cs,
          allTextIds: addItem(cs.allTextIds, duplicateId)
        }
        break;
      case 'Image':
        cs = {
          ...cs,
          allImageIds: addItem(cs.allImageIds, duplicateId)
        }
        break;
    }
    cs = {
      ...cs,
      allIds: [...cs.allIds, duplicateId],
      byId: {
        ...cs.byId,
        [duplicateId]: {
          ...itemToDuplicate,
          id: duplicateId,
          parent: parent,
          artboard: artboard,
          children: children,
          scope: scope,
          underlyingMask: underlyingMask,
          events: [],
          tweens: {
            allIds: [],
            asOrigin: [],
            asDestination: [],
            byProp: TWEEN_PROPS_MAP
          }
        }
      } as any
    };
    if (isArtboard) {
      cs = {
        ...cs,
        byId: {
          ...cs.byId,
          [duplicateId]: {
            ...cs.byId[duplicateId],
            projectIndex: Math.floor(cs.byId.root.children.length / ARTBOARDS_PER_PROJECT) + 1,
          } as Btwx.Artboard
        }
      }
    }
    if (offset) {
      cs = {
        ...cs,
        byId: {
          ...cs.byId,
          [duplicateId]: {
            ...cs.byId[duplicateId],
            frame: {
              ...cs.byId[duplicateId].frame,
              x: cs.byId[duplicateId].frame.x + offset.x,
              y: cs.byId[duplicateId].frame.y + offset.y
            }
          }
        }
      }
      if (itemToDuplicate.type === 'Text') {
        cs = {
          ...cs,
          byId: {
            ...cs.byId,
            [duplicateId]: {
              ...cs.byId[duplicateId],
              point: {
                x: (cs.byId[duplicateId] as Btwx.Text).point.x + offset.x,
                y: (cs.byId[duplicateId] as Btwx.Text).point.y + offset.y
              }
            } as Btwx.Text
          }
        }
      }
      if (itemToDuplicate.type === 'Shape' && (itemToDuplicate as Btwx.Shape).shapeType === 'Line') {
        cs = {
          ...cs,
          byId: {
            ...cs.byId,
            [duplicateId]: {
              ...cs.byId[duplicateId],
              from: {
                x: (cs.byId[duplicateId] as Btwx.Line).from.x + offset.x,
                y: (cs.byId[duplicateId] as Btwx.Line).from.y + offset.y
              },
              to: {
                x: (cs.byId[duplicateId] as Btwx.Line).to.x + offset.x,
                y: (cs.byId[duplicateId] as Btwx.Line).to.y + offset.y
              },
            } as Btwx.Line
          }
        }
      }
    }
    return cs;
  }
  // duplicate layer and descendents
  currentState = Object.keys(layerCloneMap).reduce((result: LayerState, key: string, index: number) => {
    if (isArtboard) {
      return dl(result, key, index, index === 0 ? action.payload.offset : null);
    } else {
      return dl(result, key, index, action.payload.offset);
    }
  }, currentState);
  // update duplicate parent children
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [layerItem.parent]: {
        ...currentState.byId[layerItem.parent],
        children: addItem(currentState.byId[layerItem.parent].children, layerCloneMap[action.payload.id])
      } as Btwx.Group | Btwx.Artboard
    }
  }
  // update group parent bounds
  if (groupParents.length > 0) {
    currentState = groupParents.reduce((result, current) => {
      const groupItem = result.byId[current];
      const layersBounds = getLayersRelativeBounds(result, groupItem.children);
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            frame: {
              ...result.byId[current].frame,
              x: layersBounds.center.x,
              innerWidth: layersBounds.width,
              width: layersBounds.width
            }
          }
        }
      }
      return result;
    }, currentState);
  }
  // if (layerItem.id === currentState.hover) {
  //   currentState = setLayerHover(currentState, layerActions.setLayerHover({id: layerCloneMap[action.payload.id]}) as SetLayerHover);
  // }
  return {
    state: currentState,
    cloneMap: layerCloneMap
  };
};

export const duplicateLayers = (state: LayerState, action: DuplicateLayers): LayerState => {
  let currentState = state;
  let masterCloneMap: { [id: string]: string } = {};
  const projects: string[] = [];
  const newSelection: string[] = [];
  const continueChain = currentState.edit && currentState.edit.actionType === 'DUPLICATE_LAYERS' && currentState.edit.selectedEdit === currentState.selectedEdit;
  const offset = action.payload.offset ? action.payload.offset : continueChain ? currentState.edit.payload.offset : null;
  currentState = action.payload.layers.reduce((result, current) => {
    const duplicate = duplicateLayer(result, layerActions.duplicateLayer({id: current, offset: offset}) as DuplicateLayer);
    const duplicateId = duplicate.cloneMap[current];
    const layerProject = duplicate.state.byId[duplicateId].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    masterCloneMap = {...masterCloneMap, ...duplicate.cloneMap};
    newSelection.push(duplicateId);
    result = duplicate.state;
    return result;
  }, currentState);
  if (state.hover && masterCloneMap[state.hover]) {
    currentState = setLayerHover(currentState, layerActions.setLayerHover({id: masterCloneMap[state.hover]}) as SetLayerHover);
  }
  currentState = selectLayers(currentState, layerActions.selectLayers({layers: newSelection, newSelection: true}) as SelectLayers);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: {
        ...action.payload,
        offset: offset
      },
      detail: 'Duplicate Layers',
      projects: projects,
      treeEdit: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const removeDuplicatedLayers = (state: LayerState, action: RemoveDuplicatedLayers): LayerState => {
  let currentState = state;
  // remove duplicates
  currentState = removeLayers(currentState, layerActions.removeLayers({layers: action.payload.layers}) as RemoveLayers);
  // select layer
  if (action.payload.newSelection) {
    currentState = selectLayers(currentState, layerActions.selectLayers({layers: action.payload.newSelection}) as SelectLayers);
  }
  // return final state
  return currentState;
};

export const bringLayerForward = (state: LayerState, action: BringLayerForward): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const parentItem = currentState.byId[layerItem.parent];
  const layerIndex = parentItem.children.indexOf(action.payload.id);
  if (layerIndex !== parentItem.children.length - 1) {
    currentState = insertLayerAbove(currentState, layerActions.insertLayerAbove({id: action.payload.id, above: parentItem.children[layerIndex + 1]}) as InsertLayerAbove);
  }
  return currentState;
};

export const bringLayersForward = (state: LayerState, action: BringLayersForward): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reverse().reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return bringLayerForward(result, layerActions.bringLayerForward({id: current}) as BringLayerForward);
  }, currentState);
  currentState = selectLayers(currentState, layerActions.selectLayers({layers: action.payload.layers, newSelection: true}) as SelectLayers);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Bring Layers Forward',
      projects,
      treeEdit: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const bringLayerToFront = (state: LayerState, action: BringLayerToFront): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const parentItem = currentState.byId[layerItem.parent];
  const layerIndex = parentItem.children.indexOf(action.payload.id);
  if (layerIndex !== parentItem.children.length - 1) {
    currentState = insertLayerAbove(currentState, layerActions.insertLayerAbove({id: action.payload.id, above: parentItem.children[parentItem.children.length - 1]}) as InsertLayerAbove);
  }
  return currentState;
};

export const bringLayersToFront = (state: LayerState, action: BringLayersToFront): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reverse().reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return bringLayerToFront(result, layerActions.bringLayerToFront({id: current}) as BringLayerToFront);
  }, currentState);
  currentState = selectLayers(currentState, layerActions.selectLayers({layers: action.payload.layers, newSelection: true}) as SelectLayers);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Bring Layers To Front',
      projects,
      treeEdit: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const sendLayerBackward = (state: LayerState, action: SendLayerBackward): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const parentItem = currentState.byId[layerItem.parent];
  const layerIndex = parentItem.children.indexOf(action.payload.id);
  if (layerIndex !== 0) {
    currentState = insertLayerBelow(currentState, layerActions.insertLayerBelow({id: action.payload.id, below: parentItem.children[layerIndex - 1]}) as InsertLayerBelow);
  }
  return currentState;
};

export const sendLayersBackward = (state: LayerState, action: SendLayersBackward): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return sendLayerBackward(result, layerActions.sendLayerBackward({id: current}) as SendLayerBackward);
  }, currentState);
  currentState = selectLayers(currentState, layerActions.selectLayers({layers: action.payload.layers, newSelection: true}) as SelectLayers);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Send Layers Backward',
      projects,
      treeEdit: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const sendLayerToBack = (state: LayerState, action: SendLayerToBack): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const parentItem = currentState.byId[layerItem.parent];
  const layerIndex = parentItem.children.indexOf(action.payload.id);
  if (layerIndex !== 0) {
    currentState = insertLayerBelow(currentState, layerActions.insertLayerBelow({id: action.payload.id, below: parentItem.children[0]}) as InsertLayerBelow);
  }
  return currentState;
};

export const sendLayersToBack = (state: LayerState, action: SendLayersToBack): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return sendLayerToBack(result, layerActions.sendLayerToBack({id: current}) as SendLayerToBack);
  }, currentState);
  currentState = selectLayers(currentState, layerActions.selectLayers({layers: action.payload.layers, newSelection: true}) as SelectLayers);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Send Layers To Back',
      projects,
      treeEdit: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerBlendMode = (state: LayerState, action: SetLayerBlendMode): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          blendMode: action.payload.blendMode
        }
      }
    }
  }
  return currentState;
};

export const setLayersBlendMode = (state: LayerState, action: SetLayersBlendMode): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerBlendMode(result, layerActions.setLayerBlendMode({id: current, blendMode: action.payload.blendMode}) as SetLayerBlendMode);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Blend Mode',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const uniteLayers = (state: LayerState, action: UniteLayers): LayerState => {
  let currentState = state;
  currentState = insertLayerAbove(currentState, layerActions.insertLayerAbove({id: action.payload.booleanLayer.id, above: action.payload.layers[0]}) as InsertLayerAbove);
  currentState = removeLayers(currentState, layerActions.removeLayers({layers: action.payload.layers}) as RemoveLayers);
  const layerItem = state.byId[action.payload.booleanLayer.id];
  if (layerItem.style.fill.fillType === 'gradient') {
    currentState = setLayerGradient(currentState, layerActions.setLayerGradient({id: action.payload.booleanLayer.id, prop: 'fill', gradient: layerItem.style.fill.gradient}) as SetLayerGradient);
  }
  if (layerItem.style.stroke.fillType === 'gradient') {
    currentState = setLayerGradient(currentState, layerActions.setLayerGradient({id: action.payload.booleanLayer.id, prop: 'stroke', gradient: layerItem.style.stroke.gradient}) as SetLayerGradient);
  }
  return currentState;
};

export const intersectLayers = (state: LayerState, action: IntersectLayers): LayerState => {
  let currentState = state;
  currentState = insertLayerAbove(currentState, layerActions.insertLayerAbove({id: action.payload.booleanLayer.id, above: action.payload.layers[0]}) as InsertLayerAbove);
  currentState = removeLayers(currentState, layerActions.removeLayers({layers: action.payload.layers}) as RemoveLayers);
  const layerItem = state.byId[action.payload.booleanLayer.id];
  if (layerItem.style.fill.fillType === 'gradient') {
    currentState = setLayerGradient(currentState, layerActions.setLayerGradient({id: action.payload.booleanLayer.id, prop: 'fill', gradient: layerItem.style.fill.gradient}) as SetLayerGradient);
  }
  if (layerItem.style.stroke.fillType === 'gradient') {
    currentState = setLayerGradient(currentState, layerActions.setLayerGradient({id: action.payload.booleanLayer.id, prop: 'stroke', gradient: layerItem.style.stroke.gradient}) as SetLayerGradient);
  }
  return currentState;
};

export const subtractLayers = (state: LayerState, action: SubtractLayers): LayerState => {
  let currentState = state;
  currentState = insertLayerAbove(currentState, layerActions.insertLayerAbove({id: action.payload.booleanLayer.id, above: action.payload.layers[0]}) as InsertLayerAbove);
  currentState = removeLayers(currentState, layerActions.removeLayers({layers: action.payload.layers}) as RemoveLayers);
  const layerItem = state.byId[action.payload.booleanLayer.id];
  if (layerItem.style.fill.fillType === 'gradient') {
    currentState = setLayerGradient(currentState, layerActions.setLayerGradient({id: action.payload.booleanLayer.id, prop: 'fill', gradient: layerItem.style.fill.gradient}) as SetLayerGradient);
  }
  if (layerItem.style.stroke.fillType === 'gradient') {
    currentState = setLayerGradient(currentState, layerActions.setLayerGradient({id: action.payload.booleanLayer.id, prop: 'stroke', gradient: layerItem.style.stroke.gradient}) as SetLayerGradient);
  }
  return currentState;
};

export const excludeLayers = (state: LayerState, action: ExcludeLayers): LayerState => {
  let currentState = state;
  currentState = insertLayerAbove(currentState, layerActions.insertLayerAbove({id: action.payload.booleanLayer.id, above: action.payload.layers[0]}) as InsertLayerAbove);
  currentState = removeLayers(currentState, layerActions.removeLayers({layers: action.payload.layers}) as RemoveLayers);
  const layerItem = state.byId[action.payload.booleanLayer.id];
  if (layerItem.style.fill.fillType === 'gradient') {
    currentState = setLayerGradient(currentState, layerActions.setLayerGradient({id: action.payload.booleanLayer.id, prop: 'fill', gradient: layerItem.style.fill.gradient}) as SetLayerGradient);
  }
  if (layerItem.style.stroke.fillType === 'gradient') {
    currentState = setLayerGradient(currentState, layerActions.setLayerGradient({id: action.payload.booleanLayer.id, prop: 'stroke', gradient: layerItem.style.stroke.gradient}) as SetLayerGradient);
  }
  return currentState;
};

export const divideLayers = (state: LayerState, action: DivideLayers): LayerState => {
  let currentState = state;
  currentState = insertLayerAbove(currentState, layerActions.insertLayerAbove({id: action.payload.booleanLayer.id, above: action.payload.layers[0]}) as InsertLayerAbove);
  currentState = removeLayers(currentState, layerActions.removeLayers({layers: action.payload.layers}) as RemoveLayers);
  const layerItem = state.byId[action.payload.booleanLayer.id];
  if (layerItem.style.fill.fillType === 'gradient') {
    currentState = setLayerGradient(currentState, layerActions.setLayerGradient({id: action.payload.booleanLayer.id, prop: 'fill', gradient: layerItem.style.fill.gradient}) as SetLayerGradient);
  }
  if (layerItem.style.stroke.fillType === 'gradient') {
    currentState = setLayerGradient(currentState, layerActions.setLayerGradient({id: action.payload.booleanLayer.id, prop: 'stroke', gradient: layerItem.style.stroke.gradient}) as SetLayerGradient);
  }
  return currentState;
};

export const setRoundedRadius = (state: LayerState, action: SetRoundedRadius): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id] as Btwx.Rounded;
  const groupParents = layerItem.scope.filter((id, index) => index !== 0 && index !== 1);
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        frame: action.payload.bounds
        ? {
            ...currentState.byId[action.payload.id].frame,
            ...action.payload.bounds
          }
        : currentState.byId[action.payload.id].frame,
        radius: action.payload.radius
      } as Btwx.Rounded
    }
  }
  if (action.payload.pathData && layerItem.type === 'Shape') {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          pathData: action.payload.pathData
        } as Btwx.Shape
      }
    }
    currentState = setShapeIcon(currentState, action.payload.id, action.payload.pathData);
  }
  if (groupParents.length > 0) {
    currentState = groupParents.reduce((result, current) => {
      const groupItem = result.byId[current];
      const layersBounds = getLayersRelativeBounds(result, groupItem.children);
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            frame: {
              ...result.byId[current].frame,
              x: layersBounds.center.x,
              y: layersBounds.center.y,
              innerWidth: layersBounds.width,
              innerHeight: layersBounds.height,
              width: layersBounds.width,
              height: layersBounds.height
            }
          }
        }
      }
      return result;
    }, currentState);
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['width', 'height', 'rotation', 'shape']);
  return currentState;
};

export const setRoundedRadii = (state: LayerState, action: SetRoundedRadii): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current, index) => {
    const layerItem = currentState.byId[current];
    const layerProject = layerItem.artboard;
    const bounds = action.payload.bounds ? action.payload.bounds[index] : null;
    const pathData = action.payload.pathData ? action.payload.pathData[index] : null;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setRoundedRadius(result, layerActions.setRoundedRadius({id: current, radius: action.payload.radius, bounds, pathData}) as SetRoundedRadius);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Rounded Radii',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setPolygonSides = (state: LayerState, action: SetPolygonSides): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id] as Btwx.Polygon;
  const groupParents = layerItem.scope.filter((id, index) => index !== 0 && index !== 1);
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        frame: action.payload.bounds
        ? {
            ...currentState.byId[action.payload.id].frame,
            ...action.payload.bounds
          }
        : currentState.byId[action.payload.id].frame,
        sides: action.payload.sides
      } as Btwx.Polygon
    }
  }
  if (action.payload.pathData && layerItem.type === 'Shape') {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          pathData: action.payload.pathData
        } as Btwx.Shape
      }
    }
    currentState = setShapeIcon(currentState, action.payload.id, action.payload.pathData);
  }
  if (groupParents.length > 0) {
    currentState = groupParents.reduce((result, current) => {
      const groupItem = result.byId[current];
      const layersBounds = getLayersRelativeBounds(result, groupItem.children);
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            frame: {
              ...result.byId[current].frame,
              x: layersBounds.center.x,
              y: layersBounds.center.y,
              innerWidth: layersBounds.width,
              innerHeight: layersBounds.height,
              width: layersBounds.width,
              height: layersBounds.height
            }
          }
        }
      }
      return result;
    }, currentState);
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['width', 'height', 'rotation', 'shape']);
  return currentState;
};

export const setPolygonsSides = (state: LayerState, action: SetPolygonsSides): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current, index) => {
    const layerItem = currentState.byId[current];
    const layerProject = layerItem.artboard;
    const bounds = action.payload.bounds ? action.payload.bounds[index] : null;
    const pathData = action.payload.pathData ? action.payload.pathData[index] : null;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setPolygonSides(result, layerActions.setPolygonSides({id: current, sides: action.payload.sides, bounds, pathData}) as SetPolygonSides);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Polygons Sides',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setStarPoints = (state: LayerState, action: SetStarPoints): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id] as Btwx.Star;
  const groupParents = layerItem.scope.filter((id, index) => index !== 0 && index !== 1);
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        frame: action.payload.bounds
        ? {
            ...currentState.byId[action.payload.id].frame,
            ...action.payload.bounds
          }
        : currentState.byId[action.payload.id].frame,
        points: action.payload.points
      } as Btwx.Star
    }
  }
  if (action.payload.pathData && layerItem.type === 'Shape') {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          pathData: action.payload.pathData
        } as Btwx.Shape
      }
    }
    currentState = setShapeIcon(currentState, action.payload.id, action.payload.pathData);
  }
  if (groupParents.length > 0) {
    currentState = groupParents.reduce((result, current) => {
      const groupItem = result.byId[current];
      const layersBounds = getLayersRelativeBounds(result, groupItem.children);
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            frame: {
              ...result.byId[current].frame,
              x: layersBounds.center.x,
              y: layersBounds.center.y,
              innerWidth: layersBounds.width,
              innerHeight: layersBounds.height,
              width: layersBounds.width,
              height: layersBounds.height
            }
          }
        }
      }
      return result;
    }, currentState);
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['width', 'height', 'rotation', 'shape']);
  return currentState;
};

export const setStarsPoints = (state: LayerState, action: SetStarsPoints): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current, index) => {
    const layerItem = currentState.byId[current];
    const layerProject = layerItem.artboard;
    const bounds = action.payload.bounds ? action.payload.bounds[index] : null;
    const pathData = action.payload.pathData ? action.payload.pathData[index] : null;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setStarPoints(result, layerActions.setStarPoints({id: current, points: action.payload.points, bounds, pathData}) as SetStarPoints);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Stars Points',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setStarRadius = (state: LayerState, action: SetStarRadius): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id] as Btwx.Star;
  const groupParents = layerItem.scope.filter((id, index) => index !== 0 && index !== 1);
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        frame: action.payload.bounds
        ? {
            ...currentState.byId[action.payload.id].frame,
            ...action.payload.bounds
          }
        : currentState.byId[action.payload.id].frame,
        radius: action.payload.radius
      } as Btwx.Star
    }
  }
  if (action.payload.pathData && layerItem.type === 'Shape') {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          pathData: action.payload.pathData
        } as Btwx.Shape
      }
    }
    currentState = setShapeIcon(currentState, action.payload.id, action.payload.pathData);
  }
  if (groupParents.length > 0) {
    currentState = groupParents.reduce((result, current) => {
      const groupItem = result.byId[current];
      const layersBounds = getLayersRelativeBounds(result, groupItem.children);
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            frame: {
              ...result.byId[current].frame,
              x: layersBounds.center.x,
              y: layersBounds.center.y,
              innerWidth: layersBounds.width,
              innerHeight: layersBounds.height,
              width: layersBounds.width,
              height: layersBounds.height
            }
          }
        }
      }
      return result;
    }, currentState);
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['width', 'height', 'rotation', 'shape']);
  return currentState;
};

export const setStarsRadius = (state: LayerState, action: SetStarsRadius): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current, index) => {
    const layerItem = currentState.byId[current];
    const layerProject = layerItem.artboard;
    const bounds = action.payload.bounds ? action.payload.bounds[index] : null;
    const pathData = action.payload.pathData ? action.payload.pathData[index] : null;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setStarRadius(result, layerActions.setStarRadius({id: current, radius: action.payload.radius, bounds, pathData}) as SetStarRadius);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Stars Radius',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLineFromX = (state: LayerState, action: SetLineFromX): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id] as Btwx.Line;
  const groupParents = layerItem.scope.filter((id, index) => index !== 0 && index !== 1);
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        frame: action.payload.bounds
        ? {
            ...currentState.byId[action.payload.id].frame,
            ...action.payload.bounds
          }
        : currentState.byId[action.payload.id].frame,
        transform: action.payload.rotation
        ? {
            ...currentState.byId[action.payload.id].transform,
            rotation: action.payload.rotation
          }
        : currentState.byId[action.payload.id].transform,
        from: {
          ...(currentState.byId[action.payload.id] as Btwx.Line).from,
          x: action.payload.x
        }
      } as Btwx.Line
    }
  }
  if (action.payload.pathData && layerItem.type === 'Shape') {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          pathData: action.payload.pathData
        } as Btwx.Shape
      }
    }
    currentState = setShapeIcon(currentState, action.payload.id, action.payload.pathData);
  }
  if (groupParents.length > 0) {
    currentState = groupParents.reduce((result, current) => {
      const groupItem = result.byId[current];
      const layersBounds = getLayersRelativeBounds(result, groupItem.children);
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            frame: {
              ...result.byId[current].frame,
              x: layersBounds.center.x,
              y: layersBounds.center.y,
              innerWidth: layersBounds.width,
              innerHeight: layersBounds.height,
              width: layersBounds.width,
              height: layersBounds.height
            }
          }
        }
      }
      return result;
    }, currentState);
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['fromX']);
  if (action.payload.setEdit) {
    currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
      edit: {
        actionType: action.type,
        payload: action.payload,
        detail: 'Set Line From X',
        projects: [layerItem.artboard]
      }
    }) as SetLayerEdit);
  }
  return currentState;
};

export const setLinesFromX = (state: LayerState, action: SetLinesFromX): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current, index) => {
    const layerItem = currentState.byId[current];
    const layerProject = layerItem.artboard;
    const bounds = action.payload.bounds ? action.payload.bounds[index] : null;
    const pathData = action.payload.pathData ? action.payload.pathData[index] : null;
    const rotation = action.payload.rotation ? action.payload.rotation[index] : null;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLineFromX(result, layerActions.setLineFromX({id: current, x: action.payload.x, setEdit: false, bounds, pathData, rotation}) as SetLineFromX);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Lines From X',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLineFromY = (state: LayerState, action: SetLineFromY): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const groupParents = layerItem.scope.filter((id, index) => index !== 0 && index !== 1);
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        frame: action.payload.bounds
        ? {
            ...currentState.byId[action.payload.id].frame,
            ...action.payload.bounds
          }
        : currentState.byId[action.payload.id].frame,
        transform: action.payload.rotation
        ? {
            ...currentState.byId[action.payload.id].transform,
            rotation: action.payload.rotation
          }
        : currentState.byId[action.payload.id].transform,
        from: {
          ...(currentState.byId[action.payload.id] as Btwx.Line).from,
          y: action.payload.y
        }
      } as Btwx.Line
    }
  }
  if (action.payload.pathData && layerItem.type === 'Shape') {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          pathData: action.payload.pathData
        } as Btwx.Shape
      }
    }
    currentState = setShapeIcon(currentState, action.payload.id, action.payload.pathData);
  }
  if (groupParents.length > 0) {
    currentState = groupParents.reduce((result, current) => {
      const groupItem = result.byId[current];
      const layersBounds = getLayersRelativeBounds(result, groupItem.children);
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            frame: {
              ...result.byId[current].frame,
              x: layersBounds.center.x,
              y: layersBounds.center.y,
              innerWidth: layersBounds.width,
              innerHeight: layersBounds.height,
              width: layersBounds.width,
              height: layersBounds.height
            }
          }
        }
      }
      return result;
    }, currentState);
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['fromY']);
  if (action.payload.setEdit) {
    currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
      edit: {
        actionType: action.type,
        payload: action.payload,
        detail: 'Set Line From Y',
        projects: [layerItem.artboard]
      }
    }) as SetLayerEdit);
  }
  return currentState;
};

export const setLinesFromY = (state: LayerState, action: SetLinesFromY): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current, index) => {
    const layerItem = currentState.byId[current];
    const layerProject = layerItem.artboard;
    const bounds = action.payload.bounds ? action.payload.bounds[index] : null;
    const pathData = action.payload.pathData ? action.payload.pathData[index] : null;
    const rotation = action.payload.rotation ? action.payload.rotation[index] : null;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLineFromY(result, layerActions.setLineFromY({id: current, y: action.payload.y, setEdit: false, bounds, pathData, rotation}) as SetLineFromY);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Lines From Y',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLineFrom = (state: LayerState, action: SetLineFrom): LayerState => {
  let currentState = state;
  const layerItem = state.byId[action.payload.id];
  const pathData = action.payload.pathData ? action.payload.pathData : null;
  const bounds = action.payload.bounds ? action.payload.bounds : null;
  const rotation = action.payload.rotation ? action.payload.rotation : null;
  currentState = setLineFromX(currentState, layerActions.setLineFromX({id: action.payload.id, x: action.payload.x, pathData, bounds, rotation}) as SetLineFromX);
  currentState = setLineFromY(currentState, layerActions.setLineFromY({id: action.payload.id, y: action.payload.y, pathData, bounds, rotation}) as SetLineFromY);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Line From',
      projects: [layerItem.artboard]
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLineToX = (state: LayerState, action: SetLineToX): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const groupParents = layerItem.scope.filter((id, index) => index !== 0 && index !== 1);
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        frame: action.payload.bounds
        ? {
            ...currentState.byId[action.payload.id].frame,
            ...action.payload.bounds
          }
        : currentState.byId[action.payload.id].frame,
        transform: action.payload.rotation
        ? {
            ...currentState.byId[action.payload.id].transform,
            rotation: action.payload.rotation
          }
        : currentState.byId[action.payload.id].transform,
        to: {
          ...(currentState.byId[action.payload.id] as Btwx.Line).to,
          x: action.payload.x
        }
      } as Btwx.Line
    }
  }
  if (action.payload.pathData && layerItem.type === 'Shape') {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          pathData: action.payload.pathData
        } as Btwx.Shape
      }
    }
    currentState = setShapeIcon(currentState, action.payload.id, action.payload.pathData);
  }
  if (groupParents.length > 0) {
    currentState = groupParents.reduce((result, current) => {
      const groupItem = result.byId[current];
      const layersBounds = getLayersRelativeBounds(result, groupItem.children);
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            frame: {
              ...result.byId[current].frame,
              x: layersBounds.center.x,
              y: layersBounds.center.y,
              innerWidth: layersBounds.width,
              innerHeight: layersBounds.height,
              width: layersBounds.width,
              height: layersBounds.height
            }
          }
        }
      }
      return result;
    }, currentState);
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['toX']);
  if (action.payload.setEdit) {
    currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
      edit: {
        actionType: action.type,
        payload: action.payload,
        detail: 'Set Line To X',
        projects: [layerItem.artboard]
      }
    }) as SetLayerEdit);
  }
  return currentState;
};

export const setLinesToX = (state: LayerState, action: SetLinesToX): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current, index) => {
    const layerItem = currentState.byId[current];
    const layerProject = layerItem.artboard;
    const bounds = action.payload.bounds ? action.payload.bounds[index] : null;
    const pathData = action.payload.pathData ? action.payload.pathData[index] : null;
    const rotation = action.payload.rotation ? action.payload.rotation[index] : null;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLineToX(result, layerActions.setLineToX({id: current, x: action.payload.x, setEdit: false, bounds, pathData, rotation}) as SetLineToX);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Lines To X',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLineToY = (state: LayerState, action: SetLineToY): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const groupParents = layerItem.scope.filter((id, index) => index !== 0 && index !== 1);
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        frame: action.payload.bounds
        ? {
            ...currentState.byId[action.payload.id].frame,
            ...action.payload.bounds
          }
        : currentState.byId[action.payload.id].frame,
        transform: action.payload.rotation
        ? {
            ...currentState.byId[action.payload.id].transform,
            rotation: action.payload.rotation
          }
        : currentState.byId[action.payload.id].transform,
        to: {
          ...(currentState.byId[action.payload.id] as Btwx.Line).to,
          y: action.payload.y
        }
      } as Btwx.Line
    }
  }
  if (action.payload.pathData && layerItem.type === 'Shape') {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          pathData: action.payload.pathData
        } as Btwx.Shape
      }
    }
    currentState = setShapeIcon(currentState, action.payload.id, action.payload.pathData);
  }
  if (groupParents.length > 0) {
    currentState = groupParents.reduce((result, current) => {
      const groupItem = result.byId[current];
      const layersBounds = getLayersRelativeBounds(result, groupItem.children);
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            frame: {
              ...result.byId[current].frame,
              x: layersBounds.center.x,
              y: layersBounds.center.y,
              innerWidth: layersBounds.width,
              innerHeight: layersBounds.height,
              width: layersBounds.width,
              height: layersBounds.height
            }
          }
        }
      }
      return result;
    }, currentState);
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['toY']);
  if (action.payload.setEdit) {
    currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
      edit: {
        actionType: action.type,
        payload: action.payload,
        detail: 'Set Line To Y',
        projects: [layerItem.artboard]
      }
    }) as SetLayerEdit);
  }
  return currentState;
};

export const setLinesToY = (state: LayerState, action: SetLinesToY): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current, index) => {
    const layerItem = currentState.byId[current];
    const layerProject = layerItem.artboard;
    const bounds = action.payload.bounds ? action.payload.bounds[index] : null;
    const pathData = action.payload.pathData ? action.payload.pathData[index] : null;
    const rotation = action.payload.rotation ? action.payload.rotation[index] : null;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLineToY(result, layerActions.setLineToY({id: current, y: action.payload.y, setEdit: false, bounds, pathData, rotation}) as SetLineToY);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Lines To Y',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLineTo = (state: LayerState, action: SetLineTo): LayerState => {
  let currentState = state;
  const layerItem = state.byId[action.payload.id];
  const pathData = action.payload.pathData ? action.payload.pathData : null;
  const bounds = action.payload.bounds ? action.payload.bounds : null;
  const rotation = action.payload.rotation ? action.payload.rotation : null;
  currentState = setLineToX(currentState, layerActions.setLineToX({id: action.payload.id, x: action.payload.x, pathData, bounds, rotation}) as SetLineToX);
  currentState = setLineToY(currentState, layerActions.setLineToY({id: action.payload.id, y: action.payload.y, pathData, bounds, rotation}) as SetLineToY);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['toX', 'toY']);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Line To',
      projects: [layerItem.artboard]
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerEdit = (state: LayerState, action: SetLayerEdit): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    edit: {
      ...action.payload.edit,
      selectedEdit: currentState.selectedEdit
    }
  }
  if (action.payload.edit.treeEdit) {
    currentState = {
      ...currentState,
      tree: {
        ...currentState.tree,
        tree: currentState.byId
      }
    }
  }
  return currentState;
};

export const setLayerStyle = (state: LayerState, action: SetLayerStyle): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          ...action.payload.style
        }
      }
    }
  }
  if (layerItem.type === 'Text') {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          textStyle: {
            ...(currentState.byId[action.payload.id] as Btwx.Text).textStyle,
            ...action.payload.textStyle
          }
        } as Btwx.Text
      }
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, 'all');
  return currentState;
};

export const setLayersStyle = (state: LayerState, action: SetLayersStyle): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerStyle(result, layerActions.setLayerStyle({id: current, style: action.payload.style, textStyle: action.payload.textStyle}) as SetLayerStyle);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Style',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const resetImageDimensions = (state: LayerState, action: ResetImageDimensions): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id] as Btwx.Image;
  currentState = setLayerWidth(currentState, layerActions.setLayerWidth({id: action.payload.id, width: layerItem.originalDimensions.width}) as SetLayerWidth);
  currentState = setLayerHeight(currentState, layerActions.setLayerHeight({id: action.payload.id, height: layerItem.originalDimensions.height}) as SetLayerHeight);
  return currentState;
};

export const resetImagesDimensions = (state: LayerState, action: ResetImagesDimensions): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return resetImageDimensions(result, layerActions.resetImageDimensions({id: current}) as ResetImageDimensions);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Reset Image Dimensions',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const replaceImage = (state: LayerState, action: ReplaceImage): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        imageId: action.payload.imageId,
        originalDimensions: action.payload.originalDimensions
      } as Btwx.Image
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['image']);
  return currentState;
};

export const replaceImages = (state: LayerState, action: ReplaceImages): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return replaceImage(result, layerActions.replaceImage({
      id: current,
      imageId: action.payload.imageId,
      originalDimensions: action.payload.originalDimensions
    }) as ReplaceImage);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Replace Images',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const pasteLayerFromClipboard = (state: LayerState, action: PasteLayersFromClipboard, id: string): LayerState => {
  let currentState = state;
  const layerItem = action.payload.clipboardLayers.byId[id];
  const layerAndDescendants = getLayerAndDescendants({byId: action.payload.clipboardLayers.byId} as LayerState, id);
  if (layerItem.type === 'Artboard') {
    const projectIndex = Math.floor((currentState.byId.root.children.length) / ARTBOARDS_PER_PROJECT) + 1;
    currentState = layerAndDescendants.reduce((result, current, index) => {
      const clipboardLayerItem = action.payload.clipboardLayers.byId[current];
      switch(clipboardLayerItem.type) {
        case 'Artboard':
          result = {
            ...result,
            allArtboardIds: addItem(result.allArtboardIds, current)
          }
          break;
        case 'Shape':
          result = {
            ...result,
            allShapeIds: addItem(result.allShapeIds, current)
          }
          break;
        case 'Group':
          result = {
            ...result,
            allGroupIds: addItem(result.allGroupIds, current)
          }
          break;
        case 'Text':
          result = {
            ...result,
            allTextIds: addItem(result.allTextIds, current)
          }
          break;
        case 'Image':
          result = {
            ...result,
            allImageIds: addItem(result.allImageIds, current)
          }
          break;
      }
      result = {
        ...result,
        allIds: [...result.allIds, current],
        byId: {
          ...result.byId,
          [current]: {
            ...clipboardLayerItem,
            ...(() => {
              switch(clipboardLayerItem.type) {
                case 'Artboard':
                  return {
                    projectIndex: projectIndex
                  };
                default:
                  return {};
              }
            })()
          }
        } as any
      };
      if (clipboardLayerItem.type === 'Shape') {
        result = setShapeIcon(result, clipboardLayerItem.id, (clipboardLayerItem as Btwx.Shape).pathData);
      }
      return result;
    }, currentState);
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [layerItem.parent]: {
          ...currentState.byId[layerItem.parent],
          children: addItem(currentState.byId[layerItem.parent].children, id)
        } as Btwx.Group | Btwx.Artboard
      }
    }
  } else {
    if (currentState.activeArtboard) {
      currentState = layerAndDescendants.reduce((result: LayerState, current, index) => {
        const clipboardLayerItem = action.payload.clipboardLayers.byId[current];
        const parent = index === 0 ? currentState.activeArtboard : clipboardLayerItem.parent;
        const parentItem = result.byId[parent];
        const scope = [...parentItem.scope, parent];
        switch(clipboardLayerItem.type) {
          case 'Shape':
            result = {
              ...result,
              allShapeIds: addItem(result.allShapeIds, current)
            }
            break;
          case 'Group':
            result = {
              ...result,
              allGroupIds: addItem(result.allGroupIds, current)
            }
            break;
          case 'Text':
            result = {
              ...result,
              allTextIds: addItem(result.allTextIds, current)
            }
            break;
          case 'Image':
            result = {
              ...result,
              allImageIds: addItem(result.allImageIds, current)
            }
            break;
        }
        result = {
          ...result,
          allIds: [...result.allIds, current],
          byId: {
            ...result.byId,
            [current]: {
              ...clipboardLayerItem,
              artboard: currentState.activeArtboard,
              parent: parent,
              scope: scope
            }
          } as any
        };
        if (clipboardLayerItem.type === 'Shape') {
          result = setShapeIcon(result, clipboardLayerItem.id, (clipboardLayerItem as Btwx.Shape).pathData);
        }
        return result;
      }, currentState);
      currentState = {
        ...currentState,
        byId: {
          ...currentState.byId,
          [currentState.activeArtboard]: {
            ...currentState.byId[currentState.activeArtboard],
            children: addItem(currentState.byId[currentState.activeArtboard].children, id)
          } as Btwx.Group | Btwx.Artboard
        }
      }
    }
  }
  return currentState;
};

export const pasteLayersFromClipboard = (state: LayerState, action: PasteLayersFromClipboard): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  const clipboardBounds = new paperMain.Rectangle(
    new paperMain.Point(
      (action.payload.clipboardLayers.bounds as number[])[1],
      (action.payload.clipboardLayers.bounds as number[])[2]
    ),
    new paperMain.Size(
      (action.payload.clipboardLayers.bounds as number[])[3],
      (action.payload.clipboardLayers.bounds as number[])[4]
    )
  );
  // handle if clipboard position is not within viewport
  if (!clipboardBounds.center.isInside(paperMain.view.bounds)) {
    const pointDiff = paperMain.view.center.subtract(clipboardBounds.center);
    action.payload.clipboardLayers.main.forEach((id) => {
      const clipboardLayerItem = action.payload.clipboardLayers.byId[id];
      if (clipboardLayerItem.type === 'Artboard') {
        clipboardLayerItem.frame.x += pointDiff.x;
        clipboardLayerItem.frame.y += pointDiff.y;
      }
    });
  }
  // handle paste over selection
  // if (action.payload.overSelection && currentState.selected.length > 0) {
  //   const singleSelection = currentState.selected.length === 1;
  //   const overSelectionItem = currentState.byId[currentState.selected[0]];
  //   const selectedBounds = getSelectedBounds({layer: {present: currentState}} as RootState);
  //   const selectionPosition = selectedBounds.center;
  //   const pointDiff = selectionPosition.subtract(clipboardBounds.center);
  //   action.payload.clipboardLayers.allIds.forEach((id) => {
  //     const clipboardLayerItem = action.payload.clipboardLayers.byId[id];
  //     if (singleSelection && action.payload.clipboardLayers.main.includes(id) && clipboardLayerItem.type !== 'Artboard') {
  //       if (overSelectionItem.type === 'Group' || overSelectionItem.type === 'Artboard') {
  //         clipboardLayerItem.parent = overSelectionItem.id;
  //       } else {
  //         clipboardLayerItem.parent = overSelectionItem.parent;
  //       }
  //     }
  //     clipboardLayerItem.frame.x += pointDiff.x;
  //     clipboardLayerItem.frame.y += pointDiff.y;
  //   });
  // }
  // // handle paste at point
  // if (action.payload.overPoint && !action.payload.overLayer) {
  //   const paperPoint = new paperMain.Point(action.payload.overPoint.x, action.payload.overPoint.y);
  //   const pointDiff = paperPoint.subtract(clipboardBounds.center);
  //   action.payload.clipboardLayers.allIds.forEach((id) => {
  //     const clipboardLayerItem = action.payload.clipboardLayers.byId[id];
  //     clipboardLayerItem.frame.x += pointDiff.x;
  //     clipboardLayerItem.frame.y += pointDiff.y;
  //   });
  // }
  // // handle paste over layer
  // if (action.payload.overLayer && !action.payload.overPoint) {
  //   const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.overLayer);
  //   const overLayerItem = currentState.byId[action.payload.overLayer];
  //   const pointDiff = paperLayer.position.subtract(clipboardBounds.center);
  //   action.payload.clipboardLayers.allIds.forEach((id) => {
  //     const clipboardLayerItem = action.payload.clipboardLayers.byId[id];
  //     if (action.payload.clipboardLayers.main.includes(id) && clipboardLayerItem.type !== 'Artboard') {
  //       if (overLayerItem.type === 'Group' || overLayerItem.type === 'Artboard') {
  //         clipboardLayerItem.parent = overLayerItem.id;
  //       } else {
  //         clipboardLayerItem.parent = overLayerItem.parent;
  //       }
  //     }
  //     clipboardLayerItem.frame.x += pointDiff.x;
  //     clipboardLayerItem.frame.y += pointDiff.y;
  //   });
  // }
  // // handle paste over layer and over point
  // if (action.payload.overPoint && action.payload.overLayer) {
  //   const overLayerItem = currentState.byId[action.payload.overLayer];
  //   const paperPoint = new paperMain.Point(action.payload.overPoint.x, action.payload.overPoint.y);
  //   const pointDiff = paperPoint.subtract(clipboardBounds.center);
  //   action.payload.clipboardLayers.allIds.forEach((id) => {
  //     const clipboardLayerItem = action.payload.clipboardLayers.byId[id];
  //     if (action.payload.clipboardLayers.main.includes(id) && clipboardLayerItem.type !== 'Artboard') {
  //       if (overLayerItem.type === 'Group' || overLayerItem.type === 'Artboard') {
  //         clipboardLayerItem.parent = overLayerItem.id;
  //       } else {
  //         clipboardLayerItem.parent = overLayerItem.parent;
  //       }
  //     }
  //     clipboardLayerItem.frame.x += pointDiff.x;
  //     clipboardLayerItem.frame.y += pointDiff.y;
  //   });
  // }
  currentState = action.payload.clipboardLayers.main.reduce((result, current) => {
    const layerItem = action.payload.clipboardLayers.byId[current];
    const layerProject = layerItem.type === 'Artboard' ? layerItem.artboard : currentState.activeArtboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return pasteLayerFromClipboard(result, action, current);
  }, currentState);
  currentState = selectLayers(currentState, layerActions.selectLayers({layers: action.payload.clipboardLayers.main, newSelection: true}) as SelectLayers);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Paste Layers From Clipboard',
      projects,
      treeEdit: true
    }
  }) as SetLayerEdit);
  return currentState;
};