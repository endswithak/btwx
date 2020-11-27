/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useRef } from 'react';
import { pagePaperScope } from '../canvas';
import { connect } from 'react-redux';
import { importPaperProject } from '../store/selectors/layer';
import { RootState } from '../store/reducers';

interface CanvasPageProps {
  documentImages?: {
    [id: string]: Btwx.DocumentImage;
  };
  matrix?: number[];
  paperJSON?: string;
}

const CanvasPage = (props: CanvasPageProps): ReactElement => {
  const ref = useRef<HTMLCanvasElement>(null);
  const { paperJSON, documentImages, matrix } = props;

  useEffect(() => {
    if (ref.current) {
      const canvasWrap = document.getElementById('canvas-container');
      pagePaperScope.setup(ref.current);
      importPaperProject({
        paperJSON,
        paperScope: 1,
        documentImages
      });
      pagePaperScope.view.viewSize = new pagePaperScope.Size(canvasWrap.clientWidth, canvasWrap.clientHeight);
      pagePaperScope.view.matrix.set(matrix);
    }
  }, []);

  return (
    <canvas
      id='canvas-page'
      className='c-canvas__layer c-canvas__layer--page'
      ref={ref} />
  );
}

const mapStateToProps = (state: RootState): {
  documentImages: {
    [id: string]: Btwx.DocumentImage;
  };
  matrix: number[];
  paperJSON: string;
} => {
  const { layer, documentSettings } = state;
  const page = layer.present.byId['page'] as Btwx.Page;
  return {
    documentImages: documentSettings.images.byId,
    matrix: documentSettings.matrix,
    paperJSON: page.paperJSON
  };
};

export default connect(
  mapStateToProps
)(CanvasPage);