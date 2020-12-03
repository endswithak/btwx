/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import paper from 'paper';
import { importPaperProject } from '../store/selectors/layer';
import { RootState } from '../store/reducers';

interface CanvasArtboardProps {
  id: string;
  documentImages?: {
    [id: string]: Btwx.DocumentImage;
  };
  matrix?: number[];
  paperJSON?: string;
  paperScope?: number;
}

const CanvasArtboard = (props: CanvasArtboardProps): ReactElement => {
  const ref = useRef<HTMLCanvasElement>(null);
  const { id, paperJSON, paperScope, documentImages, matrix } = props;

  useEffect(() => {
    if (ref.current) {
      const paperScopeItem = paper.PaperScope.get(paperScope);
      const canvasWrap = document.getElementById('canvas-container');
      paperScopeItem.setup(ref.current);
      importPaperProject({
        paperJSON,
        paperScope,
        documentImages
      });
      paperScopeItem.view.viewSize = new paperScopeItem.Size(canvasWrap.clientWidth, canvasWrap.clientHeight);
      paperScopeItem.view.matrix.set(matrix);
    }
    return () => {
      const paperScopeItem = paper.PaperScope.get(paperScope);
      paperScopeItem.project.remove();
    }
  }, [id]);

  return (
    <canvas
      id={`canvas-${id}`}
      className='c-canvas__layer c-canvas__layer--artboard'
      ref={ref} />
  );
}

const mapStateToProps = (state: RootState, ownProps: CanvasArtboardProps): {
  documentImages: {
    [id: string]: Btwx.DocumentImage;
  };
  matrix: number[];
  paperJSON: string;
  paperScope: number;
} => {
  const { layer, documentSettings } = state;
  const artboard = layer.present.byId[ownProps.id] as Btwx.Artboard;
  return {
    documentImages: documentSettings.images.byId,
    matrix: documentSettings.matrix,
    paperJSON: artboard.json,
    paperScope: artboard.paperScope
  };
};

export default connect(
  mapStateToProps
)(CanvasArtboard);