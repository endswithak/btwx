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
  paperProject?: string;
}

const CanvasPage = (props: CanvasPageProps): ReactElement => {
  const ref = useRef<HTMLCanvasElement>(null);
  const { paperProject, documentImages, matrix } = props;
  const [project, setProject] = useState<paper.Project>(null);

  useEffect(() => {
    if (ref.current) {
      const project = new paperMain.Project(ref.current);
      paperMain.projects.push(project);
      importPaperProject({
        paperProject,
        documentImages,
        project
      });
      project.view.viewSize = new paperMain.Size(ref.current.clientWidth, ref.current.clientHeight);
      project.view.matrix.set(matrix);
      setProject(project);
    }
    return (): void => {
      if (project) {
        project.remove();
      }
    }
  }, []);

  return (
    <canvas
      id={`canvas-page`}
      ref={ref} />
  );
}

const mapStateToProps = (state: RootState): {
  documentImages: {
    [id: string]: Btwx.DocumentImage;
  };
  matrix: number[];
  paperProject: string;
} => {
  const { layer, documentSettings } = state;
  return {
    documentImages: documentSettings.images.byId,
    matrix: documentSettings.matrix,
    paperProject: layer.present.paperProjects['page']
  };
};

export default connect(
  mapStateToProps
)(CanvasPage);