export const SET_PATH_DATA = 'SET_PATH_DATA';
export const REMOVE_PATH_DATA = 'REMOVE_PATH_DATA';

export interface SetPathDataPayload {
  id: string;
  pathData: string;
  icon: string;
}

export interface SetPathData {
  type: typeof SET_PATH_DATA;
  payload: SetPathDataPayload;
}

export interface RemovePathDataPayload {
  id: string;
}

export interface RemovePathData {
  type: typeof REMOVE_PATH_DATA;
  payload: RemovePathDataPayload;
}

export type PathDataTypes = SetPathData | RemovePathData;