/* eslint-disable @typescript-eslint/no-use-before-define */
import { v4 as uuidv4 } from 'uuid';
import capitalize from 'lodash.capitalize';
import { LayerState } from '../reducers/layer';
import * as layerActions from '../actions/layer';
import { addItem, removeItem, insertItem, moveItemAbove, moveItemBelow } from './general';
import { paperMain } from '../../canvas';
import { ARTBOARDS_PER_PROJECT, TWEEN_PROPS_MAP, DEFAULT_TWEEN_EASE, getDefaultTweenProps } from '../../constants';

import {
  AddGroup, AddShape, SelectLayer, DeselectLayer, RemoveLayer,
  AddLayerChild, InsertLayerChild, InsertLayerAbove, InsertLayerBelow,
  GroupLayers, UngroupLayers, UngroupLayer, DeselectAllLayers, RemoveLayers,
  HideLayerChildren, ShowLayerChildren, DecreaseLayerScope, NewLayerScope, SetLayerHover,
  ClearLayerScope, IncreaseLayerScope, SelectLayers, DeselectLayers, MoveLayerTo,
  MoveLayerBy, MoveLayersTo, MoveLayersBy, DeepSelectLayer, EscapeLayerScope,
  MoveLayer, MoveLayers, AddArtboard, SetLayerName, SetActiveArtboard, AddLayerTween,
  RemoveLayerTween, AddLayerEvent, RemoveLayerEvent, SetLayerTweenDuration, SetLayerTweenDelay,
  SetLayerTweenEase, SetLayerTweenPower, SetLayerX, SetLayerY, SetLayerWidth, SetLayerHeight,
  SetLayerOpacity, SetLayerFillColor, SetLayerStrokeColor, SetLayerStrokeWidth, SetLayerShadowColor,
  SetLayerShadowBlur, SetLayerShadowXOffset, SetLayerShadowYOffset, SetLayerRotation, EnableLayerFill,
  DisableLayerFill, EnableLayerStroke, DisableLayerStroke, DisableLayerShadow, EnableLayerShadow,
  SetLayerStrokeCap, SetLayerStrokeJoin, ScaleLayer, ScaleLayers, EnableLayerHorizontalFlip,
  DisableLayerHorizontalFlip, EnableLayerVerticalFlip, DisableLayerVerticalFlip, AddText, SetLayerText,
  SetLayerFontSize, SetLayerFontWeight, SetLayerFontFamily, SetLayerLeading, SetLayerJustification,
  SetLayerFillType, SetLayerStrokeFillType, AddLayersMask, RemoveLayersMask, SetLayerFill, AlignLayersToLeft,
  AlignLayersToRight, AlignLayersToTop, AlignLayersToBottom, AlignLayersToCenter, AlignLayersToMiddle,
  DistributeLayersHorizontally, DistributeLayersVertically, DuplicateLayer, DuplicateLayers,
  RemoveDuplicatedLayers, BringLayerForward, SendLayerBackward, BringLayersForward, SendLayersBackward,
  BringLayerToFront, BringLayersToFront, SendLayerToBack, SendLayersToBack, AddImage, InsertLayersAbove,
  InsertLayersBelow, AddLayerChildren, SetLayerBlendMode, UniteLayers, SetRoundedRadius, SetPolygonSides,
  SetStarPoints, IntersectLayers, SubtractLayers, ExcludeLayers, DivideLayers, SetStarRadius,
  SetLayerStrokeDashOffset, SetLayersOpacity, SetLayersBlendMode, SetLayersX, SetLayersY, SetLayersWidth,
  SetLayersHeight, SetLayersRotation, SetLayersFillColor, SetLayersStrokeColor, SetLayersShadowColor,
  EnableLayersFill, DisableLayersFill, EnableLayersStroke, DisableLayersStroke, EnableLayersShadow,
  DisableLayersShadow, SetLayersFillType, SetLayersStrokeFillType, SetLayersStrokeWidth, SetLayersStrokeCap,
  SetLayersStrokeJoin, SetLayersStrokeDashOffset, SetLayerStrokeDashArray, SetLayersStrokeDashArray,
  SetLayerStrokeDashArrayWidth, SetLayersStrokeDashArrayWidth, SetLayerStrokeDashArrayGap,
  SetLayersStrokeDashArrayGap, SetLayerGradient, SetLayersGradient, SetLayerGradientType, SetLayersGradientType,
  SetLayerGradientOrigin, SetLayersGradientOrigin, SetLayerGradientDestination, SetLayersGradientDestination,
  SetLayerGradientStopColor, SetLayersGradientStopColor, SetLayerGradientStopPosition,
  SetLayersGradientStopPosition, AddLayerGradientStop, AddLayersGradientStop, RemoveLayerGradientStop,
  RemoveLayersGradientStop, SetLayerActiveGradientStop, SetLayersShadowBlur, SetLayersShadowXOffset,
  SetLayersShadowYOffset, SetLayersFontSize, SetLayersFontWeight, SetLayersFontFamily, SetLayersLeading,
  SetLayersJustification, SetLayerTweenTiming, SetRoundedRadii, SetPolygonsSides, SetStarsPoints,
  SetStarsRadius, SetLayerEdit, AddLayers, SetLineFromX, SetLineFromY, SetLineFrom, SetLineToX, SetLineToY,
  SetLineTo, SetLinesFromX, SetLinesFromY, SetLinesToX, SetLinesToY, SelectAllLayers, SetLayerStyle,
  SetLayersStyle, EnableLayersHorizontalFlip, DisableLayersHorizontalFlip, DisableLayersVerticalFlip,
  EnableLayersVerticalFlip, SetLayerScope, SetLayersScope, SetGlobalScope, SetLayerUnderlyingMask,
  SetLayersUnderlyingMask, SetLayerMasked, SetLayersMasked, ToggleLayerMask, ToggleLayersMask,
  ToggleLayersIgnoreUnderlyingMask, ToggleLayerIgnoreUnderlyingMask, AreaSelectLayers, SetLayersGradientOD,
  ResetImagesDimensions, ResetImageDimensions, ReplaceImage, ReplaceImages, PasteLayersFromClipboard,
  SetLayerPointX, SetLayersPointX, SetLayerPointY, SetLayersPointY, SetLayerScrambleTextTweenCharacters,
  SetLayerScrambleTextTweenRevealDelay, SetLayerScrambleTextTweenSpeed, SetLayerScrambleTextTweenDelimiter,
  SetLayerScrambleTextTweenRightToLeft, SetLayerCustomBounceTweenStrength, SetLayerCustomBounceTweenEndAtStart,
  SetLayerCustomBounceTweenSquash, SetLayerCustomWiggleTweenWiggles, SetLayerCustomWiggleTweenType,
  SetLayerStepsTweenSteps, SetLayerRoughTweenClamp, SetLayerRoughTweenPoints, SetLayerRoughTweenRandomize,
  SetLayerRoughTweenStrength, SetLayerRoughTweenTaper, SetLayerRoughTweenTemplate, SetLayerSlowTweenLinearRatio,
  SetLayerSlowTweenPower, SetLayerSlowTweenYoYoMode, SetLayerTextTweenDelimiter, SetLayerTextTweenSpeed,
  SetLayerTextTweenDiff, SetLayerTextTweenScramble, SetLayerLeft, SetLayerCenter, SetLayersLeft, SetLayersCenter,
  SetLayerRight, SetLayersRight, SetLayerTop, SetLayersTop, SetLayerMiddle, SetLayersMiddle, SetLayerBottom,
  SetLayersBottom, SetLayerLetterSpacing, SetLayersLetterSpacing, SetLayerTextTransform, SetLayersTextTransform,
  SetLayersFillColors, SetLayersStrokeColors, SetLayersShadowColors, AddLayersEvent, SetLayerTree, SetLayerTreeScroll,
  SetLayerCustomWiggleTweenStrength, EnableLayerBlur, EnableLayersBlur, DisableLayerBlur,
  DisableLayersBlur, SetLayerTextResize, SetLayersTextResize, SetLayerVerticalAlignment, SetLayersVerticalAlignment,
  SetLayerFontStyle, SetLayersFontStyle, SelectLayerEvent, DeselectLayerEvent, SelectLayerEvents, DeselectLayerEvents,
  SelectLayerEventTween, DeselectLayerEventTween, SelectLayerEventTweens, DeselectLayerEventTweens,
  SetLayersTweenDuration, SetLayersTweenDelay, SetLayersTweenTiming, SetLayersTweenEase, SetLayersTweenPower,
  SetLayersStepsTweenSteps, SetLayersRoughTweenClamp, SetLayersRoughTweenPoints, SetLayersRoughTweenRandomize,
  SetLayersRoughTweenStrength, SetLayersRoughTweenTaper, SetLayersRoughTweenTemplate, SetLayersSlowTweenLinearRatio,
  SetLayersSlowTweenPower, SetLayersSlowTweenYoYoMode, SetLayersTextTweenDelimiter, SetLayersTextTweenSpeed,
  SetLayersTextTweenDiff, SetLayersTextTweenScramble, SetLayersScrambleTextTweenCharacters,
  SetLayersScrambleTextTweenRevealDelay, SetLayersScrambleTextTweenSpeed, SetLayersScrambleTextTweenDelimiter,
  SetLayersScrambleTextTweenRightToLeft, SetLayersCustomBounceTweenStrength, SetLayersCustomBounceTweenEndAtStart,
  SetLayersCustomBounceTweenSquash, SetLayersCustomWiggleTweenStrength, SetLayersCustomWiggleTweenWiggles,
  SetLayersCustomWiggleTweenType, RemoveLayerTweens, RemoveLayersEvent, ShowLayersChildren, HideLayersChildren,
  SetLayerTreeStickyArtboard, SetLayerTweenRepeat, SetLayersTweenRepeat, SetLayerTweenYoyo, SetLayersTweenYoyo,
  SetLayerTweenRepeatDelay, SetLayersTweenRepeatDelay, SetLayerTweenYoyoEase, SetLayersTweenYoyoEase,
  SetLayerBlurRadius, SetLayersBlurRadius, FlipLayerGradient, FlipLayersGradient, DeselectAllLayerEventTweens,
  DeselectAllLayerEvents, SetLayerEventEventListener, SetLayersEventEventListener, SetLayerStroke, SetLayersStroke,
  SetLayersFill, SetLayerShadow, SetLayersShadow, EnableGroupScroll, EnableGroupsScroll, DisableGroupScroll,
  DisableGroupsScroll, EnableGroupHorizontalScroll, EnableGroupsHorizontalScroll, DisableGroupHorizontalScroll,
  DisableGroupsHorizontalScroll, EnableGroupVerticalScroll, EnableGroupsVerticalScroll, DisableGroupVerticalScroll,
  DisableGroupsVerticalScroll, SetGroupScrollOverflow, SetGroupsScrollOverflow, SetGroupScrollFrame,
  EnableGroupGroupEventTweens, EnableGroupsGroupEventTweens, DisableGroupGroupEventTweens, DisableGroupsGroupEventTweens, AddGroupsWiggles,
} from '../actionTypes/layer';

import {
  isScopeLayer, isScopeGroupLayer, getNearestScopeAncestor, getLayerAndDescendants,
  getLayerDescendants, getDestinationEquivalent, getEquivalentTweenProps, getDeepSelectItem,
  getLayersBounds, getLayersRelativeBounds, orderLayersByDepth, orderLayersByLeft, orderLayersByTop,
  getEquivalentTweenProp, getLayerYoungerSiblings, getMaskableSiblings, getSiblingLayersWithUnderlyingMask,
  getItemLayers, getGradientDestination, getGradientOrigin, hasFillTween, orderLayersByRight,
  orderLayersByMiddle, orderLayersByBottom, getLayerRelativeScrollBounds, getLayerBounds, getLayerScrollBounds,
  getLayerScrollFrameBounds, getOriginTweensByEventProp, getOriginTweensByEventPropFull, getWiggleLayersSelector
} from '../selectors/layer';

export const updateGroupParentBounds = (state: LayerState, groupParents: string[]): LayerState => {
  let currentState = state;
  if (groupParents.length > 0) {
    return groupParents.reduce((result, current) => {
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
        if (groupItem.type === 'Group' && (groupItem as Btwx.Group).scroll.frame.x !== 'auto') {
          const scrollFrameBounds = getLayerRelativeScrollBounds(result, current);
          const topLeft = paperMain.Point.min(scrollFrameBounds.topLeft, layersBounds.topLeft);
          const bottomRight = paperMain.Point.max(scrollFrameBounds.bottomRight, layersBounds.bottomRight);
          const scrollBounds = new paperMain.Rectangle({
            from: topLeft,
            to: bottomRight
          });
          result = {
            ...result,
            byId: {
              ...result.byId,
              [current]: {
                ...(result.byId[current] as Btwx.Group),
                scroll: {
                  ...(result.byId[current] as Btwx.Group).scroll,
                  frame: {
                    x: scrollFrameBounds.topLeft.x - layersBounds.topLeft.x,
                    y: scrollFrameBounds.topLeft.y - layersBounds.topLeft.y,
                    width: scrollFrameBounds.width,
                    height: scrollFrameBounds.height
                  },
                  scrollWidth: scrollBounds.width,
                  scrollHeight: scrollBounds.height,
                  scrollLeft: layersBounds.left - scrollFrameBounds.left,
                  scrollTop: layersBounds.top - scrollFrameBounds.top
                }
              } as Btwx.Group
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
        if (groupItem.type === 'Group' && (groupItem as Btwx.Group).scroll.frame.x !== 'auto') {
          result = {
            ...result,
            byId: {
              ...result.byId,
              [current]: {
                ...(result.byId[current] as Btwx.Group),
                scroll: {
                  ...(result.byId[current] as Btwx.Group).scroll,
                  scrollWidth: 0,
                  scrollHeight: 0,
                  scrollLeft: 0,
                  scrollTop: 0
                }
              } as Btwx.Group
            }
          }
        }
      }
      return result;
    }, currentState);
  } else {
    return currentState;
  }
}

export const updateArtboardProjectIndices = (state: LayerState): LayerState => {
  return state.byId['root'].children.reduce((result, current, index) => {
    const newProjectIndex = Math.floor(index / ARTBOARDS_PER_PROJECT) + 1;
    const isActiveArtboard = current === result.activeArtboard;
    if (isActiveArtboard) {
      result = {
        ...result,
        activeProjectIndex: newProjectIndex
      }
    }
    result = {
      ...result,
      byId: {
        ...result.byId,
        [current]: {
          ...result.byId[current],
          projectIndex: newProjectIndex
        } as Btwx.Artboard
      }
    }
    return result;
  }, state);
}

export const addArtboard = (state: LayerState, action: AddArtboard): LayerState => {
  let currentState = state;
  const groupParents = ['root'];
  currentState = {
    ...currentState,
    allIds: addItem(
      currentState.allIds,
      action.payload.layer.id
    ),
    allArtboardIds: addItem(
      currentState.allArtboardIds,
      action.payload.layer.id
    ),
    byId: {
      ...currentState.byId,
      [action.payload.layer.id]: action.payload.layer as Btwx.Artboard,
      [action.payload.layer.parent]: {
        ...currentState.byId[action.payload.layer.parent],
        children: addItem(
          (currentState.byId[action.payload.layer.parent] as Btwx.Root).children,
          action.payload.layer.id
        ),
      } as Btwx.Root
    }
  }
  currentState = updateGroupParentBounds(currentState, groupParents);
  if (!action.payload.batch) {
    currentState = selectLayers(currentState, layerActions.selectLayers({
      layers: [action.payload.layer.id],
      newSelection: true
    }) as SelectLayers);
    currentState = setLayerTreeScroll(currentState, layerActions.setLayerTreeScroll({
      scroll: action.payload.layer.id
    }) as SetLayerTreeScroll);
    // currentState = setLayerTreeStickyArtboard(currentState, layerActions.setLayerTreeStickyArtboard({
    //   stickyArtboard: action.payload.layer.id
    // }) as SetLayerTreeStickyArtboard);
    currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
      edit: {
        actionType: action.type,
        payload: action.payload,
        detail: 'Add Artboard',
        treeEdit: true,
        undoable: true
      }
    }) as SetLayerEdit);
  }
  return currentState;
};

export const addShape = (state: LayerState, action: AddShape): LayerState => {
  let currentState = state;
  const parentItem = state.byId[action.payload.layer.parent];
  const groupParents = action.payload.layer.scope.filter((id, index) => index !== 0 && index !== 1).reverse();
  // add shape
  currentState = {
    ...currentState,
    allIds: addItem(currentState.allIds, action.payload.layer.id),
    byId: {
      ...currentState.byId,
      [action.payload.layer.id]: action.payload.layer as Btwx.Shape,
      [action.payload.layer.parent]: {
        ...currentState.byId[action.payload.layer.parent],
        children: addItem(
          (currentState.byId[action.payload.layer.parent] as Btwx.Group).children,
          action.payload.layer.id
        ),
      } as Btwx.Group
    },
    allShapeIds: addItem(state.allShapeIds, action.payload.layer.id),
    shapeIcons: {
      ...currentState.shapeIcons,
      [action.payload.layer.id]: action.payload.shapeIcon
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.layer.id, 'all');
  currentState = updateGroupParentBounds(currentState, groupParents);
  if (!action.payload.batch) {
    if (!(parentItem as Btwx.Group | Btwx.Artboard).showChildren) {
      currentState = showLayerChildren(currentState, layerActions.showLayerChildren({
        id: action.payload.layer.parent
      }) as ShowLayerChildren);
    }
    currentState = selectLayers(currentState, layerActions.selectLayers({
      layers: [action.payload.layer.id],
      newSelection: true
    }) as SelectLayers);
    currentState = setLayerTreeScroll(currentState, layerActions.setLayerTreeScroll({
      scroll: action.payload.layer.id
    }) as SetLayerTreeScroll);
    // currentState = setLayerTreeStickyArtboard(currentState, layerActions.setLayerTreeStickyArtboard({
    //   stickyArtboard: action.payload.layer.artboard
    // }) as SetLayerTreeStickyArtboard);
    currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
      edit: {
        actionType: action.type,
        payload: action.payload,
        detail: 'Add Shape',
        treeEdit: true,
        undoable: true
      }
    }) as SetLayerEdit);
  }
  return currentState;
};

export const addGroup = (state: LayerState, action: AddGroup): LayerState => {
  let currentState = state;
  const parentItem = state.byId[action.payload.layer.parent];
  const groupParents = action.payload.layer.scope.filter((id, index) => index !== 0 && index !== 1).reverse();
  currentState = {
    ...currentState,
    allIds: addItem(currentState.allIds, action.payload.layer.id),
    byId: {
      ...currentState.byId,
      [action.payload.layer.id]: action.payload.layer as Btwx.Group,
      [action.payload.layer.parent]: {
        ...currentState.byId[action.payload.layer.parent],
        children: addItem(
          (currentState.byId[action.payload.layer.parent] as Btwx.Group).children,
          action.payload.layer.id
        ),
      } as Btwx.Group
    },
    allGroupIds: addItem(state.allGroupIds, action.payload.layer.id)
  }
  currentState = updateGroupParentBounds(currentState, groupParents);
  if (!action.payload.batch) {
    if (!(parentItem as Btwx.Group | Btwx.Artboard).showChildren) {
      currentState = showLayerChildren(currentState, layerActions.showLayerChildren({
        id: action.payload.layer.parent
      }) as ShowLayerChildren);
    }
    currentState = selectLayers(currentState, layerActions.selectLayers({
      layers: [action.payload.layer.id],
      newSelection: true
    }) as SelectLayers);
    currentState = setLayerTreeScroll(currentState, layerActions.setLayerTreeScroll({
      scroll: action.payload.layer.id
    }) as SetLayerTreeScroll);
    // currentState = setLayerTreeStickyArtboard(currentState, layerActions.setLayerTreeStickyArtboard({
    //   stickyArtboard: action.payload.layer.artboard
    // }) as SetLayerTreeStickyArtboard);
    currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
      edit: {
        actionType: action.type,
        payload: action.payload,
        detail: 'Add Group',
        treeEdit: true,
        undoable: true
      }
    }) as SetLayerEdit);
  }
  return currentState;
};

export const addText = (state: LayerState, action: AddText): LayerState => {
  let currentState = state;
  const parentItem = state.byId[action.payload.layer.parent];
  const groupParents = action.payload.layer.scope.filter((id, index) => index !== 0 && index !== 1).reverse();
  currentState = {
    ...currentState,
    allIds: addItem(currentState.allIds, action.payload.layer.id),
    byId: {
      ...currentState.byId,
      [action.payload.layer.id]: action.payload.layer as Btwx.Text,
      [action.payload.layer.parent]: {
        ...currentState.byId[action.payload.layer.parent],
        children: addItem(
          (currentState.byId[action.payload.layer.parent] as Btwx.Group).children,
          action.payload.layer.id
        ),
        // showChildren: true
      } as Btwx.Group
    },
    allTextIds: addItem(state.allTextIds, action.payload.layer.id)
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.layer.id, 'all');
  currentState = updateGroupParentBounds(currentState, groupParents);
  if (!action.payload.batch) {
    if (!(parentItem as Btwx.Group | Btwx.Artboard).showChildren) {
      currentState = showLayerChildren(currentState, layerActions.showLayerChildren({
        id: action.payload.layer.parent
      }) as ShowLayerChildren);
    }
    currentState = selectLayers(currentState, layerActions.selectLayers({
      layers: [action.payload.layer.id],
      newSelection: true
    }) as SelectLayers);
    currentState = setLayerTreeScroll(currentState, layerActions.setLayerTreeScroll({
      scroll: action.payload.layer.id
    }) as SetLayerTreeScroll);
    // currentState = setLayerTreeStickyArtboard(currentState, layerActions.setLayerTreeStickyArtboard({
    //   stickyArtboard: action.payload.layer.artboard
    // }) as SetLayerTreeStickyArtboard);
    currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
      edit: {
        actionType: action.type,
        payload: action.payload,
        detail: 'Add Text',
        treeEdit: true,
        undoable: true
      }
    }) as SetLayerEdit);
  }
  return currentState;
};

export const addImage = (state: LayerState, action: AddImage): LayerState => {
  let currentState = state;
  const parentItem = state.byId[action.payload.layer.parent];
  const groupParents = action.payload.layer.scope.filter((id, index) => index !== 0 && index !== 1).reverse();
  currentState = {
    ...currentState,
    allIds: addItem(currentState.allIds, action.payload.layer.id),
    byId: {
      ...currentState.byId,
      [action.payload.layer.id]: action.payload.layer as Btwx.Image,
      [action.payload.layer.parent]: {
        ...currentState.byId[action.payload.layer.parent],
        children: addItem(
          (currentState.byId[action.payload.layer.parent] as Btwx.Group).children,
          action.payload.layer.id
        ),
      } as Btwx.Group
    },
    allImageIds: addItem(state.allImageIds, action.payload.layer.id)
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.layer.id, 'all');
  currentState = updateGroupParentBounds(currentState, groupParents);
  if (!action.payload.batch) {
    if (!(parentItem as Btwx.Group | Btwx.Artboard).showChildren) {
      currentState = showLayerChildren(currentState, layerActions.showLayerChildren({
        id: action.payload.layer.parent
      }) as ShowLayerChildren);
    }
    currentState = selectLayers(currentState, layerActions.selectLayers({
      layers: [action.payload.layer.id],
      newSelection: true
    }) as SelectLayers);
    currentState = setLayerTreeScroll(currentState, layerActions.setLayerTreeScroll({
      scroll: action.payload.layer.id
    }) as SetLayerTreeScroll);
    // currentState = setLayerTreeStickyArtboard(currentState, layerActions.setLayerTreeStickyArtboard({
    //   stickyArtboard: action.payload.layer.artboard
    // }) as SetLayerTreeStickyArtboard);
    currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
      edit: {
        actionType: action.type,
        payload: action.payload,
        detail: 'Add Image',
        treeEdit: true,
        undoable: true
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
      treeEdit: true,
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const removeLayer = (state: LayerState, action: RemoveLayer): LayerState => {
  let currentState = state;
  // const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  const layerItem = currentState.byId[action.payload.id];
  const groupParents = layerItem.type === 'Artboard' ? ['root'] : layerItem.scope.filter((id, index) => index !== 0 && index !== 1).reverse();
  const rm = (cs: LayerState, id: string, parentRemoved = false): LayerState => {
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
      const artboardIndex = cs.byId.root.children.indexOf(id);
      let nextActiveArtboard = null;
      if (cs.byId.root.children.length >= 2) {
        if (artboardIndex === 0) {
          nextActiveArtboard = cs.byId.root.children[1];
        } else {
          nextActiveArtboard = cs.byId.root.children[artboardIndex - 1];
        }
      }
      cs = setActiveArtboard(cs, layerActions.setActiveArtboard({
        id: nextActiveArtboard
      }) as SetActiveArtboard);
    }
    // if layer is sticky artboard, set sticky artboard to null
    if (cs.tree.stickyArtboard === id) {
      cs = setLayerTreeStickyArtboard(cs, layerActions.setLayerTreeStickyArtboard({
        stickyArtboard: null
      }) as SetLayerTreeStickyArtboard);
    }
    // if layer is a destination layer for any tween, remove that tween
    if (li.tweens.allIds) {
      cs = li.tweens.allIds.reduce((tweenResult, tweenCurrent) => {
        return removeLayerTween(tweenResult, layerActions.removeLayerTween({
          id: tweenCurrent
        }) as RemoveLayerTween);
      }, cs);
    }
    // if layer has any tween events, remove those events
    if (li.events.length > 0 && li.type !== 'Artboard') {
      cs = li.events.reduce((tweenResult, tweenCurrent) => {
        return removeLayerEvent(tweenResult, layerActions.removeLayerEvent({
          id: tweenCurrent
        }) as RemoveLayerEvent);
      }, cs);
    }
    // if artboard, remove any tween events with artboard as origin or destination
    if (li.type === 'Artboard' && ((li as Btwx.Artboard).originForEvents.length > 0 || (li as Btwx.Artboard).destinationForEvents.length > 0)) {
      const eventsWithArtboard = [...(li as Btwx.Artboard).originForEvents, ...(li as Btwx.Artboard).destinationForEvents];
      cs = eventsWithArtboard.reduce((tweenResult, tweenCurrent) => {
        return removeLayerEvent(tweenResult, layerActions.removeLayerEvent({
          id: tweenCurrent
        }) as RemoveLayerEvent);
      }, cs);
    }
    // if ignoring underlying mask
    if (li.type !== 'Artboard' && (li as Btwx.MaskableLayer).ignoreUnderlyingMask && !parentRemoved) {
      cs = toggleLayerIgnoreUnderlyingMask(cs, layerActions.toggleLayerIgnoreUnderlyingMask({
        id: id
      }) as ToggleLayerIgnoreUnderlyingMask);
    }
    // if layer mask
    if (isMask && !parentRemoved) {
      cs = toggleLayerMask(cs, layerActions.toggleLayerMask({
        id: id
      }) as ToggleLayerMask);
    }
    // if selection includes layer, remove layer from selection
    if (cs.selected.includes(id)) {
      cs = deselectLayers(cs, layerActions.deselectLayers({
        layers: [id]
      }) as DeselectLayers);
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
    // if artboard, update project indices
    if (li.type === 'Artboard') {
      cs = updateArtboardProjectIndices(cs);
    }
    return cs;
  }
  switch(layerItem.type) {
    case 'Artboard':
    case 'Group': {
      const layerAndDescendants = getLayerAndDescendants(currentState, action.payload.id);
      currentState = layerAndDescendants.reduce((result, current) => {
        return rm(result, current, true);
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
  currentState = updateGroupParentBounds(currentState, groupParents);
  return currentState;
};

export const removeLayers = (state: LayerState, action: RemoveLayers): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return removeLayer(result, layerActions.removeLayer({
      id: current
    }) as RemoveLayer);
  }, currentState);
  if (!action.payload.batch) {
    currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
      edit: {
        actionType: action.type,
        payload: action.payload,
        detail: 'Remove Layers',
        treeEdit: true,
        undoable: true
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
  // const pageItem = state.byId['root'];
  const topScopeItem = state.byId[state.scope[state.scope.length - 1]];
  return selectLayers(state, layerActions.selectLayers({layers: topScopeItem.children, newSelection: true}) as SelectLayers);
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
      currentState = deselectLayers(currentState, layerActions.deselectLayers({
        layers:layersToDeselect
      }) as DeselectLayers);
    }
  }
  // if any parents selected, deselect them
  if (currentState.selected.some((id) => layerItem.scope.includes(id))) {
    const deselectParents = currentState.selected.filter((id) => layerItem.scope.includes(id));
    currentState = deselectLayers(currentState, layerActions.deselectLayers({
      layers: deselectParents
    }) as DeselectLayers);
  }
  // if layer is an artboard, make it the active artboard
  if (layerItem.type === 'Artboard' && currentState.activeArtboard !== action.payload.id) {
    currentState = setActiveArtboard(currentState, layerActions.setActiveArtboard({
      id: action.payload.id
    }) as SetActiveArtboard);
  }
  // if layer scope root is an artboard, make the layer scope artboard the active artboards
  if (layerItem.type !== 'Artboard' && currentState.activeArtboard !== layerItem.scope[1]) {
    currentState = setActiveArtboard(currentState, layerActions.setActiveArtboard({
      id: layerItem.scope[1]
    }) as SetActiveArtboard);
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
    currentState = setGlobalScope(currentState, layerActions.setGlobalScope({
      scope: layerItem.scope
    }) as SetGlobalScope);
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
  if (nearestScopeAncestor.type === 'Group' || nearestScopeAncestor.type === 'Artboard') {
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
        result = deselectLayer(result, layerActions.deselectLayer({
          id: current
        }) as DeselectLayer);
      } else {
        result = selectLayer(result, layerActions.selectLayer({
          id: current
        }) as SelectLayer);
      }
      return result;
    }, currentState);
    if (action.payload.events.length > 0) {
      currentState = action.payload.events.reduce((result, current) => {
        if (currentState.events.selected.includes(current)) {
          result = deselectLayerEvent(result, layerActions.deselectLayerEvent({
            id: current
          }) as DeselectLayerEvent);
        } else {
          result = selectLayerEvent(result, layerActions.selectLayerEvent({
            id: current
          }) as SelectLayerEvent);
        }
        return result;
      }, currentState);
    }
  } else {
    currentState = selectLayers(currentState, layerActions.selectLayers({
      layers: action.payload.layers,
      newSelection: true
    }) as SelectLayers);
    if (action.payload.events.length > 0) {
      currentState = selectLayerEvents(currentState, layerActions.selectLayerEvents({
        events: action.payload.events,
        newSelection: true
      }) as SelectLayerEvents);
    }
  }
  return currentState;
};

export const setLayerHover = (state: LayerState, action: SetLayerHover): LayerState => {
  let currentState = state;
  // const currentHover = state.hover;
  // const nextHover = action.payload.id;
  // if (currentHover !==  null) {
  //   currentState = {
  //     ...currentState,
  //     byId: {
  //       ...currentState.byId,
  //       [currentHover]: {
  //         ...currentState.byId[currentHover],
  //         hover: false
  //       }
  //     }
  //   };
  // }
  // if (nextHover !== null) {
  //   currentState = {
  //     ...currentState,
  //     byId: {
  //       ...currentState.byId,
  //       [nextHover]: {
  //         ...currentState.byId[nextHover],
  //         hover: true
  //       }
  //     }
  //   };
  // }
  currentState = {
    ...currentState,
    hover: action.payload.id
  };
  return currentState;
};

export const addLayerChild = (state: LayerState, action: AddLayerChild): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const childItem = currentState.byId[action.payload.child];
  const isChildMask = childItem.type === 'Shape' && (childItem as Btwx.Shape).mask;
  const youngestChild = layerItem.children[layerItem.children.length - 1];
  const aboveId = youngestChild && youngestChild !== action.payload.child ? youngestChild : null;
  const aboveItem = aboveId ? currentState.byId[aboveId] as Btwx.MaskableLayer : null;
  const isAboveMask = aboveItem && aboveItem.type === 'Shape' && (aboveItem as Btwx.Shape).mask;
  const childItemParents = childItem.scope.filter((id, index) => index !== 0 && index !== 1);
  const layerItemParents = layerItem.scope.filter((id, index) => index !== 0 && index !== 1);
  const isChildInGroupEventsGroup = (childItem.type === 'Group' && (childItem as Btwx.Group).groupEventTweens) ? childItem.id : childItem.scope.find((id) => currentState.byId[id].type === 'Group' && (currentState.byId[id] as Btwx.Group).groupEventTweens);
  const isLayerInGroupEventsGroup = (layerItem.type === 'Group' && (layerItem as Btwx.Group).groupEventTweens) ? layerItem.id : layerItem.scope.find((id) => currentState.byId[id].type === 'Group' && (currentState.byId[id] as Btwx.Group).groupEventTweens);
  const prevLayerGroupEventsTweens = isLayerInGroupEventsGroup ? getOriginTweensByEventPropFull(currentState, isLayerInGroupEventsGroup) : null;
  const prevChildGroupEventsTweens = isChildInGroupEventsGroup ? getOriginTweensByEventPropFull(currentState, isChildInGroupEventsGroup) : null;
  const groupParents = [...childItemParents, ...layerItemParents].reduce((result, current) => {
    if (!result.includes(current)) {
      result = [...result, current];
    }
    return result;
  }, layerItem.type === 'Group' ? [action.payload.id] : []).reverse();
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
  if ((isChildInGroupEventsGroup || isLayerInGroupEventsGroup) && isChildInGroupEventsGroup !== isLayerInGroupEventsGroup) {
    if (isChildInGroupEventsGroup) {
      currentState = disableGroupGroupEventTweens(currentState, layerActions.disableGroupGroupEventTweens({id: isChildInGroupEventsGroup}) as DisableGroupGroupEventTweens);
    }
    if (isLayerInGroupEventsGroup) {
      currentState = disableGroupGroupEventTweens(currentState, layerActions.disableGroupGroupEventTweens({id: isLayerInGroupEventsGroup}) as DisableGroupGroupEventTweens);
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
  if (isLayerInGroupEventsGroup) {
    currentState = enableGroupGroupEventTweens(currentState, layerActions.enableGroupGroupEventTweens({id: isLayerInGroupEventsGroup}) as EnableGroupGroupEventTweens, prevLayerGroupEventsTweens);
  }
  if (isChildInGroupEventsGroup && isChildInGroupEventsGroup !== isLayerInGroupEventsGroup && isChildInGroupEventsGroup !== childItem.id) {
    currentState = enableGroupGroupEventTweens(currentState, layerActions.enableGroupGroupEventTweens({id: isChildInGroupEventsGroup}) as EnableGroupGroupEventTweens, prevChildGroupEventsTweens);
  }
  if (childItem.type === 'Artboard') {
    currentState = updateArtboardProjectIndices(currentState);
  }
  currentState = updateGroupParentBounds(currentState, groupParents);
  return currentState;
};

export const addLayerChildren = (state: LayerState, action: AddLayerChildren): LayerState => {
  let currentState = state;
  currentState = action.payload.children.reduce((result, current) => {
    return addLayerChild(result, layerActions.addLayerChild({id: action.payload.id, child: current}) as AddLayerChild);
  }, currentState);
  currentState = selectLayers(currentState, layerActions.selectLayers({layers: action.payload.children, newSelection: true}) as SelectLayers);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Add Layer Children',
      treeEdit: true,
      undoable: true
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
      treeEdit: true,
      undoable: false
    }
  }) as SetLayerEdit);
  return currentState;
};

