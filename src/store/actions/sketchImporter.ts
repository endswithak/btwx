import {
  OPEN_SKETCH_IMPORTER,
  CLOSE_SKETCH_IMPORTER,
  OpenSketchImporterPayload,
  SketchImporterTypes
} from '../actionTypes/sketchImporter';

export const openSketchImporter = (payload: OpenSketchImporterPayload): SketchImporterTypes => ({
  type: OPEN_SKETCH_IMPORTER,
  payload
});

export const closeSketchImporter = (): SketchImporterTypes => ({
  type: CLOSE_SKETCH_IMPORTER
});