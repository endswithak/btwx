/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, ReactElement, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { paperMain } from '../canvas';
import { setCanvasSelecting } from '../store/actions/canvasSettings';
import { areaSelectLayers } from '../store/actions/layer';
import { getLayerProjectIndices } from '../store/selectors/layer';
import PaperTool, { PaperToolProps } from './PaperTool';
import { eventsFrameId } from './EventsFrame';

const AreaSelectTool = (props: PaperToolProps): ReactElement => {
  const { tool, downEvent, dragEvent, upEvent } = props;
  const isEnabled = useSelector((state: RootState) => state.canvasSettings.activeTool === 'AreaSelect');
  const scope = useSelector((state: RootState) => state.layer.present.scope);
  const activeArtboard = useSelector((state: RootState) => state.layer.present.activeArtboard);
  const layerProjectIndices = useSelector((state: RootState) => getLayerProjectIndices(state));
  const selecting = useSelector((state: RootState) => state.canvasSettings.selecting);
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const dispatch = useDispatch();

  const resetState = () => {
    const drawingPreview = paperMain.project.getItem({data: {id: 'drawingPreview'}});
    drawingPreview.removeChildren();
    setFrom(null);
    setTo(null);
    dispatch(setCanvasSelecting({selecting: false}));
  }

  const updateAreaSelectPreview = (areaSelectBounds: paper.Rectangle): void => {
    const drawingPreview = paperMain.project.getItem({data: {id: 'drawingPreview'}});
    drawingPreview.removeChildren();
    if (areaSelectBounds) {
      const areaSelectPreview = new paperMain.Path.Rectangle({
        rectangle: areaSelectBounds,
        fillColor: 'rgba(204,204,204,0.75)',
        strokeWidth: 1 / paperMain.view.zoom,
        strokeColor: '#999',
        opacity: 0.2,
        parent: drawingPreview
      });
      areaSelectPreview.removeOn({
        up: true
      });
    }
  }

  useEffect(() => {
    try {
      if (downEvent && isEnabled && !(downEvent as any).event.ctrlKey && (downEvent as any).event.which !== 3 && (downEvent as any).event.buttons === 1) {
        if (paperMain.project.activeLayer.data.id !== 'ui') {
          paperMain.projects[0].activate();
        }
        updateAreaSelectPreview(null);
        setFrom(downEvent);
      }
    } catch(err) {
      console.error(`Area Select Tool Error -- On Mouse Down -- ${err}`);
      resetState();
    }
  }, [downEvent]);

  useEffect(() => {
    try {
      if (dragEvent && from && isEnabled) {
        updateAreaSelectPreview(
          new paperMain.Rectangle({
            from: dragEvent.downPoint,
            to: dragEvent.point
          })
        );
        setTo(dragEvent.point);
        if (!selecting) {
          dispatch(setCanvasSelecting({selecting: true}));
        }
      }
    } catch(err) {
      console.error(`Area Select Tool Error -- On Mouse Drag -- ${err}`);
      resetState();
    }
  }, [dragEvent]);

  useEffect(() => {
    try {
      if (upEvent && from && to && isEnabled) {
        const areaSelectBounds = new paperMain.Rectangle({
          from: upEvent.downPoint,
          to: upEvent.point
        });
        if (areaSelectBounds && (areaSelectBounds.width > 0 || areaSelectBounds.height > 0)) {
          const getEvents = () => {
            return paperMain.projects[0].getItems({
              data: (data: any) => {
                return data && data.elementId && data.elementId === eventsFrameId;
              },
              overlapping: areaSelectBounds
            }).reverse().reduce((result, current) => {
              if (!result.includes(current.data.interactiveType)) {
                result = [...result, current.data.interactiveType];
              }
              return result;
            }, []);
          }
          const getProjectsLayers = (project: paper.Project): string[] => {
            return project.getItems({
              data: (data: any) => {
                const notRoot = data.type === 'Layer' && data.layerType !== 'Root';
                const isScopeLayer = data.scope && (scope.includes(data.scope[data.scope.length - 1]) || data.scope[data.scope.length - 1] === activeArtboard);
                const other = data.id && data.id !== scope[scope.length - 1];
                return notRoot && isScopeLayer && other;
              },
              overlapping: areaSelectBounds
            }).reverse().reduce((result, current) => {
              if (current.data.layerType === 'Artboard') {
                if (areaSelectBounds.contains(current.bounds)) {
                  return [...result, current.data.id];
                } else {
                  return result;
                }
              } else {
                if (!result.includes(current.data.scope[0])) {
                  return [...result, current.data.id];
                }
              }
            }, []);
          }
          const layers = layerProjectIndices.reduce((result, current, index) => {
            const scope = paperMain.projects[current];
            return [...result, ...getProjectsLayers(scope)]
          }, []);
          const events = getEvents();
          if (layers.length > 0 || events.length > 0) {
            dispatch(areaSelectLayers({
              layers: layers,
              events: getEvents(),
              shiftModifier: upEvent.modifiers.shift
            }));
          }
        }
      }
      resetState();
    } catch(err) {
      console.error(`Area Select Tool Error -- On Mouse Up -- ${err}`);
      resetState();
    }
  }, [upEvent]);

  useEffect(() => {
    if (isEnabled) {
      if (tool) {
        tool.activate();
      }
    } else {
      if (tool && paperMain.tool && (paperMain.tool as any)._index === (tool as any)._index) {
        paperMain.tool = null;
        resetState();
      }
    }
  }, [isEnabled]);

  return null;
}

export default PaperTool(
  AreaSelectTool,
  {
    mouseDown: true,
    mouseDrag: true,
    mouseUp: true
  }
);