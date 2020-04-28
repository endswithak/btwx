import paper from 'paper';
import { v4 as uuidv4 } from 'uuid';

import {
  ADD_PAGE,
  REMOVE_PAGE,
  ACTIVATE_PAGE,
  DEACTIVATE_PAGE,
  SELECT_PAGE,
  DESELECT_PAGE,
  ENABLE_PAGE_HOVER,
  DISABLE_PAGE_HOVER,
  ADD_PAGE_CHILD,
  REMOVE_PAGE_CHILD,
  INSERT_PAGE_CHILD,
  PageTypes
} from '../actionTypes/page';

import {
  selectLayer,
  deselectLayer,
  removeLayer,
  enableLayerHover,
  disableLayerHover,
  activateLayer,
  deactivateLayer,
  addLayerChild,
  removeLayerChild,
  insertLayerChild
} from '../utils/layer';

export interface PageState {
  byId: {
    [id: string]: em.Page;
  };
  allIds: string[];
  active: string;
}

const initialState: PageState = {
  byId: {},
  allIds: [],
  active: null
};

export default (state = initialState, action: PageTypes): PageState => {
  switch (action.type) {
    case ADD_PAGE: {
      const pageId = uuidv4();
      const paperPage = new paper.Group();
      return {
        ...state,
        allIds: [...state.allIds, action.payload.id],
        byId: {
          ...state.byId,
          [pageId]: {
            type: 'Page',
            id: pageId,
            name: action.payload.name ? action.payload.name : 'Page',
            parent: null,
            paperLayer: paperPage.id,
            children: [],
            selected: false,
            active: false,
            hover: false
          }
        }
      }
    }
    case REMOVE_PAGE:
      return removeLayer(state, action) as PageState;
    case ACTIVATE_PAGE:
      return  activateLayer(state, action);
    case DEACTIVATE_PAGE:
      return  deactivateLayer(state, action);
    case SELECT_PAGE:
      return selectLayer(state, action) as PageState;
    case DESELECT_PAGE:
      return deselectLayer(state, action) as PageState;
    case ENABLE_PAGE_HOVER:
      return enableLayerHover(state, action) as PageState;
    case DISABLE_PAGE_HOVER:
      return disableLayerHover(state, action) as PageState;
    case ADD_PAGE_CHILD:
      return addLayerChild(state, action);
    case REMOVE_PAGE_CHILD:
      return removeLayerChild(state, action);
    case INSERT_PAGE_CHILD:
      return insertLayerChild(state, action);
    default:
      return state;
  }
}