export const showLayersChildren = (state: LayerState, action: ShowLayersChildren): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return showLayerChildren(result, layerActions.showLayerChildren({
      id: current
    }) as ShowLayerChildren);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Show Layers Children',
      treeEdit: true,
      undoable: false
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
      treeEdit: true,
      undoable: false
    }
  }) as SetLayerEdit);
  return currentState;
};

export const hideLayersChildren = (state: LayerState, action: HideLayersChildren): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return hideLayerChildren(result, layerActions.hideLayerChildren({
      id: current
    }) as HideLayerChildren);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Hide Layers Children',
      treeEdit: true,
      undoable: false
    }
  }) as SetLayerEdit);
  return currentState;
};

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
  const isBelowIgnoringUnderlyingMask = belowItem.type !== 'Artboard' && (belowItem as Btwx.MaskableLayer).ignoreUnderlyingMask;
  const belowItemParents = belowItem.scope.filter((id, index) => index !== 0 && index !== 1);
  const layerItemParents = layerItem.scope.filter((id, index) => index !== 0 && index !== 1);
  const isBelowInGroupEventsGroup = belowItem.scope.find((id) => currentState.byId[id].type === 'Group' && (currentState.byId[id] as Btwx.Group).groupEventTweens);
  const isLayerInGroupEventsGroup = (layerItem.type === 'Group' && (layerItem as Btwx.Group).groupEventTweens) ? layerItem.id : layerItem.scope.find((id) => currentState.byId[id].type === 'Group' && (currentState.byId[id] as Btwx.Group).groupEventTweens);
  const prevBelowGroupEventsTweens = isBelowInGroupEventsGroup ? getOriginTweensByEventPropFull(currentState, isBelowInGroupEventsGroup) : null;
  const prevLayerGroupEventsTweens = isLayerInGroupEventsGroup ? getOriginTweensByEventPropFull(currentState, isLayerInGroupEventsGroup) : null;
  const groupParents = [...belowItemParents, ...layerItemParents].reduce((result, current) => {
    if (!result.includes(current)) {
      result = [...result, current];
    }
    return result;
  }, []).reverse();
  // hack to clear sticky artboard on
  // tree data changes (see SidebarLayerTree handleItemsRendered)
  if (layerItem.type === 'Artboard') {
    currentState = setLayerTreeStickyArtboard(currentState, layerActions.setLayerTreeStickyArtboard({
      stickyArtboard: null
    }) as SetLayerTreeStickyArtboard);
  }
  // turn off masks
  if (isLayerIgnoringUnderlyingMask) {
    currentState = toggleLayerIgnoreUnderlyingMask(currentState, layerActions.toggleLayerIgnoreUnderlyingMask({
      id: action.payload.id
    }) as ToggleLayerIgnoreUnderlyingMask);
  }
  if (isLayerMask) {
    currentState = toggleLayerMask(currentState, layerActions.toggleLayerMask({
      id: action.payload.id
    }) as ToggleLayerMask);
  }
  if (isBelowIgnoringUnderlyingMask) {
    currentState = toggleLayerIgnoreUnderlyingMask(currentState, layerActions.toggleLayerIgnoreUnderlyingMask({
      id: action.payload.below
    }) as ToggleLayerIgnoreUnderlyingMask);
  }
  if (isBelowMask) {
    currentState = toggleLayerMask(currentState, layerActions.toggleLayerMask({
      id: action.payload.below
    }) as ToggleLayerMask);
  }
  if ((isLayerInGroupEventsGroup || isBelowInGroupEventsGroup) && isLayerInGroupEventsGroup !== isBelowInGroupEventsGroup) {
    if (isLayerInGroupEventsGroup) {
      currentState = disableGroupGroupEventTweens(currentState, layerActions.disableGroupGroupEventTweens({id: isLayerInGroupEventsGroup}) as DisableGroupGroupEventTweens);
    }
    if (isBelowInGroupEventsGroup) {
      currentState = disableGroupGroupEventTweens(currentState, layerActions.disableGroupGroupEventTweens({id: isBelowInGroupEventsGroup}) as DisableGroupGroupEventTweens);
    }
  }
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
    currentState = setLayerScope(currentState, layerActions.setLayerScope({
      id: action.payload.id,
      scope: [...belowParent.scope, belowItem.parent]
    }) as SetLayerScope);
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
          masked: (currentState.byId[action.payload.below] as Btwx.MaskableLayer).masked && !isLayerIgnoringUnderlyingMask
        } as Btwx.MaskableLayer
      }
    };
  }
  //
  if (layerItem.type === 'Artboard') {
    currentState = updateArtboardProjectIndices(currentState);
  }
  if (isLayerIgnoringUnderlyingMask) {
    currentState = toggleLayerIgnoreUnderlyingMask(currentState, layerActions.toggleLayerIgnoreUnderlyingMask({
      id: action.payload.id
    }) as ToggleLayerIgnoreUnderlyingMask);
  }
  if (isLayerMask) {
    currentState = toggleLayerMask(currentState, layerActions.toggleLayerMask({
      id: action.payload.id
    }) as ToggleLayerMask);
  }
  if (isBelowIgnoringUnderlyingMask) {
    currentState = toggleLayerIgnoreUnderlyingMask(currentState, layerActions.toggleLayerIgnoreUnderlyingMask({
      id: action.payload.below
    }) as ToggleLayerIgnoreUnderlyingMask);
  }
  if (isBelowMask) {
    currentState = toggleLayerMask(currentState, layerActions.toggleLayerMask({
      id: action.payload.below
    }) as ToggleLayerMask);
  }
  ///////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////
  // MIGHT BE BROKEN
  ///////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////
  if (isBelowInGroupEventsGroup) {
    currentState = enableGroupGroupEventTweens(currentState, layerActions.enableGroupGroupEventTweens({id: isBelowInGroupEventsGroup}) as EnableGroupGroupEventTweens, prevBelowGroupEventsTweens);
  }
  if (isLayerInGroupEventsGroup && isLayerInGroupEventsGroup !== isBelowInGroupEventsGroup && isLayerInGroupEventsGroup !== layerItem.id) {
    currentState = enableGroupGroupEventTweens(currentState, layerActions.enableGroupGroupEventTweens({id: isLayerInGroupEventsGroup}) as EnableGroupGroupEventTweens, prevLayerGroupEventsTweens);
  }
  ///////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////
  currentState = updateGroupParentBounds(currentState, groupParents);
  return currentState;
};

export const insertLayersBelow = (state: LayerState, action: InsertLayersBelow) => {
  let currentState = state;
  // const orderedLayers = orderLayersByDepth(currentState, action.payload.layers);
  currentState = action.payload.layers.reverse().reduce((result, current) => {
    return insertLayerBelow(result, layerActions.insertLayerBelow({
      id: current,
      below: action.payload.below
    }) as InsertLayerBelow);
  }, currentState);
  currentState = selectLayers(currentState, layerActions.selectLayers({
    layers: action.payload.layers,
    newSelection: true
  }) as SelectLayers);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Insert Layers Below',
      treeEdit: true,
      undoable: true
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
  const aboveItemParents = aboveItem.scope.filter((id, index) => index !== 0 && index !== 1);
  const layerItemParents = layerItem.scope.filter((id, index) => index !== 0 && index !== 1);
  const isAboveInGroupEventsGroup = aboveItem.scope.find((id) => currentState.byId[id].type === 'Group' && (currentState.byId[id] as Btwx.Group).groupEventTweens);
  const isLayerInGroupEventsGroup = (layerItem.type === 'Group' && (layerItem as Btwx.Group).groupEventTweens) ? layerItem.id : layerItem.scope.find((id) => currentState.byId[id].type === 'Group' && (currentState.byId[id] as Btwx.Group).groupEventTweens);
  const prevAboveGroupEventsTweens = isAboveInGroupEventsGroup ? getOriginTweensByEventPropFull(currentState, isAboveInGroupEventsGroup) : null;
  const prevLayerGroupEventsTweens = isLayerInGroupEventsGroup ? getOriginTweensByEventPropFull(currentState, isLayerInGroupEventsGroup) : null;
  const groupParents = [...aboveItemParents, ...layerItemParents].reduce((result, current) => {
    if (!result.includes(current)) {
      result = [...result, current];
    }
    return result;
  }, []).reverse();
  // hack to clear sticky artboard on
  // tree data changes (see SidebarLayerTree handleItemsRendered)
  if (layerItem.type === 'Artboard') {
    currentState = setLayerTreeStickyArtboard(currentState, layerActions.setLayerTreeStickyArtboard({
      stickyArtboard: null
    }) as SetLayerTreeStickyArtboard);
  }
  if (isAboveIgnoringUnderlyingMask) {
    currentState = toggleLayerIgnoreUnderlyingMask(currentState, layerActions.toggleLayerIgnoreUnderlyingMask({
      id: action.payload.above
    }) as ToggleLayerIgnoreUnderlyingMask);
  }
  if (isAboveMask) {
    currentState = toggleLayerMask(currentState, layerActions.toggleLayerMask({
      id: action.payload.above
    }) as ToggleLayerMask);
  }
  if (isLayerIgnoringUnderlyingMask) {
    currentState = toggleLayerIgnoreUnderlyingMask(currentState, layerActions.toggleLayerIgnoreUnderlyingMask({
      id: action.payload.id
    }) as ToggleLayerIgnoreUnderlyingMask);
  }
  if (isLayerMask) {
    currentState = toggleLayerMask(currentState, layerActions.toggleLayerMask({
      id: action.payload.id
    }) as ToggleLayerMask);
  }
  if ((isLayerInGroupEventsGroup || isAboveInGroupEventsGroup) && isLayerInGroupEventsGroup !== isAboveInGroupEventsGroup) {
    if (isLayerInGroupEventsGroup) {
      currentState = disableGroupGroupEventTweens(currentState, layerActions.disableGroupGroupEventTweens({id: isLayerInGroupEventsGroup}) as DisableGroupGroupEventTweens);
    }
    if (isAboveInGroupEventsGroup) {
      currentState = disableGroupGroupEventTweens(currentState, layerActions.disableGroupGroupEventTweens({id: isAboveInGroupEventsGroup}) as DisableGroupGroupEventTweens);
    }
  }
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
    currentState = setLayerScope(currentState, layerActions.setLayerScope({
      id: action.payload.id,
      scope: [...aboveParentItem.scope, aboveItem.parent]
    }) as SetLayerScope);
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
          masked: (currentState.byId[action.payload.above] as Btwx.MaskableLayer).masked && !isLayerIgnoringUnderlyingMask
        } as Btwx.MaskableLayer
      }
    };
  }
  if (layerItem.type === 'Artboard') {
    currentState = updateArtboardProjectIndices(currentState);
  }
  if (isAboveIgnoringUnderlyingMask) {
    currentState = toggleLayerIgnoreUnderlyingMask(currentState, layerActions.toggleLayerIgnoreUnderlyingMask({
      id: action.payload.above
    }) as ToggleLayerIgnoreUnderlyingMask);
  }
  if (isAboveMask) {
    currentState = toggleLayerMask(currentState, layerActions.toggleLayerMask({
      id: action.payload.above
    }) as ToggleLayerMask);
  }
  if (isLayerIgnoringUnderlyingMask) {
    currentState = toggleLayerIgnoreUnderlyingMask(currentState, layerActions.toggleLayerIgnoreUnderlyingMask({
      id: action.payload.id
    }) as ToggleLayerIgnoreUnderlyingMask);
  }
  if (isLayerMask) {
    currentState = toggleLayerMask(currentState, layerActions.toggleLayerMask({
      id: action.payload.id
    }) as ToggleLayerMask);
  }
  ///////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////
  // MIGHT BE BROKEN
  ///////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////
  if (isAboveInGroupEventsGroup) {
    currentState = enableGroupGroupEventTweens(currentState, layerActions.enableGroupGroupEventTweens({id: isAboveInGroupEventsGroup}) as EnableGroupGroupEventTweens, prevAboveGroupEventsTweens);
  }
  if (isLayerInGroupEventsGroup && isLayerInGroupEventsGroup !== isAboveInGroupEventsGroup && isLayerInGroupEventsGroup !== layerItem.id) {
    currentState = enableGroupGroupEventTweens(currentState, layerActions.enableGroupGroupEventTweens({id: isLayerInGroupEventsGroup}) as EnableGroupGroupEventTweens, prevLayerGroupEventsTweens);
  }
  ///////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////
  currentState = updateGroupParentBounds(currentState, groupParents);
  return currentState;
};

export const insertLayersAbove = (state: LayerState, action: InsertLayersAbove): LayerState => {
  let currentState = state;
  // const orderedLayers = orderLayersByDepth(state, action.payload.layers);
  currentState = action.payload.layers.reverse().reduce((result, current) => {
    return insertLayerAbove(result, layerActions.insertLayerAbove({
      id: current,
      above: action.payload.above
    }) as InsertLayerAbove);
  }, currentState);
  currentState = selectLayers(currentState, layerActions.selectLayers({
    layers: action.payload.layers,
    newSelection: true
  }) as SelectLayers);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Insert Layers Above',
      treeEdit: true,
      undoable: true
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

export const clearLayerScope = (state: LayerState, action: ClearLayerScope): LayerState => {
  return {
    ...state,
    scope: state.scope.slice(0, 1)
  }
};

export const newLayerScope = (state: LayerState, action: NewLayerScope): LayerState => ({
  ...state,
  scope: state.byId[action.payload.id].scope
});

export const escapeLayerScope = (state: LayerState, action: EscapeLayerScope): LayerState => {
  const nextScope = state.scope.filter((id, index) => index !== state.scope.length - 1);
  let currentState = state;
  if (state.scope.length > 1) {
    currentState = selectLayers(state, layerActions.selectLayers({layers: [state.scope[state.scope.length - 1]], newSelection: true}) as SelectLayers);
    currentState = setLayerTreeScroll(currentState, layerActions.setLayerTreeScroll({
      scroll: state.scope[state.scope.length - 1]
    }) as SetLayerTreeScroll);
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
  const artboardsMatch = hasArtboard && action.payload.scope[1] === currentState.activeArtboard;
  currentState = {
    ...currentState,
    scope: [...action.payload.scope]
  }
  if (!artboardsMatch) {
    currentState = setActiveArtboard(currentState, layerActions.setActiveArtboard({
      id: action.payload.scope[1]
    }) as SetActiveArtboard);
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
  currentState = insertLayerBelow(currentState, layerActions.insertLayerBelow({
    id: action.payload.group.id,
    below: action.payload.layers[0]
  }) as InsertLayerBelow);
  // add layers to group
  currentState = orderedLayersByDepth.reduce((result, current) => {
    return addLayerChild(result, layerActions.addLayerChild({
      id: action.payload.group.id,
      child: current
    }) as AddLayerChild);
  }, currentState);
  // select final group
  currentState = selectLayers(currentState, layerActions.selectLayers({
    layers: [action.payload.group.id],
    newSelection: true
  }) as SelectLayers);
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
  currentState = setLayerTreeScroll(currentState, layerActions.setLayerTreeScroll({
    scroll: action.payload.group.id
  }) as SetLayerTreeScroll);
  // currentState = setLayerTreeStickyArtboard(currentState, layerActions.setLayerTreeStickyArtboard({
  //   stickyArtboard: action.payload.group.artboard
  // }) as SetLayerTreeStickyArtboard);
  // set layer edit
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Group Layers',
      treeEdit: true,
      undoable: true
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
      return insertLayerBelow(result, layerActions.insertLayerBelow({
        id: current,
        below: action.payload.id
      }) as InsertLayerBelow);
    }, currentState);
    //
    // if (masks.length > 0) {
    //   currentState = masks.reduce((result: LayerState, current: string) => {
    //     return toggleLayerMask(result, layerActions.toggleLayerMask({id: current}) as ToggleLayerMask);
    //   }, currentState);
    // }
    // select ungrouped children
    currentState = selectLayers(currentState, layerActions.selectLayers({
      layers: layerItem.children,
      newSelection: true
    }) as SelectLayers);
    // remove group
    currentState = removeLayer(currentState, layerActions.removeLayer({
      id: action.payload.id
    }) as RemoveLayer);
  } else {
    currentState = selectLayers(state, layerActions.selectLayers({
      layers: [action.payload.id],
      newSelection: true
    }) as SelectLayers);
  }
  return currentState;
};

export const ungroupLayers = (state: LayerState, action: UngroupLayers): LayerState => {
  let currentState = state;
  const newSelection: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    // ungroup layer
    result = ungroupLayer(result, layerActions.ungroupLayer({
      id: current
    }) as UngroupLayer);
    // push ungrouped selection to newSelection
    newSelection.push(...result.selected);
    // return result
    return result;
  }, currentState);
  // select newSelection
  currentState = selectLayers(currentState, layerActions.selectLayers({
    layers: newSelection,
    newSelection: true
  }) as SelectLayers);
  // return final state
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Ungroup Layers',
      treeEdit: true,
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

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

export const moveLayer = (state: LayerState, action: MoveLayer): LayerState => {
  let currentState = state;
  const layerItem = state.byId[action.payload.id];
  if (layerItem.type === 'Group') {
    const layerDescendants = getLayerDescendants(currentState, action.payload.id);
    currentState = layerDescendants.reduce((result, current) => {
      const descendantItem = result.byId[current];
      // result = updateLayerBounds(result, current);
      if (descendantItem.type !== 'Group') {
        result = updateLayerTweensByProps(result, current, ['x', 'y']);
      }
      return result;
    }, currentState);
  } else {
    currentState = updateLayerTweensByProps(currentState, action.payload.id, ['x', 'y']);
  }
  return currentState;
};

export const moveLayers = (state: LayerState, action: MoveLayers): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return moveLayer(result, layerActions.moveLayer({
      id: current
    }) as MoveLayer);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Move Layers',
      undoable: true
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
  currentState = action.payload.layers.reduce((result, current) => {
    return moveLayerTo(result, layerActions.moveLayerTo({
      id: current,
      x: action.payload.x,
      y: action.payload.y
    }) as MoveLayerTo);
  }, state);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Move Layers To',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const moveLayerBy = (state: LayerState, action: MoveLayerBy): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const groupParents = layerItem.type === 'Artboard' ? ['root'] : layerItem.scope.filter((id, index) => index !== 0 && index !== 1).reverse();
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
            },
            lines: (cs.byId[id] as Btwx.Text).lines.reduce((lr, lc) => {
              return [
                ...lr,
                {
                  ...lc,
                  frame: {
                    ...lc.frame,
                    x: lc.frame.x + action.payload.x,
                    y: lc.frame.y + action.payload.y
                  },
                  anchor: {
                    ...lc.anchor,
                    x: lc.anchor.x + action.payload.x,
                    y: lc.anchor.y + action.payload.y
                  }
                }
              ]
            }, [])
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
      cs = updateLayerTweensByProps(cs, id, ['x', 'y']);
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
  currentState = updateGroupParentBounds(currentState, groupParents);
  return currentState;
};

export const moveLayersBy = (state: LayerState, action: MoveLayersBy): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return moveLayerBy(result, layerActions.moveLayerBy({
      id: current,
      x: action.payload.x,
      y: action.payload.y
    }) as MoveLayerBy);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Move Layers By',
      undoable: true
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
      undoable: true
    }
  }) as SetLayerEdit);
  // return final state
  return currentState;
};

export const setActiveArtboard = (state: LayerState, action: SetActiveArtboard): LayerState => {
  let currentState = state;
  const projectIndex = action.payload.id ? (state.byId[action.payload.id] as Btwx.Artboard).projectIndex : null;
  currentState = {
    ...currentState,
    activeArtboard: action.payload.id,
    activeProjectIndex: projectIndex
  }
  return currentState;
};

