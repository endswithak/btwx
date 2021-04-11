import React, { ReactElement, useEffect } from 'react';
import { updateGradientFrame } from '../store/actions/layer';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { paperMain } from '../canvas';
import { getGradientOriginPoint, getGradientDestinationPoint } from '../store/selectors/layer';

const GradientFrame = (): ReactElement => {
  const zoom = useSelector((state: RootState) => state.documentSettings.zoom);
  const gradientValue = useSelector((state: RootState) => state.layer.present.byId[state.layer.present.selected[0]].style[state.gradientEditor.prop].gradient);
  const stopsWithIndex = gradientValue && gradientValue.stops.map((stop, index) => ({
    ...stop,
    index
  }));
  const sortedStops = stopsWithIndex && stopsWithIndex.sort((a,b) => a.position - b.position);
  const originStop = sortedStops && sortedStops[0];
  const destStop = sortedStops && sortedStops[sortedStops.length - 1];
  const originPosition = useSelector((state: RootState) => getGradientOriginPoint(state.layer.present, state.layer.present.selected[0], state.gradientEditor.prop));
  const destinationPosition = useSelector((state: RootState) => getGradientDestinationPoint(state.layer.present, state.layer.present.selected[0], state.gradientEditor.prop));
  const originSelected = originStop && originStop.index === gradientValue.activeStopIndex;
  const destinationSelected = destStop && destStop.index === gradientValue.activeStopIndex;
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

  useEffect(() => {
    updateGradientFrame(origin, destination);
    return (): void => {
      const gradientFrame = paperMain.projects[0].getItem({ data: { id: 'gradientFrame' } });
      gradientFrame.removeChildren();
    }
  }, [origin, destination, zoom]);

  return null;
}

export default GradientFrame;