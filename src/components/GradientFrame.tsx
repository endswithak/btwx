import React, { useContext, ReactElement, useEffect } from 'react';
import { getGradientOriginPoint, getGradientDestinationPoint } from '../store/selectors/layer';
import { LayerState } from '../store/reducers/layer';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { paperMain } from '../canvas';
import { ThemeContext } from './ThemeProvider';

interface GradientFrameProps {
  layer: string;
  gradient: em.Gradient;
  onStopPress(index: number): void;
  layerItem?: em.Layer;
  zoom?: number;
}

const GradientFrame = (props: GradientFrameProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { layer, gradient, onStopPress, zoom, layerItem } = props;

  const updateGradientFrame = () => {
    const stopsWithIndex = gradient.stops.map((stop, index) => {
      return {
        ...stop,
        index
      }
    });
    const sortedStops = stopsWithIndex.sort((a,b) => { return a.position - b.position });
    const originStop = sortedStops[0];
    const destStop = sortedStops[sortedStops.length - 1];
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
      from: getGradientOriginPoint(layerItem, gradient.origin),
      to: getGradientDestinationPoint(layerItem, gradient.destination),
      insert: false
    }
    const gradientFrameOriginHandleBg  = new paperMain.Shape.Circle({
      ...gradientFrameHandleBgProps,
      center: getGradientOriginPoint(layerItem, gradient.origin),
      data: {
        id: 'gradientFrameHandle',
        handle: 'origin',
        type: 'background'
      },
      strokeColor: originStop.index === gradient.activeStopIndex ? theme.palette.primary : null
    });
    const gradientFrameOriginHandleSwatch  = new paperMain.Shape.Circle({
      ...gradientFrameHandleSwatchProps,
      fillColor: { hue: originStop.color.h, saturation: originStop.color.s, lightness: originStop.color.l, alpha: originStop.color.a },
      center: getGradientOriginPoint(layerItem, gradient.origin),
      data: {
        id: 'gradientFrameHandle',
        handle: 'origin',
        type: 'swatch'
      }
    });
    const gradientFrameDestinationHandleBg = new paperMain.Shape.Circle({
      ...gradientFrameHandleBgProps,
      center: getGradientDestinationPoint(layerItem, gradient.destination),
      data: {
        id: 'gradientFrameHandle',
        handle: 'destination',
        type: 'background'
      },
      strokeColor: destStop.index === gradient.activeStopIndex ? theme.palette.primary : null
    });
    const gradientFrameDestinationHandleSwatch = new paperMain.Shape.Circle({
      ...gradientFrameHandleSwatchProps,
      fillColor: { hue: destStop.color.h, saturation: destStop.color.s, lightness: destStop.color.l, alpha: destStop.color.a },
      center: getGradientDestinationPoint(layerItem, gradient.destination),
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
        if (originStop.index !== gradient.activeStopIndex) {
          onStopPress(originStop.index);
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
        if (destStop.index !== gradient.activeStopIndex) {
          onStopPress(destStop.index);
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
  }

  const handleWheel = (e: WheelEvent) => {
    if (e.ctrlKey) {
      const oldGradientFrame = paperMain.project.getItem({ data: { id: 'gradientFrame' } });
      if (oldGradientFrame) {
        oldGradientFrame.remove();
      }
    }
  }

  useEffect(() => {
    updateGradientFrame();
    document.getElementById('canvas').addEventListener('wheel', handleWheel);
    return () => {
      const oldGradientFrame = paperMain.project.getItem({ data: { id: 'gradientFrame' } });
      document.getElementById('canvas').removeEventListener('wheel', handleWheel);
      if (oldGradientFrame) {
        oldGradientFrame.remove();
      }
    }
  }, [gradient, layer, zoom]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState, ownProps: GradientFrameProps) => {
  const { documentSettings, layer } = state;
  const zoom = documentSettings.matrix[0];
  const layerItem = layer.present.byId[ownProps.layer]
  return { zoom, layerItem };
};

export default connect(
  mapStateToProps
)(GradientFrame);