export const addLayerEvent = (state: LayerState, action: AddLayerEvent): LayerState => {
  const artboardChildren = getLayerDescendants(state, action.payload.origin);
  let currentState = state;
  // if an event doesnt already exist with the same layer, event, and destination
  // add tween event
  if (!currentState.events.allIds.some((id: string) => (
    currentState.events.byId[id].layer === action.payload.layer &&
    currentState.events.byId[id].listener === action.payload.listener &&
    currentState.events.byId[id].destination === action.payload.destination
  ))) {
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
          [action.payload.id]: action.payload as Btwx.Event
        }
      }
    }
    // add event to event origin
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.origin]: {
          ...currentState.byId[action.payload.origin],
          originForEvents: addItem((currentState.byId[action.payload.origin] as Btwx.Artboard).originForEvents, action.payload.id)
        } as Btwx.Artboard
      }
    }
    // add event to event destination
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.destination]: {
          ...currentState.byId[action.payload.destination],
          destinationForEvents: addItem((currentState.byId[action.payload.destination] as Btwx.Artboard).destinationForEvents, action.payload.id)
        } as Btwx.Artboard
      }
    }
    // add background tween
    if (hasFillTween(currentState.byId[action.payload.origin], currentState.byId[action.payload.destination])) {
      const equivalentTweenProps = getEquivalentTweenProps(currentState, currentState.byId[action.payload.origin], currentState.byId[action.payload.destination]);
      currentState = Object.keys(equivalentTweenProps).reduce((result, key: Btwx.TweenProp) => {
        if (equivalentTweenProps[key]) {
          result = addLayerTween(result, layerActions.addLayerTween({
            layer: action.payload.origin,
            destinationLayer: action.payload.destination,
            prop: key,
            event: action.payload.id,
            ease: DEFAULT_TWEEN_EASE,
            ...getDefaultTweenProps(key) as any
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
      detail: 'Add Event Listener',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const addLayersEvent = (state: LayerState, action: AddLayersEvent): LayerState => {
  let currentState = state;
  currentState = action.payload.events.reduce((result, current, index) => {
    return addLayerEvent(result, layerActions.addLayerEvent(current) as AddLayerEvent);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Add Event Listeners',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const removeLayerEvent = (state: LayerState, action: RemoveLayerEvent): LayerState => {
  let currentState = state;
  const animEvent = state.events.byId[action.payload.id];
  // remove from selected
  if (currentState.events.selected.includes(action.payload.id)) {
    currentState = deselectLayerEvent(currentState, layerActions.deselectLayerEvent({
      id: action.payload.id
    }) as DeselectLayerEvent);
  }
  // remove animation event tweens
  currentState = animEvent.tweens.allIds.reduce((result, current) => {
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
      [animEvent.origin]: {
        ...currentState.byId[animEvent.origin],
        originForEvents: removeItem((currentState.byId[animEvent.origin] as Btwx.Artboard).originForEvents, action.payload.id)
      } as Btwx.Artboard,
      [animEvent.destination]: {
        ...currentState.byId[animEvent.destination],
        destinationForEvents: removeItem((currentState.byId[animEvent.destination] as Btwx.Artboard).destinationForEvents, action.payload.id)
      } as Btwx.Artboard
    }
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Remove Layer Event',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const removeLayersEvent = (state: LayerState, action: RemoveLayersEvent): LayerState => {
  let currentState = state;
  currentState = action.payload.events.reduce((result, current, index) => {
    return removeLayerEvent(result, layerActions.removeLayerEvent({
      id: current
    }) as RemoveLayerEvent);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Remove Event Listeners',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerEventEventListener = (state: LayerState, action: SetLayerEventEventListener): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    events: {
      ...currentState.events,
      byId: {
        ...currentState.events.byId,
        [action.payload.id]: {
          ...currentState.events.byId[action.payload.id],
          listener: action.payload.eventListener
        }
      }
    }
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layer Event Event Listener',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayersEventEventListener = (state: LayerState, action: SetLayersEventEventListener): LayerState => {
  let currentState = state;
  currentState = action.payload.events.reduce((result, current, index) => {
    return setLayerEventEventListener(result, layerActions.setLayerEventEventListener({
      id: current,
      eventListener: action.payload.eventListener
    }) as SetLayerEventEventListener);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layer Events Event Listener',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const selectLayerEvent = (state: LayerState, action: SelectLayerEvent): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    events: {
      ...currentState.events,
      selected: action.payload.newSelection ? [action.payload.id] : addItem(currentState.events.selected, action.payload.id)
    }
  }
  return currentState;
};

export const deselectLayerEvent = (state: LayerState, action: DeselectLayerEvent): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    events: {
      ...currentState.events,
      selected: removeItem(currentState.events.selected, action.payload.id)
    }
  }
  return currentState;
};

export const selectLayerEvents = (state: LayerState, action: SelectLayerEvents): LayerState => {
  let currentState = state;
  if (action.payload.newSelection) {
    currentState = {
      ...currentState,
      events: {
        ...currentState.events,
        selected: []
      }
    }
  }
  currentState = action.payload.events.reduce((result, current) => {
    return selectLayerEvent(result, layerActions.selectLayerEvent({
      id: current
    }) as SelectLayerEvent);
  }, currentState);
  return currentState;
};

export const deselectLayerEvents = (state: LayerState, action: DeselectLayerEvents): LayerState => {
  let currentState = state;
  currentState = action.payload.events.reduce((result, current) => {
    return deselectLayerEvent(result, layerActions.deselectLayerEvent({
      id: current
    }) as DeselectLayerEvent);
  }, state);
  return currentState;
};

export const deselectAllLayerEvents = (state: LayerState, action: DeselectAllLayerEvents): LayerState => {
  let currentState = state;
  currentState = currentState.events.selected.reduce((result, current) => {
    return deselectLayerEvent(result, layerActions.deselectLayerEvent({
      id: current
    }) as DeselectLayerEvent);
  }, state);
  return currentState;
};

export const addTweenEventLayerTweens = (state: LayerState, eventId: string, layerId: string): LayerState => {
  let currentState = state;
  const tweenEvent = currentState.events.byId[eventId];
  const destinationArtboardChildren = getLayerDescendants(currentState, tweenEvent.destination);
  const destinationEquivalent = getDestinationEquivalent(currentState, layerId, destinationArtboardChildren);
  if (destinationEquivalent) {
    const currentLayerItem = state.byId[layerId];
    const equivalentLayerItem = state.byId[destinationEquivalent.id];
    const equivalentTweenProps = getEquivalentTweenProps(currentState, currentLayerItem, equivalentLayerItem);
    currentState = Object.keys(equivalentTweenProps).reduce((result, key: Btwx.TweenProp) => {
      if (equivalentTweenProps[key]) {
        result = addLayerTween(result, layerActions.addLayerTween({
          layer: layerId,
          destinationLayer: destinationEquivalent.id,
          prop: key,
          event: eventId,
          ...getDefaultTweenProps(key) as any
        }) as AddLayerTween);
      }
      return result;
    }, currentState);
  }
  return currentState;
};

export const addLayerTween = (state: LayerState, action: AddLayerTween): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.layer];
  const tweensGroup = layerItem.scope.find((id) => currentState.byId[id].type === 'Group' && (currentState.byId[id] as Btwx.Group).groupEventTweens);
  if (layerItem.type === 'Group' && (layerItem as Btwx.Group).groupEventTweens) {
    const groupDescendents = getLayerDescendants(currentState, action.payload.layer, false);
    const eventItem = currentState.events.byId[action.payload.event];
    const eventTweens = eventItem.tweens;
    const groupLayersWithEventTweens = groupDescendents.filter((id) => {
      return currentState.events.byId[action.payload.event].tweens.byLayer[id] && currentState.events.byId[action.payload.event].tweens.byLayer[id].length > 0;
    });
    const isGroupWiggle = action.payload.ease === 'customWiggle';
    const groupLayersWithEventPropTweens = groupLayersWithEventTweens.reduce((r, c) => {
      const layerItem = currentState.byId[c];
      const tweensByProp = layerItem.tweens.byProp[action.payload.prop].filter((i) => eventTweens.byProp[action.payload.prop].includes(i));
      r = [...r, ...tweensByProp];
      return r;
    }, []);
    const wiggleTweens = groupLayersWithEventPropTweens.filter((tid) => currentState.tweens.byId[tid].ease === 'customWiggle');
    const nonWiggleTweens = groupLayersWithEventPropTweens.filter((tid) => currentState.tweens.byId[tid].ease !== 'customWiggle');
    const siblingTweens = isGroupWiggle ? wiggleTweens : nonWiggleTweens;
    action.payload = {
      ...action.payload,
      siblings: siblingTweens
    }
    // const siblingTweens = groupLayersWithEventTweens.reduce((r, c) => {
    //   const layerItem = currentState.byId[c];
    //   const tweensByProp = layerItem.tweens.byProp[action.payload.prop].filter((i) => eventTweens.byProp[action.payload.prop].includes(i) && (isGroupWiggle === (currentState.tweens.byId[i].ease === 'customWiggle')));
    //   r = [...r, ...tweensByProp];
    //   return r;
    // }, []);
    currentState = {
      ...currentState,
      events: {
        ...currentState.events,
        byId: {
          ...currentState.events.byId,
          [action.payload.event]: {
            ...currentState.events.byId[action.payload.event],
            layers: [
              ...currentState.events.byId[action.payload.event].layers.filter((l) => !groupLayersWithEventTweens.includes(l) && l !== action.payload.layer),
              action.payload.layer
            ]
          }
        }
      }
    }
    currentState = siblingTweens.reduce((r, c) => {
      return {
        ...r,
        tweens: {
          ...r.tweens,
          byId: {
            ...r.tweens.byId,
            [c]: {
              ...r.tweens.byId[c],
              group: action.payload.id
            }
          }
        }
      }
    }, currentState);
  }
  // handle adding layer to event.layers
  if (!currentState.events.byId[action.payload.event].layers.includes(action.payload.layer)) {
    currentState = {
      ...currentState,
      events: {
        ...currentState.events,
        byId: {
          ...currentState.events.byId,
          [action.payload.event]: {
            ...currentState.events.byId[action.payload.event],
            layers: addItem(currentState.events.byId[action.payload.event].layers, action.payload.layer)
          }
        }
      }
    }
  }
  // handle adding event.tweens.byLayer
  if (!currentState.events.byId[action.payload.event].tweens.byLayer[action.payload.layer]) {
    currentState = {
      ...currentState,
      events: {
        ...currentState.events,
        byId: {
          ...currentState.events.byId,
          [action.payload.event]: {
            ...currentState.events.byId[action.payload.event],
            tweens: {
              ...currentState.events.byId[action.payload.event].tweens,
              byLayer: {
                ...currentState.events.byId[action.payload.event].tweens.byLayer,
                [action.payload.layer]: [action.payload.id]
              }
            }
          }
        }
      }
    }
  } else {
    currentState = {
      ...currentState,
      events: {
        ...currentState.events,
        byId: {
          ...currentState.events.byId,
          [action.payload.event]: {
            ...currentState.events.byId[action.payload.event],
            tweens: {
              ...currentState.events.byId[action.payload.event].tweens,
              byLayer: {
                ...currentState.events.byId[action.payload.event].tweens.byLayer,
                [action.payload.layer]: addItem(currentState.events.byId[action.payload.event].tweens.byLayer[action.payload.layer], action.payload.id)
              }
            }
          }
        }
      }
    }
  }
  // handle adding event.tweens.byProp
  currentState = {
    ...currentState,
    events: {
      ...currentState.events,
      byId: {
        ...currentState.events.byId,
        [action.payload.event]: {
          ...currentState.events.byId[action.payload.event],
          tweens: {
            ...currentState.events.byId[action.payload.event].tweens,
            byProp: {
              ...currentState.events.byId[action.payload.event].tweens.byProp,
              [action.payload.prop]: addItem(currentState.events.byId[action.payload.event].tweens.byProp[action.payload.prop], action.payload.id)
            }
          }
        }
      }
    }
  }
  // handle adding tween to event.tweens.allIds
  currentState = {
    ...currentState,
    events: {
      ...currentState.events,
      byId: {
        ...currentState.events.byId,
        [action.payload.event]: {
          ...currentState.events.byId[action.payload.event],
          tweens: {
            ...currentState.events.byId[action.payload.event].tweens,
            allIds: addItem(currentState.events.byId[action.payload.event].tweens.allIds, action.payload.id)
          }
        }
      }
    }
  }
  // handle adding tween to action.payload.layer
  currentState = {
    ...currentState,
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
      }
    }
  }
  // handle adding tween to action.payload.destinationLayer
  if (action.payload.destinationLayer) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
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
      }
    }
  }
  // handle adding tween to tweens
  currentState = {
    ...currentState,
    tweens: {
      ...currentState.tweens,
      allIds: addItem(currentState.tweens.allIds, action.payload.id),
      byId: {
        ...currentState.tweens.byId,
        // [action.payload.id]: {
        //   ...action.payload as Btwx.Tween,
        //   group: tweensGroup
        // }
        [action.payload.id]: action.payload as Btwx.Tween
      }
    }
  }
  // handle adding tween if in tweenGroup
  if (tweensGroup) {
    const isGroupWiggle = action.payload.ease === 'customWiggle';
    const groupTweens = getOriginTweensByEventProp(state, tweensGroup);
    if (groupTweens[action.payload.event] && groupTweens[action.payload.event][action.payload.prop].length > 0 && groupTweens[action.payload.event][action.payload.prop].find((id) => isGroupWiggle === (currentState.tweens.byId[id].ease === 'customWiggle'))) {
      const groupTween = groupTweens[action.payload.event][action.payload.prop].find((id) => isGroupWiggle === (currentState.tweens.byId[id].ease === 'customWiggle'));
      currentState = {
        ...currentState,
        events: {
          ...currentState.events,
          byId: {
            ...currentState.events.byId,
            [action.payload.event]: {
              ...currentState.events.byId[action.payload.event],
              layers: removeItem(currentState.events.byId[action.payload.event].layers, action.payload.layer)
            }
          }
        },
        tweens: {
          ...currentState.tweens,
          byId: {
            ...currentState.tweens.byId,
            [action.payload.id]: {
              ...currentState.tweens.byId[action.payload.id],
              group: groupTween
            },
            [groupTween]: {
              ...currentState.tweens.byId[groupTween],
              siblings: addItem(currentState.tweens.byId[groupTween].siblings, action.payload.id)
            }
          }
        }
      }
    } else {
      currentState = addLayerTween(currentState, layerActions.addLayerTween({
        layer: tweensGroup,
        destinationLayer: null,
        prop: action.payload.prop,
        event: action.payload.event,
        ...getDefaultTweenProps(action.payload.prop) as any,
        ease: action.payload.ease === 'customWiggle' ? action.payload.ease : DEFAULT_TWEEN_EASE,
      }) as AddLayerTween);
    }
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Add Layer Tween',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

// const addLayerTweenToGroupTween = (state: LayerState, id: string, group: string): LayerState => {
//   let currentState = state;
//   const layerTween = state.tweens.byId[id];
//   currentState = {
//     ...currentState,
//     tweens: {
//       ...currentState.tweens,
//       byId: {
//         ...currentState.tweens.byId,
//         [id]: {
//           ...currentState.tweens[id],
//           group: group
//         },
//         [group]: {
//           ...currentState.tweens[group],
//           siblings: addItem(currentState.tweens[group].siblings, id)
//         }
//       }
//     },
//     events: {
//       ...currentState.events,
//       byId: {
//         ...currentState.events.byId,
//         [layerTween.event]: {
//           ...currentState.events.byId[layerTween.event],
//           layers: removeItem(currentState.events.byId[layerTween.event].layers, id)
//         }
//       }
//     }
//   }
//   return currentState;
// }

// const removeLayerTweenFromGroupTween = (state: LayerState, id: string, group: string): LayerState => {
//   let currentState = state;
//   const layerTween = state.tweens.byId[id];
//   currentState = {
//     ...currentState,
//     tweens: {
//       ...currentState.tweens,
//       byId: {
//         ...currentState.tweens.byId,
//         [id]: {
//           ...currentState.tweens[id],
//           group: null
//         },
//         [group]: {
//           ...currentState.tweens[group],
//           siblings: currentState.tweens[group].siblings.filter((ti) => ti !== id)
//         }
//       }
//     },
//     events: {
//       ...currentState.events,
//       byId: {
//         ...currentState.events.byId,
//         [layerTween.event]: {
//           ...currentState.events.byId[layerTween.event],
//           layers: addItem(currentState.events.byId[layerTween.event].layers, id)
//         }
//       }
//     }
//   }
//   return currentState;
// }

// // change to only update groups when group children change
// export const updateGroupEventTweens = (state: LayerState, id: string): LayerState => {
//   let currentState = state;
//   const layerItem = state.byId[id] as Btwx.Group;
//   const artboardItem = currentState.byId[layerItem.artboard] as Btwx.Artboard;
//   const hasScopedGroupEventTweens = layerItem.scope.find((si) =>
//     state.byId[si].type === 'Group' && (state.byId[si] as Btwx.Group).groupEventTweens
//   );
//   if (layerItem.groupEventTweens) {
//     if (hasScopedGroupEventTweens) {

//     } else {
//       const groupDescendents = getLayerDescendants(currentState, id, false);
//       const groupItemTweens = getOriginTweensByEventProp(currentState, id);
//       currentState = groupDescendents.reduce((result, current) => {

//       }, currentState);
//     }
//   }
// }

// // 1. need to update layer tweens when moving between groups (if groupEventTweens)
// // 2. need to update groupEventTweens if moving groups with stacked groupEventTweens
// // 3. need prop for easier referenceing between thingamajigs
// export const updateLayerGroupEventTweens = (state: LayerState, id: string): LayerState => {
//   let currentState = state;
//   const layerItem = state.byId[id];
//   const hasScopedGroupEventTweens = layerItem.scope.find((si) => state.byId[si].type === 'Group' && (state.byId[si] as Btwx.Group).groupEventTweens);
//   if (hasScopedGroupEventTweens) {
//     const layerItemTweens = getOriginTweensByEventProp(currentState, id);
//     const groupItemTweens = getOriginTweensByEventProp(currentState, hasScopedGroupEventTweens);
//     currentState = Object.keys(layerItemTweens).reduce((result, current) => {
//       return Object.keys(layerItemTweens[current]).reduce((r, c) => {
//         const layerEventPropTween = layerItemTweens[current][c][0];
//         const groupEventPropTween = groupItemTweens[current][c][0];
//         if (layerEventPropTween) {
//           const layerEventPropTweenItem = state.tweens.byId[layerEventPropTween];
//           if (layerEventPropTweenItem.group && layerEventPropTweenItem.group !== groupEventPropTween) {
//             r = {
//               ...r,
//               tweens: {
//                 ...r.tweens,
//                 byId: {
//                   ...r.tweens.byId,
//                   [layerEventPropTweenItem.group]: {
//                     ...result.tweens[layerEventPropTweenItem.group],
//                     siblings: result.tweens[layerEventPropTweenItem.group].siblings.filter((ti) => ti !== layerEventPropTween)
//                   }
//                 }
//               }
//             }
//           }
//           let groupTweenId;
//           if (groupEventPropTween) {
//             groupTweenId = groupEventPropTween;
//           } else {
//             r = addLayerTween(r, layerActions.addLayerTween({
//               layer: hasScopedGroupEventTweens,
//               destinationLayer: null,
//               prop: c,
//               event: current,
//               ease: DEFAULT_TWEEN_EASE,
//               ...getDefaultTweenProps(c) as any
//             }) as AddLayerTween);
//             groupTweenId = r.tweens.allIds[r.tweens.allIds.length - 1];
//           }
//           if (r.events.byId[r.tweens[groupTweenId].event].layers.includes(id)) {
//             r = {
//               ...r,
//               events: {
//                 ...r.events,
//                 byId: {
//                   ...r.events.byId,
//                   [r.tweens[groupTweenId].event]: {
//                     ...r.events.byId[r.tweens[groupTweenId].event],
//                     layers: removeItem(r.events.byId[r.tweens[groupTweenId].event].layers, id)
//                   }
//                 }
//               }
//             }
//           }
//           r = {
//             ...r,
//             tweens: {
//               ...r.tweens,
//               byId: {
//                 ...r.tweens.byId,
//                 [layerEventPropTween]: {
//                   ...r.tweens[layerEventPropTween],
//                   group: groupTweenId
//                 },
//                 [groupTweenId]: {
//                   ...r.tweens[groupTweenId],
//                   siblings: [
//                     ...r.tweens[groupTweenId].siblings.filter((ti) => ti !== layerEventPropTween),
//                     layerEventPropTween
//                   ]
//                 }
//               }
//             }
//           }
//         }
//         return r;
//       }, result);
//     }, currentState);
//     // get all tweens
//     // if non-group
//     //  if no group tweens, create one
//     //    add groupEvents group anscestor to tweens
//     // if group w/ groupEvents
//     //  remove all group tweens
//     // if out of groupEvents
//     //  remove group from tweens & add back to event layers
//     // currentState = layerItem.tweens.asOrigin.reduce((result, current) => {
//     //   const tween = result.tweens.byId[current];
//     //   const groupItem = result.byId[hasScopedGroupEventTweens];
//     //   const tweenGroup = groupItem.tweens.asOrigin.find((ti) => {
//     //     const groupTween = result.tweens.byId[ti];
//     //     if (tween.prop === groupTween.prop) {
//     //       if (groupItem.tweens.byProp[tween.prop].length === 0) {
//     //         // add group tween
//     //         result = addLayerTween(result, layerActions.addLayerTween({
//     //           layer: groupItem.id,
//     //           destinationLayer: null,
//     //           prop: tween.prop,
//     //           event: tween.event,
//     //           ease: DEFAULT_TWEEN_EASE,
//     //           ...getDefaultTweenProps(tween.prop) as any
//     //         }) as AddLayerTween);
//     //         return result.tweens.allIds[result.tweens.allIds.length - 1];
//     //       } else {
//     //         return groupTween.id;
//     //       }
//     //     }
//     //   });
//     //   result = {
//     //     ...result,
//     //     tweens: {
//     //       ...result.tweens,
//     //       byId: {
//     //         ...result.tweens.byId,
//     //         [current]: {
//     //           ...result.tweens[current],
//     //           group:
//     //         }
//     //       }
//     //     }
//     //   }
//     //   return result;
//     // }, currentState);
//   }
// }

export const removeLayerTween = (state: LayerState, action: RemoveLayerTween): LayerState => {
  const tween = state.tweens.byId[action.payload.id];
  const layerItem = state.byId[tween.layer];
  let currentState = state;
  const onlyLayerTween = currentState.events.byId[tween.event].tweens.byLayer[tween.layer].length === 1;
  if (currentState.tweens.selected.allIds.includes(action.payload.id)) {
    currentState = deselectLayerEventTween(currentState, layerActions.deselectLayerEventTween({
      id: action.payload.id
    }) as DeselectLayerEventTween);
  }
  //
  if (layerItem.type === 'Group' && (layerItem as Btwx.Group).groupEventTweens) {
    if (onlyLayerTween) {
      currentState = {
        ...currentState,
        events: {
          ...currentState.events,
          byId: {
            ...currentState.events.byId,
            [tween.event]: {
              ...currentState.events.byId[tween.event],
              layers: Object.keys(currentState.events.byId[tween.event].tweens.byLayer).filter((l) => l !== tween.layer)
            }
          }
        }
      }
    }
    currentState = tween.siblings.reduce((r, c) => {
      return {
        ...r,
        tweens: {
          ...r.tweens,
          byId: {
            ...r.tweens.byId,
            [c]: {
              ...r.tweens.byId[c],
              group: null
            }
          }
        }
      }
    }, currentState);
  } else {
    // remove tween from event.layers
    if (currentState.events.byId[tween.event].layers.includes(tween.layer) && onlyLayerTween) {
      currentState = {
        ...currentState,
        events: {
          ...currentState.events,
          byId: {
            ...currentState.events.byId,
            [tween.event]: {
              ...currentState.events.byId[tween.event],
              layers: removeItem(currentState.events.byId[tween.event].layers, tween.layer)
            }
          }
        }
      }
    }
  }
  if (tween.group) {
    currentState = {
      ...currentState,
      tweens: {
        ...currentState.tweens,
        byId: {
          ...currentState.tweens.byId,
          [tween.group]: {
            ...currentState.tweens.byId[tween.group],
            siblings: removeItem(currentState.tweens.byId[tween.group].siblings, action.payload.id)
          }
        }
      }
    }
  }
  // handle removing from event.tweens
  currentState = {
    ...currentState,
    events: {
      ...currentState.events,
      byId: {
        ...currentState.events.byId,
        [tween.event]: {
          ...currentState.events.byId[tween.event],
          tweens: {
            ...currentState.events.byId[tween.event].tweens,
            allIds: removeItem(currentState.events.byId[tween.event].tweens.allIds, action.payload.id),
            byLayer: Object.keys(currentState.events.byId[tween.event].tweens.byLayer).reduce((result, current) => {
              if (tween.layer === current) {
                if (!onlyLayerTween) {
                  result = {
                    ...result,
                    [current]: removeItem(currentState.events.byId[tween.event].tweens.byLayer[current], action.payload.id)
                  }
                }
              } else {
                result = {
                  ...result,
                  [current]: currentState.events.byId[tween.event].tweens.byLayer[current]
                }
              }
              return result;
            }, {}),
            byProp: {
              ...currentState.events.byId[tween.event].tweens.byProp,
              [tween.prop]: removeItem(currentState.events.byId[tween.event].tweens.byProp[tween.prop], action.payload.id)
            }
          }
        }
      }
    }
  }
  // handle removing from tween.layer
  currentState = {
    ...currentState,
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
      }
    }
  }
  // handle removing from tween.destinationLayer
  if (tween.destinationLayer) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
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
      }
    }
  }
  // handle removing from tweens
  currentState = {
    ...currentState,
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
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const removeLayerTweens = (state: LayerState, action: RemoveLayerTweens): LayerState => {
  let currentState = state;
  currentState = action.payload.tweens.reduce((result, current) => {
    // if group wiggle, remove group and sibling wiggles
    if (currentState.tweens.byId[current].siblings.length > 0 && currentState.tweens.byId[current].ease === 'customWiggle') {
      result = currentState.tweens.byId[current].siblings.reduce((r, c) => {
        return removeLayerTween(r, layerActions.removeLayerTween({
          id: c
        }) as RemoveLayerTween);
      }, result);
    }
    return removeLayerTween(result, layerActions.removeLayerTween({
      id: current
    }) as RemoveLayerTween);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Remove Layer Tweens',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const selectLayerEventTween = (state: LayerState, action: SelectLayerEventTween): LayerState => {
  let currentState = state;
  const isSelected = currentState.tweens.selected.allIds.includes(action.payload.id);
  currentState = {
    ...currentState,
    tweens: {
      ...currentState.tweens,
      selected: {
        ...currentState.selected,
        allIds: action.payload.newSelection
        ? [action.payload.id]
        : isSelected
        ? currentState.tweens.selected.allIds
        : addItem(currentState.tweens.selected.allIds, action.payload.id),
        handle: action.payload.newSelection ? {
          [action.payload.id]: action.payload.handle
        } : {
          ...currentState.tweens.selected.handle,
          [action.payload.id]: action.payload.handle
        }
      }
    }
  }
  return currentState;
};

export const deselectLayerEventTween = (state: LayerState, action: DeselectLayerEventTween): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    tweens: {
      ...currentState.tweens,
      selected: {
        ...currentState.tweens.selected,
        allIds: removeItem(currentState.tweens.selected.allIds, action.payload.id),
        handle: Object.keys(currentState.tweens.selected.handle).reduce((result, current) => {
          if (current !== action.payload.id) {
            result = {
              ...result,
              [current]: currentState.tweens.selected.handle[current]
            }
          }
          return result;
        }, {})
      }
    }
  }
  return currentState;
};

export const selectLayerEventTweens = (state: LayerState, action: SelectLayerEventTweens): LayerState => {
  let currentState = state;
  if (action.payload.newSelection) {
    currentState = {
      ...currentState,
      tweens: {
        ...currentState.tweens,
        selected: {
          ...currentState.tweens.selected,
          allIds: [],
          handle: {}
        }
      }
    }
  }
  currentState = action.payload.tweens.reduce((result, current) => {
    return selectLayerEventTween(result, layerActions.selectLayerEventTween({
      id: current,
      handle: action.payload.handle[current]
    }) as SelectLayerEventTween);
  }, currentState);
  return currentState;
};

export const deselectLayerEventTweens = (state: LayerState, action: DeselectLayerEventTweens): LayerState => {
  let currentState = state;
  currentState = action.payload.tweens.reduce((result, current) => {
    return deselectLayerEventTween(result, layerActions.deselectLayerEventTween({
      id: current
    }) as DeselectLayerEventTween);
  }, state);
  return currentState;
};

export const deselectAllLayerEventTweens = (state: LayerState, action: DeselectAllLayerEventTweens): LayerState => {
  let currentState = state;
  currentState = currentState.tweens.selected.allIds.reduce((result, current) => {
    return deselectLayerEventTween(result, layerActions.deselectLayerEventTween({
      id: current
    }) as DeselectLayerEventTween);
  }, state);
  return currentState;
};

export const updateLayerTweensByProp = (state: LayerState, layerId: string, prop: Btwx.TweenProp): LayerState => {
  let currentState = state;
  const layerItem = state.byId[layerId];
  if (layerItem.type === 'Artboard' || (layerItem.scope.length > 1 && state.byId[layerItem.scope[1]].type === 'Artboard')) {
    const artboard = layerItem.type === 'Artboard' ? layerId : layerItem.scope[1];
    const artboardItem = state.byId[artboard] as Btwx.Artboard;
    const eventsWithArtboardAsOrigin = artboardItem.originForEvents;
    const eventsWithArtboardAsDestination = artboardItem.destinationForEvents;
    const tweensByProp = layerItem.tweens.byProp[prop];
    // filter tweens by prop
    // if new layer prop matches destination prop, remove tween
    // if new destination prop matches layer prop, remove tween
    // if has wiggle that matches prop, remove wiggle
    if (tweensByProp.length > 0) {
      currentState = tweensByProp.reduce((result: LayerState, current: string) => {
        const tween = result.tweens.byId[current];
        const layerItem = result.byId[tween.layer] as Btwx.Layer;
        const destinationLayerItem = result.byId[tween.destinationLayer] as Btwx.Layer;
        const hasTween = getEquivalentTweenProp(result, layerItem, destinationLayerItem, prop);
        const hasWiggle = layerItem.tweens.byProp[prop].find(id => result.tweens.byId[id].ease === 'customWiggle');
        if (hasWiggle) {
          result = removeLayerTween(result, layerActions.removeLayerTween({id: hasWiggle}) as RemoveLayerTween);
        }
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
      const destinationArtboardChildren = layerItem.type === 'Artboard' ? null : getLayerDescendants(result, tweenEvent.destination);
      const destinationEquivalent = layerItem.type === 'Artboard' ? result.byId[tweenEvent.destination] : getDestinationEquivalent(result, layerId, destinationArtboardChildren);
      ////////////////////////////////////////////////////
      ////////////////////////////////////////////////////
      // NEED TO ADD GROUP SHIT HERE
      ////////////////////////////////////////////////////
      ////////////////////////////////////////////////////
      if (destinationEquivalent) {
        const layerItem = result.byId[layerId] as Btwx.Layer;
        const equivalentLayerItem = result.byId[destinationEquivalent.id] as Btwx.Layer;
        const hasTween = getEquivalentTweenProp(result, layerItem, equivalentLayerItem, prop);
        const tweenExists = tweenEvent.tweens.allIds.some((id: string) => {
          const tween = result.tweens.byId[id];
          return tween.layer === layerId && tween.prop === prop;
        });
        if (hasTween && !tweenExists) {
          result = addLayerTween(result, layerActions.addLayerTween({
            layer: layerId,
            destinationLayer: destinationEquivalent.id,
            prop: prop,
            event: current,
            ...getDefaultTweenProps(prop) as any
          }) as AddLayerTween);
        }
      }
      return result;
    }, currentState);
    // add tween to events with artboard as destination
    // if it doesnt already exist
    currentState = eventsWithArtboardAsDestination.reduce((result: LayerState, current: string) => {
      const tweenEvent = result.events.byId[current];
      const originArtboardChildren = layerItem.type === 'Artboard' ? null : getLayerDescendants(result, tweenEvent.origin);
      const originEquivalent = layerItem.type === 'Artboard' ? result.byId[tweenEvent.origin] : getDestinationEquivalent(result, layerId, originArtboardChildren);
      if (originEquivalent) {
        const layerItem = result.byId[layerId] as Btwx.Layer;
        const equivalentLayerItem = result.byId[originEquivalent.id] as Btwx.Layer;
        const hasTween = getEquivalentTweenProp(result, layerItem, equivalentLayerItem, prop);
        const tweenExists = tweenEvent.tweens.allIds.some((id: string) => {
          const tween = result.tweens.byId[id];
          return tween.layer === originEquivalent.id && tween.prop === prop;
        });
        if (hasTween && !tweenExists) {
          result = addLayerTween(result, layerActions.addLayerTween({
            layer: originEquivalent.id,
            destinationLayer: layerId,
            prop: prop,
            event: current,
            ...getDefaultTweenProps(prop) as any
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
      undoable: true,
      tweenEdit: [action.payload.id]
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayersTweenDuration = (state: LayerState, action: SetLayersTweenDuration): LayerState => {
  let currentState = state;
  currentState = action.payload.tweens.reduce((result, current) => {
    return setLayerTweenDuration(result, layerActions.setLayerTweenDuration({
      id: current,
      duration: action.payload.duration
    }) as SetLayerTweenDuration);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Tween Duration',
      undoable: true,
      tweenEdit: action.payload.tweens
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerTweenRepeat = (state: LayerState, action: SetLayerTweenRepeat): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    tweens: {
      ...currentState.tweens,
      byId: {
        ...currentState.tweens.byId,
        [action.payload.id]: {
          ...currentState.tweens.byId[action.payload.id],
          repeat: Math.round(action.payload.repeat)
        }
      }
    }
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layer Tween Repeat',
      undoable: true,
      tweenEdit: [action.payload.id]
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayersTweenRepeat = (state: LayerState, action: SetLayersTweenRepeat): LayerState => {
  let currentState = state;
  currentState = action.payload.tweens.reduce((result, current) => {
    return setLayerTweenRepeat(result, layerActions.setLayerTweenRepeat({
      id: current,
      repeat: action.payload.repeat
    }) as SetLayerTweenRepeat);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Tween Repeat',
      undoable: true,
      tweenEdit: action.payload.tweens
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerTweenRepeatDelay = (state: LayerState, action: SetLayerTweenRepeatDelay): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    tweens: {
      ...currentState.tweens,
      byId: {
        ...currentState.tweens.byId,
        [action.payload.id]: {
          ...currentState.tweens.byId[action.payload.id],
          repeatDelay: Math.round((action.payload.repeatDelay + Number.EPSILON) * 100) / 100
        }
      }
    }
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layer Tween Repeat Delay',
      undoable: true,
      tweenEdit: [action.payload.id]
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayersTweenRepeatDelay = (state: LayerState, action: SetLayersTweenRepeatDelay): LayerState => {
  let currentState = state;
  currentState = action.payload.tweens.reduce((result, current) => {
    return setLayerTweenRepeatDelay(result, layerActions.setLayerTweenRepeatDelay({
      id: current,
      repeatDelay: action.payload.repeatDelay
    }) as SetLayerTweenRepeatDelay);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Tween Repeat Delay',
      undoable: true,
      tweenEdit: action.payload.tweens
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerTweenYoyo = (state: LayerState, action: SetLayerTweenYoyo): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    tweens: {
      ...currentState.tweens,
      byId: {
        ...currentState.tweens.byId,
        [action.payload.id]: {
          ...currentState.tweens.byId[action.payload.id],
          yoyo: action.payload.yoyo
        }
      }
    }
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layer Tween YoYo',
      undoable: true,
      tweenEdit: [action.payload.id]
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayersTweenYoyo = (state: LayerState, action: SetLayersTweenYoyo): LayerState => {
  let currentState = state;
  currentState = action.payload.tweens.reduce((result, current) => {
    return setLayerTweenYoyo(result, layerActions.setLayerTweenYoyo({
      id: current,
      yoyo: action.payload.yoyo
    }) as SetLayerTweenYoyo);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Tween YoYo',
      undoable: true,
      tweenEdit: action.payload.tweens
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerTweenYoyoEase = (state: LayerState, action: SetLayerTweenYoyoEase): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    tweens: {
      ...currentState.tweens,
      byId: {
        ...currentState.tweens.byId,
        [action.payload.id]: {
          ...currentState.tweens.byId[action.payload.id],
          yoyoEase: action.payload.yoyoEase
        }
      }
    }
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layer Tween YoYo Ease',
      undoable: true,
      tweenEdit: [action.payload.id]
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayersTweenYoyoEase = (state: LayerState, action: SetLayersTweenYoyoEase): LayerState => {
  let currentState = state;
  currentState = action.payload.tweens.reduce((result, current) => {
    return setLayerTweenYoyoEase(result, layerActions.setLayerTweenYoyoEase({
      id: current,
      yoyoEase: action.payload.yoyoEase
    }) as SetLayerTweenYoyoEase);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Tween YoYo Ease',
      undoable: true,
      tweenEdit: action.payload.tweens
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
      undoable: true,
      tweenEdit: [action.payload.id]
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayersTweenDelay = (state: LayerState, action: SetLayersTweenDelay): LayerState => {
  let currentState = state;
  currentState = action.payload.tweens.reduce((result, current) => {
    return setLayerTweenDelay(result, layerActions.setLayerTweenDelay({
      id: current,
      delay: action.payload.delay
    }) as SetLayerTweenDelay);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Tween Delay',
      undoable: true,
      tweenEdit: action.payload.tweens
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerTweenTiming = (state: LayerState, action: SetLayerTweenTiming): LayerState => {
  let currentState = state;
  if (action.payload.duration || action.payload.duration === 0) {
    currentState = setLayerTweenDuration(currentState, layerActions.setLayerTweenDuration({
      id: action.payload.id,
      duration: action.payload.duration
    }) as SetLayerTweenDuration);
  }
  if (action.payload.delay || action.payload.delay === 0) {
    currentState = setLayerTweenDelay(currentState, layerActions.setLayerTweenDelay({
      id: action.payload.id,
      delay: action.payload.delay
    }) as SetLayerTweenDelay);
  }
  return currentState;
};

export const setLayersTweenTiming = (state: LayerState, action: SetLayersTweenTiming): LayerState => {
  let currentState = state;
  currentState = action.payload.tweens.reduce((result, current) => {
    return setLayerTweenTiming(result, layerActions.setLayerTweenTiming({
      id: current,
      delay: action.payload.delay[current],
      duration: action.payload.duration[current]
    }) as SetLayerTweenTiming);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Tween Timing',
      undoable: true,
      tweenEdit: action.payload.tweens
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerTweenEase = (state: LayerState, action: SetLayerTweenEase): LayerState => {
  let currentState = state;
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
      undoable: true,
      tweenEdit: [action.payload.id]
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayersTweenEase = (state: LayerState, action: SetLayersTweenEase): LayerState => {
  let currentState = state;
  currentState = action.payload.tweens.reduce((result, current) => {
    return setLayerTweenEase(result, layerActions.setLayerTweenEase({
      id: current,
      ease: action.payload.ease
    }) as SetLayerTweenEase);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Tween Ease',
      undoable: true,
      tweenEdit: action.payload.tweens
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
      undoable: true,
      tweenEdit: [action.payload.id]
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayersTweenPower = (state: LayerState, action: SetLayersTweenPower): LayerState => {
  let currentState = state;
  currentState = action.payload.tweens.reduce((result, current) => {
    return setLayerTweenPower(result, layerActions.setLayerTweenPower({
      id: current,
      power: action.payload.power
    }) as SetLayerTweenPower);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Tween Power',
      undoable: true,
      tweenEdit: action.payload.tweens
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
      undoable: true,
      tweenEdit: [action.payload.id]
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayersStepsTweenSteps = (state: LayerState, action: SetLayersStepsTweenSteps): LayerState => {
  let currentState = state;
  currentState = action.payload.tweens.reduce((result, current) => {
    return setLayerStepsTweenSteps(result, layerActions.setLayerStepsTweenSteps({
      id: current,
      steps: action.payload.steps
    }) as SetLayerStepsTweenSteps);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Tween Steps',
      undoable: true,
      tweenEdit: action.payload.tweens
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
            ref: action.payload.ref
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
      undoable: true,
      tweenEdit: [action.payload.id]
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayersRoughTweenClamp = (state: LayerState, action: SetLayersRoughTweenClamp): LayerState => {
  let currentState = state;
  currentState = action.payload.tweens.reduce((result, current) => {
    return setLayerRoughTweenClamp(result, layerActions.setLayerRoughTweenClamp({
      id: current,
      clamp: action.payload.clamp,
      ref: action.payload.ref[current]
    }) as SetLayerRoughTweenClamp);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Rough Tween Clamp',
      undoable: true,
      tweenEdit: action.payload.tweens
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
            ref: action.payload.ref
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
      undoable: true,
      tweenEdit: [action.payload.id]
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayersRoughTweenPoints = (state: LayerState, action: SetLayersRoughTweenPoints): LayerState => {
  let currentState = state;
  currentState = action.payload.tweens.reduce((result, current) => {
    return setLayerRoughTweenPoints(result, layerActions.setLayerRoughTweenPoints({
      id: current,
      points: action.payload.points,
      ref: action.payload.ref[current]
    }) as SetLayerRoughTweenPoints);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Rough Tween Points',
      undoable: true,
      tweenEdit: action.payload.tweens
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
            ref: action.payload.ref
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
      undoable: true,
      tweenEdit: [action.payload.id]
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayersRoughTweenRandomize = (state: LayerState, action: SetLayersRoughTweenRandomize): LayerState => {
  let currentState = state;
  currentState = action.payload.tweens.reduce((result, current) => {
    return setLayerRoughTweenRandomize(result, layerActions.setLayerRoughTweenRandomize({
      id: current,
      randomize: action.payload.randomize,
      ref: action.payload.ref[current]
    }) as SetLayerRoughTweenRandomize);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Rough Tween Randomize',
      undoable: true,
      tweenEdit: action.payload.tweens
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
            ref: action.payload.ref
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
      undoable: true,
      tweenEdit: [action.payload.id]
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayersRoughTweenStrength = (state: LayerState, action: SetLayersRoughTweenStrength): LayerState => {
  let currentState = state;
  currentState = action.payload.tweens.reduce((result, current) => {
    return setLayerRoughTweenStrength(result, layerActions.setLayerRoughTweenStrength({
      id: current,
      strength: action.payload.strength,
      ref: action.payload.ref[current]
    }) as SetLayerRoughTweenStrength);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Rough Tween Strength',
      undoable: true,
      tweenEdit: action.payload.tweens
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
            ref: action.payload.ref
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
      undoable: true,
      tweenEdit: [action.payload.id]
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayersRoughTweenTaper = (state: LayerState, action: SetLayersRoughTweenTaper): LayerState => {
  let currentState = state;
  currentState = action.payload.tweens.reduce((result, current) => {
    return setLayerRoughTweenTaper(result, layerActions.setLayerRoughTweenTaper({
      id: current,
      taper: action.payload.taper,
      ref: action.payload.ref[current]
    }) as SetLayerRoughTweenTaper);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Rough Tween Taper',
      undoable: true,
      tweenEdit: action.payload.tweens
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
            ref: action.payload.ref
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
      undoable: true,
      tweenEdit: [action.payload.id]
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayersRoughTweenTemplate = (state: LayerState, action: SetLayersRoughTweenTemplate): LayerState => {
  let currentState = state;
  currentState = action.payload.tweens.reduce((result, current) => {
    return setLayerRoughTweenTemplate(result, layerActions.setLayerRoughTweenTemplate({
      id: current,
      template: action.payload.template,
      ref: action.payload.ref[current]
    }) as SetLayerRoughTweenTemplate);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Rough Tween Template',
      undoable: true,
      tweenEdit: action.payload.tweens
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
      undoable: true,
      tweenEdit: [action.payload.id]
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayersSlowTweenLinearRatio = (state: LayerState, action: SetLayersSlowTweenLinearRatio): LayerState => {
  let currentState = state;
  currentState = action.payload.tweens.reduce((result, current) => {
    return setLayerSlowTweenLinearRatio(result, layerActions.setLayerSlowTweenLinearRatio({
      id: current,
      linearRatio: action.payload.linearRatio,
    }) as SetLayerSlowTweenLinearRatio);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Slow Tween Linear Ratio',
      undoable: true,
      tweenEdit: action.payload.tweens
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
      undoable: true,
      tweenEdit: [action.payload.id]
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayersSlowTweenPower = (state: LayerState, action: SetLayersSlowTweenPower): LayerState => {
  let currentState = state;
  currentState = action.payload.tweens.reduce((result, current) => {
    return setLayerSlowTweenPower(result, layerActions.setLayerSlowTweenPower({
      id: current,
      power: action.payload.power,
    }) as SetLayerSlowTweenPower);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Slow Tween Power',
      undoable: true,
      tweenEdit: action.payload.tweens
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
      undoable: true,
      tweenEdit: [action.payload.id]
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayersSlowTweenYoYoMode = (state: LayerState, action: SetLayersSlowTweenYoYoMode): LayerState => {
  let currentState = state;
  currentState = action.payload.tweens.reduce((result, current) => {
    return setLayerSlowTweenYoYoMode(result, layerActions.setLayerSlowTweenYoYoMode({
      id: current,
      yoyoMode: action.payload.yoyoMode,
    }) as SetLayerSlowTweenYoYoMode);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Slow Tween YoYo Mode',
      undoable: true,
      tweenEdit: action.payload.tweens
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
      undoable: true,
      tweenEdit: [action.payload.id]
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayersTextTweenDelimiter = (state: LayerState, action: SetLayersTextTweenDelimiter): LayerState => {
  let currentState = state;
  currentState = action.payload.tweens.reduce((result, current) => {
    return setLayerTextTweenDelimiter(result, layerActions.setLayerTextTweenDelimiter({
      id: current,
      delimiter: action.payload.delimiter,
    }) as SetLayerTextTweenDelimiter);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Text Tween Delimiter',
      undoable: true,
      tweenEdit: action.payload.tweens
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
      undoable: true,
      tweenEdit: [action.payload.id]
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayersTextTweenSpeed = (state: LayerState, action: SetLayersTextTweenSpeed): LayerState => {
  let currentState = state;
  currentState = action.payload.tweens.reduce((result, current) => {
    return setLayerTextTweenSpeed(result, layerActions.setLayerTextTweenSpeed({
      id: current,
      speed: action.payload.speed,
    }) as SetLayerTextTweenSpeed);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Text Tween Speed',
      undoable: true,
      tweenEdit: action.payload.tweens
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
      undoable: true,
      tweenEdit: [action.payload.id]
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayersTextTweenDiff = (state: LayerState, action: SetLayersTextTweenDiff): LayerState => {
  let currentState = state;
  currentState = action.payload.tweens.reduce((result, current) => {
    return setLayerTextTweenDiff(result, layerActions.setLayerTextTweenDiff({
      id: current,
      diff: action.payload.diff,
    }) as SetLayerTextTweenDiff);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Text Tween Diff',
      undoable: true,
      tweenEdit: action.payload.tweens
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
      undoable: true,
      tweenEdit: [action.payload.id]
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayersTextTweenScramble = (state: LayerState, action: SetLayersTextTweenScramble): LayerState => {
  let currentState = state;
  currentState = action.payload.tweens.reduce((result, current) => {
    return setLayerTextTweenScramble(result, layerActions.setLayerTextTweenScramble({
      id: current,
      scramble: action.payload.scramble,
    }) as SetLayerTextTweenScramble);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Text Tween Scramble',
      undoable: true,
      tweenEdit: action.payload.tweens
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
      detail: 'Set Layer Scramble Text Tween Characters',
      undoable: true,
      tweenEdit: [action.payload.id]
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayersScrambleTextTweenCharacters = (state: LayerState, action: SetLayersScrambleTextTweenCharacters): LayerState => {
  let currentState = state;
  currentState = action.payload.tweens.reduce((result, current) => {
    return setLayerScrambleTextTweenCharacters(result, layerActions.setLayerScrambleTextTweenCharacters({
      id: current,
      characters: action.payload.characters,
      customCharacters: action.payload.customCharacters
    }) as SetLayerScrambleTextTweenCharacters);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Scramble Text Tween Characters',
      undoable: true,
      tweenEdit: action.payload.tweens
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
      detail: 'Set Layer Scramble Text Tween Reveal Delay',
      undoable: true,
      tweenEdit: [action.payload.id]
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayersScrambleTextTweenRevealDelay = (state: LayerState, action: SetLayersScrambleTextTweenRevealDelay): LayerState => {
  let currentState = state;
  currentState = action.payload.tweens.reduce((result, current) => {
    return setLayerScrambleTextTweenRevealDelay(result, layerActions.setLayerScrambleTextTweenRevealDelay({
      id: current,
      revealDelay: action.payload.revealDelay,
    }) as SetLayerScrambleTextTweenRevealDelay);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Scramble Text Tween Reveal Delay',
      undoable: true,
      tweenEdit: action.payload.tweens
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
      detail: 'Set Layer Scramble Text Tween Speed',
      undoable: true,
      tweenEdit: [action.payload.id]
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayersScrambleTextTweenSpeed = (state: LayerState, action: SetLayersScrambleTextTweenSpeed): LayerState => {
  let currentState = state;
  currentState = action.payload.tweens.reduce((result, current) => {
    return setLayerScrambleTextTweenSpeed(result, layerActions.setLayerScrambleTextTweenSpeed({
      id: current,
      speed: action.payload.speed,
    }) as SetLayerScrambleTextTweenSpeed);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Scramble Text Tween Speed',
      undoable: true,
      tweenEdit: action.payload.tweens
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
      detail: 'Set Layer Scramble Text Tween Delimiter',
      undoable: true,
      tweenEdit: [action.payload.id]
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayersScrambleTextTweenDelimiter = (state: LayerState, action: SetLayersScrambleTextTweenDelimiter): LayerState => {
  let currentState = state;
  currentState = action.payload.tweens.reduce((result, current) => {
    return setLayerScrambleTextTweenDelimiter(result, layerActions.setLayerScrambleTextTweenDelimiter({
      id: current,
      delimiter: action.payload.delimiter,
    }) as SetLayerScrambleTextTweenDelimiter);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Scramble Text Tween Delimiter',
      undoable: true,
      tweenEdit: action.payload.tweens
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
      detail: 'Set Layer Scramble Text Tween Right To Left',
      undoable: true,
      tweenEdit: [action.payload.id]
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayersScrambleTextTweenRightToLeft = (state: LayerState, action: SetLayersScrambleTextTweenRightToLeft): LayerState => {
  let currentState = state;
  currentState = action.payload.tweens.reduce((result, current) => {
    return setLayerScrambleTextTweenRightToLeft(result, layerActions.setLayerScrambleTextTweenRightToLeft({
      id: current,
      rightToLeft: action.payload.rightToLeft,
    }) as SetLayerScrambleTextTweenRightToLeft);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Scramble Text Tween Right To Left',
      undoable: true,
      tweenEdit: action.payload.tweens
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
      undoable: true,
      tweenEdit: [action.payload.id]
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayersCustomBounceTweenStrength = (state: LayerState, action: SetLayersCustomBounceTweenStrength): LayerState => {
  let currentState = state;
  currentState = action.payload.tweens.reduce((result, current) => {
    return setLayerCustomBounceTweenStrength(result, layerActions.setLayerCustomBounceTweenStrength({
      id: current,
      strength: action.payload.strength,
    }) as SetLayerCustomBounceTweenStrength);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Custom Bounce Tween Strength',
      undoable: true,
      tweenEdit: action.payload.tweens
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
      undoable: true,
      tweenEdit: [action.payload.id]
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayersCustomBounceTweenEndAtStart = (state: LayerState, action: SetLayersCustomBounceTweenEndAtStart): LayerState => {
  let currentState = state;
  currentState = action.payload.tweens.reduce((result, current) => {
    return setLayerCustomBounceTweenEndAtStart(result, layerActions.setLayerCustomBounceTweenEndAtStart({
      id: current,
      endAtStart: action.payload.endAtStart
    }) as SetLayerCustomBounceTweenEndAtStart);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Custom Bounce Tween End At Start',
      undoable: true,
      tweenEdit: action.payload.tweens
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
      undoable: true,
      tweenEdit: [action.payload.id]
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayersCustomBounceTweenSquash = (state: LayerState, action: SetLayersCustomBounceTweenSquash): LayerState => {
  let currentState = state;
  currentState = action.payload.tweens.reduce((result, current) => {
    return setLayerCustomBounceTweenSquash(result, layerActions.setLayerCustomBounceTweenSquash({
      id: current,
      squash: action.payload.squash
    }) as SetLayerCustomBounceTweenSquash);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Custom Bounce Tween Squash',
      undoable: true,
      tweenEdit: action.payload.tweens
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerCustomWiggleTweenStrength = (state: LayerState, action: SetLayerCustomWiggleTweenStrength): LayerState => {
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
      detail: 'Set Layer Custom Wiggle Tween Strength',
      undoable: true,
      tweenEdit: [action.payload.id]
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayersCustomWiggleTweenStrength = (state: LayerState, action: SetLayersCustomWiggleTweenStrength): LayerState => {
  let currentState = state;
  currentState = action.payload.tweens.reduce((result, current) => {
    return setLayerCustomWiggleTweenStrength(result, layerActions.setLayerCustomWiggleTweenStrength({
      id: current,
      strength: action.payload.strength
    }) as SetLayerCustomWiggleTweenStrength);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Custom Wiggle Tween Strength',
      undoable: true,
      tweenEdit: action.payload.tweens
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
      undoable: true,
      tweenEdit: [action.payload.id]
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayersCustomWiggleTweenWiggles = (state: LayerState, action: SetLayersCustomWiggleTweenWiggles): LayerState => {
  let currentState = state;
  currentState = action.payload.tweens.reduce((result, current) => {
    return setLayerCustomWiggleTweenWiggles(result, layerActions.setLayerCustomWiggleTweenWiggles({
      id: current,
      wiggles: action.payload.wiggles
    }) as SetLayerCustomWiggleTweenWiggles);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Custom Wiggle Tween Wiggles',
      undoable: true,
      tweenEdit: action.payload.tweens
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
      undoable: true,
      tweenEdit: [action.payload.id]
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayersCustomWiggleTweenType = (state: LayerState, action: SetLayersCustomWiggleTweenType): LayerState => {
  let currentState = state;
  currentState = action.payload.tweens.reduce((result, current) => {
    return setLayerCustomWiggleTweenType(result, layerActions.setLayerCustomWiggleTweenType({
      id: current,
      type: action.payload.type
    }) as SetLayerCustomWiggleTweenType);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Custom Wiggle Tween Type',
      undoable: true,
      tweenEdit: action.payload.tweens
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerX = (state: LayerState, action: SetLayerX): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const isArtboard = layerItem.type === 'Artboard';
  const groupParents = isArtboard ? ['root'] : layerItem.scope.filter((id, index) => index !== 0 && index !== 1).reverse();
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
          },
          lines: (currentState.byId[action.payload.id] as Btwx.Text).lines.reduce((lr, lc) => {
            return [
              ...lr,
              {
                ...lc,
                frame: {
                  ...lc.frame,
                  x: lc.frame.x + diff
                },
                anchor: {
                  ...lc.anchor,
                  x: lc.anchor.x + diff
                }
              }
            ]
          }, [])
        } as Btwx.Text
      }
    }
  }
  currentState = updateGroupParentBounds(currentState, groupParents);
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
              },
              lines: (result.byId[current] as Btwx.Text).lines.reduce((lr, lc) => {
                return [
                  ...lr,
                  {
                    ...lc,
                    frame: {
                      ...lc.frame,
                      x: lc.frame.x + diff
                    },
                    anchor: {
                      ...lc.anchor,
                      x: lc.anchor.x + diff
                    }
                  }
                ]
              }, [])
            } as Btwx.Text
          }
        }
      }
      if (descendantItem.type !== 'Group') {
        result = updateLayerTweensByProps(result, current, ['x']);
      }
      return result;
    }, currentState);
  } else {
    currentState = updateLayerTweensByProps(currentState, action.payload.id, ['x']);
  }
  return currentState;
};

export const setLayersX = (state: LayerState, action: SetLayersX): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerX(result, layerActions.setLayerX({
      id: current,
      x: action.payload.x
    }) as SetLayerX);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers X',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerY = (state: LayerState, action: SetLayerY): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const isArtboard = layerItem.type === 'Artboard';
  const groupParents = isArtboard ? ['root'] : layerItem.scope.filter((id, index) => index !== 0 && index !== 1).reverse();
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
          },
          lines: (currentState.byId[action.payload.id] as Btwx.Text).lines.reduce((lr, lc) => {
            return [
              ...lr,
              {
                ...lc,
                frame: {
                  ...lc.frame,
                  y: lc.frame.y + diff
                },
                anchor: {
                  ...lc.anchor,
                  y: lc.anchor.y + diff
                }
              }
            ]
          }, [])
        } as Btwx.Text
      }
    }
  }
  currentState = updateGroupParentBounds(currentState, groupParents);
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
              },
              lines: (result.byId[current] as Btwx.Text).lines.reduce((lr, lc) => {
                return [
                  ...lr,
                  {
                    ...lc,
                    frame: {
                      ...lc.frame,
                      y: lc.frame.y + diff
                    },
                    anchor: {
                      ...lc.anchor,
                      y: lc.anchor.y + diff
                    }
                  }
                ]
              }, [])
            } as Btwx.Text
          }
        }
      }
      if (descendantItem.type !== 'Group') {
        result = updateLayerTweensByProps(result, current, ['y']);
      }
      return result;
    }, currentState);
  } else {
    currentState = updateLayerTweensByProps(currentState, action.payload.id, ['y']);
  }
  return currentState;
};

export const setLayersY = (state: LayerState, action: SetLayersY): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerY(result, layerActions.setLayerY({
      id: current,
      y: action.payload.y
    }) as SetLayerY);
  }, state);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Y',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerLeft = (state: LayerState, action: SetLayerLeft): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const isArtboard = layerItem.type === 'Artboard';
  const groupParents = isArtboard ? ['root'] : layerItem.scope.filter((id, index) => index !== 0 && index !== 1).reverse();
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
          },
          lines: (currentState.byId[action.payload.id] as Btwx.Text).lines.reduce((lr, lc) => {
            return [
              ...lr,
              {
                ...lc,
                frame: {
                  ...lc.frame,
                  x: lc.frame.x + diff
                },
                anchor: {
                  ...lc.anchor,
                  x: lc.anchor.x + diff
                }
              }
            ]
          }, [])
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
  currentState = updateGroupParentBounds(currentState, groupParents);
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
              },
              lines: (result.byId[current] as Btwx.Text).lines.reduce((lr, lc) => {
                return [
                  ...lr,
                  {
                    ...lc,
                    frame: {
                      ...lc.frame,
                      x: lc.frame.x + diff
                    },
                    anchor: {
                      ...lc.anchor,
                      x: lc.anchor.x + diff
                    }
                  }
                ]
              }, [])
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
        result = updateLayerTweensByProps(result, current, ['x']);
      }
      return result;
    }, currentState);
  } else {
    currentState = updateLayerTweensByProps(currentState, action.payload.id, ['x']);
  }
  return currentState;
};

export const setLayersLeft = (state: LayerState, action: SetLayersLeft): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerLeft(result, layerActions.setLayerLeft({
      id: current,
      left: action.payload.left
    }) as SetLayerLeft);
  }, state);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Left',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerCenter = (state: LayerState, action: SetLayerCenter): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const isArtboard = layerItem.type === 'Artboard';
  const groupParents = isArtboard ? ['root'] : layerItem.scope.filter((id, index) => index !== 0 && index !== 1).reverse();
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
          },
          lines: (currentState.byId[action.payload.id] as Btwx.Text).lines.reduce((lr, lc) => {
            return [
              ...lr,
              {
                ...lc,
                frame: {
                  ...lc.frame,
                  x: lc.frame.x + diff
                },
                anchor: {
                  ...lc.anchor,
                  x: lc.anchor.x + diff
                }
              }
            ]
          }, [])
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
  currentState = updateGroupParentBounds(currentState, groupParents);
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
              },
              lines: (result.byId[current] as Btwx.Text).lines.reduce((lr, lc) => {
                return [
                  ...lr,
                  {
                    ...lc,
                    frame: {
                      ...lc.frame,
                      x: lc.frame.x + diff
                    },
                    anchor: {
                      ...lc.anchor,
                      x: lc.anchor.x + diff
                    }
                  }
                ]
              }, [])
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
        result = updateLayerTweensByProps(result, current, ['x']);
      }
      return result;
    }, currentState);
  } else {
    currentState = updateLayerTweensByProps(currentState, action.payload.id, ['x']);
  }
  return currentState;
};

export const setLayersCenter = (state: LayerState, action: SetLayersCenter): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerCenter(result, layerActions.setLayerCenter({
      id: current,
      center: action.payload.center
    }) as SetLayerCenter);
  }, state);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Center',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerRight = (state: LayerState, action: SetLayerRight): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const isArtboard = layerItem.type === 'Artboard';
  const groupParents = isArtboard ? ['root'] : layerItem.scope.filter((id, index) => index !== 0 && index !== 1).reverse();
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
          },
          lines: (currentState.byId[action.payload.id] as Btwx.Text).lines.reduce((lr, lc) => {
            return [
              ...lr,
              {
                ...lc,
                frame: {
                  ...lc.frame,
                  x: lc.frame.x + diff
                },
                anchor: {
                  ...lc.anchor,
                  x: lc.anchor.x + diff
                }
              }
            ]
          }, [])
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
  currentState = updateGroupParentBounds(currentState, groupParents);
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
              },
              lines: (result.byId[current] as Btwx.Text).lines.reduce((lr, lc) => {
                return [
                  ...lr,
                  {
                    ...lc,
                    frame: {
                      ...lc.frame,
                      x: lc.frame.x + diff
                    },
                    anchor: {
                      ...lc.anchor,
                      x: lc.anchor.x + diff
                    }
                  }
                ]
              }, [])
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
        result = updateLayerTweensByProps(result, current, ['x']);
      }
      return result;
    }, currentState);
  } else {
    currentState = updateLayerTweensByProps(currentState, action.payload.id, ['x']);
  }
  return currentState;
};

export const setLayersRight = (state: LayerState, action: SetLayersRight): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerRight(result, layerActions.setLayerRight({
      id: current,
      right: action.payload.right
    }) as SetLayerRight);
  }, state);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Right',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerTop = (state: LayerState, action: SetLayerTop): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const isArtboard = layerItem.type === 'Artboard';
  const groupParents = isArtboard ? ['root'] : layerItem.scope.filter((id, index) => index !== 0 && index !== 1).reverse();
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
          },
          lines: (currentState.byId[action.payload.id] as Btwx.Text).lines.reduce((lr, lc) => {
            return [
              ...lr,
              {
                ...lc,
                frame: {
                  ...lc.frame,
                  y: lc.frame.y + diff
                },
                anchor: {
                  ...lc.anchor,
                  y: lc.anchor.y + diff
                }
              }
            ]
          }, [])
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
  currentState = updateGroupParentBounds(currentState, groupParents);
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
              },
              lines: (result.byId[current] as Btwx.Text).lines.reduce((lr, lc) => {
                return [
                  ...lr,
                  {
                    ...lc,
                    frame: {
                      ...lc.frame,
                      y: lc.frame.y + diff
                    },
                    anchor: {
                      ...lc.anchor,
                      y: lc.anchor.y + diff
                    }
                  }
                ]
              }, [])
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
        result = updateLayerTweensByProps(result, current, ['y']);
      }
      return result;
    }, currentState);
  } else {
    currentState = updateLayerTweensByProps(currentState, action.payload.id, ['y']);
  }
  return currentState;
};

export const setLayersTop = (state: LayerState, action: SetLayersTop): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerTop(result, layerActions.setLayerTop({
      id: current,
      top: action.payload.top
    }) as SetLayerTop);
  }, state);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Top',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerMiddle = (state: LayerState, action: SetLayerMiddle): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const isArtboard = layerItem.type === 'Artboard';
  const groupParents = isArtboard ? ['root'] : layerItem.scope.filter((id, index) => index !== 0 && index !== 1).reverse();
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
          },
          lines: (currentState.byId[action.payload.id] as Btwx.Text).lines.reduce((lr, lc) => {
            return [
              ...lr,
              {
                ...lc,
                frame: {
                  ...lc.frame,
                  y: lc.frame.y + diff
                },
                anchor: {
                  ...lc.anchor,
                  y: lc.anchor.y + diff
                }
              }
            ]
          }, [])
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
  currentState = updateGroupParentBounds(currentState, groupParents);
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
              },
              lines: (result.byId[current] as Btwx.Text).lines.reduce((lr, lc) => {
                return [
                  ...lr,
                  {
                    ...lc,
                    frame: {
                      ...lc.frame,
                      y: lc.frame.y + diff
                    },
                    anchor: {
                      ...lc.anchor,
                      y: lc.anchor.y + diff
                    }
                  }
                ]
              }, [])
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
        result = updateLayerTweensByProps(result, current, ['y']);
      }
      return result;
    }, currentState);
  } else {
    currentState = updateLayerTweensByProps(currentState, action.payload.id, ['y']);
  }
  return currentState;
};

export const setLayersMiddle = (state: LayerState, action: SetLayersMiddle): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerMiddle(result, layerActions.setLayerMiddle({
      id: current,
      middle: action.payload.middle
    }) as SetLayerMiddle);
  }, state);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Top',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerBottom = (state: LayerState, action: SetLayerBottom): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const isArtboard = layerItem.type === 'Artboard';
  const groupParents = isArtboard ? ['root'] : layerItem.scope.filter((id, index) => index !== 0 && index !== 1).reverse();
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
          },
          lines: (currentState.byId[action.payload.id] as Btwx.Text).lines.reduce((lr, lc) => {
            return [
              ...lr,
              {
                ...lc,
                frame: {
                  ...lc.frame,
                  y: lc.frame.y + diff
                },
                anchor: {
                  ...lc.anchor,
                  y: lc.anchor.y + diff
                }
              }
            ]
          }, [])
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
  currentState = updateGroupParentBounds(currentState, groupParents);
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
              },
              lines: (result.byId[current] as Btwx.Text).lines.reduce((lr, lc) => {
                return [
                  ...lr,
                  {
                    ...lc,
                    frame: {
                      ...lc.frame,
                      y: lc.frame.y + diff
                    },
                    anchor: {
                      ...lc.anchor,
                      y: lc.anchor.y + diff
                    }
                  }
                ]
              }, [])
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
        result = updateLayerTweensByProps(result, current, ['y']);
      }
      return result;
    }, currentState);
  } else {
    currentState = updateLayerTweensByProps(currentState, action.payload.id, ['y']);
  }
  return currentState;
};

export const setLayersBottom = (state: LayerState, action: SetLayersBottom): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerBottom(result, layerActions.setLayerBottom({
      id: current,
      bottom: action.payload.bottom
    }) as SetLayerBottom);
  }, state);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Bottom',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerWidth = (state: LayerState, action: SetLayerWidth): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const isArtboard = layerItem.type === 'Artboard';
  const groupParents = isArtboard ? ['root'] : layerItem.scope.filter((id, index) => index !== 0 && index !== 1).reverse();
  const pathData = action.payload.pathData;
  const shapeIcon = action.payload.shapeIcon;
  const bounds = action.payload.bounds;
  const lines = action.payload.lines;
  const textResize = action.payload.textResize;
  const paragraphs = action.payload.paragraphs;
  const from = action.payload.from;
  const to = action.payload.to;
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
    currentState = updateLayerTweensByProps(currentState, action.payload.id, ['shape']);
  }
  if (shapeIcon) {
    currentState = {
      ...currentState,
      shapeIcons: {
        ...currentState.shapeIcons,
        [action.payload.id]: shapeIcon
      }
    }
  }
  if (textResize) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          textStyle: {
            ...(currentState.byId[action.payload.id] as Btwx.Text).textStyle,
            textResize: textResize
          }
        } as Btwx.Text
      }
    }
  }
  if (paragraphs) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          paragraphs: paragraphs
        } as Btwx.Text
      }
    }
  }
  if (lines) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          lines: lines
        } as Btwx.Text
      }
    }
  }
  if (from) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id] as Btwx.Line,
          from: {
            ...(currentState.byId[action.payload.id] as Btwx.Line).from,
            ...from
          }
        } as Btwx.Line
      }
    }
  }
  if (to) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id] as Btwx.Line,
          to: {
            ...(currentState.byId[action.payload.id] as Btwx.Line).to,
            ...to
          }
        } as Btwx.Line
      }
    }
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
  currentState = updateGroupParentBounds(currentState, groupParents);
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
  currentState = action.payload.layers.reduce((result, current) => {
    const pathData = action.payload.pathData ? action.payload.pathData[current] : null;
    const shapeIcon = action.payload.shapeIcon ? action.payload.shapeIcon[current] : null;
    const bounds = action.payload.bounds ? action.payload.bounds[current] : null;
    const paragraphs = action.payload.paragraphs ? action.payload.paragraphs[current] : null;
    const lines = action.payload.lines ? action.payload.lines[current] : null;
    const textResize = action.payload.textResize ? action.payload.textResize[current] : null;
    const from = action.payload.from ? action.payload.from[current] : null;
    const to = action.payload.to ? action.payload.to[current] : null;
    return setLayerWidth(result, layerActions.setLayerWidth({
      id: current,
      width: action.payload.width,
      pathData,
      shapeIcon,
      bounds,
      paragraphs,
      lines,
      textResize,
      from,
      to
    }) as SetLayerWidth);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Width',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerHeight = (state: LayerState, action: SetLayerHeight): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const isArtboard = layerItem.type === 'Artboard';
  const groupParents = isArtboard ? ['root'] : layerItem.scope.filter((id, index) => index !== 0 && index !== 1).reverse();
  const shapeIcon = action.payload.shapeIcon;
  const pathData = action.payload.pathData;
  const bounds = action.payload.bounds;
  const lines = action.payload.lines;
  const textResize = action.payload.textResize;
  const paragraphs = action.payload.paragraphs;
  const from = action.payload.from;
  const to = action.payload.to;
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
    currentState = updateLayerTweensByProps(currentState, action.payload.id, ['shape']);
  }
  if (shapeIcon) {
    currentState = {
      ...currentState,
      shapeIcons: {
        ...currentState.shapeIcons,
        [action.payload.id]: shapeIcon
      }
    }
  }
  if (textResize) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          textStyle: {
            ...(currentState.byId[action.payload.id] as Btwx.Text).textStyle,
            textResize: textResize
          }
        } as Btwx.Text
      }
    }
  }
  if (paragraphs) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          paragraphs: paragraphs
        } as Btwx.Text
      }
    }
  }
  if (lines) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          lines: lines
        } as Btwx.Text
      }
    }
  }
  if (from) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id] as Btwx.Line,
          from: {
            ...(currentState.byId[action.payload.id] as Btwx.Line).from,
            ...from
          }
        } as Btwx.Line
      }
    }
  }
  if (to) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id] as Btwx.Line,
          to: {
            ...(currentState.byId[action.payload.id] as Btwx.Line).to,
            ...to
          }
        } as Btwx.Line
      }
    }
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
  currentState = updateGroupParentBounds(currentState, groupParents);
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
  currentState = action.payload.layers.reduce((result, current) => {
    const pathData = action.payload.pathData ? action.payload.pathData[current] : null;
    const shapeIcon = action.payload.shapeIcon ? action.payload.shapeIcon[current] : null;
    const bounds = action.payload.bounds ? action.payload.bounds[current] : null;
    const paragraphs = action.payload.paragraphs ? action.payload.paragraphs[current] : null;
    const lines = action.payload.lines ? action.payload.lines[current] : null;
    const textResize = action.payload.textResize ? action.payload.textResize[current] : null;
    const from = action.payload.from ? action.payload.from[current] : null;
    const to = action.payload.to ? action.payload.to[current] : null;
    return setLayerHeight(result, layerActions.setLayerHeight({
      id: current,
      height: action.payload.height,
      pathData,
      shapeIcon,
      bounds,
      paragraphs,
      lines,
      textResize,
      from,
      to
    }) as SetLayerHeight);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Height',
      undoable: true
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
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerOpacity(result, layerActions.setLayerOpacity({
      id: current,
      opacity: action.payload.opacity
    }) as SetLayerOpacity);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Opacity',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const enableLayerBlur = (state: LayerState, action: EnableLayerBlur): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          blur: {
            ...currentState.byId[action.payload.id].style.blur,
            enabled: true
          }
        }
      }
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['blur']);
  return currentState;
};

