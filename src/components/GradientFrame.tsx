import React, { useContext, ReactElement, useEffect } from 'react';
import { updateGradientFrame } from '../store/actions/layer';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { uiPaperScope } from '../canvas';
import { ThemeContext } from './ThemeProvider';
import { getGradientOriginPoint, getGradientDestinationPoint } from '../store/selectors/layer';

interface GradientFrameProps {
  layer: string;
  gradient: Btwx.Gradient;
  prop: 'stroke' | 'fill';
  onStopPress(index: number): void;
  zoom?: number;
  layerItem?: Btwx.Layer;
  origin?: {
    position: paper.Point;
    color: Btwx.Color;
    selected: boolean;
    index: number;
  };
  destination?: {
    position: paper.Point;
    color: Btwx.Color;
    selected: boolean;
    index: number;
  };
}

const GradientFrame = (props: GradientFrameProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { layer, gradient, onStopPress, zoom, layerItem, origin, destination } = props;

  const handleWheel = (e: WheelEvent): void => {
    if (e.ctrlKey) {
      const gradientFrame = uiPaperScope.project.getItem({ data: { id: 'gradientFrame' } });
      gradientFrame.removeChildren();
    }
  }

  useEffect(() => {
    updateGradientFrame(origin, destination);
    document.getElementById('canvas-container').addEventListener('wheel', handleWheel);
    return () => {
      const gradientFrame = uiPaperScope.project.getItem({ data: { id: 'gradientFrame' } });
      gradientFrame.removeChildren();
      document.getElementById('canvas-container').removeEventListener('wheel', handleWheel);
    }
  }, [gradient, layer, zoom]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState, ownProps: GradientFrameProps): {
  zoom: number;
  layerItem: Btwx.Layer;
  origin: {
    position: paper.Point;
    color: Btwx.Color;
    selected: boolean;
  };
  destination: {
    position: paper.Point;
    color: Btwx.Color;
    selected: boolean;
  };
} => {
  const { documentSettings, layer } = state;
  const zoom = documentSettings.matrix[0];
  const layerItem = layer.present.byId[ownProps.layer];
  const stopsWithIndex = ownProps.gradient.stops.map((stop, index) => {
    return {
      ...stop,
      index
    }
  });
  const sortedStops = stopsWithIndex.sort((a,b) => { return a.position - b.position });
  const originStop = sortedStops[0];
  const destStop = sortedStops[sortedStops.length - 1];
  const originPosition = getGradientOriginPoint(state.layer.present, ownProps.layer, ownProps.prop);
  const destinationPosition = getGradientDestinationPoint(state.layer.present, ownProps.layer, ownProps.prop);
  const originSelected = originStop.index === ownProps.gradient.activeStopIndex;
  const destinationSelected = destStop.index === ownProps.gradient.activeStopIndex;
  const origin = {
    position: originPosition,
    color: originStop.color,
    selected: originSelected,
    index: originStop.index
  }
  const destination = {
    position: destinationPosition,
    color: destStop.color,
    selected: destinationSelected,
    index: destStop.index
  }
  return { zoom, layerItem, origin, destination };
};

export default connect(
  mapStateToProps
)(GradientFrame);