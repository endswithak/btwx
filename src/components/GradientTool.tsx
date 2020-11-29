/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, useEffect, ReactElement, useState } from 'react';
import { connect } from 'react-redux';
import { uiPaperScope } from '../canvas';
import { RootState } from '../store/reducers';
import { SetLayersGradientDestinationPayload, SetLayersGradientOriginPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayersGradientOrigin, setLayersGradientDestination } from '../store/actions/layer';
import { setCanvasResizing } from '../store/actions/canvasSettings';
import { CanvasSettingsTypes, SetCanvasResizingPayload } from '../store/actionTypes/canvasSettings';
import { getPaperLayer, getSelectedPaperScopes, getPaperProp } from '../store/selectors/layer';
import { ThemeContext } from './ThemeProvider';
import SnapTool from './SnapTool';
import PaperTool, { PaperToolProps } from './PaperTool';

interface GradientToolStateProps {
  isEnabled?: boolean;
  gradient?: Btwx.Gradient;
  selected?: string[];
  selectedPaperScopes?: {
    [id: string]: number;
  };
  gradientHandle?: Btwx.GradientHandle;
  gradientProp?: 'fill' | 'stroke';
  resizing?: boolean;
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
  const { isEnabled, setLayersGradientOrigin, setLayersGradientDestination, selected, selectedPaperScopes, tool, downEvent, dragEvent, upEvent, gradientHandle, gradientProp, setCanvasResizing, resizing } = props;
  const [originHandlePosition, setOriginHandlePosition] = useState<paper.Point>(null);
  const [destinationHandlePosition, setDestinationHandlePosition] = useState<paper.Point>(null);
  const [snapBounds, setSnapBounds] = useState<paper.Rectangle>(null);
  const [toBounds, setToBounds] = useState<paper.Rectangle>(null);
  const [handle, setHandle] = useState<Btwx.GradientHandle>(null);

  const resetState = () => {
    setOriginHandlePosition(null);
    setDestinationHandlePosition(null);
    setToBounds(null);
    setSnapBounds(null);
    setHandle(null);
  }

  const handleSnapToolUpdate = (snapToolBounds: paper.Rectangle, xSnapPoint: Btwx.SnapPoint, ySnapPoint: Btwx.SnapPoint): void => {
    setToBounds(snapToolBounds);
  }

  useEffect(() => {
    if (downEvent && isEnabled) {
      const originHandle = uiPaperScope.project.getItem({data: { id: 'gradientFrameOriginHandle' }});
      const destinationHandle = uiPaperScope.project.getItem({data: { id: 'gradientFrameDestinationHandle' }});
      setOriginHandlePosition(originHandle.position);
      setDestinationHandlePosition(destinationHandle.position);
      setHandle(gradientHandle);
    }
  }, [downEvent])

  useEffect(() => {
    if (dragEvent && isEnabled) {
      const nextSnapBounds = new uiPaperScope.Rectangle({
        from: new uiPaperScope.Point(dragEvent.point.x - 0.5, dragEvent.point.y - 0.5),
        to: new uiPaperScope.Point(dragEvent.point.x + 0.5, dragEvent.point.y + 0.5)
      });
      setSnapBounds(nextSnapBounds);
      if (!resizing) {
        setCanvasResizing({resizing: true});
      }
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
      if (resizing) {
        setCanvasResizing({resizing: false});
      }
      resetState();
    }
  }, [upEvent]);

  const updateGradients = (): void => {
    const originHandle = uiPaperScope.project.getItem({data: { id: 'gradientFrameOriginHandle' }});
    const destinationHandle = uiPaperScope.project.getItem({data: { id: 'gradientFrameDestinationHandle' }});
    const lines = uiPaperScope.project.getItems({data: { id: 'gradientFrameLine' }});
    const paperProp = getPaperProp(gradientProp);
    if (handle === 'origin') {
      originHandle.position = toBounds.center;
      lines.forEach((line: paper.Path) => {
        line.firstSegment.point = toBounds.center;
      });
      selected.forEach((id) => {
        const paperLayer = getPaperLayer(id, selectedPaperScopes[id]);
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
        const paperLayer = getPaperLayer(id, selectedPaperScopes[id]);
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
  const isEnabled = gradientEditor.isOpen && canvasSettings.activeTool === 'Gradient';
  const selected = layer.present.selected;
  const selectedPaperScopes = getSelectedPaperScopes(state);
  const gradientHandle = canvasSettings.gradientHandle;
  const gradientProp = gradientEditor.prop;
  const resizing = canvasSettings.resizing;
  return {
    isEnabled,
    selected,
    gradientHandle,
    gradientProp,
    selectedPaperScopes,
    resizing
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