export const enableLayersBlur = (state: LayerState, action: EnableLayersBlur): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return enableLayerBlur(result, layerActions.enableLayerBlur({
      id: current
    }) as EnableLayerBlur);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Enable Layers Blur',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const disableLayerBlur = (state: LayerState, action: DisableLayerBlur): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          blur: {
            ...currentState.byId[action.payload.id].style.blur,
            enabled: false
          }
        }
      }
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['blur']);
  return currentState;
};

export const disableLayersBlur = (state: LayerState, action: DisableLayersBlur): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return disableLayerBlur(result, layerActions.disableLayerBlur({
      id: current
    }) as DisableLayerBlur);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Disable Layers Blur',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerBlurRadius = (state: LayerState, action: SetLayerBlurRadius): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          blur: {
            ...currentState.byId[action.payload.id].style.blur,
            radius: action.payload.radius
          }
        }
      }
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['blur']);
  return currentState;
};

export const setLayersBlurRadius = (state: LayerState, action: SetLayersBlurRadius): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerBlurRadius(result, layerActions.setLayerBlurRadius({
      id: current,
      radius: action.payload.radius
    }) as SetLayerBlurRadius);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Blur Radius',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerRotation = (state: LayerState, action: SetLayerRotation): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const groupParents = layerItem.scope.filter((id, index) => index !== 0 && index !== 1).reverse();
  const isShape = layerItem.type === 'Shape';
  const isLine = isShape && (layerItem as Btwx.Shape).shapeType === 'Line';
  const point = action.payload.point;
  const from = action.payload.from;
  const to = action.payload.to;
  const pathData = action.payload.pathData;
  const shapeIcon = action.payload.shapeIcon;
  const bounds = action.payload.bounds;
  const fillGradientOrigin = action.payload.fillGradientOrigin;
  const fillGradientDestination = action.payload.fillGradientDestination;
  const strokeGradientOrigin = action.payload.strokeGradientOrigin;
  const strokeGradientDestination = action.payload.strokeGradientDestination;
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
  if (fillGradientOrigin) {
    currentState = setLayerGradientOrigin(currentState, layerActions.setLayerGradientOrigin({
      id: action.payload.id,
      prop: 'fill',
      origin: fillGradientOrigin
    }) as SetLayerGradientOrigin);
  }
  if (fillGradientDestination) {
    currentState = setLayerGradientDestination(currentState, layerActions.setLayerGradientDestination({
      id: action.payload.id,
      prop: 'fill',
      destination: fillGradientDestination
    }) as SetLayerGradientDestination);
  }
  if (strokeGradientOrigin) {
    currentState = setLayerGradientOrigin(currentState, layerActions.setLayerGradientOrigin({
      id: action.payload.id,
      prop: 'stroke',
      origin: strokeGradientOrigin
    }) as SetLayerGradientOrigin);
  }
  if (strokeGradientDestination) {
    currentState = setLayerGradientDestination(currentState, layerActions.setLayerGradientDestination({
      id: action.payload.id,
      prop: 'stroke',
      destination: strokeGradientDestination
    }) as SetLayerGradientDestination);
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
    currentState = updateLayerTweensByProps(currentState, action.payload.id, ['shape']);
  }
  if (shapeIcon) {
    currentState = {
      ...currentState,
      shapeIcons: {
        ...currentState.shapeIcons,
        [action.payload.id]: shapeIcon
      }
    }
  }
  if (point) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          point: {
            ...(currentState.byId[action.payload.id] as Btwx.Text).point,
            ...point
          }
        } as Btwx.Text
      }
    }
  }
  if (from) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          from: {
            ...(currentState.byId[action.payload.id] as Btwx.Line).from,
            ...from
          }
        } as Btwx.Line
      }
    }
  }
  if (to) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          to: {
            ...(currentState.byId[action.payload.id] as Btwx.Line).to,
            ...to
          }
        } as Btwx.Line
      }
    }
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
            ...action.payload.bounds
          }
        }
      }
    }
  }
  currentState = updateGroupParentBounds(currentState, groupParents);
  if (layerItem.type !== 'Group') {
    currentState = updateLayerTweensByProps(currentState, action.payload.id, ['rotation']);
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
  currentState = action.payload.layers.reduce((result, current, index) => {
    const pathData = action.payload.pathData ? action.payload.pathData[current] : null;
    const shapeIcon = action.payload.shapeIcon ? action.payload.shapeIcon[current] : null;
    const bounds = action.payload.bounds ? action.payload.bounds[current] : null;
    const point = action.payload.point ? action.payload.point[current] : null;
    const from = action.payload.point ? action.payload.from[current] : null;
    const to = action.payload.point ? action.payload.to[current] : null;
    const fillGradientOrigin = action.payload.fillGradientOrigin ? action.payload.fillGradientOrigin[current] : null;
    const fillGradientDestination = action.payload.fillGradientDestination ? action.payload.fillGradientDestination[current] : null;
    const strokeGradientOrigin = action.payload.strokeGradientOrigin ? action.payload.strokeGradientOrigin[current] : null;
    const strokeGradientDestination = action.payload.strokeGradientDestination ? action.payload.strokeGradientDestination[current] : null;
    return setLayerRotation(result, layerActions.setLayerRotation({
      id: current,
      rotation: action.payload.rotation,
      pathData,
      fillGradientOrigin,
      fillGradientDestination,
      strokeGradientOrigin,
      strokeGradientDestination,
      shapeIcon,
      bounds,
      point,
      from,
      to
    }) as SetLayerRotation);
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
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const enableLayerHorizontalFlip = (state: LayerState, action: EnableLayerHorizontalFlip): LayerState => {
  let currentState = state;
  const pathData = action.payload.pathData;
  const shapeIcon = action.payload.shapeIcon;
  const from = action.payload.from;
  const to = action.payload.to;
  const point = action.payload.point;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        transform: {
          ...currentState.byId[action.payload.id].transform,
          horizontalFlip: true
        },
        style: {
          ...currentState.byId[action.payload.id].style,
          fill: {
            ...currentState.byId[action.payload.id].style.fill,
            gradient: {
              ...currentState.byId[action.payload.id].style.fill.gradient,
              origin: {
                ...currentState.byId[action.payload.id].style.fill.gradient.origin,
                x: currentState.byId[action.payload.id].style.fill.gradient.origin.x * -1
              },
              destination: {
                ...currentState.byId[action.payload.id].style.fill.gradient.destination,
                x: currentState.byId[action.payload.id].style.fill.gradient.destination.x * -1
              }
            }
          },
          stroke: {
            ...currentState.byId[action.payload.id].style.stroke,
            gradient: {
              ...currentState.byId[action.payload.id].style.stroke.gradient,
              origin: {
                ...currentState.byId[action.payload.id].style.stroke.gradient.origin,
                x: currentState.byId[action.payload.id].style.stroke.gradient.origin.x * -1
              },
              destination: {
                ...currentState.byId[action.payload.id].style.stroke.gradient.destination,
                x: currentState.byId[action.payload.id].style.stroke.gradient.destination.x * -1
              }
            }
          },
          shadow: {
            ...currentState.byId[action.payload.id].style.shadow,
            offset: {
              ...currentState.byId[action.payload.id].style.shadow.offset,
              x: currentState.byId[action.payload.id].style.shadow.offset.x * -1
            }
          }
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
    currentState = updateLayerTweensByProps(currentState, action.payload.id, ['shape']);
  }
  if (shapeIcon) {
    currentState = {
      ...currentState,
      shapeIcons: {
        ...currentState.shapeIcons,
        [action.payload.id]: shapeIcon
      }
    }
  }
  if (from) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          from: {
            ...(currentState.byId[action.payload.id] as Btwx.Line).from,
            x: from.x
          }
        } as Btwx.Line
      }
    }
  }
  if (to) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          to: {
            ...(currentState.byId[action.payload.id] as Btwx.Line).to,
            x: to.x
          }
        } as Btwx.Line
      }
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['scaleX', 'fillGradientOriginX', 'fillGradientDestinationX', 'strokeGradientOriginX', 'strokeGradientDestinationX', 'shadowOffsetX']);
  if (point) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          point: {
            ...(currentState.byId[action.payload.id] as Btwx.Text).point,
            x: point.x
          }
        } as Btwx.Text
      }
    }
    // currentState = updateLayerTweensByProps(currentState, action.payload.id, ['pointX']);
  }
  return currentState;
};

