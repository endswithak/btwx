/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, ReactElement, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { isBetween, getPathItemSegments, paperSegToRawSeg } from '../utils';
import { RootState } from '../store/reducers';
import { paperMain } from '../canvas';
import { setCanvasResizing } from '../store/actions/canvasSettings';
import { setVectorEditTool } from '../store/actions/vectorEditTool';
import { getPaperLayer, getSelectedProjectIndices } from '../store/selectors/layer';
import SnapTool from './SnapTool';
import PaperTool, { PaperToolProps } from './PaperTool';
import { updateSelectionFrame } from './SelectionFrame';

const VectorEditTool = (props: PaperToolProps): ReactElement => {
  const { tool, keyDownEvent, keyUpEvent, downEvent, dragEvent, upEvent } = props;
  const isEnabled = useSelector((state: RootState) => state.vectorEditTool.isEnabled);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const resizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const vectorEditToolLayerId = useSelector((state: RootState) => state.vectorEditTool.layerId);
  const vectorEditToolSegments = useSelector((state: RootState) => state.vectorEditTool.segments);
  const vectorEditToolSegmentHover = useSelector((state: RootState) => state.vectorEditTool.segmentHover);
  const vectorEditToolSegmentHoverIndex = useSelector((state: RootState) => state.vectorEditTool.segmentHoverIndex);
  const vectorEditToolSegmentHoverType = useSelector((state: RootState) => state.vectorEditTool.segmentHoverType);
  const selectedProjectIndices = useSelector((state: RootState) => getSelectedProjectIndices(state));
  const [paperSegment, setPaperSegment] = useState<paper.Segment>(null);
  const [segmentHandle, setSegmentHandle] = useState(null);
  const [segmentIndex, setSegmentIndex] = useState(null);
  const [segments, setSegments] = useState(null);
  // const [fromHandlePosition, setFromHandlePosition] = useState<paper.Point>(null);
  // const [toHandlePosition, setToHandlePosition] = useState<paper.Point>(null);
  // const [vector, setVector] = useState<paper.Point>(null);
  // const [shiftModifier, setShiftModifier] = useState<boolean>(false);
  // const [snapBounds, setSnapBounds] = useState<paper.Rectangle>(null);
  // const [toBounds, setToBounds] = useState<paper.Rectangle>(null);
  // const [isHorizontal, setIsHorizontal] = useState<boolean>(false);
  // const [isVertical, setIsVertical] = useState<boolean>(false);
  // const [originalPaperSelection, setOriginalPaperSelection] = useState<paper.Path>(null);
  const dispatch = useDispatch();

  const resetState = (): void => {
    setPaperSegment(null);
    setSegmentHandle(null);
    setSegmentIndex(null);
    setSegments(null);
    // setHandle(null);
    // setVector(null);
    // setToBounds(null);
    // setShiftModifier(false);
    // setSnapBounds(null);
    // setFromHandlePosition(null);
    // setToHandlePosition(null);
    // setIsHorizontal(false);
    // setIsVertical(false);
    // setOriginalPaperSelection(null);
  }

  // const handleSnapToolUpdate = (snapToolBounds: paper.Rectangle, xSnapPoint: Btwx.SnapPoint, ySnapPoint: Btwx.SnapPoint): void => {
  //   setToBounds(snapToolBounds);
  // }

  useEffect(() => {
    try {
      if (downEvent && isEnabled) {
        const selectedPaperLayer = getPaperLayer(selected[0], selectedProjectIndices[selected[0]]);
        setPaperSegment(getPathItemSegments(selectedPaperLayer as paper.PathItem)[vectorEditToolSegmentHoverIndex]);
        setSegmentHandle(vectorEditToolSegmentHoverType);
        setSegmentIndex(vectorEditToolSegmentHoverIndex);
        setSegments(vectorEditToolSegments);
      }
    } catch(err) {
      console.error(`Line Tool Error -- On Mouse Down -- ${err}`);
      resetState();
    }
  }, [downEvent])

  useEffect(() => {
    try {
      if (downEvent && dragEvent && isEnabled) {
        if (!resizing) {
          dispatch(setCanvasResizing({resizing: true}));
        }
        switch(segmentHandle) {
          case 'segmentHandleIn':
            paperSegment.handleIn = dragEvent.point.subtract(paperSegment.point);
            break;
          case 'segmentHandleOut':
            paperSegment.handleOut = dragEvent.point.subtract(paperSegment.point);
            break;
          case 'segmentPoint':
            paperSegment.point = dragEvent.point;
            break;
        }
        const nextSelectedSegment = paperSegToRawSeg(paperSegment);
        dispatch(setVectorEditTool({
          segments: segments.map((current, index) => {
            if (index === segmentIndex) {
              return nextSelectedSegment;
            } else {
              return current;
            }
          }),
          selectedSegment: nextSelectedSegment,
          selectedSegmentIndex: segmentIndex,
          selectedSegmentType: segmentHandle,
          segmentHover: nextSelectedSegment,
          segmentHoverIndex: segmentIndex,
          segmentHoverType: segmentHandle,
        }));
      }
    } catch(err) {
      console.error(`Line Tool Error -- On Mouse Drag -- ${err}`);
      resetState();
    }
  }, [dragEvent]);

  useEffect(() => {
    try {
      if (downEvent && upEvent && isEnabled && resizing) {
        if (resizing) {
          dispatch(setCanvasResizing({resizing: false}));
        }
        resetState();
      }
    } catch(err) {
      console.error(`Line Tool Error -- On Mouse Up -- ${err}`);
      resetState();
    }
  }, [upEvent]);

  // useEffect(() => {
  //   try {
  //     if (keyDownEvent && isEnabled && resizing) {
  //       if (keyDownEvent.key === 'shift') {
  //         const nextSnapBounds = new paperMain.Rectangle({
  //           from: new paperMain.Point(dragEvent.point.x - 0.5, dragEvent.point.y - 0.5),
  //           to: new paperMain.Point(dragEvent.point.x + 0.5, dragEvent.point.y + 0.5)
  //         });
  //         if (isHorizontal) {
  //           switch(handle) {
  //             case 'lineTo':
  //               nextSnapBounds.center.y = fromHandlePosition.y;
  //               break;
  //             case 'lineFrom':
  //               nextSnapBounds.center.y = toHandlePosition.y;
  //               break;
  //           }
  //         }
  //         if (isVertical) {
  //           switch(handle) {
  //             case 'lineTo':
  //               nextSnapBounds.center.x = fromHandlePosition.x;
  //               break;
  //             case 'lineFrom':
  //               nextSnapBounds.center.x = toHandlePosition.x;
  //               break;
  //           }
  //         }
  //         setSnapBounds(nextSnapBounds);
  //         setShiftModifier(true);
  //       }
  //     }
  //   } catch(err) {
  //     console.error(`Line Tool Error -- On Key Down -- ${err}`);
  //     resetState();
  //   }
  // }, [keyDownEvent]);

  // useEffect(() => {
  //   try {
  //     if (keyUpEvent && isEnabled && resizing) {
  //       if (keyUpEvent.key === 'shift') {
  //         const nextSnapBounds = new paperMain.Rectangle({
  //           from: new paperMain.Point(dragEvent.point.x - 0.5, dragEvent.point.y - 0.5),
  //           to: new paperMain.Point(dragEvent.point.x + 0.5, dragEvent.point.y + 0.5)
  //         });
  //         setSnapBounds(nextSnapBounds);
  //         setShiftModifier(false);
  //       }
  //     }
  //   } catch(err) {
  //     console.error(`Line Tool Error -- On Key Up -- ${err}`);
  //     resetState();
  //   }
  // }, [keyUpEvent]);

  // useEffect(() => {
  //   if (toBounds && isEnabled) {
  //     const nextPosition = new paperMain.Point(toBounds.center.x, toBounds.center.y);
  //     const selectedPaperLayer = getPaperLayer(selected[0], selectedProjectIndices[selected[0]]);
  //     let lineHandles: { from: any; to: any };
  //     switch(handle) {
  //       case 'lineTo': {
  //         lineHandles = { from: fromHandlePosition, to: nextPosition };
  //         originalPaperSelection.lastSegment.point = nextPosition;
  //         break;
  //       }
  //       case 'lineFrom': {
  //         lineHandles = { from: nextPosition, to: toHandlePosition };
  //         originalPaperSelection.firstSegment.point = nextPosition;
  //         break;
  //       }
  //     }
  //     updateSelectionFrame({
  //       bounds: selectedPaperLayer.bounds,
  //       handle: initialHandle,
  //       lineHandles
  //     });
  //   }
  // }, [toBounds]);

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

  // return (
  //   isEnabled && resizing
  //   ? <SnapTool
  //       bounds={snapBounds}
  //       snapRule={'move'}
  //       hitTestZones={{center: true, middle: true}}
  //       onUpdate={handleSnapToolUpdate}
  //       preserveAspectRatio={shiftModifier}
  //       toolEvent={dragEvent}
  //       blackListLayers={selected} />
  //   : null
  // );
}

export default PaperTool(
  VectorEditTool,
  { all: true }
);