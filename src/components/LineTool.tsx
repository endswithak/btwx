/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, ReactElement, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { isBetween } from '../utils';
import { RootState } from '../store/reducers';
import { uiPaperScope } from '../canvas';
import { setCanvasResizing } from '../store/actions/canvasSettings';
import { setLineFrom, setLineTo, updateSelectionFrame } from '../store/actions/layer';
import { getPaperLayer, getSelectedProjectIndices } from '../store/selectors/layer';
import SnapTool from './SnapTool';
import PaperTool, { PaperToolProps } from './PaperTool';

const LineTool = (props: PaperToolProps): ReactElement => {
  const { tool, keyDownEvent, keyUpEvent, downEvent, dragEvent, upEvent } = props;
  const isEnabled = useSelector((state: RootState) => state.canvasSettings.activeTool === 'Line');
  const resizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const initialHandle = useSelector((state: RootState) => state.canvasSettings.lineHandle);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const selectedProjectIndices = useSelector((state: RootState) => getSelectedProjectIndices(state));
  const [handle, setHandle] = useState<Btwx.LineHandle>(null);
  const [fromHandlePosition, setFromHandlePosition] = useState<paper.Point>(null);
  const [toHandlePosition, setToHandlePosition] = useState<paper.Point>(null);
  const [vector, setVector] = useState<paper.Point>(null);
  const [shiftModifier, setShiftModifier] = useState<boolean>(false);
  const [snapBounds, setSnapBounds] = useState<paper.Rectangle>(null);
  const [toBounds, setToBounds] = useState<paper.Rectangle>(null);
  const [isHorizontal, setIsHorizontal] = useState<boolean>(false);
  const [isVertical, setIsVertical] = useState<boolean>(false);
  const [originalPaperSelection, setOriginalPaperSelection] = useState<paper.Path>(null);
  const dispatch = useDispatch();

  const resetState = (): void => {
    setHandle(null);
    setVector(null);
    setToBounds(null);
    setShiftModifier(false);
    setSnapBounds(null);
    setFromHandlePosition(null);
    setToHandlePosition(null);
    setIsHorizontal(false);
    setIsVertical(false);
    setOriginalPaperSelection(null);
  }

  const handleSnapToolUpdate = (snapToolBounds: paper.Rectangle, xSnapPoint: Btwx.SnapPoint, ySnapPoint: Btwx.SnapPoint): void => {
    setToBounds(snapToolBounds);
  }

  useEffect(() => {
    if (downEvent && isEnabled) {
      const selectedPaperLayer = getPaperLayer(selected[0], selectedProjectIndices[selected[0]]);
      const fromHandle = uiPaperScope.project.getItem({data: { interactiveType: 'lineFrom' }});
      const toHandle = uiPaperScope.project.getItem({data: { interactiveType: 'lineTo' }});
      setFromHandlePosition(fromHandle.position);
      setToHandlePosition(toHandle.position);
      setHandle(initialHandle as Btwx.LineHandle);
      setOriginalPaperSelection(selectedPaperLayer.children[0] as paper.Path);
      updateSelectionFrame(selectedPaperLayer.bounds, initialHandle, selectedPaperLayer);
    }
  }, [downEvent])

  useEffect(() => {
    if (downEvent && dragEvent && isEnabled) {
      let nextVector: paper.Point;
      switch(handle) {
        case 'lineFrom': {
          const toPoint = toHandlePosition;
          nextVector = toPoint.subtract(dragEvent.point);
          break;
        }
        case 'lineTo': {
          const fromPoint = fromHandlePosition;
          nextVector = fromPoint.subtract(dragEvent.point);
          break;
        }
      }
      const nextIsHorizontal = (isBetween(nextVector.angle, 0, 45) || isBetween(nextVector.angle, -45, 0) || isBetween(nextVector.angle, 135, 180) || isBetween(nextVector.angle, -180, -135));
      const nextIsVertical = (isBetween(nextVector.angle, -90, -45) || isBetween(nextVector.angle, -135, -90) || isBetween(nextVector.angle, 45, 90) || isBetween(nextVector.angle, 90, 135));
      const nextSnapBounds = new uiPaperScope.Rectangle({
        from: new uiPaperScope.Point(dragEvent.point.x - 0.5, dragEvent.point.y - 0.5),
        to: new uiPaperScope.Point(dragEvent.point.x + 0.5, dragEvent.point.y + 0.5)
      });
      if (!resizing) {
        dispatch(setCanvasResizing({resizing: true}));
      }
      if (dragEvent.modifiers.shift) {
        if (isHorizontal) {
          switch(handle) {
            case 'lineTo':
              nextSnapBounds.center.y = fromHandlePosition.y;
              break;
            case 'lineFrom':
              nextSnapBounds.center.y = toHandlePosition.y;
              break;
          }
        }
        if (isVertical) {
          switch(handle) {
            case 'lineTo':
              nextSnapBounds.center.x = fromHandlePosition.x;
              break;
            case 'lineFrom':
              nextSnapBounds.center.x = toHandlePosition.x;
              break;
          }
        }
        setShiftModifier(true);
      } else {
        setShiftModifier(false);
      }
      setSnapBounds(nextSnapBounds);
      setVector(nextVector);
      setIsHorizontal(nextIsHorizontal);
      setIsVertical(nextIsVertical);
    }
  }, [dragEvent]);

  useEffect(() => {
    if (downEvent && upEvent && isEnabled && resizing) {
      const newX = (upEvent.point.x - originalPaperSelection.position.x) / vector.length;
      const newY = (upEvent.point.y - originalPaperSelection.position.y) / vector.length;
      switch(handle) {
        case 'lineFrom': {
          dispatch(setLineFrom({id: selected[0], x: newX, y: newY}));
          break;
        }
        case 'lineTo': {
          dispatch(setLineTo({id: selected[0], x: newX, y: newY}));
          break;
        }
      }
      if (resizing) {
        dispatch(setCanvasResizing({resizing: false}));
      }
    }
  }, [upEvent]);

  useEffect(() => {
    if (keyDownEvent && isEnabled && resizing) {
      if (keyDownEvent.key === 'shift') {
        const nextSnapBounds = new uiPaperScope.Rectangle({
          from: new uiPaperScope.Point(dragEvent.point.x - 0.5, dragEvent.point.y - 0.5),
          to: new uiPaperScope.Point(dragEvent.point.x + 0.5, dragEvent.point.y + 0.5)
        });
        if (isHorizontal) {
          switch(handle) {
            case 'lineTo':
              nextSnapBounds.center.y = fromHandlePosition.y;
              break;
            case 'lineFrom':
              nextSnapBounds.center.y = toHandlePosition.y;
              break;
          }
        }
        if (isVertical) {
          switch(handle) {
            case 'lineTo':
              nextSnapBounds.center.x = fromHandlePosition.x;
              break;
            case 'lineFrom':
              nextSnapBounds.center.x = toHandlePosition.x;
              break;
          }
        }
        setSnapBounds(nextSnapBounds);
        setShiftModifier(true);
      }
    }
  }, [keyDownEvent]);

  useEffect(() => {
    if (keyUpEvent && isEnabled && resizing) {
      if (keyUpEvent.key === 'shift') {
        const nextSnapBounds = new uiPaperScope.Rectangle({
          from: new uiPaperScope.Point(dragEvent.point.x - 0.5, dragEvent.point.y - 0.5),
          to: new uiPaperScope.Point(dragEvent.point.x + 0.5, dragEvent.point.y + 0.5)
        });
        setSnapBounds(nextSnapBounds);
        setShiftModifier(false);
      }
    }
  }, [keyUpEvent]);

  useEffect(() => {
    if (toBounds && isEnabled) {
      const nextPosition = new uiPaperScope.Point(toBounds.center.x, toBounds.center.y);
      const selectedPaperLayer = getPaperLayer(selected[0], selectedProjectIndices[selected[0]]);
      switch(handle) {
        case 'lineTo': {
          originalPaperSelection.lastSegment.point = nextPosition;
          break;
        }
        case 'lineFrom': {
          originalPaperSelection.firstSegment.point = nextPosition;
          break;
        }
      }
      updateSelectionFrame(selectedPaperLayer.bounds, initialHandle, selectedPaperLayer);
    }
  }, [toBounds]);

  useEffect(() => {
    if (isEnabled) {
      if (tool) {
        tool.activate();
      }
    } else {
      if (tool && uiPaperScope.tool && (uiPaperScope.tool as any)._index === (tool as any)._index) {
        uiPaperScope.tool = null;
        resetState();
      }
    }
  }, [isEnabled]);

  return (
    isEnabled && resizing
    ? <SnapTool
        bounds={snapBounds}
        snapRule={'move'}
        hitTestZones={{center: true, middle: true}}
        onUpdate={handleSnapToolUpdate}
        preserveAspectRatio={shiftModifier}
        toolEvent={dragEvent}
        blackListLayers={selected} />
    : null
  );
}

export default PaperTool(
  LineTool,
  { all: true }
);