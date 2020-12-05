import React, { useContext, ReactElement, useEffect } from 'react';
import { updateGradientFrame } from '../store/actions/layer';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { uiPaperScope } from '../canvas';
import { ThemeContext } from './ThemeProvider';
import { getGradientOriginPoint, getGradientDestinationPoint } from '../store/selectors/layer';

interface GradientFrameProps {
  zoom?: number;
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
  const { zoom, origin, destination } = props;

  useEffect(() => {
    updateGradientFrame(origin, destination);
    return () => {
      const gradientFrame = uiPaperScope.projects[0].getItem({ data: { id: 'gradientFrame' } });
      gradientFrame.removeChildren();
    }
  }, [origin, destination, zoom]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  zoom: number;
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
  const { documentSettings, layer, gradientEditor } = state;
  const zoom = documentSettings.zoom;
  const selected = layer.present.selected;
  const gradientValue = layer.present.byId[selected[0]].style[gradientEditor.prop].gradient;
  const stopsWithIndex = gradientValue.stops.map((stop, index) => ({
    ...stop,
    index
  }));
  const sortedStops = stopsWithIndex.sort((a,b) => a.position - b.position);
  const originStop = sortedStops[0];
  const destStop = sortedStops[sortedStops.length - 1];
  const originPosition = getGradientOriginPoint(state.layer.present, selected[0], gradientEditor.prop);
  const destinationPosition = getGradientDestinationPoint(state.layer.present, selected[0], gradientEditor.prop);
  const originSelected = originStop.index === gradientValue.activeStopIndex;
  const destinationSelected = destStop.index === gradientValue.activeStopIndex;
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
  return { zoom, origin, destination };
};

export default connect(
  mapStateToProps
)(GradientFrame);