export const enableLayersHorizontalFlip = (state: LayerState, action: EnableLayersHorizontalFlip): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    const pathData = action.payload.pathData ? action.payload.pathData[current] : null;
    const shapeIcon = action.payload.shapeIcon ? action.payload.shapeIcon[current] : null;
    const point = action.payload.point ? action.payload.point[current] : null;
    const from = action.payload.from ? action.payload.from[current] : null;
    const to = action.payload.to ? action.payload.to[current] : null;
    return enableLayerHorizontalFlip(result, layerActions.enableLayerHorizontalFlip({
      id: current,
      point,
      pathData,
      shapeIcon,
      from,
      to
    }) as EnableLayerHorizontalFlip);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Enable Layers Horizontal Flip',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const disableLayerHorizontalFlip = (state: LayerState, action: DisableLayerHorizontalFlip): LayerState => {
  let currentState = state;
  const pathData = action.payload.pathData;
  const from = action.payload.from;
  const to = action.payload.to;
  const point = action.payload.point;
  const shapeIcon = action.payload.shapeIcon;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        transform: {
          ...currentState.byId[action.payload.id].transform,
          horizontalFlip: false
        },
        style: {
          ...currentState.byId[action.payload.id].style,
          fill: {
            ...currentState.byId[action.payload.id].style.fill,
            gradient: {
              ...currentState.byId[action.payload.id].style.fill.gradient,
              origin: {
                ...currentState.byId[action.payload.id].style.fill.gradient.origin,
                x: currentState.byId[action.payload.id].style.fill.gradient.origin.x * -1
              },
              destination: {
                ...currentState.byId[action.payload.id].style.fill.gradient.destination,
                x: currentState.byId[action.payload.id].style.fill.gradient.destination.x * -1
              }
            }
          },
          stroke: {
            ...currentState.byId[action.payload.id].style.stroke,
            gradient: {
              ...currentState.byId[action.payload.id].style.stroke.gradient,
              origin: {
                ...currentState.byId[action.payload.id].style.stroke.gradient.origin,
                x: currentState.byId[action.payload.id].style.stroke.gradient.origin.x * -1
              },
              destination: {
                ...currentState.byId[action.payload.id].style.stroke.gradient.destination,
                x: currentState.byId[action.payload.id].style.stroke.gradient.destination.x * -1
              }
            }
          },
          shadow: {
            ...currentState.byId[action.payload.id].style.shadow,
            offset: {
              ...currentState.byId[action.payload.id].style.shadow.offset,
              x: currentState.byId[action.payload.id].style.shadow.offset.x * -1
            }
          }
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
    currentState = updateLayerTweensByProps(currentState, action.payload.id, ['shape']);
  }
  if (shapeIcon) {
    currentState = {
      ...currentState,
      shapeIcons: {
        ...currentState.shapeIcons,
        [action.payload.id]: shapeIcon
      }
    }
  }
  if (from) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          from: {
            ...(currentState.byId[action.payload.id] as Btwx.Line).from,
            x: from.x
          }
        } as Btwx.Line
      }
    }
  }
  if (to) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          to: {
            ...(currentState.byId[action.payload.id] as Btwx.Line).to,
            x: to.x
          }
        } as Btwx.Line
      }
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['scaleX', 'fillGradientOriginX', 'fillGradientDestinationX', 'strokeGradientOriginX', 'strokeGradientDestinationX', 'shadowOffsetX']);
  if (point) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          point: {
            ...(currentState.byId[action.payload.id] as Btwx.Text).point,
            x: point.x
          }
        } as Btwx.Text
      }
    }
  }
  return currentState;
};

export const disableLayersHorizontalFlip = (state: LayerState, action: DisableLayersHorizontalFlip): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    const pathData = action.payload.pathData ? action.payload.pathData[current] : null;
    const shapeIcon = action.payload.shapeIcon ? action.payload.shapeIcon[current] : null;
    const point = action.payload.point ? action.payload.point[current] : null;
    const from = action.payload.from ? action.payload.from[current] : null;
    const to = action.payload.to ? action.payload.to[current] : null;
    return disableLayerHorizontalFlip(result, layerActions.disableLayerHorizontalFlip({
      id: current,
      point,
      pathData,
      shapeIcon,
      from,
      to
    }) as DisableLayerHorizontalFlip);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Disable Layers Horizontal Flip',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const enableLayerVerticalFlip = (state: LayerState, action: EnableLayerVerticalFlip): LayerState => {
  let currentState = state;
  const pathData = action.payload.pathData;
  const shapeIcon = action.payload.shapeIcon;
  const from = action.payload.from;
  const to = action.payload.to;
  const point = action.payload.point;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        transform: {
          ...currentState.byId[action.payload.id].transform,
          verticalFlip: true
        },
        style: {
          ...currentState.byId[action.payload.id].style,
          fill: {
            ...currentState.byId[action.payload.id].style.fill,
            gradient: {
              ...currentState.byId[action.payload.id].style.fill.gradient,
              origin: {
                ...currentState.byId[action.payload.id].style.fill.gradient.origin,
                y: currentState.byId[action.payload.id].style.fill.gradient.origin.y * -1
              },
              destination: {
                ...currentState.byId[action.payload.id].style.fill.gradient.destination,
                y: currentState.byId[action.payload.id].style.fill.gradient.destination.y * -1
              }
            }
          },
          stroke: {
            ...currentState.byId[action.payload.id].style.stroke,
            gradient: {
              ...currentState.byId[action.payload.id].style.stroke.gradient,
              origin: {
                ...currentState.byId[action.payload.id].style.stroke.gradient.origin,
                y: currentState.byId[action.payload.id].style.stroke.gradient.origin.y * -1
              },
              destination: {
                ...currentState.byId[action.payload.id].style.stroke.gradient.destination,
                y: currentState.byId[action.payload.id].style.stroke.gradient.destination.y * -1
              }
            }
          },
          shadow: {
            ...currentState.byId[action.payload.id].style.shadow,
            offset: {
              ...currentState.byId[action.payload.id].style.shadow.offset,
              y: currentState.byId[action.payload.id].style.shadow.offset.y * -1
            }
          }
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
    currentState = updateLayerTweensByProps(currentState, action.payload.id, ['shape']);
  }
  if (shapeIcon) {
    currentState = {
      ...currentState,
      shapeIcons: {
        ...currentState.shapeIcons,
        [action.payload.id]: shapeIcon
      }
    }
  }
  if (from) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          from: {
            ...(currentState.byId[action.payload.id] as Btwx.Line).from,
            y: from.y
          }
        } as Btwx.Line
      }
    }
  }
  if (to) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          to: {
            ...(currentState.byId[action.payload.id] as Btwx.Line).to,
            y: to.y
          }
        } as Btwx.Line
      }
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['scaleY', 'fillGradientOriginY', 'fillGradientDestinationY', 'strokeGradientOriginY', 'strokeGradientDestinationY', 'shadowOffsetY']);
  if (point) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          point: {
            ...(currentState.byId[action.payload.id] as Btwx.Text).point,
            y: point.y
          }
        } as Btwx.Text
      }
    }
    // currentState = updateLayerTweensByProps(currentState, action.payload.id, ['pointY']);
  }
  return currentState;
};

export const enableLayersVerticalFlip = (state: LayerState, action: EnableLayersVerticalFlip): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    const pathData = action.payload.pathData ? action.payload.pathData[current] : null;
    const shapeIcon = action.payload.shapeIcon ? action.payload.shapeIcon[current] : null;
    const point = action.payload.point ? action.payload.point[current] : null;
    const from = action.payload.from ? action.payload.from[current] : null;
    const to = action.payload.to ? action.payload.to[current] : null;
    return enableLayerVerticalFlip(result, layerActions.enableLayerVerticalFlip({
      id: current,
      point,
      pathData,
      shapeIcon,
      from,
      to
    }) as EnableLayerVerticalFlip);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Enable Layers Vertical Flip',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const disableLayerVerticalFlip = (state: LayerState, action: DisableLayerVerticalFlip): LayerState => {
  let currentState = state;
  const pathData = action.payload.pathData;
  const shapeIcon = action.payload.shapeIcon;
  const from = action.payload.from;
  const to = action.payload.to;
  const point = action.payload.point;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        transform: {
          ...currentState.byId[action.payload.id].transform,
          verticalFlip: false
        },
        style: {
          ...currentState.byId[action.payload.id].style,
          fill: {
            ...currentState.byId[action.payload.id].style.fill,
            gradient: {
              ...currentState.byId[action.payload.id].style.fill.gradient,
              origin: {
                ...currentState.byId[action.payload.id].style.fill.gradient.origin,
                y: currentState.byId[action.payload.id].style.fill.gradient.origin.y * -1
              },
              destination: {
                ...currentState.byId[action.payload.id].style.fill.gradient.destination,
                y: currentState.byId[action.payload.id].style.fill.gradient.destination.y * -1
              }
            }
          },
          stroke: {
            ...currentState.byId[action.payload.id].style.stroke,
            gradient: {
              ...currentState.byId[action.payload.id].style.stroke.gradient,
              origin: {
                ...currentState.byId[action.payload.id].style.stroke.gradient.origin,
                y: currentState.byId[action.payload.id].style.stroke.gradient.origin.y * -1
              },
              destination: {
                ...currentState.byId[action.payload.id].style.stroke.gradient.destination,
                y: currentState.byId[action.payload.id].style.stroke.gradient.destination.y * -1
              }
            }
          },
          shadow: {
            ...currentState.byId[action.payload.id].style.shadow,
            offset: {
              ...currentState.byId[action.payload.id].style.shadow.offset,
              y: currentState.byId[action.payload.id].style.shadow.offset.y * -1
            }
          }
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
    currentState = updateLayerTweensByProps(currentState, action.payload.id, ['shape']);
  }
  if (shapeIcon) {
    currentState = {
      ...currentState,
      shapeIcons: {
        ...currentState.shapeIcons,
        [action.payload.id]: shapeIcon
      }
    }
  }
  if (from) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          from: {
            ...(currentState.byId[action.payload.id] as Btwx.Line).from,
            y: from.y
          }
        } as Btwx.Line
      }
    }
  }
  if (to) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          to: {
            ...(currentState.byId[action.payload.id] as Btwx.Line).to,
            y: to.y
          }
        } as Btwx.Line
      }
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['scaleY', 'fillGradientOriginY', 'fillGradientDestinationY', 'strokeGradientOriginY', 'strokeGradientDestinationY', 'shadowOffsetY']);
  if (point) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          point: {
            ...(currentState.byId[action.payload.id] as Btwx.Text).point,
            y: point.y
          }
        } as Btwx.Text
      }
    }
    // currentState = updateLayerTweensByProps(currentState, action.payload.id, ['pointY']);
  }
  return currentState;
};

