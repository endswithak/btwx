/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { paperMain } from '../canvas';

interface CanvasUIProps {
  documentImages?: {
    [id: string]: Btwx.DocumentImage;
  };
  matrix?: number[];
  paperProject?: string;
}

const CanvasUI = (props: CanvasUIProps): ReactElement => {
  const ref = useRef<HTMLCanvasElement>(null);
  const { paperProject, matrix } = props;
  const [project, setProject] = useState<paper.Project>(null);

  useEffect(() => {
    if (ref.current) {
      const project = new paperMain.Project(ref.current);
      paperMain.projects.push(project);
      project.clear();
      project.importJSON(paperProject);
      project.view.viewSize = new paperMain.Size(ref.current.clientWidth, ref.current.clientHeight);
      project.view.matrix.set(matrix);
      setProject(project);
    }
    return () => {
      if (project) {
        project.remove();
      }
    }
  }, []);

  return (
    <canvas
      id={`canvas-ui`}
      ref={ref} />
  );
}

const mapStateToProps = (state: RootState): {
  matrix: number[];
  paperProject: string;
} => {
  const { documentSettings } = state;
  return {
    matrix: documentSettings.matrix,
    paperProject: '[["Layer",{"applyMatrix":true,"children":[["Group",{"applyMatrix":true,"name":"UI","data":{"id":"ui","type":"UI"},"children":[["Group",{"applyMatrix":true,"name":"Active Artboard Frame","data":{"id":"ActiveArtboardFrame","type":"UIElement"}}],["Group",{"applyMatrix":true,"name":"Artboard Events","data":{"id":"ArtboardEvents","type":"UIElement"}}],["Group",{"applyMatrix":true,"name":"Hover Frame","data":{"id":"HoverFrame","type":"UIElement"}}],["Group",{"applyMatrix":true,"name":"Selection Frame","data":{"id":"SelectionFrame","type":"UIElement"}}],["Group",{"applyMatrix":true,"name":"Guides","data":{"id":"Guides"},"children":[["Group",{"applyMatrix":true,"name":"Snap Guides","data":{"id":"SnapGuides","type":"UIElement"}}],["Group",{"applyMatrix":true,"name":"Static Guides","data":{"id":"StaticGuides","type":"UIElement"}}]]}],["Group",{"applyMatrix":true,"name":"Measure Guides","data":{"id":"MeasureGuides","type":"UIElement"}}]]}]]}]]'
  };
};

export default connect(
  mapStateToProps
)(CanvasUI);