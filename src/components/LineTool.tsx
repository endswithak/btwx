/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, ReactElement, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { isBetween } from '../utils';
import { RootState } from '../store/reducers';
import { paperMain } from '../canvas';
import { setCanvasResizing } from '../store/actions/canvasSettings';
import { setLineFromThunk, setLineToThunk, updateSelectionFrame } from '../store/actions/layer';
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
    try {
      if (downEvent && isEnabled) {
        const selectedPaperLayer = getPaperLayer(selected[0], selectedProjectIndices[selected[0]]);
        const fromHandle = paperMain.project.getItem({data: { interactiveType: 'lineFrom' }});
        const toHandle = paperMain.project.getItem({data: { interactiveType: 'lineTo' }});
        setFromHandlePosition(fromHandle.position);
        setToHandlePosition(toHandle.position);
        setHandle(initialHandle as Btwx.LineHandle);
        setOriginalPaperSelection(selectedPaperLayer.children[0] as paper.Path);
        updateSelectionFrame({
          bounds: selectedPaperLayer.bounds,
          handle: initialHandle,
          lineHandles: {
            from: fromHandle.position,
            to: toHandle.position
          }
        });
      }
    } catch(err) {
      console.error(`Line Tool Error -- On Mouse Down -- ${err}`);
      resetState();
    }
  }, [downEvent])

  useEffect(() => {
    try {
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
        // const nextIsHorizontal = (isBetween(nextVector.angle, 0, 45) || isBetween(nextVector.angle, -45, 0) || isBetween(nextVector.angle, 135, 180) || isBetween(nextVector.angle, -180, -135));
        // const nextIsVertical = (isBetween(nextVector.angle, -90, -45) || isBetween(nextVector.angle, -135, -90) || isBetween(nextVector.angle, 45, 90) || isBetween(nextVector.angle, 90, 135));
        const isHorizontal = isBetween(Math.abs(nextVector.angle), 0, 45) || isBetween(Math.abs(nextVector.angle), 135, 180);
        const nextSnapBounds = new paperMain.Rectangle({
          from: new paperMain.Point(dragEvent.point.x - 0.5, dragEvent.point.y - 0.5),
          to: new paperMain.Point(dragEvent.point.x + 0.5, dragEvent.point.y + 0.5)
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
        setIsHorizontal(isHorizontal);
        setIsVertical(!isHorizontal);
      }
    } catch(err) {
      console.error(`Line Tool Error -- On Mouse Drag -- ${err}`);
      resetState();
    }
  }, [dragEvent]);

  useEffect(() => {
    try {
      if (downEvent && upEvent && isEnabled && resizing) {
        switch(handle) {
          case 'lineFrom': {
            dispatch(setLineFromThunk({
              id: selected[0],
              x: toBounds.center.x,
              y: toBounds.center.y
            }));
            break;
          }
          case 'lineTo': {
            dispatch(setLineToThunk({
              id: selected[0],
              x: toBounds.center.x,
              y: toBounds.center.y
            }));
            break;
          }
        }
        if (resizing) {
          dispatch(setCanvasResizing({resizing: false}));
        }
      }
    } catch(err) {
      console.error(`Line Tool Error -- On Mouse Up -- ${err}`);
      resetState();
    }
  }, [upEvent]);

  useEffect(() => {
    try {
      if (keyDownEvent && isEnabled && resizing) {
        if (keyDownEvent.key === 'shift') {
          const nextSnapBounds = new paperMain.Rectangle({
            from: new paperMain.Point(dragEvent.point.x - 0.5, dragEvent.point.y - 0.5),
            to: new paperMain.Point(dragEvent.point.x + 0.5, dragEvent.point.y + 0.5)
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
    } catch(err) {
      console.error(`Line Tool Error -- On Key Down -- ${err}`);
      resetState();
    }
  }, [keyDownEvent]);

  useEffect(() => {
    try {
      if (keyUpEvent && isEnabled && resizing) {
        if (keyUpEvent.key === 'shift') {
          const nextSnapBounds = new paperMain.Rectangle({
            from: new paperMain.Point(dragEvent.point.x - 0.5, dragEvent.point.y - 0.5),
            to: new paperMain.Point(dragEvent.point.x + 0.5, dragEvent.point.y + 0.5)
          });
          setSnapBounds(nextSnapBounds);
          setShiftModifier(false);
        }
      }
    } catch(err) {
      console.error(`Line Tool Error -- On Key Up -- ${err}`);
      resetState();
    }
  }, [keyUpEvent]);

  useEffect(() => {
    if (toBounds && isEnabled) {
      const nextPosition = new paperMain.Point(toBounds.center.x, toBounds.center.y);
      const selectedPaperLayer = getPaperLayer(selected[0], selectedProjectIndices[selected[0]]);
      let lineHandles: { from: any; to: any };
      switch(handle) {
        case 'lineTo': {
          lineHandles = { from: fromHandlePosition, to: nextPosition };
          originalPaperSelection.lastSegment.point = nextPosition;
          break;
        }
        case 'lineFrom': {
          lineHandles = { from: nextPosition, to: toHandlePosition };
          originalPaperSelection.firstSegment.point = nextPosition;
          break;
        }
      }
      updateSelectionFrame({
        bounds: selectedPaperLayer.bounds,
        handle: initialHandle,
        lineHandles
      });
    }
  }, [toBounds]);

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