export const disableLayersVerticalFlip = (state: LayerState, action: DisableLayersVerticalFlip): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    const pathData = action.payload.pathData ? action.payload.pathData[current] : null;
    const shapeIcon = action.payload.shapeIcon ? action.payload.shapeIcon[current] : null;
    const point = action.payload.point ? action.payload.point[current] : null;
    const from = action.payload.from ? action.payload.from[current] : null;
    const to = action.payload.to ? action.payload.to[current] : null;
    return disableLayerVerticalFlip(result, layerActions.disableLayerVerticalFlip({
      id: current,
      point,
      pathData,
      shapeIcon,
      from,
      to
    }) as DisableLayerVerticalFlip);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Disable Layers Vertical Flip',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const enableLayerFill = (state: LayerState, action: EnableLayerFill): LayerState => {
  let currentState = state;
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
  currentState = action.payload.layers.reduce((result, current) => {
    return enableLayerFill(result, layerActions.enableLayerFill({
      id: current
    }) as EnableLayerFill);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Enable Layers Fill',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const disableLayerFill = (state: LayerState, action: DisableLayerFill): LayerState => {
  let currentState = state;
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
  currentState = action.payload.layers.reduce((result, current) => {
    return disableLayerFill(result, layerActions.disableLayerFill({
      id: current
    }) as DisableLayerFill);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Disable Layers Fill',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerFillColor = (state: LayerState, action: SetLayerFillColor): LayerState => {
  let currentState = state;
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
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerFillColor(result, layerActions.setLayerFillColor({
      id: current,
      fillColor: action.payload.fillColor
    }) as SetLayerFillColor);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Fill Color',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayersFillColors = (state: LayerState, action: SetLayersFillColors): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerFillColor(result, layerActions.setLayerFillColor({
      id: current,
      fillColor: action.payload.fillColors[current]
    }) as SetLayerFillColor);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Fill Colors',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerFill = (state: LayerState, action: SetLayerFill): LayerState => {
  let currentState = state;
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
            ...action.payload.fill
          }
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
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayersFill = (state: LayerState, action: SetLayersFill): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerFill(result, layerActions.setLayerFill({
      id: current,
      fill: action.payload.fill
    }) as SetLayerFill);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Fill',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerStroke = (state: LayerState, action: SetLayerStroke): LayerState => {
  let currentState = state;
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
            ...action.payload.stroke
          }
        }
      }
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['stroke', 'strokeGradientOriginX', 'strokeGradientOriginY', 'strokeGradientDestinationX', 'strokeGradientDestinationY']);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Stroke',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayersStroke = (state: LayerState, action: SetLayersStroke): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerStroke(result, layerActions.setLayerStroke({
      id: current,
      stroke: action.payload.stroke
    }) as SetLayerStroke);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Stroke',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerShadow = (state: LayerState, action: SetLayerShadow): LayerState => {
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
            ...action.payload.shadow
          }
        }
      }
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['shadowColor', 'shadowOffsetX', 'shadowOffsetY', 'shadowBlur']);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Shadow',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayersShadow = (state: LayerState, action: SetLayersShadow): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerShadow(result, layerActions.setLayerShadow({
      id: current,
      shadow: action.payload.shadow
    }) as SetLayerShadow);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Shadow',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerFillType = (state: LayerState, action: SetLayerFillType): LayerState => {
  let currentState = state;
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
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerFillType(result, layerActions.setLayerFillType({
      id: current,
      fillType: action.payload.fillType,
      gradientType: action.payload.gradientType
    }) as SetLayerFillType);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Fill Type',
      undoable: true
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
  currentState = updateLayerTweensByProps(currentState, action.payload.id, [action.payload.prop, `${action.payload.prop}GradientOriginX`, `${action.payload.prop}GradientOriginY`, `${action.payload.prop}GradientDestinationX`, `${action.payload.prop}GradientDestinationY`] as any);
  return currentState;
};

export const setLayersGradient = (state: LayerState, action: SetLayersGradient): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerGradient(result, layerActions.setLayerGradient({
      id: current,
      prop: action.payload.prop,
      gradient: action.payload.gradient
    }) as SetLayerGradient);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Gradient',
      undoable: true
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
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerGradientType(result, layerActions.setLayerGradientType({
      id: current,
      prop: action.payload.prop,
      gradientType: action.payload.gradientType
    }) as SetLayerGradientType);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Gradient Type',
      undoable: true
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
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerGradientOrigin(result, layerActions.setLayerGradientOrigin({
      id: current,
      prop: action.payload.prop,
      origin: action.payload.origin
    }) as SetLayerGradientOrigin);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Gradient Origin',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerGradientDestination = (state: LayerState, action: SetLayerGradientDestination): LayerState => {
  let currentState = state;
  const destination = getGradientDestination(currentState, action.payload.id, action.payload.destination);
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
  currentState = updateLayerTweensByProps(currentState, action.payload.id, [action.payload.prop, `${action.payload.prop}GradientDestinationX`, `${action.payload.prop}GradientDestinationY`] as any);
  return currentState;
};

export const setLayersGradientDestination = (state: LayerState, action: SetLayersGradientDestination): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerGradientDestination(result, layerActions.setLayerGradientDestination({
      id: current,
      prop: action.payload.prop,
      destination: action.payload.destination
    }) as SetLayerGradientDestination);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Gradient Destination',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayersGradientOD = (state: LayerState, action: SetLayersGradientOD): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    result = setLayerGradientOrigin(result, layerActions.setLayerGradientOrigin({
      id: current,
      prop: action.payload.prop,
      origin: action.payload.origin
    }) as SetLayerGradientOrigin);
    result = setLayerGradientDestination(result, layerActions.setLayerGradientDestination({
      id: current,
      prop: action.payload.prop,
      destination: action.payload.destination
    }) as SetLayerGradientDestination);
    return result;
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: `Set Layers Gradient ${capitalize(action.payload.handle)}`,
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerGradientStopColor = (state: LayerState, action: SetLayerGradientStopColor): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const gradient = layerItem.style[action.payload.prop].gradient;
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
  currentState = setLayerGradientStopColor(currentState, layerActions.setLayerGradientStopColor({
    id: action.payload.layers[0],
    prop: action.payload.prop,
    stopIndex: action.payload.stopIndex,
    color: action.payload.color
  }) as SetLayerGradientStopColor);
  currentState = updateGradients(currentState, action.payload.layers, action.payload.prop);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Gradient Stop Color',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerGradientStopPosition = (state: LayerState, action: SetLayerGradientStopPosition): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const gradient = layerItem.style[action.payload.prop].gradient;
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
  currentState = updateLayerTweensByProps(currentState, action.payload.id, [action.payload.prop]);
  return currentState;
};

export const setLayersGradientStopPosition = (state: LayerState, action: SetLayersGradientStopPosition): LayerState => {
  let currentState = state;
  currentState = setLayerGradientStopPosition(currentState, layerActions.setLayerGradientStopPosition({
    id: action.payload.layers[0],
    prop: action.payload.prop,
    stopIndex: action.payload.stopIndex,
    position: action.payload.position
  }) as SetLayerGradientStopPosition);
  currentState = updateGradients(currentState, action.payload.layers, action.payload.prop);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Gradient Stop Position',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const addLayerGradientStop = (state: LayerState, action: AddLayerGradientStop): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const gradient = layerItem.style[action.payload.prop].gradient;
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
  currentState = addLayerGradientStop(currentState, layerActions.addLayerGradientStop({
    id: action.payload.layers[0],
    prop: action.payload.prop,
    gradientStop: action.payload.gradientStop
  }) as AddLayerGradientStop);
  currentState = updateGradients(currentState, action.payload.layers, action.payload.prop);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Add Layers Gradient Stop',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const removeLayerGradientStop = (state: LayerState, action: RemoveLayerGradientStop): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
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
  currentState = setLayerActiveGradientStop(currentState, layerActions.setLayerActiveGradientStop({id: action.payload.id, prop: action.payload.prop, stopIndex: 0}) as SetLayerActiveGradientStop);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, [action.payload.prop]);
  return currentState;
};

export const removeLayersGradientStop = (state: LayerState, action: RemoveLayersGradientStop): LayerState => {
  let currentState = state;
  currentState = removeLayerGradientStop(currentState, layerActions.removeLayerGradientStop({
    id: action.payload.layers[0],
    prop: action.payload.prop,
    stopIndex: action.payload.stopIndex
  }) as RemoveLayerGradientStop);
  currentState = updateGradients(currentState, action.payload.layers, action.payload.prop);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Remove Layers Gradient Stop',
      undoable: true
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

export const flipLayerGradient = (state: LayerState, action: FlipLayerGradient): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const gradient = layerItem.style[action.payload.prop].gradient;
  const newStops = gradient.stops.reverse().map((stop) => ({
    ...stop,
    position: 1 - stop.position
  }));
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
              stops: newStops,
              activeStopIndex: (gradient.stops.length - 1) - currentState.byId[action.payload.id].style[action.payload.prop].gradient.activeStopIndex
            }
          }
        }
      }
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, [action.payload.prop]);
  return currentState;
};

export const flipLayersGradient = (state: LayerState, action: FlipLayersGradient): LayerState => {
  let currentState = state;
  currentState = flipLayerGradient(currentState, layerActions.flipLayerGradient({
    id: action.payload.layers[0],
    prop: action.payload.prop
  }) as FlipLayerGradient);
  currentState = updateGradients(currentState, action.payload.layers, action.payload.prop);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Flip Layers Gradient',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const enableLayerStroke = (state: LayerState, action: EnableLayerStroke): LayerState => {
  let currentState = state;
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
  currentState = action.payload.layers.reduce((result, current) => {
    return enableLayerStroke(result, layerActions.enableLayerStroke({
      id: current
    }) as EnableLayerStroke);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Enable Layers Stroke',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const disableLayerStroke = (state: LayerState, action: DisableLayerStroke): LayerState => {
  let currentState = state;
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
  currentState = action.payload.layers.reduce((result, current) => {
    return disableLayerStroke(result, layerActions.disableLayerStroke({
      id: current
    }) as DisableLayerStroke);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Disable Layers Stroke',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerStrokeColor = (state: LayerState, action: SetLayerStrokeColor): LayerState => {
  let currentState = state;
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
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerStrokeColor(result, layerActions.setLayerStrokeColor({
      id: current,
      strokeColor: action.payload.strokeColor
    }) as SetLayerStrokeColor);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Stroke Color',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayersStrokeColors = (state: LayerState, action: SetLayersStrokeColors): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerStrokeColor(result, layerActions.setLayerStrokeColor({
      id: current,
      strokeColor: action.payload.strokeColors[current]
    }) as SetLayerStrokeColor);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Stroke Color',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerStrokeFillType = (state: LayerState, action: SetLayerStrokeFillType): LayerState => {
  let currentState = state;
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
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerStrokeFillType(result, layerActions.setLayerStrokeFillType({
      id: current,
      fillType: action.payload.fillType,
      gradientType: action.payload.gradientType
    }) as SetLayerStrokeFillType);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Stroke Fill Type',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerStrokeWidth = (state: LayerState, action: SetLayerStrokeWidth): LayerState => {
  let currentState = state;
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
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerStrokeWidth(result, layerActions.setLayerStrokeWidth({
      id: current,
      strokeWidth: action.payload.strokeWidth
    }) as SetLayerStrokeWidth);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Stroke Width',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerStrokeCap = (state: LayerState, action: SetLayerStrokeCap): LayerState => {
  let currentState = state;
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
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerStrokeCap(result, layerActions.setLayerStrokeCap({
      id: current,
      strokeCap: action.payload.strokeCap
    }) as SetLayerStrokeCap);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Stroke Cap',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerStrokeJoin = (state: LayerState, action: SetLayerStrokeJoin): LayerState => {
  let currentState = state;
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
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerStrokeJoin(result, layerActions.setLayerStrokeJoin({
      id: current,
      strokeJoin: action.payload.strokeJoin
    }) as SetLayerStrokeJoin);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Stroke Join',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerStrokeDashOffset = (state: LayerState, action: SetLayerStrokeDashOffset): LayerState => {
  let currentState = state;
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
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerStrokeDashOffset(result, layerActions.setLayerStrokeDashOffset({
      id: current,
      strokeDashOffset: action.payload.strokeDashOffset
    }) as SetLayerStrokeDashOffset);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Stroke Dash Offset',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerStrokeDashArray = (state: LayerState, action: SetLayerStrokeDashArray): LayerState => {
  let currentState = state;
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
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerStrokeDashArray(result, layerActions.setLayerStrokeDashArray({
      id: current,
      strokeDashArray: action.payload.strokeDashArray
    }) as SetLayerStrokeDashArray);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Stroke Dash Array',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerStrokeDashArrayWidth = (state: LayerState, action: SetLayerStrokeDashArrayWidth): LayerState => {
  let currentState = state;
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
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerStrokeDashArrayWidth(result, layerActions.setLayerStrokeDashArrayWidth({
      id: current,
      strokeDashArrayWidth: action.payload.strokeDashArrayWidth
    }) as SetLayerStrokeDashArrayWidth);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Stroke Dash Array Width',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerStrokeDashArrayGap = (state: LayerState, action: SetLayerStrokeDashArrayGap): LayerState => {
  let currentState = state;
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
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerStrokeDashArrayGap(result, layerActions.setLayerStrokeDashArrayGap({
      id: current,
      strokeDashArrayGap: action.payload.strokeDashArrayGap
    }) as SetLayerStrokeDashArrayGap);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Stroke Dash Array Gap',
      undoable: true
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
  currentState = action.payload.layers.reduce((result, current) => {
    return enableLayerShadow(result, layerActions.enableLayerShadow({
      id: current
    }) as EnableLayerShadow);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Enable Layers Shadow',
      undoable: true
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
  currentState = action.payload.layers.reduce((result, current) => {
    return disableLayerShadow(result, layerActions.disableLayerShadow({
      id: current
    }) as DisableLayerShadow);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Disable Layers Shadow',
      undoable: true
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
            color: {
              ...currentState.byId[action.payload.id].style.shadow.color,
              ...action.payload.shadowColor
            }
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
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerShadowColor(result, layerActions.setLayerShadowColor({
      id: current,
      shadowColor: action.payload.shadowColor
    }) as SetLayerShadowColor);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Shadow Color',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayersShadowColors = (state: LayerState, action: SetLayersShadowColors): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerShadowColor(result, layerActions.setLayerShadowColor({
      id: current,
      shadowColor: action.payload.shadowColors[current]
    }) as SetLayerShadowColor);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Shadow Color',
      undoable: true
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
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerShadowBlur(result, layerActions.setLayerShadowBlur({
      id: current,
      shadowBlur: action.payload.shadowBlur
    }) as SetLayerShadowBlur);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Shadow Blur',
      undoable: true
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
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerShadowXOffset(result, layerActions.setLayerShadowXOffset({
      id: current,
      shadowXOffset: action.payload.shadowXOffset
    }) as SetLayerShadowXOffset);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Shadow X Offset',
      undoable: true
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
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerShadowYOffset(result, layerActions.setLayerShadowYOffset({
      id: current,
      shadowYOffset: action.payload.shadowYOffset
    }) as SetLayerShadowYOffset);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Shadow Y Offset',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const scaleLayer = (state: LayerState, action: ScaleLayer): LayerState => {
  let currentState = state;
  const layerItem = state.byId[action.payload.id];
  const pathData = action.payload.pathData;
  const shapeIcon = action.payload.shapeIcon;
  const rotation = action.payload.rotation;
  const bounds = action.payload.bounds;
  const from = action.payload.from;
  const to = action.payload.to;
  const point = action.payload.point;
  const lines = action.payload.lines;
  const resize = action.payload.resize;
  const paragraphs = action.payload.paragraphs;
  const isArtboard = layerItem.type === 'Artboard';
  const groupParents = isArtboard ? ['root'] : layerItem.scope.filter((id, index) => index !== 0 && index !== 1).reverse();
  if (action.payload.horizontalFlip) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          transform: {
            ...currentState.byId[action.payload.id].transform,
            horizontalFlip: !currentState.byId[action.payload.id].transform.horizontalFlip
          },
          style: {
            ...currentState.byId[action.payload.id].style,
            fill: {
              ...currentState.byId[action.payload.id].style.fill,
              gradient: {
                ...currentState.byId[action.payload.id].style.fill.gradient,
                origin: {
                  ...currentState.byId[action.payload.id].style.fill.gradient.origin,
                  x: currentState.byId[action.payload.id].style.fill.gradient.origin.x * -1
                },
                destination: {
                  ...currentState.byId[action.payload.id].style.fill.gradient.destination,
                  x: currentState.byId[action.payload.id].style.fill.gradient.destination.x * -1
                }
              }
            },
            stroke: {
              ...currentState.byId[action.payload.id].style.stroke,
              gradient: {
                ...currentState.byId[action.payload.id].style.stroke.gradient,
                origin: {
                  ...currentState.byId[action.payload.id].style.stroke.gradient.origin,
                  x: currentState.byId[action.payload.id].style.stroke.gradient.origin.x * -1
                },
                destination: {
                  ...currentState.byId[action.payload.id].style.stroke.gradient.destination,
                  x: currentState.byId[action.payload.id].style.stroke.gradient.destination.x * -1
                }
              }
            },
            shadow: {
              ...currentState.byId[action.payload.id].style.shadow,
              offset: {
                ...currentState.byId[action.payload.id].style.shadow.offset,
                x: currentState.byId[action.payload.id].style.shadow.offset.x * -1
              }
            }
          }
        }
      }
    }
  }
  if (action.payload.verticalFlip) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          transform: {
            ...currentState.byId[action.payload.id].transform,
            verticalFlip: !currentState.byId[action.payload.id].transform.verticalFlip
          },
          style: {
            ...currentState.byId[action.payload.id].style,
            fill: {
              ...currentState.byId[action.payload.id].style.fill,
              gradient: {
                ...currentState.byId[action.payload.id].style.fill.gradient,
                origin: {
                  ...currentState.byId[action.payload.id].style.fill.gradient.origin,
                  y: currentState.byId[action.payload.id].style.fill.gradient.origin.y * -1
                },
                destination: {
                  ...currentState.byId[action.payload.id].style.fill.gradient.destination,
                  y: currentState.byId[action.payload.id].style.fill.gradient.destination.y * -1
                }
              }
            },
            stroke: {
              ...currentState.byId[action.payload.id].style.stroke,
              gradient: {
                ...currentState.byId[action.payload.id].style.stroke.gradient,
                origin: {
                  ...currentState.byId[action.payload.id].style.stroke.gradient.origin,
                  y: currentState.byId[action.payload.id].style.stroke.gradient.origin.y * -1
                },
                destination: {
                  ...currentState.byId[action.payload.id].style.stroke.gradient.destination,
                  y: currentState.byId[action.payload.id].style.stroke.gradient.destination.y * -1
                }
              }
            },
            shadow: {
              ...currentState.byId[action.payload.id].style.shadow,
              offset: {
                ...currentState.byId[action.payload.id].style.shadow.offset,
                y: currentState.byId[action.payload.id].style.shadow.offset.y * -1
              }
            }
          }
        }
      }
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['scaleX', 'scaleY', 'fillGradientOriginX', 'fillGradientDestinationX', 'strokeGradientOriginX', 'strokeGradientDestinationX', 'fillGradientOriginY', 'fillGradientDestinationY', 'strokeGradientOriginY', 'strokeGradientDestinationY', 'shadowOffsetX', 'shadowOffsetY']);
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
    currentState = updateLayerTweensByProps(currentState, action.payload.id, ['shape']);
  }
  if (shapeIcon) {
    currentState = {
      ...currentState,
      shapeIcons: {
        ...currentState.shapeIcons,
        [action.payload.id]: action.payload.shapeIcon
      }
    }
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
  }
  if (point) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          point: point
        } as Btwx.Text
      }
    }
  }
  if (resize) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          textStyle: {
            ...(currentState.byId[action.payload.id] as Btwx.Text).textStyle,
            textResize: resize
          }
        } as Btwx.Text
      }
    }
  }
  if (paragraphs) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          paragraphs: paragraphs
        } as Btwx.Text
      }
    }
  }
  if (lines) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          lines: lines
        } as Btwx.Text
      }
    }
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
  currentState = updateGroupParentBounds(currentState, groupParents);
  return currentState;
};

export const scaleLayers = (state: LayerState, action: ScaleLayers): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    const pathData = action.payload.pathData ? action.payload.pathData[current] : null;
    const shapeIcon = action.payload.shapeIcon ? action.payload.shapeIcon[current] : null;
    const rotation = action.payload.rotation ? action.payload.rotation[current] : null;
    const bounds = action.payload.bounds ? action.payload.bounds[current] : null;
    const point = action.payload.point ? action.payload.point[current] : null;
    const lines = action.payload.lines ? action.payload.lines[current] : null;
    const from = action.payload.from ? action.payload.from[current] : null;
    const to = action.payload.to ? action.payload.to[current] : null;
    const resize = action.payload.resize ? action.payload.resize[current] : null;
    const paragraphs = action.payload.paragraphs ? action.payload.paragraphs[current] : null;
    const scale = action.payload.scale;
    const verticalFlip = action.payload.verticalFlip;
    const horizontalFlip = action.payload.horizontalFlip;
    return scaleLayer(result, layerActions.scaleLayer({
      id: current,
      scale,
      point,
      lines,
      verticalFlip,
      horizontalFlip,
      pathData,
      shapeIcon,
      rotation,
      resize,
      bounds,
      from,
      to,
      paragraphs
    }) as ScaleLayer);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Resize Layers',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerText = (state: LayerState, action: SetLayerText): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const groupParents = layerItem.scope.filter((id, index) => index !== 0 && index !== 1).reverse();
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
        }, []),
        paragraphs: action.payload.paragraphs ? action.payload.paragraphs : (currentState.byId[action.payload.id] as Btwx.Text).paragraphs,
        point: {
          ...(currentState.byId[action.payload.id] as Btwx.Text).point,
          ...action.payload.point
        }
      } as Btwx.Text
    }
  }
  currentState = updateGroupParentBounds(currentState, groupParents);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['x', 'y', 'text', 'width', 'height']);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layer Text',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerTextResize = (state: LayerState, action: SetLayerTextResize): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const groupParents = layerItem.scope.filter((id, index) => index !== 0 && index !== 1).reverse();
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
          textResize: action.payload.resize
        },
        lines: action.payload.lines ? action.payload.lines : (currentState.byId[action.payload.id] as Btwx.Text).lines,
        paragraphs: action.payload.paragraphs ? action.payload.paragraphs : (currentState.byId[action.payload.id] as Btwx.Text).paragraphs,
        point: {
          ...(currentState.byId[action.payload.id] as Btwx.Text).point,
          ...action.payload.point
        }
      } as Btwx.Text
    }
  }
  currentState = updateGroupParentBounds(currentState, groupParents);
  // currentState = updateLayerTweensByProps(currentState, action.payload.id, ['pointX', 'pointY', 'text']);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Text Resize',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayersTextResize = (state: LayerState, action: SetLayersTextResize): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current, index) => {
    const bounds = action.payload.bounds ? action.payload.bounds[index] : null;
    const lines = action.payload.lines ? action.payload.lines[index] : null;
    const paragraphs = action.payload.paragraphs ? action.payload.paragraphs[index] : null;
    const point = action.payload.point ? action.payload.point[index] : null;
    return setLayerTextResize(result, layerActions.setLayerTextResize({
      id: current,
      resize: action.payload.resize,
      bounds,
      lines,
      paragraphs,
      point
    }) as SetLayerTextResize);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Text Resize',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerFontSize = (state: LayerState, action: SetLayerFontSize): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const groupParents = layerItem.scope.filter((id, index) => index !== 0 && index !== 1).reverse();
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
        lines: action.payload.lines ? action.payload.lines : (currentState.byId[action.payload.id] as Btwx.Text).lines,
        paragraphs: action.payload.paragraphs ? action.payload.paragraphs : (currentState.byId[action.payload.id] as Btwx.Text).paragraphs,
        point: {
          ...(currentState.byId[action.payload.id] as Btwx.Text).point,
          ...action.payload.point
        }
      } as Btwx.Text
    }
  }
  currentState = updateGroupParentBounds(currentState, groupParents);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['fontSize', 'x', 'width', 'lineHeight']);
  return currentState;
};

export const setLayersFontSize = (state: LayerState, action: SetLayersFontSize): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current, index) => {
    const bounds = action.payload.bounds ? action.payload.bounds[index] : null;
    const lines = action.payload.lines ? action.payload.lines[index] : null;
    const paragraphs = action.payload.paragraphs ? action.payload.paragraphs[index] : null;
    const point = action.payload.point ? action.payload.point[index] : null;
    return setLayerFontSize(result, layerActions.setLayerFontSize({
      id: current,
      fontSize: action.payload.fontSize,
      bounds,
      lines,
      paragraphs,
      point
    }) as SetLayerFontSize);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Font Size',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerFontWeight = (state: LayerState, action: SetLayerFontWeight): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const groupParents = layerItem.scope.filter((id, index) => index !== 0 && index !== 1).reverse();
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
        lines: action.payload.lines ? action.payload.lines : (currentState.byId[action.payload.id] as Btwx.Text).lines,
        paragraphs: action.payload.paragraphs ? action.payload.paragraphs : (currentState.byId[action.payload.id] as Btwx.Text).paragraphs,
        point: {
          ...(currentState.byId[action.payload.id] as Btwx.Text).point,
          ...action.payload.point
        }
      } as Btwx.Text
    }
  }
  currentState = updateGroupParentBounds(currentState, groupParents);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['fontWeight', 'x', 'width']);
  return currentState;
};

export const setLayersFontWeight = (state: LayerState, action: SetLayersFontWeight): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current, index) => {
    const bounds = action.payload.bounds ? action.payload.bounds[index] : null;
    const lines = action.payload.lines ? action.payload.lines[index] : null;
    const paragraphs = action.payload.paragraphs ? action.payload.paragraphs[index] : null;
    const point = action.payload.point ? action.payload.point[index] : null;
    return setLayerFontWeight(result, layerActions.setLayerFontWeight({
      id: current,
      fontWeight: action.payload.fontWeight,
      bounds,
      lines,
      paragraphs,
      point
    }) as SetLayerFontWeight);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Font Weight',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerLetterSpacing = (state: LayerState, action: SetLayerLetterSpacing): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const groupParents = layerItem.scope.filter((id, index) => index !== 0 && index !== 1).reverse();
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
        lines: action.payload.lines ? action.payload.lines : (currentState.byId[action.payload.id] as Btwx.Text).lines,
        paragraphs: action.payload.paragraphs ? action.payload.paragraphs : (currentState.byId[action.payload.id] as Btwx.Text).paragraphs,
        point: {
          ...(currentState.byId[action.payload.id] as Btwx.Text).point,
          ...action.payload.point
        }
      } as Btwx.Text
    }
  }
  currentState = updateGroupParentBounds(currentState, groupParents);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['letterSpacing']);
  return currentState;
};

export const setLayersLetterSpacing = (state: LayerState, action: SetLayersLetterSpacing): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current, index) => {
    const bounds = action.payload.bounds ? action.payload.bounds[index] : null;
    const lines = action.payload.lines ? action.payload.lines[index] : null;
    const paragraphs = action.payload.paragraphs ? action.payload.paragraphs[index] : null;
    const point = action.payload.point ? action.payload.point[index] : null;
    return setLayerLetterSpacing(result, layerActions.setLayerLetterSpacing({
      id: current,
      letterSpacing: action.payload.letterSpacing,
      bounds,
      lines,
      paragraphs,
      point
    }) as SetLayerLetterSpacing);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Letter Spacing',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerTextTransform = (state: LayerState, action: SetLayerTextTransform): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const groupParents = layerItem.scope.filter((id, index) => index !== 0 && index !== 1).reverse();
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
          textTransform: action.payload.textTransform
        },
        lines: action.payload.lines ? action.payload.lines : (currentState.byId[action.payload.id] as Btwx.Text).lines,
        paragraphs: action.payload.paragraphs ? action.payload.paragraphs : (currentState.byId[action.payload.id] as Btwx.Text).paragraphs,
        point: {
          ...(currentState.byId[action.payload.id] as Btwx.Text).point,
          ...action.payload.point
        }
      } as Btwx.Text
    }
  }
  currentState = updateGroupParentBounds(currentState, groupParents);
  return currentState;
};

export const setLayersTextTransform = (state: LayerState, action: SetLayersTextTransform): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current, index) => {
    const bounds = action.payload.bounds ? action.payload.bounds[index] : null;
    const lines = action.payload.lines ? action.payload.lines[index] : null;
    const paragraphs = action.payload.paragraphs ? action.payload.paragraphs[index] : null;
    const point = action.payload.point ? action.payload.point[index] : null;
    return setLayerTextTransform(result, layerActions.setLayerTextTransform({
      id: current,
      textTransform: action.payload.textTransform,
      bounds,
      lines,
      paragraphs,
      point
    }) as SetLayerTextTransform);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Text Transform',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerFontFamily = (state: LayerState, action: SetLayerFontFamily): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const groupParents = layerItem.scope.filter((id, index) => index !== 0 && index !== 1).reverse();
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
        lines: action.payload.lines ? action.payload.lines : (currentState.byId[action.payload.id] as Btwx.Text).lines,
        paragraphs: action.payload.paragraphs ? action.payload.paragraphs : (currentState.byId[action.payload.id] as Btwx.Text).paragraphs,
        point: {
          ...(currentState.byId[action.payload.id] as Btwx.Text).point,
          ...action.payload.point
        }
      } as Btwx.Text
    }
  }
  currentState = updateGroupParentBounds(currentState, groupParents);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['x', 'y', 'width', 'height']);
  return currentState;
};

