/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { uiPaperScope } from '../canvas';
import { importPaperProject } from '../store/selectors/layer';
import { RootState } from '../store/reducers';

interface CanvasArtboardProps {
  id: string;
  documentImages?: {
    [id: string]: Btwx.DocumentImage;
  };
  matrix?: number[];
  paperJSON?: string;
  paperScopeIndex?: number;
}

const CanvasArtboard = (props: CanvasArtboardProps): ReactElement => {
  const { id, paperJSON, documentImages, matrix, paperScopeIndex } = props;

  useEffect(() => {
    const canvasWrap = document.getElementById('canvas-container');
    const paperScope = uiPaperScope.projects[paperScopeIndex];
    importPaperProject({
      paperJSON,
      paperScope,
      documentImages
    });
    paperScope.view.viewSize = new uiPaperScope.Size(canvasWrap.clientWidth, canvasWrap.clientHeight);
    paperScope.view.matrix.set(matrix);
    return () => {
      uiPaperScope.projects[paperScopeIndex].clear();
    }
  }, [id]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState, ownProps: CanvasArtboardProps): {
  documentImages: {
    [id: string]: Btwx.DocumentImage;
  };
  matrix: number[];
  paperJSON: string;
  paperScopeIndex: number;
} => {
  const { layer, documentSettings } = state;
  const artboard = layer.present.byId[ownProps.id] as Btwx.Artboard;
  return {
    documentImages: documentSettings.images.byId,
    matrix: documentSettings.matrix,
    paperJSON: artboard.json,
    paperScopeIndex: artboard.paperScope
  };
};

export default connect(
  mapStateToProps
)(CanvasArtboard);