import React, { ReactElement, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { paperMain } from '../canvas';
import { activateUI } from './CanvasUI';
import { getSelectedProjectIndices } from '../store/selectors/layer';
import { rawRectToPaperRect, rawPointToPaperPoint } from '../utils';

export const selectionFrameId = 'selectionFrame';

export const selectionFrameJSON = `[
  "Group", {
    "applyMatrix": true,
    "name": "Selection Frame",
    "data": {
      "id": "${selectionFrameId}",
      "type": "UIElement"
    }
  }
]`;

export const getSelectionFrame = (): paper.Group =>
  paperMain.projects[0].getItem({ data: { id: selectionFrameId } }) as paper.Group;

export const clearSelectionFrame = () => {
  const selectionFrame = getSelectionFrame();
  if (selectionFrame) {
    selectionFrame.removeChildren();
  }
}

export const updateSelectionFrame = ({
  bounds,
  handle = 'all',
  lineHandles
}: {
  bounds: paper.Rectangle;
  handle?: Btwx.SelectionFrameHandle;
  lineHandles?: {
    from: Btwx.Point;
    to: Btwx.Point;
  };
}): void => {
  activateUI();
  clearSelectionFrame();
  if (bounds) {
    const selectionFrame = getSelectionFrame();
    const frameWithResizeHandles = new paperMain.Group({
      data: {
        type: 'UIElementChild',
        interactive: false,
        interactiveType: null,
        elementId: selectionFrameId
      },
      parent: selectionFrame
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
    const baseFrame = new paperMain.Group({
      opacity: 0.33,
      data: {
        type: 'UIElementChild',
        interactive: false,
        interactiveType: null,
        elementId: selectionFrameId
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
        elementId: selectionFrameId
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
        elementId: selectionFrameId
      },
      parent: baseFrame
    });
    const moveHandle = new paperMain.Path.Ellipse({
      ...baseProps,
      opacity: 1,
      visible: handle === 'all' || handle === 'move',
      data: {
        type: 'UIElementChild',
        interactive: true,
        interactiveType: 'move',
        elementId: selectionFrameId
      },
      parent: selectionFrame
    });
    moveHandle.position = new paperMain.Point(baseFrame.bounds.topCenter.x, baseFrame.bounds.topCenter.y - ((1 / paperMain.view.zoom) * 20));
    moveHandle.scaling.x = 1 / paperMain.view.zoom;
    moveHandle.scaling.y = 1 / paperMain.view.zoom;
    // Line selection frame
    if (handle.startsWith('line')) {
      const fromHandle = new paperMain.Path.Rectangle({
        ...baseProps,
        visible: handle === 'lineFrom' || handle === 'lineAll',
        data: {
          type: 'UIElementChild',
          interactive: true,
          interactiveType: 'lineFrom',
          elementId: selectionFrameId
        }
      });
      fromHandle.position = new paperMain.Point(lineHandles.from.x, lineHandles.from.y);
      fromHandle.scaling.x = 1 / paperMain.view.zoom;
      fromHandle.scaling.y = 1 / paperMain.view.zoom;
      const toHandle = new paperMain.Path.Rectangle({
        ...baseProps,
        visible: handle === 'lineTo' || handle === 'lineAll',
        data: {
          type: 'UIElementChild',
          interactive: true,
          interactiveType: 'lineTo',
          elementId: selectionFrameId
        }
      });
      toHandle.position = new paperMain.Point(lineHandles.to.x, lineHandles.to.y);
      toHandle.scaling.x = 1 / paperMain.view.zoom;
      toHandle.scaling.y = 1 / paperMain.view.zoom;
    } else {
      const topLeftHandle = new paperMain.Path.Rectangle({
        ...baseProps,
        visible: handle === 'all' || handle === 'topLeft',
        data: {
          type: 'UIElementChild',
          interactive: true,
          interactiveType: 'topLeft',
          elementId: selectionFrameId
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
          elementId: selectionFrameId
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
          elementId: selectionFrameId
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
          elementId: selectionFrameId
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
          elementId: selectionFrameId
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
          elementId: selectionFrameId
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
          elementId: selectionFrameId
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
          elementId: selectionFrameId
        }
      });
      leftCenterHandle.position = baseFrame.bounds.leftCenter;
      leftCenterHandle.scaling.x = 1 / paperMain.view.zoom;
      leftCenterHandle.scaling.y = 1 / paperMain.view.zoom;
    }
  }
};

const SelectionFrame = (): ReactElement => {
  const selectionBounds = useSelector((state: RootState) => state.selectionTool.bounds);
  const selectionHandle = useSelector((state: RootState) => state.selectionTool.handle);
  const selectionLineFromPoint = useSelector((state: RootState) => state.selectionTool.lineFromPoint);
  const selectionLineToPoint = useSelector((state: RootState) => state.selectionTool.lineToPoint);
  const selectedPaperScopes = useSelector((state: RootState) => getSelectedProjectIndices(state));
  const zoom = useSelector((state: RootState) => state.documentSettings.zoom);

  useEffect(() => {
    updateSelectionFrame({
      bounds: selectionBounds && rawRectToPaperRect(selectionBounds),
      handle: selectionHandle,
      lineHandles: {
        from: selectionLineFromPoint && rawPointToPaperPoint(selectionLineFromPoint),
        to: selectionLineToPoint && rawPointToPaperPoint(selectionLineToPoint)
      }
    });
    return () => {
      clearSelectionFrame();
    }
  }, [selectionBounds, selectionHandle, selectionLineFromPoint, selectionLineToPoint, zoom, selectedPaperScopes]);

  return null;
}

export default SelectionFrame;