import FileFormat from '@sketch-hq/sketch-file-format-ts';
export const OPEN_SKETCH_IMPORTER = 'OPEN_SKETCH_IMPORTER';
export const CLOSE_SKETCH_IMPORTER = 'CLOSE_SKETCH_IMPORTER';

export interface OpenSketchImporterPayload {
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

export interface OpenSketchImporter {
  type: typeof OPEN_SKETCH_IMPORTER;
  payload: OpenSketchImporterPayload;
}

export interface CloseSketchImporter {
  type: typeof CLOSE_SKETCH_IMPORTER;
}

export type SketchImporterTypes = OpenSketchImporter | CloseSketchImporter;