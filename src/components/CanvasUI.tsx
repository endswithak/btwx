/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { uiPaperScope } from '../canvas';
import ActiveArtboardFrameWrap from './ActiveArtboardFrameWrap';
import SelectionFrameWrap from './SelectionFrameWrap';
import GradientFrameWrap from './GradientFrameWrap';
import MeasureFrameWrap from './MeasureFrameWrap';
import TweenEventsFrameWrap from './EventsFrameWrap';
import HoverFrameWrap from './HoverFrameWrap';
import NameFrameWrap from './NameFrameWrap';

interface CanvasUIProps {
  ready?: boolean;
}

const CanvasUI = (props: CanvasUIProps): ReactElement => {
  const ref = useRef<HTMLCanvasElement>(null);
  const { ready } = props;
  const matrix = useSelector((state: RootState) => state.documentSettings.matrix);
  const projectJSON = '[["Layer",{"applyMatrix":true,"name":"UI","data":{"id":"ui","type":"UI"},"children":[["Group",{"applyMatrix":true,"name":"Artboard Events","data":{"id":"eventsFrame","type":"UIElement"}}],["Group",{"applyMatrix":true,"name":"Active Artboard Frame","data":{"id":"activeArtboardFrame","type":"UIElement"}}],["Group",{"applyMatrix":true,"name":"Gradient Frame","data":{"id":"gradientFrame","type":"UIElement"}}],["Group",{"applyMatrix":true,"name":"Drawing Preview","data":{"id":"drawingPreview","type":"UIElement"}}],["Group",{"applyMatrix":true,"name":"Hover Frame","data":{"id":"hoverFrame","type":"UIElement"}}],["Group",{"applyMatrix":true,"name":"Selection Frame","data":{"id":"selectionFrame","type":"UIElement"}}],["Group",{"applyMatrix":true,"name":"Name Frame","data":{"id":"nameFrame","type":"UIElement"}}],["Group",{"applyMatrix":true,"name":"Static Guides","data":{"id":"staticGuides","type":"UIElement"}}],["Group",{"applyMatrix":true,"name":"Snap Guides","data":{"id":"snapGuides","type":"UIElement"}}],["Group",{"applyMatrix":true,"name":"Measure Guides","data":{"id":"measureGuides","type":"UIElement"}}],["Group",{"applyMatrix":true,"name":"Tooltips","data":{"id":"tooltips","type":"UIElement"}}]]}]]';

  useEffect(() => {
    if (ref.current) {
      const canvasWrap = document.getElementById('canvas-container');
      uiPaperScope.setup(ref.current);
      uiPaperScope.project.clear();
      uiPaperScope.project.importJSON(projectJSON);
      uiPaperScope.view.viewSize = new uiPaperScope.Size(canvasWrap.clientWidth, canvasWrap.clientHeight);
      uiPaperScope.view.matrix.set(matrix);
    }
  }, []);

  return (
    <>
      <canvas
        id='canvas-ui'
        className='c-canvas__layer c-canvas__layer--ui'
        ref={ref} />
      {
        ready
        ? <>
            <ActiveArtboardFrameWrap />
            <HoverFrameWrap />
            <SelectionFrameWrap />
            <GradientFrameWrap />
            <TweenEventsFrameWrap />
            <NameFrameWrap />
          </>
        : null
      }
      {/* <MeasureFrameWrap /> */}
    </>
  );
}

export default CanvasUI;