export const ADD_PAGE = 'ADD_PAGE';
export const REMOVE_PAGE = 'REMOVE_PAGE';

export const ACTIVATE_PAGE = 'ACTIVATE_PAGE';
export const DEACTIVATE_PAGE = 'DEACTIVATE_PAGE';

export const SELECT_PAGE = 'SELECT_PAGE';
export const DESELECT_PAGE = 'DESELECT_PAGE';

export const ENABLE_PAGE_HOVER = 'ENABLE_PAGE_HOVER';
export const DISABLE_PAGE_HOVER = 'DISABLE_PAGE_HOVER';

export const ADD_PAGE_CHILD = 'ADD_PAGE_CHILD';
export const REMOVE_PAGE_CHILD = 'REMOVE_PAGE_CHILD';
export const INSERT_PAGE_CHILD = 'INSERT_PAGE_CHILD';

// Add / remove

export interface AddPagePayload {
  id: string;
  name?: string;
}

export interface AddPage {
  type: typeof ADD_PAGE;
  payload: AddPagePayload;
}

export interface RemovePagePayload {
  id: string;
}

export interface RemovePage {
  type: typeof REMOVE_PAGE;
  payload: RemovePagePayload;
}

// Activate

export interface ActivatePagePayload {
  id: string;
}

export interface ActivatePage {
  type: typeof ACTIVATE_PAGE;
  payload: ActivatePagePayload;
}

export interface DeactivatePagePayload {
  id: string;
}

export interface DeactivatePage {
  type: typeof DEACTIVATE_PAGE;
  payload: DeactivatePagePayload;
}

// Select

export interface SelectPagePayload {
  id: string;
}

export interface SelectPage {
  type: typeof SELECT_PAGE;
  payload: SelectPagePayload;
}

export interface DeselectPagePayload {
  id: string;
}

export interface DeselectPage {
  type: typeof DESELECT_PAGE;
  payload: DeselectPagePayload;
}

// Hover

export interface EnablePageHoverPayload {
  id: string;
}

export interface EnablePageHover {
  type: typeof ENABLE_PAGE_HOVER;
  payload: EnablePageHoverPayload;
}

export interface DisablePageHoverPayload {
  id: string;
}

export interface DisablePageHover {
  type: typeof DISABLE_PAGE_HOVER;
  payload: DisablePageHoverPayload;
}

// Children

export interface AddPageChildPayload {
  id: string;
  child: string;
}

export interface AddPageChild {
  type: typeof ADD_PAGE_CHILD;
  payload: AddPageChildPayload;
}

export interface RemovePageChildPayload {
  id: string;
  child: string;
}

export interface RemovePageChild {
  type: typeof REMOVE_PAGE_CHILD;
  payload: RemovePageChildPayload;
}

export interface InsertPageChildPayload {
  id: string;
  child: string;
  index: number;
}

export interface InsertPageChild {
  type: typeof INSERT_PAGE_CHILD;
  payload: InsertPageChildPayload;
}

export type PageTypes = AddPage | RemovePage | ActivatePage | DeactivatePage | SelectPage | DeselectPage | EnablePageHover | DisablePageHover | AddPageChild | RemovePageChild | InsertPageChild;