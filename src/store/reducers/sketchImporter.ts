import FileFormat from '@sketch-hq/sketch-file-format-ts';

import {
  OPEN_SKETCH_IMPORTER,
  CLOSE_SKETCH_IMPORTER,
  SketchImporterTypes
} from '../actionTypes/sketchImporter';

export interface SketchImporterState {
  isOpen: boolean;
  sketchFile: {
    document: FileFormat.Document;
    meta: FileFormat.Meta;
    user: FileFormat.User;
    pages: FileFormat.Page[];
    images: {
        [id: string]: Buffer;
    };
  };
}

export const initialState: SketchImporterState = {
  isOpen: false,
  sketchFile: null
};

export default (state = initialState, action: SketchImporterTypes): SketchImporterState => {
  switch (action.type) {
    case OPEN_SKETCH_IMPORTER: {
      return {
        ...state,
        isOpen: true,
        sketchFile: action.payload.sketchFile
      };
    }
    case CLOSE_SKETCH_IMPORTER: {
      return {
        ...state,
        isOpen: false,
        sketchFile: null
      };
    }
    default:
      return state;
  }
}
