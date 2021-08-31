import React, { ReactElement, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { getScrollFrameBounds } from '../store/selectors/layer';
import { disableScrollFrameTool } from '../store/actions/scrollFrameTool';
import { paperMain } from '../canvas';
import getTheme from '../theme';
import { activateUI } from './CanvasUI';

export const scrollFrameId = 'scrollFrame';

export const scrollFrameJSON = `[
  "Group", {
    "applyMatrix": true,
    "name": "Scroll Frame",
    "data": {
      "id": "${scrollFrameId}",
      "type": "UIElement"
    }
  }
]`;

export const getScrollFrame = (): paper.Group =>
  paperMain.projects[0].getItem({ data: { id: scrollFrameId } }) as paper.Group;

export const clearScrollFrame = () => {
  const scrollFrame = getScrollFrame();
  if (scrollFrame) {
    scrollFrame.removeChildren();
  }
}

export const updateScrollFrame = ({
  bounds,
  themeName,
  handle = 'all'
}: {
  bounds: paper.Rectangle;
  themeName: Btwx.ThemeName;
  handle?: Btwx.SelectionFrameHandle;
}): void => {
  activateUI();
  clearScrollFrame();
  if (bounds) {
    const scrollFrame = getScrollFrame();
    const theme = getTheme(themeName);
    const frameWithResizeHandles = new paperMain.Group({
      data: {
        type: 'UIElementChild',
        interactive: false,
        interactiveType: null,
        elementId: scrollFrameId
      },
      parent: scrollFrame
    });
    const resizeDisabled = false;
    const baseProps = {
      point: bounds.topLeft,
      size: [8, 8],
      fillColor: '#fff',
      strokeColor: { hue: 0, saturation: 0, lightness: 0, alpha: 0.24 },
      strokeWidth: 1 / paperMain.view.zoom,
      shadowColor: { hue: 0, saturation: 0, lightness: 0, alpha: 0.5 },
      shadowBlur: 1 / paperMain.view.zoom,
      opacity: resizeDisabled ? 1 : 1,
      parent: frameWithResizeHandles
    }
    const selectionTopLeft = bounds.topLeft; // bounds ? bounds.topLeft : getSelectedTopLeft(state);
    const selectionBottomRight = bounds.bottomRight; // bounds ? bounds.bottomRight : getSelectedBottomRight(state);
    const redFrame = new paperMain.Group({
      data: {
        type: 'UIElementChild',
        interactive: false,
        interactiveType: null,
        elementId: scrollFrameId
      },
      parent: frameWithResizeHandles,
      children: [
        new paperMain.Path.Rectangle({
          from: selectionTopLeft,
          to: selectionBottomRight,
          strokeColor: theme.palette.primary,
          strokeWidth: 4 / paperMain.view.zoom,
          data: {
            type: 'UIElementChild',
            interactive: false,
            interactiveType: null,
            elementId: scrollFrameId
          }
        })
      ]
    });
    const baseFrame = new paperMain.Group({
      opacity: 0.33,
      data: {
        type: 'UIElementChild',
        interactive: false,
        interactiveType: null,
        elementId: scrollFrameId
      },
      parent: frameWithResizeHandles
    });
    const baseFrameOverlay = new paperMain.Path.Rectangle({
      from: selectionTopLeft,
      to: selectionBottomRight,
      strokeColor: '#fff',
      strokeWidth: 1 / paperMain.view.zoom,
      blendMode: 'multiply',
      data: {
        type: 'UIElementChild',
        interactive: false,
        interactiveType: null,
        elementId: scrollFrameId
      },
      parent: baseFrame
    });
    const baseFrameDifference = new paperMain.Path.Rectangle({
      from: selectionTopLeft,
      to: selectionBottomRight,
      strokeColor: '#999',
      strokeWidth: 1 / paperMain.view.zoom,
      blendMode: 'difference',
      data: {
        type: 'UIElementChild',
        interactive: false,
        interactiveType: null,
        elementId: scrollFrameId
      },
      parent: baseFrame
    });
    // Line selection frame
    const topLeftHandle = new paperMain.Path.Rectangle({
      ...baseProps,
      visible: handle === 'all' || handle === 'topLeft',
      data: {
        type: 'UIElementChild',
        interactive: true,
        interactiveType: 'topLeft',
        elementId: scrollFrameId
      }
    });
    topLeftHandle.position = baseFrame.bounds.topLeft;
    topLeftHandle.scaling.x = 1 / paperMain.view.zoom;
    topLeftHandle.scaling.y = 1 / paperMain.view.zoom;
    const topCenterHandle = new paperMain.Path.Rectangle({
      ...baseProps,
      visible: handle === 'all' || handle === 'topCenter',
      data: {
        type: 'UIElementChild',
        interactive: true,
        interactiveType: 'topCenter',
        elementId: scrollFrameId
      }
    });
    topCenterHandle.position = baseFrame.bounds.topCenter;
    topCenterHandle.scaling.x = 1 / paperMain.view.zoom;
    topCenterHandle.scaling.y = 1 / paperMain.view.zoom;
    const topRightHandle = new paperMain.Path.Rectangle({
      ...baseProps,
      visible: handle === 'all' || handle === 'topRight',
      data: {
        type: 'UIElementChild',
        interactive: true,
        interactiveType: 'topRight',
        elementId: scrollFrameId
      }
    });
    topRightHandle.position = baseFrame.bounds.topRight;
    topRightHandle.scaling.x = 1 / paperMain.view.zoom;
    topRightHandle.scaling.y = 1 / paperMain.view.zoom;
    const bottomLeftHandle = new paperMain.Path.Rectangle({
      ...baseProps,
      visible: handle === 'all' || handle === 'bottomLeft',
      data: {
        type: 'UIElementChild',
        interactive: true,
        interactiveType: 'bottomLeft',
        elementId: scrollFrameId
      }
    });
    bottomLeftHandle.position = baseFrame.bounds.bottomLeft;
    bottomLeftHandle.scaling.x = 1 / paperMain.view.zoom;
    bottomLeftHandle.scaling.y = 1 / paperMain.view.zoom;
    const bottomCenterHandle = new paperMain.Path.Rectangle({
      ...baseProps,
      visible: handle === 'all' || handle === 'bottomCenter',
      data: {
        type: 'UIElementChild',
        interactive: true,
        interactiveType: 'bottomCenter',
        elementId: scrollFrameId
      }
    });
    bottomCenterHandle.position = baseFrame.bounds.bottomCenter;
    bottomCenterHandle.scaling.x = 1 / paperMain.view.zoom;
    bottomCenterHandle.scaling.y = 1 / paperMain.view.zoom;
    const bottomRightHandle = new paperMain.Path.Rectangle({
      ...baseProps,
      visible: handle === 'all' || handle === 'bottomRight',
      data: {
        type: 'UIElementChild',
        interactive: true,
        interactiveType: 'bottomRight',
        elementId: scrollFrameId
      }
    });
    bottomRightHandle.position = baseFrame.bounds.bottomRight;
    bottomRightHandle.scaling.x = 1 / paperMain.view.zoom;
    bottomRightHandle.scaling.y = 1 / paperMain.view.zoom;
    const rightCenterHandle = new paperMain.Path.Rectangle({
      ...baseProps,
      visible: handle === 'all' || handle === 'rightCenter',
      data: {
        type: 'UIElementChild',
        interactive: true,
        interactiveType: 'rightCenter',
        elementId: scrollFrameId
      }
    });
    rightCenterHandle.position = baseFrame.bounds.rightCenter;
    rightCenterHandle.scaling.x = 1 / paperMain.view.zoom;
    rightCenterHandle.scaling.y = 1 / paperMain.view.zoom;
    const leftCenterHandle = new paperMain.Path.Rectangle({
      ...baseProps,
      visible: handle === 'all' || handle === 'leftCenter',
      data: {
        type: 'UIElementChild',
        interactive: true,
        interactiveType: 'leftCenter',
        elementId: scrollFrameId
      }
    });
    leftCenterHandle.position = baseFrame.bounds.leftCenter;
    leftCenterHandle.scaling.x = 1 / paperMain.view.zoom;
    leftCenterHandle.scaling.y = 1 / paperMain.view.zoom;
  }
};

const ScrollFrame = (): ReactElement => {
  const themeName = useSelector((state: RootState) => state.preferences.theme);
  const scrollFrameId = useSelector((state: RootState) => state.scrollFrameTool.id);
  const scrollFrameBounds: paper.Rectangle = useSelector((state: RootState) => getScrollFrameBounds(state));
  const zoom = useSelector((state: RootState) => state.documentSettings.zoom);
  const dispatch = useDispatch();

  const onMouseDown = (event: any): void => {
    if ((event.target.id as string).startsWith('canvas')) {
      const eventPoint = paperMain.view.getEventPoint(event);
      const hitResult = paperMain.project.hitTest(eventPoint);
      if (!hitResult || !(hitResult.item && hitResult.item.data && hitResult.item.data.elementId === scrollFrameId)) {
        dispatch(disableScrollFrameTool());
      }
    } else if (event.target.id !== 'control-scroll-resize') {
      dispatch(disableScrollFrameTool());
    }
  }

  useEffect(() => {
    updateScrollFrame({
      bounds: scrollFrameBounds,
      handle: 'all',
      themeName
    });
    return () => {
      clearScrollFrame();
    }
  }, [themeName, scrollFrameBounds, zoom, scrollFrameId]);

  useEffect(() => {
    document.addEventListener('mousedown', onMouseDown);
    return (): void => {
      document.removeEventListener('mousedown', onMouseDown);
    }
  }, []);

  return null;
}

export default ScrollFrame;