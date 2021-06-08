import { getPaperLayer } from '../selectors/layer';
import { paperMain } from '../../canvas';
import { RootState } from '../reducers';

import {
  OPEN_TEXT_EDITOR,
  CLOSE_TEXT_EDITOR,
  OpenTextEditorPayload,
  TextEditorTypes
} from '../actionTypes/textEditor';

export const openTextEditor = (payload: OpenTextEditorPayload): TextEditorTypes => ({
  type: OPEN_TEXT_EDITOR,
  payload
});

export const openTextEditorThunk = (id: string, projectIndex: number) => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    const paperLayer = getPaperLayer(id, projectIndex);
    const topLeft = paperMain.view.projectToView(paperLayer.bounds.topLeft);
    const topCenter = paperMain.view.projectToView(paperLayer.bounds.topCenter);
    const topRight = paperMain.view.projectToView(paperLayer.bounds.topRight);
    dispatch(openTextEditor({
      layer: id,
      projectIndex: projectIndex,
      x: ((): number => {
        switch(state.textSettings.justification) {
          case 'left':
            return topLeft.x;
          case 'center':
            return topCenter.x;
          case 'right':
            return topRight.x;
        }
      })(),
      y: ((): number => {
        switch(state.textSettings.justification) {
          case 'left':
            return topLeft.y;
          case 'center':
            return topCenter.y;
          case 'right':
            return topRight.y;
        }
      })()
    }));
  }
};

export const closeTextEditor = (): TextEditorTypes => ({
  type: CLOSE_TEXT_EDITOR
});