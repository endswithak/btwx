import paper from 'paper';
import { PageState } from '../reducers/page';
import { ShapeState } from '../reducers/shape';
import { SelectPage, DeselectPage, RemovePage, ActivatePage, DeactivatePage, AddPageChild, RemovePageChild, InsertPageChild, EnablePageHover, DisablePageHover } from '../actionTypes/page';
import { SelectShape, DeselectShape, RemoveShape, EnableShapeHover, DisableShapeHover } from '../actionTypes/shape';

type RemoveLayerAction = RemovePage | RemoveShape;
type RemoveLayerState = PageState | ShapeState;

export const removeLayer = (state: RemoveLayerState, action: RemoveLayerAction): RemoveLayerState => {
  const layer = state.byId[action.payload.id];
  paper.project.getItem({id: layer.paperLayer}).remove();
  return {
    ...state,
    allIds: state.allIds.filter(id => id !== action.payload.id),
    byId: Object.keys(state.byId).reduce((result: any, key) => {
      if (key !== action.payload.id) {
        result[key] = state.byId[key];
      }
      return result;
    }, {})
  };
}

type SelectLayerAction = SelectPage | SelectShape;
type SelectLayerState = PageState | ShapeState;
type SelectLayerTypes = em.Page | em.Shape;

export const selectLayer = (state: SelectLayerState, action: SelectLayerAction): SelectLayerState => {
  const layer = state.byId[action.payload.id] as SelectLayerTypes;
  paper.project.getItem({id: layer.paperLayer}).selected = true;
  return {
    ...state,
    byId: {
      ...state.byId,
      [action.payload.id]: {
        ...state.byId[action.payload.id],
        selected: true
      }
    }
  } as SelectLayerState;
}

type DeselectLayerAction = DeselectPage | DeselectShape;
type DeselectLayerState = PageState | ShapeState;
type DeselectLayerTypes = em.Page | em.Shape;

export const deselectLayer = (state: DeselectLayerState, action: DeselectLayerAction): DeselectLayerState => {
  const layer = state.byId[action.payload.id] as DeselectLayerTypes;
  paper.project.getItem({id: layer.paperLayer}).selected = false;
  return {
    ...state,
    byId: {
      ...state.byId,
      [action.payload.id]: {
        ...state.byId[action.payload.id],
        selected: false
      }
    }
  } as DeselectLayerState;
}

type EnableLayerHoverAction = EnablePageHover | EnableShapeHover;
type EnableLayerHoverState = PageState | ShapeState;

export const enableLayerHover = (state: EnableLayerHoverState, action: EnableLayerHoverAction): EnableLayerHoverState => {
  return {
    ...state,
    byId: {
      ...state.byId,
      [action.payload.id]: {
        ...state.byId[action.payload.id],
        hover: true
      }
    }
  } as EnableLayerHoverState;
}

type DisableLayerHoverAction = DisablePageHover | DisableShapeHover;
type DisableLayerHoverState = PageState | ShapeState;

export const disableLayerHover = (state: DisableLayerHoverState, action: DisableLayerHoverAction): DisableLayerHoverState => {
  return {
    ...state,
    byId: {
      ...state.byId,
      [action.payload.id]: {
        ...state.byId[action.payload.id],
        hover: false
      }
    }
  } as DisableLayerHoverState;
}

type ActivateLayerAction = ActivatePage;
type ActivateLayerState = PageState;

export const activateLayer = (state: ActivateLayerState, action: ActivateLayerAction): ActivateLayerState => {
  return {
    ...state,
    byId: {
      ...state.byId,
      [action.payload.id]: {
        ...state.byId[action.payload.id],
        active: true
      }
    },
    active: action.payload.id
  } as ActivateLayerState;
}

type DeactivateLayerAction = DeactivatePage;
type DeactivateLayerState = PageState;

export const deactivateLayer = (state: DeactivateLayerState, action: DeactivateLayerAction): DeactivateLayerState => {
  return {
    ...state,
    byId: {
      ...state.byId,
      [action.payload.id]: {
        ...state.byId[action.payload.id],
        active: false
      }
    }
  } as DeactivateLayerState;
}

type AddLayerChildAction = AddPageChild;
type AddLayerChildState = PageState;

export const addLayerChild = (state: AddLayerChildState, action: AddLayerChildAction): AddLayerChildState => {
  return {
    ...state,
    byId: {
      ...state.byId,
      [action.payload.id]: {
        ...state.byId[action.payload.id],
        children: [...state.byId[action.payload.id].children, action.payload.child]
      }
    }
  } as AddLayerChildState;
}

type RemoveLayerChildAction = RemovePageChild;
type RemoveLayerChildState = PageState;

export const removeLayerChild = (state: RemoveLayerChildState, action: RemoveLayerChildAction): RemoveLayerChildState => {
  return {
    ...state,
    byId: {
      ...state.byId,
      [action.payload.id]: {
        ...state.byId[action.payload.id],
        children: state.byId[action.payload.id].children.filter((id) => id !== action.payload.child)
      }
    }
  } as RemoveLayerChildState;
}

type InsertLayerChildAction = InsertPageChild;
type InsertLayerChildState = PageState;

export const insertLayerChild = (state: InsertLayerChildState, action: InsertLayerChildAction): InsertLayerChildState => {
  const updatedChildren = state.byId[action.payload.id].children.slice();
  updatedChildren.splice(action.payload.index, 0, action.payload.id);
  return {
    ...state,
    byId: {
      ...state.byId,
      [action.payload.id]: {
        ...state.byId[action.payload.id],
        children: updatedChildren
      }
    }
  } as InsertLayerChildState;
}