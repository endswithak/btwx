import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { getGradientOriginPoint, getGradientDestinationPoint } from '../store/selectors/layer';
import { paperMain } from '../canvas';
import { ThemeContext } from './ThemeProvider';

interface GradientFrameProps {
  layer: string;
  gradient: em.Gradient;
  onStopPress(id: string): void;
}

const GradientFrame = (props: GradientFrameProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { layer, gradient, onStopPress } = props;

  useEffect(() => {
    const sortedStops = [...Object.keys(gradient.stops.byId)].sort((a,b) => { return gradient.stops.byId[a].position - gradient.stops.byId[b].position });
    const originStop = gradient.stops.byId[sortedStops[0]];
    const destStop = gradient.stops.byId[sortedStops[sortedStops.length - 1]];
    const oldGradientFrame = paperMain.project.getItem({ data: { id: 'gradientFrame' } });
    if (oldGradientFrame) {
      oldGradientFrame.remove();
    }
    const gradientFrameHandleBgProps = {
      radius: (theme.unit * 2) / paperMain.view.zoom,
      fillColor: '#fff',
      shadowColor: new paperMain.Color(0, 0, 0, 0.5),
      shadowBlur: theme.unit / 2,
      insert: false,
      strokeWidth: 1 / paperMain.view.zoom
    }
    const gradientFrameHandleSwatchProps = {
      radius: (theme.unit + 2) / paperMain.view.zoom,
      fillColor: '#fff',
      insert: false
    }
    const gradientFrameLineProps = {
      from: getGradientOriginPoint(layer, gradient.origin),
      to: getGradientDestinationPoint(layer, gradient.destination),
      insert: false
    }
    const gradientFrameOriginHandleBg  = new paperMain.Shape.Circle({
      ...gradientFrameHandleBgProps,
      center: getGradientOriginPoint(layer, gradient.origin),
      data: {
        id: 'gradientFrameHandle',
        handle: 'origin',
        type: 'background'
      },
      strokeColor: originStop.active ? theme.palette.primary : null
    });
    const gradientFrameOriginHandleSwatch  = new paperMain.Shape.Circle({
      ...gradientFrameHandleSwatchProps,
      fillColor: { hue: originStop.color.h, saturation: originStop.color.s, lightness: originStop.color.l, alpha: originStop.color.a },
      center: getGradientOriginPoint(layer, gradient.origin),
      data: {
        id: 'gradientFrameHandle',
        handle: 'origin',
        type: 'swatch'
      }
    });
    const gradientFrameDestinationHandleBg = new paperMain.Shape.Circle({
      ...gradientFrameHandleBgProps,
      center: getGradientDestinationPoint(layer, gradient.destination),
      data: {
        id: 'gradientFrameHandle',
        handle: 'destination',
        type: 'background'
      },
      strokeColor: destStop.active ? theme.palette.primary : null
    });
    const gradientFrameDestinationHandleSwatch = new paperMain.Shape.Circle({
      ...gradientFrameHandleSwatchProps,
      fillColor: { hue: destStop.color.h, saturation: destStop.color.s, lightness: destStop.color.l, alpha: destStop.color.a },
      center: getGradientDestinationPoint(layer, gradient.destination),
      data: {
        id: 'gradientFrameHandle',
        handle: 'destination',
        type: 'swatch'
      }
    });
    const gradientFrameLineDark = new paperMain.Path.Line({
      ...gradientFrameLineProps,
      strokeColor: new paperMain.Color(0, 0, 0, 0.25),
      strokeWidth: 3 / paperMain.view.zoom,
      data: {
        id: 'gradientFrameLine',
        line: 'dark'
      }
    });
    const gradientFrameLineLight = new paperMain.Path.Line({
      ...gradientFrameLineProps,
      strokeColor: '#fff',
      strokeWidth: 1 / paperMain.view.zoom,
      data: {
        id: 'gradientFrameLine',
        line: 'light'
      }
    });
    const gradientFrameOriginHandle = new paperMain.Group({
      data: {
        id: 'gradientFrameOriginHandle'
      },
      insert: false,
      children: [gradientFrameOriginHandleBg, gradientFrameOriginHandleSwatch],
      onMouseDown: () => {
        if (!originStop.active) {
          onStopPress(sortedStops[0]);
        }
      }
    });
    const gradientFrameDestinationHandle = new paperMain.Group({
      data: {
        id: 'gradientFrameDestinationHandle'
      },
      insert: false,
      children: [gradientFrameDestinationHandleBg, gradientFrameDestinationHandleSwatch],
      onMouseDown: () => {
        if (!destStop.active) {
          onStopPress(sortedStops[sortedStops.length - 1]);
        }
      }
    });
    const gradientFrameLines = new paperMain.Group({
      data: {
        id: 'gradientFrameLines'
      },
      insert: false,
      children: [gradientFrameLineDark, gradientFrameLineLight]
    });
    const newGradientFrame = new paperMain.Group({
      data: {
        id: 'gradientFrame'
      },
      children: [gradientFrameLines, gradientFrameOriginHandle, gradientFrameDestinationHandle]
    });
    return () => {
      const oldGradientFrame = paperMain.project.getItem({ data: { id: 'gradientFrame' } });
      if (oldGradientFrame) {
        oldGradientFrame.remove();
      }
    }
  }, [gradient, layer]);

  return (
    <div />
  );
}

export default GradientFrame;