export const setLayersFontFamily = (state: LayerState, action: SetLayersFontFamily): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current, index) => {
    const bounds = action.payload.bounds ? action.payload.bounds[index] : null;
    const lines = action.payload.lines ? action.payload.lines[index] : null;
    const paragraphs = action.payload.paragraphs ? action.payload.paragraphs[index] : null;
    const point = action.payload.point ? action.payload.point[index] : null;
    return setLayerFontFamily(result, layerActions.setLayerFontFamily({
      id: current,
      fontFamily: action.payload.fontFamily,
      bounds,
      lines,
      paragraphs,
      point
    }) as SetLayerFontFamily);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Font Family',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerLeading = (state: LayerState, action: SetLayerLeading): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const groupParents = layerItem.scope.filter((id, index) => index !== 0 && index !== 1).reverse();
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
        lines: action.payload.lines ? action.payload.lines : (currentState.byId[action.payload.id] as Btwx.Text).lines,
        textStyle: {
          ...(currentState.byId[action.payload.id] as Btwx.Text).textStyle,
          leading: action.payload.leading
        },
        point: {
          ...(currentState.byId[action.payload.id] as Btwx.Text).point,
          ...action.payload.point
        }
      } as Btwx.Text
    }
  }
  currentState = updateGroupParentBounds(currentState, groupParents);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['lineHeight']);
  return currentState;
};

export const setLayersLeading = (state: LayerState, action: SetLayersLeading): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current, index) => {
    const bounds = action.payload.bounds ? action.payload.bounds[index] : null;
    const lines = action.payload.lines ? action.payload.lines[index] : null;
    const point = action.payload.point ? action.payload.point[index] : null;
    return setLayerLeading(result, layerActions.setLayerLeading({
      id: current,
      leading: action.payload.leading,
      bounds,
      lines,
      point
    }) as SetLayerLeading);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Leading',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerJustification = (state: LayerState, action: SetLayerJustification): LayerState => {
  let currentState = state;
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
        lines: action.payload.lines ? action.payload.lines : (currentState.byId[action.payload.id] as Btwx.Text).lines,
        point: {
          ...(currentState.byId[action.payload.id] as Btwx.Text).point,
          ...action.payload.point
        },
        textStyle: {
          ...(currentState.byId[action.payload.id] as Btwx.Text).textStyle,
          justification: action.payload.justification
        },
      } as Btwx.Text
    }
  }
  // currentState = updateLayerTweensByProps(currentState, action.payload.id, ['justification']);
  return currentState;
};

export const setLayersJustification = (state: LayerState, action: SetLayersJustification): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current, index) => {
    const lines = action.payload.lines ? action.payload.lines[index] : null;
    const bounds = action.payload.bounds ? action.payload.bounds[index] : null;
    const point = action.payload.points ? action.payload.points[index] : null;
    return setLayerJustification(result, layerActions.setLayerJustification({
      id: current,
      justification: action.payload.justification,
      lines,
      bounds,
      point
    }) as SetLayerJustification);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Justification',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerVerticalAlignment = (state: LayerState, action: SetLayerVerticalAlignment): LayerState => {
  let currentState = state;
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
        lines: action.payload.lines ? action.payload.lines : (currentState.byId[action.payload.id] as Btwx.Text).lines,
        point: {
          ...(currentState.byId[action.payload.id] as Btwx.Text).point,
          ...action.payload.point
        },
        textStyle: {
          ...(currentState.byId[action.payload.id] as Btwx.Text).textStyle,
          verticalAlignment: action.payload.verticalAlignment
        },
      } as Btwx.Text
    }
  }
  // currentState = updateLayerTweensByProps(currentState, action.payload.id, ['justification']);
  return currentState;
};

export const setLayersVerticalAlignment = (state: LayerState, action: SetLayersVerticalAlignment): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current, index) => {
    const lines = action.payload.lines ? action.payload.lines[index] : null;
    const bounds = action.payload.bounds ? action.payload.bounds[index] : null;
    const point = action.payload.points ? action.payload.points[index] : null;
    return setLayerVerticalAlignment(result, layerActions.setLayerVerticalAlignment({
      id: current,
      verticalAlignment: action.payload.verticalAlignment,
      lines,
      bounds,
      point
    }) as SetLayerVerticalAlignment);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Text Vertical Alignment',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerFontStyle = (state: LayerState, action: SetLayerFontStyle): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const groupParents = layerItem.scope.filter((id, index) => index !== 0 && index !== 1).reverse();
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
          fontStyle: action.payload.fontStyle
        },
        lines: action.payload.lines ? action.payload.lines : (currentState.byId[action.payload.id] as Btwx.Text).lines,
        paragraphs: action.payload.paragraphs ? action.payload.paragraphs : (currentState.byId[action.payload.id] as Btwx.Text).paragraphs,
        point: {
          ...(currentState.byId[action.payload.id] as Btwx.Text).point,
          ...action.payload.point
        }
      } as Btwx.Text
    }
  }
  currentState = updateGroupParentBounds(currentState, groupParents);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['x', 'width']);
  return currentState;
};

export const setLayersFontStyle = (state: LayerState, action: SetLayersFontStyle): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current, index) => {
    const bounds = action.payload.bounds ? action.payload.bounds[index] : null;
    const lines = action.payload.lines ? action.payload.lines[index] : null;
    const paragraphs = action.payload.paragraphs ? action.payload.paragraphs[index] : null;
    const point = action.payload.point ? action.payload.point[index] : null;
    return setLayerFontStyle(result, layerActions.setLayerFontStyle({
      id: current,
      fontStyle: action.payload.fontStyle,
      bounds,
      lines,
      paragraphs,
      point
    }) as SetLayerFontStyle);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Font Style',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerPointX = (state: LayerState, action: SetLayerPointX): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id] as Btwx.Text;
  const groupParents = layerItem.scope.filter((id, index) => index !== 0 && index !== 1).reverse();
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
        },
        lines: (currentState.byId[action.payload.id] as Btwx.Text).lines.reduce((lr, lc) => {
          return [
            ...lr,
            {
              ...lc,
              frame: {
                ...lc.frame,
                x: lc.frame.x + diff
              },
              anchor: {
                ...lc.anchor,
                x: lc.anchor.x + diff
              }
            }
          ]
        }, [])
      } as Btwx.Text
    }
  }
  currentState = updateGroupParentBounds(currentState, groupParents);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['x']);
  return currentState;
};

export const setLayersPointX = (state: LayerState, action: SetLayersPointX): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerPointX(result, layerActions.setLayerPointX({
      id: current,
      x: action.payload.x
    }) as SetLayerPointX);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Point X',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerPointY = (state: LayerState, action: SetLayerPointY): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id] as Btwx.Text;
  const groupParents = layerItem.scope.filter((id, index) => index !== 0 && index !== 1).reverse();
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
        },
        lines: (currentState.byId[action.payload.id] as Btwx.Text).lines.reduce((lr, lc) => {
          return [
            ...lr,
            {
              ...lc,
              frame: {
                ...lc.frame,
                y: lc.frame.y + diff
              },
              anchor: {
                ...lc.anchor,
                y: lc.anchor.y + diff
              }
            }
          ]
        }, [])
      } as Btwx.Text
    }
  }
  currentState = updateGroupParentBounds(currentState, groupParents);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['y']);
  return currentState;
};

export const setLayersPointY = (state: LayerState, action: SetLayersPointY): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerPointY(result, layerActions.setLayerPointY({
      id: current,
      y: action.payload.y
    }) as SetLayerPointY);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Point Y',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const addLayersMask = (state: LayerState, action: AddLayersMask): LayerState => {
  let currentState = state;
  const maskId = action.payload.layers[0];
  const maskItem = state.byId[maskId] as Btwx.Shape;
  if (!maskItem.mask) {
    currentState = toggleLayerMask(currentState, layerActions.toggleLayerMask({
      id: action.payload.layers[0]
    }) as ToggleLayerMask);
  }
  currentState = groupLayers(currentState, layerActions.groupLayers({
    layers: action.payload.layers,
    group: action.payload.group
  }) as GroupLayers);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Add Layers Mask',
      treeEdit: true,
      undoable: true
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
          currentState = setLayerMasked(currentState, layerActions.setLayerMasked({
            id: sibling,
            masked: false
          }) as SetLayerMasked);
        }
      }
      if (siblingsWithUnderlyingMask.includes(sibling)) {
        currentState = setLayerUnderlyingMask(currentState, layerActions.setLayerUnderlyingMask({
          id: sibling,
          underlyingMask: layerItem.underlyingMask
        }) as SetLayerUnderlyingMask);
      }
    });
  } else {
    if (maskableUnderlyingSiblings.length > 0) {
      maskableUnderlyingSiblings.forEach((sibling) => {
        const siblingItem = currentState.byId[sibling] as Btwx.MaskableLayer;
        currentState = setLayerUnderlyingMask(currentState, layerActions.setLayerUnderlyingMask({
          id: sibling,
          underlyingMask: action.payload.id
        }) as SetLayerUnderlyingMask);
        if (!siblingItem.masked) {
          currentState = setLayerMasked(currentState, layerActions.setLayerMasked({
            id: sibling,
            masked: true
          }) as SetLayerMasked);
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
  currentState = action.payload.layers.reduce((result, current) => {
    return toggleLayerMask(result, layerActions.toggleLayerMask({
      id: current
    }) as ToggleLayerMask);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Toggle Layers Mask',
      treeEdit: true,
      undoable: true
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
  const layerItem = currentState.byId[action.payload.id] as Btwx.MaskableLayer;
  const isMask = layerItem.type === 'Shape' && (layerItem as Btwx.Shape).mask;
  const parentItem = currentState.byId[layerItem.parent];
  const layerIndex = parentItem.children.indexOf(action.payload.id);
  const aboveSiblingId = layerIndex !== 0 ? parentItem.children[layerIndex - 1] : null;
  const aboveSiblingItem = aboveSiblingId ? currentState.byId[aboveSiblingId] as Btwx.MaskableLayer : null;
  const isAboveSiblingMask = aboveSiblingItem && aboveSiblingItem.type === 'Shape' && (aboveSiblingItem as Btwx.Shape).mask;
  const isAboveSiblingMasked = aboveSiblingItem && aboveSiblingItem.masked;
  const maskableUnderlyingSiblings = getMaskableSiblings(currentState, action.payload.id);
  if (layerItem.ignoreUnderlyingMask) {
    if (layerItem.underlyingMask && (isAboveSiblingMasked || isAboveSiblingMask)) {
      currentState = setLayersMasked(currentState, layerActions.setLayersMasked({
        layers: [...maskableUnderlyingSiblings, action.payload.id],
        masked: true
      }) as SetLayersMasked);
    }
  } else {
    if (layerItem.underlyingMask && layerItem.masked) {
      if (maskableUnderlyingSiblings.length > 0 && !isMask) {
        maskableUnderlyingSiblings.reverse().forEach((sibling) => {
          currentState = setLayerMasked(currentState, layerActions.setLayerMasked({
            id: sibling,
            masked: false
          }) as SetLayerMasked);
        });
      }
      currentState = setLayerMasked(currentState, layerActions.setLayerMasked({
        id: action.payload.id,
        masked: false
      }) as SetLayerMasked);
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
  currentState = action.payload.layers.reduce((result, current) => {
    return toggleLayerIgnoreUnderlyingMask(result, layerActions.toggleLayerIgnoreUnderlyingMask({
      id: current
    }) as ToggleLayerIgnoreUnderlyingMask);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Toggle Layers Ignore Underlying Mask',
      treeEdit: true,
      undoable: true
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
  currentState = action.payload.layers.reduce((result, current) => {
    const layerItem = result.byId[current];
    const layerProject = layerItem.artboard;
    const artboardItem = result.byId[layerProject];
    const artboardLeft = artboardItem.frame.x - (artboardItem.frame.width / 2);
    const artboardDiff = layerItem.type === 'Artboard' ? 0 : leftMostArtboardLeft - artboardLeft;
    return setLayerLeft(result, layerActions.setLayerLeft({
      id: current,
      left: left + artboardDiff
    }) as SetLayerLeft);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Align Layers To Left',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const alignLayersToCenter = (state: LayerState, action: AlignLayersToCenter): LayerState => {
  let currentState = state;
  const layerBounds = getLayersBounds(currentState, action.payload.layers);
  const center = layerBounds.center.x;
  currentState = action.payload.layers.reduce((result, current) => {
    const layerItem = result.byId[current];
    const layerProject = layerItem.artboard;
    const artboardItem = result.byId[layerProject];
    const artboardCenter = artboardItem.frame.x;
    const x = layerItem.type === 'Artboard' ? artboardCenter : layerItem.frame.x + artboardCenter;
    const diff = center - x;
    return setLayerCenter(result, layerActions.setLayerCenter({
      id: current,
      center: layerItem.frame.x + diff
    }) as SetLayerCenter);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Align Layers To Center',
      undoable: true
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
  currentState = action.payload.layers.reduce((result, current) => {
    const layerItem = result.byId[current];
    const layerProject = layerItem.artboard;
    const artboardItem = result.byId[layerProject];
    const artboardRight = artboardItem.frame.x + (artboardItem.frame.width / 2);
    const artboardDiff = layerItem.type === 'Artboard' ? 0 : rightMostArtboardRight - artboardRight;
    return setLayerRight(result, layerActions.setLayerRight({
      id: current,
      right: right + artboardDiff
    }) as SetLayerRight);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Align Layers To Right',
      undoable: true
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
  currentState = action.payload.layers.reduce((result, current) => {
    const layerItem = result.byId[current];
    const layerProject = layerItem.artboard;
    const artboardItem = result.byId[layerProject];
    const artboardTop = artboardItem.frame.y - (artboardItem.frame.height / 2);
    const artboardDiff = layerItem.type === 'Artboard' ? 0 : topMostArtboardTop - artboardTop;
    return setLayerTop(result, layerActions.setLayerTop({id: current, top: top + artboardDiff}) as SetLayerTop);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Align Layers To Top',
      undoable: true
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
  currentState = action.payload.layers.reduce((result, current) => {
    const layerItem = result.byId[current];
    const layerProject = layerItem.artboard;
    const artboardItem = result.byId[layerProject];
    const artboardMiddle = artboardItem.frame.y;
    const artboardDiff = layerItem.type === 'Artboard' ? 0 : middleMostArtboardMiddle - artboardMiddle;
    return setLayerMiddle(result, layerActions.setLayerMiddle({id: current, middle: middle + artboardDiff}) as SetLayerMiddle);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Align Layers To Middle',
      undoable: true
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
  currentState = action.payload.layers.reduce((result, current) => {
    const layerItem = result.byId[current];
    const layerProject = layerItem.artboard;
    const artboardItem = result.byId[layerProject];
    const artboardBottom = artboardItem.frame.y + (artboardItem.frame.height / 2);
    const artboardDiff = layerItem.type === 'Artboard' ? 0 : bottomMostArtboardBottom - artboardBottom;
    return setLayerBottom(result, layerActions.setLayerBottom({
      id: current,
      bottom: bottom + artboardDiff
    }) as SetLayerBottom);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Align Layers To Bottom',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const distributeLayersHorizontally = (state: LayerState, action: DistributeLayersHorizontally): LayerState => {
  let currentState = state;
  const layersBounds = getLayersBounds(currentState, action.payload.layers);
  const layersWidth = action.payload.layers.reduce((result, current) => {
    const layerItem = currentState.byId[current];
    result += layerItem.frame.width;
    return result;
  }, 0);
  const diff = (layersBounds.width - layersWidth) / (action.payload.layers.length - 1);
  const orderedLayers = orderLayersByLeft(currentState, action.payload.layers);
  currentState = orderedLayers.reduce((result: LayerState, current: string, index: number) => {
    if (index !== 0 && index !== orderedLayers.length - 1) {
      const prevLayer = orderedLayers[index - 1];
      const prevItem = result.byId[prevLayer];
      const prevItemRight = prevItem.frame.x + (prevItem.frame.width / 2);
      result = setLayerLeft(result, layerActions.setLayerLeft({
        id: current,
        left: prevItemRight + diff
      }) as SetLayerLeft);
    }
    return result;
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Distribute Layers Horizontally',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const distributeLayersVertically = (state: LayerState, action: DistributeLayersVertically): LayerState => {
  let currentState = state;
  const layersBounds = getLayersBounds(currentState, action.payload.layers);
  const layersHeight = action.payload.layers.reduce((result, current) => {
    const layerItem = currentState.byId[current];
    result += layerItem.frame.height;
    return result;
  }, 0);
  const diff = (layersBounds.height - layersHeight) / (action.payload.layers.length - 1);
  const orderedLayers = orderLayersByTop(currentState, action.payload.layers);
  currentState = orderedLayers.reduce((result: LayerState, current: string, index: number) => {
    if (index !== 0 && index !== orderedLayers.length - 1) {
      const prevLayer = orderedLayers[index - 1];
      const prevItem = result.byId[prevLayer];
      const prevItemBottom = prevItem.frame.y + (prevItem.frame.height / 2);
      result = setLayerTop(result, layerActions.setLayerTop({
        id: current,
        top: prevItemBottom + diff
      }) as SetLayerTop);
    }
    return result;
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Distribute Layers Vertically',
      undoable: true
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
  const groupParents = layerItem.type === 'Artboard' ? ['root'] : layerItem.scope.filter((id, index) => index !== 0 && index !== 1).reverse();
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
            destinationForEvents: [],
            originForEvents: []
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
              },
              lines: (cs.byId[duplicateId] as Btwx.Text).lines.map((textLine) => {
                return {
                  ...textLine,
                  frame: {
                    ...textLine.frame,
                    x: textLine.frame.x + offset.x,
                    y: textLine.frame.y + offset.y
                  },
                  anchor: {
                    ...textLine.anchor,
                    x: textLine.anchor.x + offset.x,
                    y: textLine.anchor.y + offset.y
                  }
                }
              })
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
  currentState = updateGroupParentBounds(currentState, groupParents);
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
  const newSelection: string[] = [];
  const continueChain = currentState.edit && currentState.edit.actionType === 'DUPLICATE_LAYERS' && currentState.edit.selectedEdit === currentState.selectedEdit;
  const offset = action.payload.offset ? action.payload.offset : continueChain ? currentState.edit.payload.offset : null;
  currentState = action.payload.layers.reduce((result, current) => {
    const duplicate = duplicateLayer(result, layerActions.duplicateLayer({
      id: current,
      offset: offset
    }) as DuplicateLayer);
    const duplicateId = duplicate.cloneMap[current];
    masterCloneMap = {...masterCloneMap, ...duplicate.cloneMap};
    newSelection.push(duplicateId);
    result = duplicate.state;
    return result;
  }, currentState);
  if (state.hover && masterCloneMap[state.hover]) {
    currentState = setLayerHover(currentState, layerActions.setLayerHover({
      id: masterCloneMap[state.hover]
    }) as SetLayerHover);
  }
  currentState = selectLayers(currentState, layerActions.selectLayers({
    layers: newSelection,
    newSelection: true
  }) as SelectLayers);
  currentState = setLayerTreeScroll(currentState, layerActions.setLayerTreeScroll({
    scroll: newSelection[0]
  }) as SetLayerTreeScroll);
  // currentState = setLayerTreeStickyArtboard(currentState, layerActions.setLayerTreeStickyArtboard({
  //   stickyArtboard: currentState.byId[newSelection[0]].artboard
  // }) as SetLayerTreeStickyArtboard);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: {
        ...action.payload,
        offset: offset
      },
      detail: 'Duplicate Layers',
      treeEdit: true,
      undoable: true
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
  currentState = action.payload.layers.reverse().reduce((result, current) => {
    return bringLayerForward(result, layerActions.bringLayerForward({
      id: current
    }) as BringLayerForward);
  }, currentState);
  currentState = selectLayers(currentState, layerActions.selectLayers({
    layers: action.payload.layers,
    newSelection: true
  }) as SelectLayers);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Bring Layers Forward',
      treeEdit: true,
      undoable: true
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
  currentState = action.payload.layers.reverse().reduce((result, current) => {
    return bringLayerToFront(result, layerActions.bringLayerToFront({
      id: current
    }) as BringLayerToFront);
  }, currentState);
  currentState = selectLayers(currentState, layerActions.selectLayers({
    layers: action.payload.layers,
    newSelection: true
  }) as SelectLayers);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Bring Layers To Front',
      treeEdit: true,
      undoable: true
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
  currentState = action.payload.layers.reduce((result, current) => {
    return sendLayerBackward(result, layerActions.sendLayerBackward({
      id: current
    }) as SendLayerBackward);
  }, currentState);
  currentState = selectLayers(currentState, layerActions.selectLayers({
    layers: action.payload.layers,
    newSelection: true
  }) as SelectLayers);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Send Layers Backward',
      treeEdit: true,
      undoable: true
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
  currentState = action.payload.layers.reduce((result, current) => {
    return sendLayerToBack(result, layerActions.sendLayerToBack({
      id: current
    }) as SendLayerToBack);
  }, currentState);
  currentState = selectLayers(currentState, layerActions.selectLayers({
    layers: action.payload.layers,
    newSelection: true
  }) as SelectLayers);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Send Layers To Back',
      treeEdit: true,
      undoable: true
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
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerBlendMode(result, layerActions.setLayerBlendMode({
      id: current,
      blendMode: action.payload.blendMode
    }) as SetLayerBlendMode);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Blend Mode',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const uniteLayers = (state: LayerState, action: UniteLayers): LayerState => {
  let currentState = state;
  currentState = insertLayerAbove(currentState, layerActions.insertLayerAbove({
    id: action.payload.booleanLayer.id,
    above: action.payload.layers[0]
  }) as InsertLayerAbove);
  currentState = removeLayers(currentState, layerActions.removeLayers({
    layers: action.payload.layers
  }) as RemoveLayers);
  const layerItem = state.byId[action.payload.booleanLayer.id];
  if (layerItem.style.fill.fillType === 'gradient') {
    currentState = setLayerGradient(currentState, layerActions.setLayerGradient({
      id: action.payload.booleanLayer.id,
      prop: 'fill',
      gradient: layerItem.style.fill.gradient
    }) as SetLayerGradient);
  }
  if (layerItem.style.stroke.fillType === 'gradient') {
    currentState = setLayerGradient(currentState, layerActions.setLayerGradient({
      id: action.payload.booleanLayer.id,
      prop: 'stroke',
      gradient: layerItem.style.stroke.gradient
    }) as SetLayerGradient);
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Boolean Union',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const intersectLayers = (state: LayerState, action: IntersectLayers): LayerState => {
  let currentState = state;
  currentState = insertLayerAbove(currentState, layerActions.insertLayerAbove({
    id: action.payload.booleanLayer.id,
    above: action.payload.layers[0]
  }) as InsertLayerAbove);
  currentState = removeLayers(currentState, layerActions.removeLayers({
    layers: action.payload.layers
  }) as RemoveLayers);
  const layerItem = state.byId[action.payload.booleanLayer.id];
  if (layerItem.style.fill.fillType === 'gradient') {
    currentState = setLayerGradient(currentState, layerActions.setLayerGradient({
      id: action.payload.booleanLayer.id,
      prop: 'fill',
      gradient: layerItem.style.fill.gradient
    }) as SetLayerGradient);
  }
  if (layerItem.style.stroke.fillType === 'gradient') {
    currentState = setLayerGradient(currentState, layerActions.setLayerGradient({
      id: action.payload.booleanLayer.id,
      prop: 'stroke',
      gradient: layerItem.style.stroke.gradient
    }) as SetLayerGradient);
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Boolean Intersect',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const subtractLayers = (state: LayerState, action: SubtractLayers): LayerState => {
  let currentState = state;
  currentState = insertLayerAbove(currentState, layerActions.insertLayerAbove({
    id: action.payload.booleanLayer.id,
    above: action.payload.layers[0]
  }) as InsertLayerAbove);
  currentState = removeLayers(currentState, layerActions.removeLayers({
    layers: action.payload.layers
  }) as RemoveLayers);
  const layerItem = state.byId[action.payload.booleanLayer.id];
  if (layerItem.style.fill.fillType === 'gradient') {
    currentState = setLayerGradient(currentState, layerActions.setLayerGradient({
      id: action.payload.booleanLayer.id,
      prop: 'fill',
      gradient: layerItem.style.fill.gradient
    }) as SetLayerGradient);
  }
  if (layerItem.style.stroke.fillType === 'gradient') {
    currentState = setLayerGradient(currentState, layerActions.setLayerGradient({
      id: action.payload.booleanLayer.id,
      prop: 'stroke',
      gradient: layerItem.style.stroke.gradient
    }) as SetLayerGradient);
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Boolean Subtract',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const excludeLayers = (state: LayerState, action: ExcludeLayers): LayerState => {
  let currentState = state;
  currentState = insertLayerAbove(currentState, layerActions.insertLayerAbove({
    id: action.payload.booleanLayer.id,
    above: action.payload.layers[0]
  }) as InsertLayerAbove);
  currentState = removeLayers(currentState, layerActions.removeLayers({
    layers: action.payload.layers
  }) as RemoveLayers);
  const layerItem = state.byId[action.payload.booleanLayer.id];
  if (layerItem.style.fill.fillType === 'gradient') {
    currentState = setLayerGradient(currentState, layerActions.setLayerGradient({
      id: action.payload.booleanLayer.id,
      prop: 'fill',
      gradient: layerItem.style.fill.gradient
    }) as SetLayerGradient);
  }
  if (layerItem.style.stroke.fillType === 'gradient') {
    currentState = setLayerGradient(currentState, layerActions.setLayerGradient({
      id: action.payload.booleanLayer.id,
      prop: 'stroke',
      gradient: layerItem.style.stroke.gradient
    }) as SetLayerGradient);
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Boolean Difference',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const divideLayers = (state: LayerState, action: DivideLayers): LayerState => {
  let currentState = state;
  currentState = insertLayerAbove(currentState, layerActions.insertLayerAbove({
    id: action.payload.booleanLayer.id,
    above: action.payload.layers[0]
  }) as InsertLayerAbove);
  currentState = removeLayers(currentState, layerActions.removeLayers({
    layers: action.payload.layers
  }) as RemoveLayers);
  const layerItem = state.byId[action.payload.booleanLayer.id];
  if (layerItem.style.fill.fillType === 'gradient') {
    currentState = setLayerGradient(currentState, layerActions.setLayerGradient({
      id: action.payload.booleanLayer.id,
      prop: 'fill',
      gradient: layerItem.style.fill.gradient
    }) as SetLayerGradient);
  }
  if (layerItem.style.stroke.fillType === 'gradient') {
    currentState = setLayerGradient(currentState, layerActions.setLayerGradient({
      id: action.payload.booleanLayer.id,
      prop: 'stroke',
      gradient: layerItem.style.stroke.gradient
    }) as SetLayerGradient);
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Boolean Divide',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setRoundedRadius = (state: LayerState, action: SetRoundedRadius): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id] as Btwx.Rounded;
  const groupParents = layerItem.scope.filter((id, index) => index !== 0 && index !== 1).reverse();
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
  }
  if (action.payload.shapeIcon && layerItem.type === 'Shape') {
    currentState = {
      ...currentState,
      shapeIcons: {
        ...currentState.shapeIcons,
        [action.payload.id]: action.payload.shapeIcon
      }
    }
  }
  currentState = updateGroupParentBounds(currentState, groupParents);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['width', 'height', 'rotation', 'shape']);
  return currentState;
};

export const setRoundedRadii = (state: LayerState, action: SetRoundedRadii): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current, index) => {
    const bounds = action.payload.bounds ? action.payload.bounds[index] : null;
    const pathData = action.payload.pathData ? action.payload.pathData[index] : null;
    const shapeIcon = action.payload.shapeIcon ? action.payload.shapeIcon[index] : null;
    return setRoundedRadius(result, layerActions.setRoundedRadius({
      id: current,
      radius: action.payload.radius,
      bounds,
      pathData,
      shapeIcon
    }) as SetRoundedRadius);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Rounded Radii',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setPolygonSides = (state: LayerState, action: SetPolygonSides): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id] as Btwx.Polygon;
  const groupParents = layerItem.scope.filter((id, index) => index !== 0 && index !== 1).reverse();
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
  }
  if (action.payload.shapeIcon && layerItem.type === 'Shape') {
    currentState = {
      ...currentState,
      shapeIcons: {
        ...currentState.shapeIcons,
        [action.payload.id]: action.payload.shapeIcon
      }
    }
  }
  currentState = updateGroupParentBounds(currentState, groupParents);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['width', 'height', 'rotation', 'shape']);
  return currentState;
};

export const setPolygonsSides = (state: LayerState, action: SetPolygonsSides): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current, index) => {
    const bounds = action.payload.bounds ? action.payload.bounds[index] : null;
    const pathData = action.payload.pathData ? action.payload.pathData[index] : null;
    const shapeIcon = action.payload.shapeIcon ? action.payload.shapeIcon[index] : null;
    return setPolygonSides(result, layerActions.setPolygonSides({
      id: current,
      sides: action.payload.sides,
      bounds,
      pathData,
      shapeIcon
    }) as SetPolygonSides);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Polygons Sides',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setStarPoints = (state: LayerState, action: SetStarPoints): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id] as Btwx.Star;
  const groupParents = layerItem.scope.filter((id, index) => index !== 0 && index !== 1).reverse();
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
  }
  if (action.payload.shapeIcon && layerItem.type === 'Shape') {
    currentState = {
      ...currentState,
      shapeIcons: {
        ...currentState.shapeIcons,
        [action.payload.id]: action.payload.shapeIcon
      }
    }
  }
  currentState = updateGroupParentBounds(currentState, groupParents);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['width', 'height', 'rotation', 'shape']);
  return currentState;
};

export const setStarsPoints = (state: LayerState, action: SetStarsPoints): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current, index) => {
    const bounds = action.payload.bounds ? action.payload.bounds[index] : null;
    const pathData = action.payload.pathData ? action.payload.pathData[index] : null;
    const shapeIcon = action.payload.shapeIcon ? action.payload.shapeIcon[index] : null;
    return setStarPoints(result, layerActions.setStarPoints({
      id: current,
      points: action.payload.points,
      bounds,
      pathData,
      shapeIcon
    }) as SetStarPoints);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Stars Points',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setStarRadius = (state: LayerState, action: SetStarRadius): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id] as Btwx.Star;
  const groupParents = layerItem.scope.filter((id, index) => index !== 0 && index !== 1).reverse();
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
  }
  if (action.payload.shapeIcon && layerItem.type === 'Shape') {
    currentState = {
      ...currentState,
      shapeIcons: {
        ...currentState.shapeIcons,
        [action.payload.id]: action.payload.shapeIcon
      }
    }
  }
  currentState = updateGroupParentBounds(currentState, groupParents);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['width', 'height', 'rotation', 'shape']);
  return currentState;
};

export const setStarsRadius = (state: LayerState, action: SetStarsRadius): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current, index) => {
    const bounds = action.payload.bounds ? action.payload.bounds[index] : null;
    const pathData = action.payload.pathData ? action.payload.pathData[index] : null;
    const shapeIcon = action.payload.shapeIcon ? action.payload.shapeIcon[index] : null;
    return setStarRadius(result, layerActions.setStarRadius({
      id: current,
      radius: action.payload.radius,
      bounds,
      pathData,
      shapeIcon
    }) as SetStarRadius);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Stars Radius',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLineFromX = (state: LayerState, action: SetLineFromX): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id] as Btwx.Line;
  const groupParents = layerItem.scope.filter((id, index) => index !== 0 && index !== 1).reverse();
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
  }
  if (action.payload.shapeIcon && layerItem.type === 'Shape') {
    currentState = {
      ...currentState,
      shapeIcons: {
        ...currentState.shapeIcons,
        [action.payload.id]: action.payload.shapeIcon
      }
    }
  }
  currentState = updateGroupParentBounds(currentState, groupParents);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['x', 'y', 'width', 'rotation']);
  if (action.payload.setEdit) {
    currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
      edit: {
        actionType: action.type,
        payload: action.payload,
        detail: 'Set Line From X',
        undoable: true
      }
    }) as SetLayerEdit);
  }
  return currentState;
};

export const setLinesFromX = (state: LayerState, action: SetLinesFromX): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current, index) => {
    const bounds = action.payload.bounds ? action.payload.bounds[index] : null;
    const pathData = action.payload.pathData ? action.payload.pathData[index] : null;
    const shapeIcon = action.payload.shapeIcon ? action.payload.shapeIcon[index] : null;
    const rotation = action.payload.rotation ? action.payload.rotation[index] : null;
    return setLineFromX(result, layerActions.setLineFromX({
      id: current,
      x: action.payload.x,
      setEdit: false,
      bounds,
      pathData,
      shapeIcon,
      rotation
    }) as SetLineFromX);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Lines From X',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLineFromY = (state: LayerState, action: SetLineFromY): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const groupParents = layerItem.scope.filter((id, index) => index !== 0 && index !== 1).reverse();
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
  }
  if (action.payload.shapeIcon && layerItem.type === 'Shape') {
    currentState = {
      ...currentState,
      shapeIcons: {
        ...currentState.shapeIcons,
        [action.payload.id]: action.payload.shapeIcon
      }
    }
  }
  currentState = updateGroupParentBounds(currentState, groupParents);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['x', 'y', 'width', 'rotation']);
  if (action.payload.setEdit) {
    currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
      edit: {
        actionType: action.type,
        payload: action.payload,
        detail: 'Set Line From Y',
        undoable: true
      }
    }) as SetLayerEdit);
  }
  return currentState;
};

export const setLinesFromY = (state: LayerState, action: SetLinesFromY): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current, index) => {
    const bounds = action.payload.bounds ? action.payload.bounds[index] : null;
    const pathData = action.payload.pathData ? action.payload.pathData[index] : null;
    const shapeIcon = action.payload.shapeIcon ? action.payload.shapeIcon[index] : null;
    const rotation = action.payload.rotation ? action.payload.rotation[index] : null;
    return setLineFromY(result, layerActions.setLineFromY({
      id: current,
      y: action.payload.y,
      setEdit: false,
      bounds,
      pathData,
      shapeIcon,
      rotation
    }) as SetLineFromY);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Lines From Y',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLineFrom = (state: LayerState, action: SetLineFrom): LayerState => {
  let currentState = state;
  const pathData = action.payload.pathData ? action.payload.pathData : null;
  const shapeIcon = action.payload.pathData ? action.payload.shapeIcon : null;
  const bounds = action.payload.bounds ? action.payload.bounds : null;
  const rotation = action.payload.rotation ? action.payload.rotation : null;
  currentState = setLineFromX(currentState, layerActions.setLineFromX({
    id: action.payload.id,
    x: action.payload.x,
    pathData,
    shapeIcon,
    bounds,
    rotation
  }) as SetLineFromX);
  currentState = setLineFromY(currentState, layerActions.setLineFromY({
    id: action.payload.id,
    y: action.payload.y,
    pathData,
    shapeIcon,
    bounds,
    rotation
  }) as SetLineFromY);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Line From',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLineToX = (state: LayerState, action: SetLineToX): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const groupParents = layerItem.scope.filter((id, index) => index !== 0 && index !== 1).reverse();
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
  }
  if (action.payload.shapeIcon && layerItem.type === 'Shape') {
    currentState = {
      ...currentState,
      shapeIcons: {
        ...currentState.shapeIcons,
        [action.payload.id]: action.payload.shapeIcon
      }
    }
  }
  currentState = updateGroupParentBounds(currentState, groupParents);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['x', 'y', 'width', 'rotation']);
  if (action.payload.setEdit) {
    currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
      edit: {
        actionType: action.type,
        payload: action.payload,
        detail: 'Set Line To X',
        undoable: true
      }
    }) as SetLayerEdit);
  }
  return currentState;
};

