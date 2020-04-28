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
  AddPagePayload,
  RemovePagePayload,
  ActivatePagePayload,
  DeactivatePagePayload,
  SelectPagePayload,
  DeselectPagePayload,
  EnablePageHoverPayload,
  DisablePageHoverPayload,
  AddPageChildPayload,
  RemovePageChildPayload,
  InsertPageChildPayload,
  PageTypes
} from '../actionTypes/page';

import { StoreDispatch, StoreGetState } from '../index';

// Add / remove

export const addPage = (payload: AddPagePayload): PageTypes => ({
  type: ADD_PAGE,
  payload
});

export const removePage = (payload: RemovePagePayload): PageTypes => ({
  type: REMOVE_PAGE,
  payload
});

// Activate

export const activatePage = (payload: ActivatePagePayload): PageTypes => ({
  type: ACTIVATE_PAGE,
  payload
});

export const deactivatePage = (payload: DeactivatePagePayload): PageTypes => ({
  type: DEACTIVATE_PAGE,
  payload
});

// Select

export const selectPage = (payload: SelectPagePayload): PageTypes => ({
  type: SELECT_PAGE,
  payload
});

export const deselectPage = (payload: DeselectPagePayload): PageTypes => ({
  type: DESELECT_PAGE,
  payload
});

// Hover

export const enablePageHover = (payload: EnablePageHoverPayload): PageTypes => ({
  type: ENABLE_PAGE_HOVER,
  payload
});

export const disablePageHover = (payload: DisablePageHoverPayload): PageTypes => ({
  type: DISABLE_PAGE_HOVER,
  payload
});

// Children

export const addPageChild = (payload: AddPageChildPayload): PageTypes => ({
  type: ADD_PAGE_CHILD,
  payload
});

export const removePageChild = (payload: RemovePageChildPayload): PageTypes => ({
  type: REMOVE_PAGE_CHILD,
  payload
});

export const insertPageChild = (payload: InsertPageChildPayload): PageTypes => ({
  type: INSERT_PAGE_CHILD,
  payload
});