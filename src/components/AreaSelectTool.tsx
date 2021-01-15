/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, useEffect, ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import tinyColor from 'tinycolor2';
import { RootState } from '../store/reducers';
import { paperMain } from '../canvas';
import { setCanvasSelecting } from '../store/actions/canvasSettings';
import { areaSelectLayers } from '../store/actions/layer';
import { getLayerProjectIndices } from '../store/selectors/layer';
import PaperTool, { PaperToolProps } from './PaperTool';
import { ThemeContext } from './ThemeProvider';

const AreaSelectTool = (props: PaperToolProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { tool, downEvent, dragEvent, upEvent } = props;
  const isEnabled = useSelector((state: RootState) => state.canvasSettings.activeTool === 'AreaSelect');
  const scope = useSelector((state: RootState) => state.layer.present.scope);
  const activeArtboard = useSelector((state: RootState) => state.layer.present.activeArtboard);
  const layerProjectIndices = useSelector((state: RootState) => getLayerProjectIndices(state));
  const dispatch = useDispatch();

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
    if (dragEvent && isEnabled) {
      if (paperMain.project.activeLayer.data.id !== 'ui') {
        paperMain.projects[0].activate();
      }
      updateAreaSelectPreview(null);
      dispatch(setCanvasSelecting({selecting: true}));
    }
  }, [downEvent]);

  useEffect(() => {
    if (dragEvent && isEnabled) {
      updateAreaSelectPreview(
        new paperMain.Rectangle({
          from: dragEvent.downPoint,
          to: dragEvent.point
        })
      );
    }
  }, [dragEvent]);

  useEffect(() => {
    if (upEvent && isEnabled) {
      const areaSelectBounds = new paperMain.Rectangle({
        from: upEvent.downPoint,
        to: upEvent.point
      });
      if (areaSelectBounds && (areaSelectBounds.width > 0 || areaSelectBounds.height > 0)) {
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
        if (layers.length > 0) {
          dispatch(areaSelectLayers({
            layers: layers,
            shiftModifier: upEvent.modifiers.shift
          }));
        }
      }
      dispatch(setCanvasSelecting({selecting: false}));
      updateAreaSelectPreview(null);
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
        updateAreaSelectPreview(null);
      }
    }
  }, [isEnabled]);

  return (
    <></>
  );
}

export default PaperTool(
  AreaSelectTool,
  {
    mouseDown: true,
    mouseDrag: true,
    mouseUp: true
  }
);