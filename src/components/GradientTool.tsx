/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, ReactElement, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { paperMain } from '../canvas';
import { RootState } from '../store/reducers';
import { setLayersGradientOD } from '../store/actions/layer';
import { setCanvasResizing } from '../store/actions/canvasSettings';
import { getPaperLayer, getSelectedProjectIndices, getPaperProp, getSelectedById } from '../store/selectors/layer';
import SnapTool from './SnapTool';
import PaperTool, { PaperToolProps } from './PaperTool';

const GradientTool = (props: PaperToolProps): ReactElement => {
  const { tool, downEvent, dragEvent, upEvent } = props;
  const isEnabled = useSelector((state: RootState) => state.gradientEditor.isOpen && state.canvasSettings.activeTool === 'Gradient');
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const selectedProjectIndices = useSelector((state: RootState) => getSelectedProjectIndices(state));
  const gradientHandle = useSelector((state: RootState) => state.canvasSettings.gradientHandle);
  const gradientProp = useSelector((state: RootState) => state.gradientEditor.prop);
  const resizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const selectedById = useSelector((state: RootState) => getSelectedById(state));
  const [originHandlePosition, setOriginHandlePosition] = useState<paper.Point>(null);
  const [destinationHandlePosition, setDestinationHandlePosition] = useState<paper.Point>(null);
  const [snapBounds, setSnapBounds] = useState<paper.Rectangle>(null);
  const [toBounds, setToBounds] = useState<paper.Rectangle>(null);
  const [handle, setHandle] = useState<Btwx.GradientHandle>(null);
  const dispatch = useDispatch();

  const resetState = (): void => {
    setOriginHandlePosition(null);
    setDestinationHandlePosition(null);
    setToBounds(null);
    setSnapBounds(null);
    setHandle(null);
    dispatch(setCanvasResizing({resizing: false}));
  }

  const handleSnapToolUpdate = (snapToolBounds: paper.Rectangle, xSnapPoint: Btwx.SnapPoint, ySnapPoint: Btwx.SnapPoint): void => {
    setToBounds(snapToolBounds);
  }

  useEffect(() => {
    try {
      if (downEvent && isEnabled) {
        const originHandle = paperMain.project.getItem({data: { id: 'gradientFrameOriginHandle' }});
        const destinationHandle = paperMain.project.getItem({data: { id: 'gradientFrameDestinationHandle' }});
        setOriginHandlePosition(originHandle.position);
        setDestinationHandlePosition(destinationHandle.position);
        setHandle(gradientHandle);
      }
    } catch(err) {
      console.error(`Gradient Tool Error -- On Mouse Down -- ${err}`);
      resetState();
    }
  }, [downEvent])

  useEffect(() => {
    try {
      if (dragEvent && isEnabled) {
        const nextSnapBounds = new paperMain.Rectangle({
          from: new paperMain.Point(dragEvent.point.x - 0.5, dragEvent.point.y - 0.5),
          to: new paperMain.Point(dragEvent.point.x + 0.5, dragEvent.point.y + 0.5)
        });
        setSnapBounds(nextSnapBounds);
        if (!resizing) {
          dispatch(setCanvasResizing({resizing: true}));
        }
      }
    } catch(err) {
      console.error(`Gradient Tool Error -- On Mouse Drag -- ${err}`);
      resetState();
    }
  }, [dragEvent]);

  useEffect(() => {
    try {
      if (upEvent && isEnabled && toBounds) {
        switch(handle) {
          case 'origin': {
            dispatch(setLayersGradientOD({
              layers: selected,
              origin: {
                x: toBounds.center.x,
                y: toBounds.center.y
              },
              destination: {
                x: destinationHandlePosition.x,
                y: destinationHandlePosition.y
              },
              prop: gradientProp,
              handle: handle
            }));
            break;
          }
          case 'destination': {
            dispatch(setLayersGradientOD({
              layers: selected,
              origin: {
                x: originHandlePosition.x,
                y: originHandlePosition.y
              },
              destination: {
                x: toBounds.center.x,
                y: toBounds.center.y
              },
              prop: gradientProp,
              handle: handle
            }));
            break;
          }
        }
        resetState();
      }
    } catch(err) {
      console.error(`Gradient Tool Error -- On Mouse Up -- ${err}`);
      resetState();
    }
  }, [upEvent]);

  const updateGradients = (): void => {
    const originHandle = paperMain.project.getItem({data: { id: 'gradientFrameOriginHandle' }});
    const destinationHandle = paperMain.project.getItem({data: { id: 'gradientFrameDestinationHandle' }});
    const lines = paperMain.project.getItems({data: { id: 'gradientFrameLine' }});
    const paperProp = getPaperProp(gradientProp);
    if (handle === 'origin') {
      originHandle.position = toBounds.center;
      lines.forEach((line: paper.Path) => {
        line.firstSegment.point = toBounds.center;
      });
      selected.forEach((id) => {
        let paperLayer = getPaperLayer(id, selectedProjectIndices[id]);
        if (selectedById[id].type === 'Artboard') {
          paperLayer = paperLayer.getItem({data: {id: 'artboardBackground'}});
        }
        if (selectedById[id].type === 'Text') {
          paperLayer = paperLayer.getItem({data: {id: 'textLines'}});
        }
        paperLayer[paperProp] = {
          gradient: paperLayer[paperProp].gradient,
          origin: toBounds.center,
          destination: destinationHandlePosition
        } as Btwx.PaperGradientFill
      });
    }
    if (handle === 'destination') {
      destinationHandle.position = toBounds.center;
      lines.forEach((line: paper.Path) => {
        line.lastSegment.point = toBounds.center;
      });
      selected.forEach((id) => {
        let paperLayer = getPaperLayer(id, selectedProjectIndices[id]);
        if (selectedById[id].type === 'Artboard') {
          paperLayer = paperLayer.getItem({data: {id: 'artboardBackground'}});
        }
        if (selectedById[id].type === 'Text') {
          paperLayer = paperLayer.getItem({data: {id: 'textLines'}});
        }
        paperLayer[paperProp] = {
          gradient: paperLayer[paperProp].gradient,
          origin: originHandlePosition,
          destination: toBounds.center
        } as Btwx.PaperGradientFill
      });
    }
  }

  // handle preview on toBounds update
  useEffect(() => {
    if (toBounds && isEnabled) {
      updateGradients();
    }
  }, [toBounds]);

  // handle tool enable / disable
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

  return (
    isEnabled
    ? <SnapTool
        bounds={snapBounds}
        snapRule={'move'}
        hitTestZones={{all: true}}
        onUpdate={handleSnapToolUpdate}
        toolEvent={dragEvent}
        whiteListLayers={selected} />
    : null
  );
}

export default PaperTool(
  GradientTool,
  {
    mouseDown: true,
    mouseDrag: true,
    mouseUp: true
  }
);