/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { uiPaperScope } from '../canvas';
import ActiveArtboardFrameWrap from './ActiveArtboardFrameWrap';
import SelectionFrameWrap from './SelectionFrameWrap';
import GradientFrameWrap from './GradientFrameWrap';
import MeasureFrameWrap from './MeasureFrameWrap';
import TweenEventsFrameWrap from './TweenEventsFrameWrap';
import HoverFrameWrap from './HoverFrameWrap';

interface CanvasUIProps {
  documentImages?: {
    [id: string]: Btwx.DocumentImage;
  };
  matrix?: number[];
  projectJSON?: string;
}

const CanvasUI = (props: CanvasUIProps): ReactElement => {
  const ref = useRef<HTMLCanvasElement>(null);
  const { projectJSON, matrix } = props;

  useEffect(() => {
    if (ref.current) {
      const canvasWrap = document.getElementById('canvas-container');
      uiPaperScope.setup(ref.current);
      uiPaperScope.project.clear();
      uiPaperScope.project.importJSON(projectJSON);
      uiPaperScope.view.viewSize = new uiPaperScope.Size(canvasWrap.clientWidth, canvasWrap.clientHeight);
      uiPaperScope.view.matrix.set(matrix);
      [...Array(33).keys()].forEach((scope, index) => {
        new uiPaperScope.Project(document.getElementById(`canvas-artboard-${index}`) as HTMLCanvasElement);
      });
      uiPaperScope.projects[0].activate();
    }
  }, []);

  return (
    <>
      <canvas
        id='canvas-ui'
        className='c-canvas__layer c-canvas__layer--ui'
        ref={ref} />
      {
        [...Array(33).keys()].map((key, index) => (
          <canvas
            key={index}
            id={`canvas-artboard-${index}`}
            className='c-canvas__layer c-canvas__layer--artboard' />
        ))
      }
      <ActiveArtboardFrameWrap />
      <HoverFrameWrap />
      <SelectionFrameWrap />
      <GradientFrameWrap />
      <TweenEventsFrameWrap />
      {/* <MeasureFrameWrap /> */}
    </>
  );
}

const mapStateToProps = (state: RootState): {
  matrix: number[];
  projectJSON: string;
} => {
  const { documentSettings } = state;
  return {
    matrix: documentSettings.matrix,
    projectJSON: '[["Layer",{"applyMatrix":true,"name":"UI","data":{"id":"ui","type":"UI"},"children":[["Group",{"applyMatrix":true,"name":"Artboard Events","data":{"id":"artboardEvents","type":"UIElement"}}],["Group",{"applyMatrix":true,"name":"Active Artboard Frame","data":{"id":"activeArtboardFrame","type":"UIElement"}}],["Group",{"applyMatrix":true,"name":"Gradient Frame","data":{"id":"gradientFrame","type":"UIElement"}}],["Group",{"applyMatrix":true,"name":"Drawing Preview","data":{"id":"drawingPreview","type":"UIElement"}}],["Group",{"applyMatrix":true,"name":"Hover Frame","data":{"id":"hoverFrame","type":"UIElement"}}],["Group",{"applyMatrix":true,"name":"Selection Frame","data":{"id":"selectionFrame","type":"UIElement"}}],["Group",{"applyMatrix":true,"name":"Static Guides","data":{"id":"staticGuides","type":"UIElement"}}],["Group",{"applyMatrix":true,"name":"Snap Guides","data":{"id":"snapGuides","type":"UIElement"}}],["Group",{"applyMatrix":true,"name":"Measure Guides","data":{"id":"measureGuides","type":"UIElement"}}],["Group",{"applyMatrix":true,"name":"Tooltips","data":{"id":"tooltips","type":"UIElement"}}]]}]]'
  };
};

export default connect(
  mapStateToProps
)(CanvasUI);