import {
  SET_PATH_DATA,
  REMOVE_PATH_DATA,
  SetPathDataPayload,
  RemovePathDataPayload,
  PathDataTypes
} from '../actionTypes/pathData';

export const setPathData = (payload: SetPathDataPayload): PathDataTypes => ({
  type: SET_PATH_DATA,
  payload
});

export const removePathData = (payload: RemovePathDataPayload): PathDataTypes => ({
  type: REMOVE_PATH_DATA,
  payload
});