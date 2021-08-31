import React, { ReactElement, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { paperMain } from '../canvas';
import getTheme from '../theme';
import { activateUI } from './CanvasUI';
import { getGradientOriginPoint, getGradientDestinationPoint } from '../store/selectors/layer';

export const gradientFrameId = 'gradientFrame';

export const gradientFrameJSON = `[
  "Group", {
    "applyMatrix": true,
    "name": "Gradient Frame",
    "data":{
      "id": "${gradientFrameId}",
      "type": "UIElement"
    }
  }
]`;

export const getGradientFrame = (): paper.Group =>
  paperMain.projects[0].getItem({ data: { id: gradientFrameId } }) as paper.Group;

export const clearGradientFrame = () => {
  const gradientFrame = getGradientFrame();
  if (gradientFrame) {
    gradientFrame.removeChildren();
  }
}

export const updateGradientFrame = ({
  origin,
  destination,
  themeName
}: {
  origin: {
    position: paper.Point;
    color: Btwx.Color;
    selected: boolean;
    index: number;
  };
  destination: {
    position: paper.Point;
    color: Btwx.Color;
    selected: boolean;
    index: number;
  };
  themeName: Btwx.ThemeName;
}): void => {
  activateUI();
  clearGradientFrame();
  if (origin && destination) {
    const gradientFrame = getGradientFrame();
    const theme = getTheme(themeName);
    const gradientFrameHandleBgProps = {
      radius: 8 / paperMain.view.zoom,
      fillColor: '#fff',
      shadowColor: new paperMain.Color(0, 0, 0, 0.5),
      shadowBlur: 2 / paperMain.view.zoom,
      insert: false,
      strokeWidth: 1 / paperMain.view.zoom
    }
    const gradientFrameHandleSwatchProps = {
      radius: 6 / paperMain.view.zoom,
      fillColor: '#fff',
      insert: false
    }
    const gradientFrameHandleActiveBorderProps = {
      radius: 10 / paperMain.view.zoom,
      fillColor: null,
      insert: false,
      strokeWidth: 2 / paperMain.view.zoom,
      shadowColor: new paperMain.Color(0, 0, 0, 0.5),
      shadowBlur: 2 / paperMain.view.zoom,
      strokeColor: theme.palette.primary
    }
    const gradientFrameLineProps = {
      from: origin.position,
      to: destination.position,
      insert: false
    }
    const gradientFrameOriginHandleBg = new paperMain.Shape.Circle({
      ...gradientFrameHandleBgProps,
      center: origin.position,
      data: {
        type: 'UIElementChild',
        interactive: true,
        interactiveType: 'origin',
        elementId: gradientFrameId,
        stopIndex: origin.index
      }
    });
    const gradientFrameOriginHandleSwatch  = new paperMain.Shape.Circle({
      ...gradientFrameHandleSwatchProps,
      fillColor: {
        hue: origin.color.h,
        saturation: origin.color.s,
        lightness: origin.color.l,
        alpha: origin.color.a
      },
      center: origin.position,
      data: {
        type: 'UIElementChild',
        interactive: true,
        interactiveType: 'origin',
        elementId: gradientFrameId,
        stopIndex: origin.index
      }
    });
    const gradientFrameOriginHandleActiveBorder  = new paperMain.Shape.Circle({
      ...gradientFrameHandleActiveBorderProps,
      center: origin.position,
      visible: origin.selected,
      data: {
        type: 'UIElementChild',
        interactive: true,
        interactiveType: 'origin',
        elementId: gradientFrameId,
        stopIndex: origin.index
      }
    });
    const gradientFrameDestinationHandleBg = new paperMain.Shape.Circle({
      ...gradientFrameHandleBgProps,
      center: destination.position,
      data: {
        type: 'UIElementChild',
        interactive: true,
        interactiveType: 'destination',
        elementId: gradientFrameId,
        stopIndex: destination.index
      }
    });
    const gradientFrameDestinationHandleSwatch = new paperMain.Shape.Circle({
      ...gradientFrameHandleSwatchProps,
      fillColor: {
        hue: destination.color.h,
        saturation: destination.color.s,
        lightness: destination.color.l,
        alpha: destination.color.a
      },
      center: destination.position,
      data: {
        type: 'UIElementChild',
        interactive: true,
        interactiveType: 'destination',
        elementId: gradientFrameId,
        stopIndex: destination.index
      }
    });
    const gradientFrameDestinationHandleActiveBorder  = new paperMain.Shape.Circle({
      ...gradientFrameHandleActiveBorderProps,
      center: destination.position,
      visible: destination.selected,
      data: {
        type: 'UIElementChild',
        interactive: true,
        interactiveType: 'destination',
        elementId: gradientFrameId,
        stopIndex: destination.index
      }
    });
    const gradientFrameLineDark = new paperMain.Path.Line({
      ...gradientFrameLineProps,
      strokeColor: new paperMain.Color(0, 0, 0, 0.25),
      strokeWidth: 3 / paperMain.view.zoom,
      data: {
        id: 'gradientFrameLine',
        type: 'UIElementChild',
        interactive: true,
        interactiveType: 'connector',
        elementId: gradientFrameId
      }
    });
    const gradientFrameLineLight = new paperMain.Path.Line({
      ...gradientFrameLineProps,
      strokeColor: '#fff',
      strokeWidth: 1 / paperMain.view.zoom,
      data: {
        id: 'gradientFrameLine',
        type: 'UIElementChild',
        interactive: true,
        interactiveType: 'connector',
        elementId: gradientFrameId
      }
    });
    const gradientFrameOriginHandle = new paperMain.Group({
      data: {
        id: 'gradientFrameOriginHandle',
        type: 'UIElementChild',
        interactive: true,
        interactiveType: 'origin',
        elementId: gradientFrameId,
        stopIndex: origin.index
      },
      insert: false,
      children: [gradientFrameOriginHandleActiveBorder, gradientFrameOriginHandleBg, gradientFrameOriginHandleSwatch]
    });
    const gradientFrameDestinationHandle = new paperMain.Group({
      data: {
        id: 'gradientFrameDestinationHandle',
        type: 'UIElementChild',
        interactive: true,
        interactiveType: 'destination',
        elementId: gradientFrameId,
        stopIndex: destination.index
      },
      insert: false,
      children: [gradientFrameDestinationHandleActiveBorder, gradientFrameDestinationHandleBg, gradientFrameDestinationHandleSwatch]
    });
    const gradientFrameLines = new paperMain.Group({
      data: {
        id: 'gradientFrameLines',
        type: 'UIElementChild',
        interactive: true,
        interactiveType: 'connector',
        elementId: gradientFrameId
      },
      insert: false,
      children: [gradientFrameLineDark, gradientFrameLineLight]
    });
    new paperMain.Group({
      data: {
        id: 'GradientFrame',
        type: 'UIElement',
        interactive: false,
        interactiveType: null,
        elementId: gradientFrameId
      },
      children: [gradientFrameLines, gradientFrameOriginHandle, gradientFrameDestinationHandle],
      parent: gradientFrame
    });
  }
}

const GradientFrame = (): ReactElement => {
  const themeName = useSelector((state: RootState) => state.preferences.theme);
  const zoom = useSelector((state: RootState) => state.documentSettings.zoom);
  const gradientValue = useSelector((state: RootState) => state.layer.present.byId[state.layer.present.selected[0]] && state.layer.present.byId[state.layer.present.selected[0]].style[state.gradientEditor.prop].gradient);
  const stopsWithIndex = gradientValue && gradientValue.stops.map((stop, index) => ({
    ...stop,
    index
  }));
  const sortedStops = stopsWithIndex && stopsWithIndex.sort((a,b) => a.position - b.position);
  const originStop = sortedStops && sortedStops[0];
  const destStop = sortedStops && sortedStops[sortedStops.length - 1];
  const originPosition = useSelector((state: RootState) => state.layer.present.byId[state.layer.present.selected[0]] && getGradientOriginPoint(state.layer.present, state.layer.present.selected[0], state.gradientEditor.prop));
  const destinationPosition = useSelector((state: RootState) => state.layer.present.byId[state.layer.present.selected[0]] && getGradientDestinationPoint(state.layer.present, state.layer.present.selected[0], state.gradientEditor.prop));
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
    updateGradientFrame({
      origin,
      destination,
      themeName
    });
    return (): void => {
      clearGradientFrame();
    }
  }, [origin, destination, zoom, themeName]);

  return null;
}

export default GradientFrame;