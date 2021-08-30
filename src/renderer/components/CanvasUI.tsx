/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { paperMain } from '../canvas';
import ActiveArtboardFrameWrap from './ActiveArtboardFrameWrap';
import { activeArtboardFrameJSON } from './ActiveArtboardFrame';
import SelectionFrameWrap from './SelectionFrameWrap';
import { selectionFrameJSON } from './SelectionFrame';
import ScrollFrameWrap from './ScrollFrameWrap';
import { scrollFrameJSON } from './ScrollFrame';
import GradientFrameWrap from './GradientFrameWrap';
import { gradientFrameJSON } from './GradientFrame';
import MeasureFrameWrap from './MeasureFrameWrap';
import { measureFrameJSON } from './MeasureFrame';
import EventsFrameWrap from './EventsFrameWrap';
import { eventsFrameJSON } from './EventsFrame';
import HoverFrameWrap from './HoverFrameWrap';
import { hoverFrameJSON } from './HoverFrame';
import NamesFrameWrap from './NamesFrameWrap';
import { namesFrameJSON } from './NamesFrame';
import VectorEditFrameWrap from './VectorEditFrameWrap';
import { vectorEditFrameJSON } from './VectorEditFrame';

const CanvasUI = (): ReactElement => {
  const ref = useRef<HTMLCanvasElement>(null);
  const ready = useSelector((state: RootState) => state.canvasSettings.ready);
  const matrix = useSelector((state: RootState) => state.documentSettings.matrix);
  const projectJSON = `[[
    "Layer", {
      "applyMatrix": true,
      "name": "UI",
      "data": {
        "id": "ui",
        "type": "UI"
      },
      "children": [
        ${eventsFrameJSON},
        ${activeArtboardFrameJSON},
        ${vectorEditFrameJSON},
        ${gradientFrameJSON},
        ${hoverFrameJSON},
        ${scrollFrameJSON},
        ${selectionFrameJSON},
        ${namesFrameJSON},
        ${measureFrameJSON},
        ["Group",{"applyMatrix":true,"name":"Drawing Preview","data":{"id":"drawingPreview","type":"UIElement"}}],
        ["Group",{"applyMatrix":true,"name":"Static Guides","data":{"id":"staticGuides","type":"UIElement"}}],
        ["Group",{"applyMatrix":true,"name":"Snap Guides","data":{"id":"snapGuides","type":"UIElement"}}],
        ["Group",{"applyMatrix":true,"name":"Tooltips","data":{"id":"tooltips","type":"UIElement"}}]
      ]
    }
  ]]`;

  useEffect(() => {
    if (ref.current) {
      const canvasWrap = document.getElementById('canvas-container');
      paperMain.setup(ref.current);
      paperMain.project.clear();
      paperMain.project.importJSON(projectJSON);
      paperMain.view.viewSize = new paperMain.Size(canvasWrap.clientWidth, canvasWrap.clientHeight);
      paperMain.view.matrix.set(matrix);
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
            <ScrollFrameWrap />
            <SelectionFrameWrap />
            <GradientFrameWrap />
            <EventsFrameWrap />
            <NamesFrameWrap />
            <MeasureFrameWrap />
            <VectorEditFrameWrap />
          </>
        : null
      }
    </>
  );
}

export default CanvasUI;