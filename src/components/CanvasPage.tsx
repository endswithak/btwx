/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { importPaperProject } from '../store/selectors/layer';
import { RootState } from '../store/reducers';
import { paperMain } from '../canvas';

interface CanvasPageProps {
  documentImages?: {
    [id: string]: Btwx.DocumentImage;
  };
  matrix?: number[];
  projectJSON?: string;
}

const CanvasPage = (props: CanvasPageProps): ReactElement => {
  const ref = useRef<HTMLCanvasElement>(null);
  const { projectJSON, documentImages, matrix } = props;

  useEffect(() => {
    if (ref.current) {
      const canvasWrap = document.getElementById('canvas-container');
      const project = new paperMain.Project(ref.current);
      paperMain.projects.push(project);
      importPaperProject({
        projectJSON,
        documentImages,
        projectIndex: 0
      });
      project.view.viewSize = new paperMain.Size(canvasWrap.clientWidth, canvasWrap.clientHeight);
      project.view.matrix.set(matrix);
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
  projectJSON: string;
} => {
  const { layer, documentSettings } = state;
  const page = layer.present.byId['page'] as Btwx.Page;
  return {
    documentImages: documentSettings.images.byId,
    matrix: documentSettings.matrix,
    projectJSON: page.project
  };
};

export default connect(
  mapStateToProps
)(CanvasPage);