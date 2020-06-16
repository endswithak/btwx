import {
  OPEN_STROKE_EDITOR,
  CLOSE_STROKE_EDITOR,
  StrokeEditorTypes,
} from '../actionTypes/strokeEditor';

export interface StrokeEditorState {
  isOpen: boolean;
  layer: string;
  stroke: em.Stroke;
  x: number;
  y: number;
  onChange?(stroke: em.Stroke): void;
  onClose?(stroke: em.Stroke): void;
}

const initialState: StrokeEditorState = {
  isOpen: false,
  layer: null,
  stroke: null,
  x: null,
  y: null,
  onChange: null,
  onClose: null
};

export default (state = initialState, action: StrokeEditorTypes): StrokeEditorState => {
  switch (action.type) {
    case OPEN_STROKE_EDITOR: {
      return {
        ...state,
        isOpen: true,
        layer: action.payload.layer,
        stroke: action.payload.stroke,
        x: action.payload.x,
        y: action.payload.y,
        onChange: action.payload.onChange,
        onClose: action.payload.onClose
      };
    }
    case CLOSE_STROKE_EDITOR: {
      return {
        ...state,
        isOpen: false,
        layer: null,
        stroke: null,
        x: null,
        y: null,
        onChange: null,
        onClose: null
      };
    }
    default:
      return state;
  }
}
