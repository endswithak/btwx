/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, ReactElement, useState } from 'react';
import { connect } from 'react-redux';
import { isBetween } from '../utils';
import { RootState } from '../store/reducers';
import { uiPaperScope } from '../canvas';
import { setCanvasResizing } from '../store/actions/canvasSettings';
import { CanvasSettingsTypes, SetCanvasResizingPayload } from '../store/actionTypes/canvasSettings';
import { setLineFrom, setLineTo, updateSelectionFrame } from '../store/actions/layer';
import { SetLineFromPayload, SetLineToPayload, LayerTypes } from '../store/actionTypes/layer';
import { getPaperLayer, getSelectedPaperScopes } from '../store/selectors/layer';
import SnapTool from './SnapTool';
import PaperTool, { PaperToolProps } from './PaperTool';

interface LineToolStateProps {
  isEnabled?: boolean;
  resizing?: boolean;
  initialHandle?: Btwx.LineHandle;
  selected?: string[];
  selectedPaperScopes?: {
    [id: string]: number;
  };
}

interface LineToolDispatchProps {
  setLineFrom?(payload: SetLineFromPayload): LayerTypes;
  setLineTo?(payload: SetLineToPayload): LayerTypes;
  setCanvasResizing?(payload: SetCanvasResizingPayload): CanvasSettingsTypes;
}

type LineToolProps = (
  LineToolStateProps &
  LineToolDispatchProps &
  PaperToolProps
);

const LineTool = (props: LineToolProps): ReactElement => {
  const { isEnabled, resizing, initialHandle, setLineFrom, setLineTo, tool, keyDownEvent, keyUpEvent, moveEvent, downEvent, dragEvent, upEvent, setCanvasResizing, selected, selectedPaperScopes } = props;
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

  const resetState = () => {
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
      const selectedPaperLayer = getPaperLayer(selected[0], selectedPaperScopes[selected[0]]);
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
    if (dragEvent && isEnabled) {
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
        setCanvasResizing({resizing: true});
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
    if (upEvent && isEnabled && resizing) {
      const newX = (upEvent.point.x - originalPaperSelection.position.x) / vector.length;
      const newY = (upEvent.point.y - originalPaperSelection.position.y) / vector.length;
      switch(handle) {
        case 'lineFrom': {
          setLineFrom({id: selected[0], x: newX, y: newY});
          break;
        }
        case 'lineTo': {
          setLineTo({id: selected[0], x: newX, y: newY});
          break;
        }
      }
      if (resizing) {
        setCanvasResizing({resizing: false});
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
      const selectedPaperLayer = getPaperLayer(selected[0], selectedPaperScopes[selected[0]]);
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

const mapStateToProps = (state: RootState): LineToolStateProps => {
  const { layer, canvasSettings } = state;
  const isEnabled = canvasSettings.activeTool === 'Line';
  const resizing = canvasSettings.resizing;
  const initialHandle = canvasSettings.lineHandle;
  const selected = layer.present.selected;
  const selectedPaperScopes = getSelectedPaperScopes(state);
  return {
    isEnabled,
    resizing,
    initialHandle,
    selected,
    selectedPaperScopes
  };
};

const mapDispatchToProps = {
  setLineFrom,
  setLineTo,
  setCanvasResizing
};

export default PaperTool(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(LineTool),
  {
    all: true
  }
);