import paper from 'paper';

import {
  SET_HOVER,
  HoverPayload,
  HoverTypes
} from '../actionTypes/hover';

import { getLayerIndex, getTopParentGroup, getActiveGroup, getActivePage, getParentLayer, getPaperLayer, getLayer } from '../selectors/layers';
import { hoverEnter, hoverLeave } from '../actions/layers';
import { toggleLayerSelection, newSelection } from '../actions/selection';

import { StoreGetState, StoreDispatch } from '../index';

export const setHover = (hover: HoverPayload): HoverTypes => ({
  type: SET_HOVER,
  payload: hover
});

// let hoverOutline: paper.Path = null;

// const setHoverOutline = (paperLayer: paper.Item) => {
//   if (hoverOutline) {
//     hoverOutline.bounds.topLeft = paperLayer.bounds.topLeft;
//     hoverOutline.bounds.width = paperLayer.bounds.width;
//     hoverOutline.bounds.height = paperLayer.bounds.height;
//   } else {
//     hoverOutline = new paper.Path.Rectangle({
//       point: paperLayer.bounds.topLeft,
//       size: new paper.Size(paperLayer.bounds.width, paperLayer.bounds.height),
//       strokeColor: 'red',
//       strokeWidth: 1
//     });
//   }
// }

// const clearHoverOutline = () => {
//   if (hoverOutline) {
//     hoverOutline.remove();
//     hoverOutline = null;
//   }
// }

export const setHoverLayer = (id: string): any => {
  return (dispatch: StoreDispatch, getState: StoreGetState) => {
    const state = getState();
    if (state.layers.activeGroup) {
      let currentNode = getActiveGroup(state.layers);
      const currentNodeParent = getParentLayer(state.layers, currentNode.id);
      while(currentNode.parent && (currentNodeParent.type === 'Group' || currentNodeParent.type === 'Page')) {
        if (currentNode.children.includes(id)) {
          //setHoverOutline(getPaperLayer(state.layers, id));
          dispatch(setHover({id}));
          dispatch(hoverEnter({id}));
        }
        currentNode = getParentLayer(state.layers, currentNode.id);
      }
    } else {
      const activePageLayer = getActivePage(state.layers);
      if (activePageLayer.children.includes(id)) {
        //setHoverOutline(getPaperLayer(state.layers, id));
        dispatch(setHover({id}));
        dispatch(hoverEnter({id}));
      }
    }
  }
}

export const clearHoverLayer = (): any => {
  return (dispatch: StoreDispatch, getState: StoreGetState) => {
    const state = getState();
    if (state.hover) {
      dispatch(setHover({id: null}));
      dispatch(hoverLeave({id: state.hover}));
    }
    //clearHoverOutline();
  }
}