export const setLinesToX = (state: LayerState, action: SetLinesToX): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current, index) => {
    const bounds = action.payload.bounds ? action.payload.bounds[index] : null;
    const pathData = action.payload.pathData ? action.payload.pathData[index] : null;
    const shapeIcon = action.payload.shapeIcon ? action.payload.shapeIcon[index] : null;
    const rotation = action.payload.rotation ? action.payload.rotation[index] : null;
    return setLineToX(result, layerActions.setLineToX({
      id: current,
      x: action.payload.x,
      setEdit: false,
      bounds,
      pathData,
      shapeIcon,
      rotation
    }) as SetLineToX);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Lines To X',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLineToY = (state: LayerState, action: SetLineToY): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const groupParents = layerItem.scope.filter((id, index) => index !== 0 && index !== 1).reverse();
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
  }
  if (action.payload.shapeIcon && layerItem.type === 'Shape') {
    currentState = {
      ...currentState,
      shapeIcons: {
        ...currentState.shapeIcons,
        [action.payload.id]: action.payload.shapeIcon
      }
    }
  }
  currentState = updateGroupParentBounds(currentState, groupParents);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['x', 'y', 'width', 'rotation']);
  if (action.payload.setEdit) {
    currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
      edit: {
        actionType: action.type,
        payload: action.payload,
        detail: 'Set Line To Y',
        undoable: true
      }
    }) as SetLayerEdit);
  }
  return currentState;
};

export const setLinesToY = (state: LayerState, action: SetLinesToY): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current, index) => {
    const bounds = action.payload.bounds ? action.payload.bounds[index] : null;
    const pathData = action.payload.pathData ? action.payload.pathData[index] : null;
    const shapeIcon = action.payload.shapeIcon ? action.payload.shapeIcon[index] : null;
    const rotation = action.payload.rotation ? action.payload.rotation[index] : null;
    return setLineToY(result, layerActions.setLineToY({
      id: current,
      y: action.payload.y,
      setEdit: false,
      bounds,
      pathData,
      shapeIcon,
      rotation
    }) as SetLineToY);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Lines To Y',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLineTo = (state: LayerState, action: SetLineTo): LayerState => {
  let currentState = state;
  const pathData = action.payload.pathData ? action.payload.pathData : null;
  const shapeIcon = action.payload.shapeIcon ? action.payload.shapeIcon : null;
  const bounds = action.payload.bounds ? action.payload.bounds : null;
  const rotation = action.payload.rotation ? action.payload.rotation : null;
  currentState = setLineToX(currentState, layerActions.setLineToX({
    id: action.payload.id,
    x: action.payload.x,
    pathData,
    shapeIcon,
    bounds,
    rotation
  }) as SetLineToX);
  currentState = setLineToY(currentState, layerActions.setLineToY({
    id: action.payload.id,
    y: action.payload.y,
    pathData,
    shapeIcon,
    bounds,
    rotation
  }) as SetLineToY);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['x', 'y', 'width', 'rotation']);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Line To',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerEdit = (state: LayerState, action: SetLayerEdit): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    edit: {
      ...currentState.edit,
      selectedEdit: currentState.selectedEdit
    }
  }
  if (action.payload.edit.undoable) {
    currentState = {
      ...currentState,
      edit: {
        ...currentState.edit,
        ...action.payload.edit,
        tweenEdit: action.payload.edit.tweenEdit ? action.payload.edit.tweenEdit : null
      }
    }
  }
  if (action.payload.edit.treeEdit) {
    currentState = setLayerTree(currentState, layerActions.setLayerTree() as SetLayerTree);
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
  currentState = action.payload.layers.reduce((result, current) => {
    const layerItem = currentState.byId[current];
    const styleByType = (() => {
      switch(layerItem.type) {
        case 'Artboard':
          return {
            fill: action.payload.style.fill
          };
        case 'Group':
          return {};
        case 'Image':
          return {
            opacity: action.payload.style.opacity,
            blur: action.payload.style.blur,
            blendMode: action.payload.style.blendMode,
            shadow: action.payload.style.shadow,
            stroke: action.payload.style.stroke,
            strokeOptions: action.payload.style.strokeOptions,
          };
        case 'Text':
          return {
            opacity: action.payload.style.opacity,
            blur: action.payload.style.blur,
            blendMode: action.payload.style.blendMode,
            fill: action.payload.style.fill,
            stroke: action.payload.style.stroke,
            strokeOptions: action.payload.style.strokeOptions,
            shadow: action.payload.style.shadow
          };
        case 'Shape':
          return {
            opacity: action.payload.style.opacity,
            blur: action.payload.style.blur,
            blendMode: action.payload.style.blendMode,
            fill: action.payload.style.fill,
            stroke: action.payload.style.stroke,
            strokeOptions: action.payload.style.strokeOptions,
            shadow: action.payload.style.shadow
          };
      }
    })();
    return setLayerStyle(result, layerActions.setLayerStyle({
      id: current,
      style: styleByType as Btwx.Style,
      textStyle: action.payload.textStyle
    }) as SetLayerStyle);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Style',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const resetImageDimensions = (state: LayerState, action: ResetImageDimensions): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id] as Btwx.Image;
  currentState = setLayerWidth(currentState, layerActions.setLayerWidth({
    id: action.payload.id,
    width: layerItem.originalDimensions.width,
    bounds: action.payload.bounds
  }) as SetLayerWidth);
  currentState = setLayerHeight(currentState, layerActions.setLayerHeight({
    id: action.payload.id,
    height: layerItem.originalDimensions.height,
    bounds: action.payload.bounds
  }) as SetLayerHeight);
  return currentState;
};

export const resetImagesDimensions = (state: LayerState, action: ResetImagesDimensions): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    const bounds = action.payload.bounds[current];
    return resetImageDimensions(result, layerActions.resetImageDimensions({
      id: current,
      bounds
    }) as ResetImageDimensions);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Reset Image Dimensions',
      undoable: true
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
  // currentState = updateLayerTweensByProps(currentState, action.payload.id, ['image']);
  return currentState;
};

export const replaceImages = (state: LayerState, action: ReplaceImages): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
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
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const pasteLayersFromClipboard = (state: LayerState, action: PasteLayersFromClipboard): LayerState => {
  let currentState = state;
  const activeArtboard = currentState.activeArtboard;
  const topScopeId = currentState.scope[currentState.scope.length - 1] === 'root'
  ? currentState.activeArtboard
    ? currentState.activeArtboard
    : 'root'
  : currentState.scope[currentState.scope.length - 1];
  const topScopeItem = topScopeId ? currentState.byId[topScopeId] as Btwx.Artboard | Btwx.Group : null;
  currentState = {
    ...currentState,
    allIds: [...currentState.allIds, ...action.payload.clipboardLayers.allIds],
    allArtboardIds: [
      ...currentState.allArtboardIds,
      ...action.payload.clipboardLayers.allArtboardIds
    ],
    allGroupIds: [
      ...currentState.allGroupIds,
      ...action.payload.clipboardLayers.allGroupIds
    ],
    allShapeIds: [
      ...currentState.allShapeIds,
      ...action.payload.clipboardLayers.allShapeIds
    ],
    allTextIds: [
      ...currentState.allTextIds,
      ...action.payload.clipboardLayers.allTextIds
    ],
    allImageIds: [
      ...currentState.allImageIds,
      ...action.payload.clipboardLayers.allImageIds
    ],
    byId: {
      ...currentState.byId,
      ...action.payload.clipboardLayers.byId,
      root: {
        ...currentState.byId.root,
        children: [
          ...currentState.byId.root.children,
          ...action.payload.clipboardLayers.allArtboardIds
        ]
      }
    },
    events: {
      ...currentState.events,
      allIds: [
        ...currentState.events.allIds,
        ...action.payload.clipboardLayers.events.allIds
      ],
      byId: {
        ...currentState.events.byId,
        ...action.payload.clipboardLayers.events.byId
      }
    },
    tweens: {
      ...currentState.tweens,
      allIds: [
        ...currentState.tweens.allIds,
        ...action.payload.clipboardLayers.tweens.allIds
      ],
      byId: {
        ...currentState.tweens.byId,
        ...action.payload.clipboardLayers.tweens.byId
      }
    },
    shapeIcons: {
      ...currentState.shapeIcons,
      ...action.payload.clipboardLayers.shapeIcons
    }
  }
  if (action.payload.clipboardLayers.type === 'sketch-layers') {
    currentState = action.payload.clipboardLayers.allGroupIds.reduce((result, current) => {
      const allDescendents = getLayerDescendants(result, current, false);
      const layerBounds = getLayersRelativeBounds(result, allDescendents);
      return {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            frame: {
              x: layerBounds.center.x,
              y: layerBounds.center.y,
              width: layerBounds.width,
              height: layerBounds.height,
              innerWidth: layerBounds.width,
              innerHeight: layerBounds.height
            }
          }
        }
      }
    }, currentState);
  }
  // if artboards pasted, update root bounds
  if (action.payload.clipboardLayers.allArtboardIds.length > 0) {
    currentState = updateGroupParentBounds(currentState, ['root']);
  }
  // if non-artboard layers pasted w/ top scope item...
  // add layers as children to top scope item
  if (action.payload.clipboardLayers.topScopeChildren.length > 0 && topScopeItem) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [topScopeItem.id]: {
          ...currentState.byId[topScopeItem.id],
          children: [...currentState.byId[topScopeItem.id].children, ...action.payload.clipboardLayers.topScopeChildren]
        }
      }
    }
    if (topScopeItem.type !== 'Artboard') {
      currentState = updateGroupParentBounds(currentState, [topScopeId]);
    }
  }
  currentState = selectLayers(currentState, layerActions.selectLayers({
    layers: action.payload.clipboardLayers.main,
    newSelection: true
  }) as SelectLayers);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Paste Layers From Clipboard',
      treeEdit: true,
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerTree = (state: LayerState, action: SetLayerTree): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    tree: {
      ...currentState.tree,
      byId: currentState.byId
    }
  }
  return currentState;
};

export const setLayerTreeScroll = (state: LayerState, action: SetLayerTreeScroll): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    tree: {
      ...currentState.tree,
      scroll: action.payload.scroll
    }
  }
  return currentState;
};

export const setLayerTreeStickyArtboard = (state: LayerState, action: SetLayerTreeStickyArtboard): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    tree: {
      ...currentState.tree,
      stickyArtboard: action.payload.stickyArtboard
    }
  }
  return currentState;
};

const updateGroupScrollChildrenPosTweens = (state: LayerState, id: string): LayerState => {
  const groupDescendents = getLayerDescendants(state, id, false);
  return groupDescendents.reduce((result, current) => updateLayerTweensByProps(result, current, ['x', 'y']), state);
}

//

export const enableGroupScroll = (state: LayerState, action: EnableGroupScroll): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        scroll: {
          ...(currentState.byId[action.payload.id] as Btwx.Group).scroll,
          enabled: true
        }
      } as Btwx.Group
    }
  }
  currentState = updateGroupScrollChildrenPosTweens(currentState, action.payload.id);
  return currentState;
};

export const enableGroupsScroll = (state: LayerState, action: EnableGroupsScroll): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current, index) => {
    return enableGroupScroll(result, layerActions.enableGroupScroll({
      id: current
    }) as EnableGroupScroll);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Enable Groups Scroll',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

//

export const disableGroupScroll = (state: LayerState, action: DisableGroupScroll): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        scroll: {
          ...(currentState.byId[action.payload.id] as Btwx.Group).scroll,
          enabled: false
        }
      } as Btwx.Group
    }
  }
  currentState = updateGroupScrollChildrenPosTweens(currentState, action.payload.id);
  return currentState;
};

export const disableGroupsScroll = (state: LayerState, action: DisableGroupsScroll): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current, index) => {
    return disableGroupScroll(result, layerActions.disableGroupScroll({
      id: current
    }) as DisableGroupScroll);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Disable Groups Scroll',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

//

export const enableGroupHorizontalScroll = (state: LayerState, action: EnableGroupHorizontalScroll): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        scroll: {
          ...(currentState.byId[action.payload.id] as Btwx.Group).scroll,
          direction: {
            ...(currentState.byId[action.payload.id] as Btwx.Group).scroll.direction,
            horizontal: true
          }
        }
      } as Btwx.Group
    }
  }
  currentState = updateGroupScrollChildrenPosTweens(currentState, action.payload.id);
  return currentState;
};

export const enableGroupsHorizontalScroll = (state: LayerState, action: EnableGroupsHorizontalScroll): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current, index) => {
    return enableGroupHorizontalScroll(result, layerActions.enableGroupHorizontalScroll({
      id: current
    }) as EnableGroupHorizontalScroll);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Enable Groups Horizontal Scroll',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

//

export const disableGroupHorizontalScroll = (state: LayerState, action: DisableGroupHorizontalScroll): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        scroll: {
          ...(currentState.byId[action.payload.id] as Btwx.Group).scroll,
          direction: {
            ...(currentState.byId[action.payload.id] as Btwx.Group).scroll.direction,
            horizontal: false
          }
        }
      } as Btwx.Group
    }
  }
  currentState = updateGroupScrollChildrenPosTweens(currentState, action.payload.id);
  return currentState;
};

export const disableGroupsHorizontalScroll = (state: LayerState, action: DisableGroupsHorizontalScroll): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current, index) => {
    return disableGroupHorizontalScroll(result, layerActions.disableGroupHorizontalScroll({
      id: current
    }) as DisableGroupHorizontalScroll);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Disable Groups Horizontal Scroll',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

//

export const enableGroupVerticalScroll = (state: LayerState, action: EnableGroupVerticalScroll): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        scroll: {
          ...(currentState.byId[action.payload.id] as Btwx.Group).scroll,
          direction: {
            ...(currentState.byId[action.payload.id] as Btwx.Group).scroll.direction,
            vertical: true
          }
        }
      } as Btwx.Group
    }
  }
  currentState = updateGroupScrollChildrenPosTweens(currentState, action.payload.id);
  return currentState;
};

export const enableGroupsVerticalScroll = (state: LayerState, action: EnableGroupsVerticalScroll): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current, index) => {
    return enableGroupVerticalScroll(result, layerActions.enableGroupVerticalScroll({
      id: current
    }) as EnableGroupVerticalScroll);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Enable Groups Vertical Scroll',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

//

export const disableGroupVerticalScroll = (state: LayerState, action: DisableGroupVerticalScroll): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        scroll: {
          ...(currentState.byId[action.payload.id] as Btwx.Group).scroll,
          direction: {
            ...(currentState.byId[action.payload.id] as Btwx.Group).scroll.direction,
            vertical: false
          }
        }
      } as Btwx.Group
    }
  }
  currentState = updateGroupScrollChildrenPosTweens(currentState, action.payload.id);
  return currentState;
};

export const disableGroupsVerticalScroll = (state: LayerState, action: DisableGroupsVerticalScroll): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current, index) => {
    return disableGroupVerticalScroll(result, layerActions.disableGroupVerticalScroll({
      id: current
    }) as DisableGroupVerticalScroll);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Disable Groups Vertical Scroll',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

//

export const setGroupScrollOverflow = (state: LayerState, action: SetGroupScrollOverflow): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        scroll: {
          ...(currentState.byId[action.payload.id] as Btwx.Group).scroll,
          overflow: action.payload.overflow
        }
      } as Btwx.Group
    }
  }
  return currentState;
};

export const setGroupsScrollOverflow = (state: LayerState, action: SetGroupsScrollOverflow): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current, index) => {
    return setGroupScrollOverflow(result, layerActions.setGroupScrollOverflow({
      id: current,
      overflow: action.payload.overflow
    }) as SetGroupScrollOverflow);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Groups Scroll Overflow',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setGroupScrollFrame = (state: LayerState, action: SetGroupScrollFrame): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        scroll: {
          ...(currentState.byId[action.payload.id] as Btwx.Group).scroll,
          frame: {
            ...(currentState.byId[action.payload.id] as Btwx.Group).scroll.frame,
            ...action.payload.frame
          }
        }
      } as Btwx.Group
    }
  }
  const groupBounds = getLayerBounds(currentState, action.payload.id);
  const scrollFrameBounds = getLayerScrollFrameBounds(currentState, action.payload.id);
  const scrollBounds = getLayerScrollBounds(currentState, action.payload.id);
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        scroll: {
          ...(currentState.byId[action.payload.id] as Btwx.Group).scroll,
          scrollWidth: scrollBounds.width, // scrollFrameBounds.width - groupBounds.width,
          scrollHeight: scrollBounds.height, // scrollFrameBounds.height - groupBounds.height,
          scrollLeft: groupBounds.left - scrollFrameBounds.left,
          scrollTop: groupBounds.top - scrollFrameBounds.top
        }
      } as Btwx.Group
    }
  }
  currentState = updateGroupScrollChildrenPosTweens(currentState, action.payload.id);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Group Scroll Frame',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

//

export const enableGroupGroupEventTweens = (state: LayerState, action: EnableGroupGroupEventTweens, other?: { [id: string]: { [K in Btwx.TweenProp]: Btwx.Tween[] } }): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const artboardItem = currentState.byId[layerItem.artboard] as Btwx.Artboard;
  const artboardEvents = artboardItem.originForEvents;
  const inGroupEventTweensGroup = layerItem.scope.find((id) => currentState.byId[id].type === 'Group' && (currentState.byId[id] as Btwx.Group).groupEventTweens);
  if (!inGroupEventTweensGroup) {
    const groupDescendents = getLayerDescendants(currentState, action.payload.id, false);
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          groupEventTweens: true
        } as Btwx.Group
      }
    }
    currentState = artboardEvents.reduce((result, current) => {
      const eventItem = result.events.byId[current];
      const eventTweens = eventItem.tweens;
      const groupLayersWithEventTweens = groupDescendents.filter((id) => {
        return result.events.byId[current].tweens.byLayer[id] && result.events.byId[current].tweens.byLayer[id].length > 0;
      });
      result = Object.keys(TWEEN_PROPS_MAP).reduce((res, prop) => {
        const groupLayersWithEventPropTweens = groupLayersWithEventTweens.reduce((r, c) => {
          const layerItem = res.byId[c];
          const tweensByProp = layerItem.tweens.byProp[prop].filter((i) => eventTweens.byProp[prop].includes(i));
          r = [...r, ...tweensByProp];
          return r;
        }, []);
        const wiggleTweens = groupLayersWithEventPropTweens.filter((tid) => res.tweens.byId[tid].ease === 'customWiggle');
        const nonWiggleTweens = groupLayersWithEventPropTweens.filter((tid) => res.tweens.byId[tid].ease !== 'customWiggle');
        if (groupLayersWithEventPropTweens.length > 0) {
          const suppliedTweens = other && other[current] && other[current][prop] && other[current][prop].length > 0;
          const suppliedWiggle = suppliedTweens && other[current][prop].find((c) => c.siblings.some((sib) => groupDescendents.includes(res.tweens.byId[sib].layer) && res.tweens.byId[sib].ease === 'customWiggle'));
          const suppliedNonWiggle = suppliedTweens && other[current][prop].find((c) => c.siblings.some((sib) => groupDescendents.includes(res.tweens.byId[sib].layer) && res.tweens.byId[sib].ease !== 'customWiggle'));
          if (suppliedWiggle) {
            const wiggleLayers = getWiggleLayersSelector({layer: { present: res }} as any, current);
            const groupWiggleLayers = wiggleLayers.group[action.payload.id][prop];
            const nonSuppliedWiggleLayers = groupWiggleLayers && groupWiggleLayers.filter((lid) => !suppliedWiggle.siblings.some((tid) => res.tweens.byId[tid].layer === lid));
            if (nonSuppliedWiggleLayers && nonSuppliedWiggleLayers.length > 0) {
              res = nonSuppliedWiggleLayers.reduce((r, c) => {
                return addLayerTween(r, layerActions.addLayerTween({
                  ...suppliedWiggle,
                  layer: c,
                  destinationLayer: wiggleLayers.group[action.payload.id].map[c],
                  prop: current,
                  event: current,
                  ease: 'customWiggle'
                }) as AddLayerTween);
              }, res);
            }
            res = addLayerTween(res, layerActions.addLayerTween({
              ...suppliedWiggle,
            }) as AddLayerTween);
          } else {
            if (wiggleTweens.length > 0) {
              const wiggleLayers = getWiggleLayersSelector({layer: { present: res }} as any, current);
              const groupWiggleLayers = wiggleLayers.group[action.payload.id][prop];
              const nonSuppliedWiggleLayers = groupWiggleLayers && groupWiggleLayers.filter((lid) => !wiggleTweens.some((tid) => res.tweens.byId[tid].layer === lid));
              if (nonSuppliedWiggleLayers && nonSuppliedWiggleLayers.length > 0) {
                res = nonSuppliedWiggleLayers.reduce((r, c) => {
                  return addLayerTween(r, layerActions.addLayerTween({
                    ...suppliedWiggle,
                    layer: c,
                    destinationLayer: wiggleLayers.group[action.payload.id].map[c],
                    prop: current,
                    event: current,
                    ease: 'customWiggle'
                  }) as AddLayerTween);
                }, res);
              }
              res = addLayerTween(res, layerActions.addLayerTween({
                layer: action.payload.id,
                destinationLayer: null,
                siblings: wiggleTweens,
                prop: prop,
                event: current,
                ...getDefaultTweenProps(prop) as any,
                ease: 'customWiggle',
              }) as AddLayerTween);
            }
          }
          if (suppliedNonWiggle) {
            res = addLayerTween(res, layerActions.addLayerTween({
              ...suppliedNonWiggle,
            }) as AddLayerTween);
          } else {
            if (nonWiggleTweens.length > 0) {
              res = addLayerTween(res, layerActions.addLayerTween({
                layer: action.payload.id,
                destinationLayer: null,
                siblings: nonWiggleTweens,
                prop: prop,
                event: current,
                ease: DEFAULT_TWEEN_EASE,
                ...getDefaultTweenProps(prop) as any
              }) as AddLayerTween);
            }
          }
        }
        return res;
      }, result);
      return result;
    }, currentState);
  }
  return currentState;
};

export const enableGroupsGroupEventTweens = (state: LayerState, action: EnableGroupsGroupEventTweens): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current, index) => {
    return enableGroupGroupEventTweens(result, layerActions.enableGroupGroupEventTweens({
      id: current
    }) as EnableGroupGroupEventTweens);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Enable Groups Group Event Tweens',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

//

export const disableGroupGroupEventTweens = (state: LayerState, action: DisableGroupGroupEventTweens): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const artboardItem = currentState.byId[layerItem.artboard] as Btwx.Artboard;
  const artboardEvents = artboardItem.originForEvents;
  currentState = artboardEvents.reduce((result, current) => {
    const eventItem = result.events.byId[current];
    if (eventItem.layers.includes(action.payload.id)) {
      // see removeLayerTweens why not that way
      eventItem.tweens.byLayer[action.payload.id].forEach((id) => {
        result = removeLayerTween(result, layerActions.removeLayerTween({id}) as RemoveLayerTween);
      });
    }
    return result;
  }, currentState);
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        groupEventTweens: false
      } as Btwx.Group
    }
  }
  return currentState;
};

export const disableGroupsGroupEventTweens = (state: LayerState, action: DisableGroupsGroupEventTweens): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current, index) => {
    return disableGroupGroupEventTweens(result, layerActions.disableGroupGroupEventTweens({
      id: current
    }) as DisableGroupGroupEventTweens);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Disable Groups Group Event Tweens',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};

export const addGroupWiggles = (state: LayerState, action: AddGroupsWiggles): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current, index) => {
    return addLayerTween(result, layerActions.addLayerTween(action.payload.byLayer[current]) as AddLayerTween);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Add Layer Wiggles',
      undoable: true
    }
  }) as SetLayerEdit);
  return currentState;
};