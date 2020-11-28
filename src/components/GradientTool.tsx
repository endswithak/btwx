/* eslint-disable @typescript-eslint/no-use-before-define */
// import { remote } from 'electron';
import React, { useContext, useEffect, ReactElement, useState } from 'react';
import { connect } from 'react-redux';
import { uiPaperScope } from '../canvas';
import { RootState } from '../store/reducers';
import Tooltip from '../canvas/tooltip';
import { SetLayersGradientDestinationPayload, SetLayersGradientOriginPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayersGradientOrigin, setLayersGradientDestination, updateGradientFrame } from '../store/actions/layer';
import { setCanvasResizing } from '../store/actions/canvasSettings';
import { CanvasSettingsTypes, SetCanvasResizingPayload } from '../store/actionTypes/canvasSettings';
import { getPaperLayer, getGradientOriginPoint, getGradientDestinationPoint } from '../store/selectors/layer';
import { ThemeContext } from './ThemeProvider';
import SnapTool from './SnapTool';
import PaperTool, { PaperToolProps } from './PaperTool';

interface GradientToolStateProps {
  isEnabled?: boolean;
  gradient?: Btwx.Gradient;
  selected?: string[];
  gradientHandle?: Btwx.GradientHandle;
  gradientProp?: any;
}

interface GradientToolDispatchProps {
  setLayersGradientOrigin?(payload: SetLayersGradientOriginPayload): LayerTypes;
  setLayersGradientDestination?(payload: SetLayersGradientDestinationPayload): LayerTypes;
  setCanvasResizing?(payload: SetCanvasResizingPayload): CanvasSettingsTypes;
}

type GradientToolProps = (
  GradientToolStateProps &
  GradientToolDispatchProps &
  PaperToolProps
);

const GradientTool = (props: GradientToolProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { isEnabled, setLayersGradientOrigin, setLayersGradientDestination, selected, tool, keyDownEvent, keyUpEvent, moveEvent, downEvent, dragEvent, upEvent, gradientHandle, gradientProp, setCanvasResizing } = props;
  const [originHandlePosition, setOriginHandlePosition] = useState<paper.Point>(null);
  const [destinationHandlePosition, setDestinationHandlePosition] = useState<paper.Point>(null);
  const [originHandleColor, setOriginHandleColor] = useState<paper.Point>(null);
  const [destinationHandleColor, setDestinationHandleColor] = useState<paper.Point>(null);
  const [snapBounds, setSnapBounds] = useState<paper.Rectangle>(null);
  const [toBounds, setToBounds] = useState<paper.Rectangle>(null);
  const [handle, setHandle] = useState<Btwx.GradientHandle>(gradientHandle);

  const resetState = () => {
    setOriginHandlePosition(null);
    setDestinationHandlePosition(null);
    setToBounds(null);
    setSnapBounds(null);
    setOriginHandleColor(null);
    setDestinationHandleColor(null);
  }

  const handleSnapToolUpdate = (snapToolBounds: paper.Rectangle, xSnapPoint: Btwx.SnapPoint, ySnapPoint: Btwx.SnapPoint): void => {
    setToBounds(snapToolBounds);
  }

  useEffect(() => {
    if (downEvent && isEnabled) {
      const originHandle = uiPaperScope.project.getItem({data: { interactiveType: 'origin' }});
      const destinationHandle = uiPaperScope.project.getItem({data: { interactiveType: 'destination' }});
      setOriginHandlePosition(originHandle.position);
      setDestinationHandlePosition(destinationHandle.position);
      setCanvasResizing({resizing: true});
    }
  }, [downEvent])

  useEffect(() => {
    if (dragEvent && isEnabled) {
      const nextSnapBounds = new uiPaperScope.Rectangle({
        from: new uiPaperScope.Point(dragEvent.point.x - 0.5, dragEvent.point.y - 0.5),
        to: new uiPaperScope.Point(dragEvent.point.x + 0.5, dragEvent.point.y + 0.5)
      });
      setSnapBounds(nextSnapBounds);
    }
  }, [dragEvent]);

  useEffect(() => {
    if (upEvent && isEnabled && toBounds) {
      switch(handle) {
        case 'origin': {
          setLayersGradientOrigin({layers: selected, origin: {x: toBounds.center.x, y: toBounds.center.y}, prop: gradientProp});
          break;
        }
        case 'destination': {
          setLayersGradientDestination({layers: selected, destination: {x: toBounds.center.x, y: toBounds.center.y}, prop: gradientProp});
          break;
        }
      }
      setCanvasResizing({resizing: false});
      resetState();
    }
  }, [upEvent]);

  const updateGradients = () => {

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
      if (tool && uiPaperScope.tool && (uiPaperScope.tool as any)._index === (tool as any)._index) {
        uiPaperScope.tool = null;
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

const mapStateToProps = (state: RootState): GradientToolStateProps => {
  const { gradientEditor, layer, canvasSettings } = state;
  const isEnabled = gradientEditor.isOpen;
  const selected = layer.present.selected;
  const gradientHandle = canvasSettings.gradientHandle;
  const gradientProp = gradientEditor.prop;
  return {
    isEnabled,
    selected,
    gradientHandle,
    gradientProp
  };
};

const mapDispatchToProps = {
  setLayersGradientOrigin,
  setLayersGradientDestination,
  setCanvasResizing
};

export default PaperTool(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(GradientTool),
  {
    all: true
  }
);