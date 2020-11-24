/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { importPaperProject } from '../store/selectors/layer';
import { RootState } from '../store/reducers';
import { paperMain } from '../canvas';

interface CanvasArtboardProps {
  id: string;
  documentImages?: {
    [id: string]: Btwx.DocumentImage;
  };
  matrix?: number[];
  projectJSON?: string;
  projectIndex?: number;
}

const CanvasArtboard = (props: CanvasArtboardProps): ReactElement => {
  const ref = useRef<HTMLCanvasElement>(null);
  const { id, projectJSON, projectIndex, documentImages, matrix } = props;

  useEffect(() => {
    if (ref.current) {
      let project = paperMain.projects[projectIndex];
      const canvasWrap = document.getElementById('canvas-container');
      if (!project) {
        project = new paperMain.Project(ref.current);
        paperMain.projects.push(project);
      }
      importPaperProject({
        projectJSON,
        projectIndex,
        documentImages
      });
      project.view.viewSize = new paperMain.Size(canvasWrap.clientWidth, canvasWrap.clientHeight);
      project.view.matrix.set(matrix);
    }
    return () => {
      if (paperMain.projects[projectIndex]) {
        paperMain.projects[projectIndex].remove();
        paperMain.projects = paperMain.projects.filter((project, index) => index !== projectIndex);
      }
    }
  }, []);

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
  projectJSON: string;
  projectIndex: number;
} => {
  const { layer, documentSettings } = state;
  const artboard = layer.present.byId[ownProps.id] as Btwx.Artboard;
  return {
    documentImages: documentSettings.images.byId,
    matrix: documentSettings.matrix,
    projectJSON: artboard.project,
    projectIndex: artboard.projectIndex
  };
};

export default connect(
  mapStateToProps
)(CanvasArtboard);