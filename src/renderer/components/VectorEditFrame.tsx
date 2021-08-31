import React, { ReactElement, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import getTheme from '../theme';
import { activateUI } from './CanvasUI';
import { paperMain } from '../canvas';

export const vectorEditFrameId = 'vectorEditFrame';

export const vectorEditFrameJSON = `[
  "Group", {
    "applyMatrix": true,
    "name": "Vector Edit Frame",
    "data":{
      "id": "${vectorEditFrameId}",
      "type": "UIElement"
    }
  }
]`;

export const getVectorEditFrame = (): paper.Group =>
  paperMain.projects[0].getItem({ data: { id: vectorEditFrameId } }) as paper.Group;

export const clearVectorEditFrame = () => {
  const vectorEditFrame = getVectorEditFrame();
  if (vectorEditFrame) {
    vectorEditFrame.removeChildren();
  }
}

export const updateVectorEditFrame = ({
  layerId,
  themeName,
  pathData,
  curveHover,
  segments,
  selectedSegment,
  selectedSegmentType
}: {
  layerId: string;
  themeName: Btwx.ThemeName;
  pathData: string;
  curveHover: paper.CurveLocation;
  segments: paper.Segment[];
  selectedSegment: paper.Segment;
  selectedSegmentType: Btwx.SelectedSegmentType;
}): void => {
  activateUI();
  clearVectorEditFrame();
  if (pathData) {
    const vectorEditFrame = getVectorEditFrame();
    const theme = getTheme(themeName);
    const createHandle = (type: 'In' | 'Out') => {
      const handlePoint = type === 'In' ? selectedSegment.handleIn : selectedSegment.handleOut;
      const handleId = `handle${type}`;
      const strokeWidth = selectedSegmentType === handleId ? 2 : 1;
      const handleGroup = new paperMain.Group({
        data: {
          type: 'UIElementChild',
          interactive: false,
          interactiveType: null,
          elementId: vectorEditFrameId
        },
        children: [
          // connector line
          new paperMain.Group({
            opacity: 0.33,
            data: {
              type: 'UIElementChild',
              interactive: false,
              interactiveType: null,
              elementId: vectorEditFrameId
            },
            children: [
              new paperMain.Path.Line({
                from: selectedSegment.point,
                to: selectedSegment.point.add(handlePoint),
                strokeColor: '#fff',
                strokeWidth: 1 / paperMain.view.zoom,
                blendMode: 'multiply',
                data: {
                  type: 'UIElementChild',
                  interactive: false,
                  interactiveType: null,
                  elementId: vectorEditFrameId
                }
              }),
              new paperMain.Path.Line({
                from: selectedSegment.point,
                to: selectedSegment.point.add(handlePoint),
                strokeColor: '#999',
                strokeWidth: 1 / paperMain.view.zoom,
                blendMode: 'difference',
                data: {
                  type: 'UIElementChild',
                  interactive: false,
                  interactiveType: null,
                  elementId: vectorEditFrameId
                }
              })
            ]
          })
        ],
        parent: vectorEditFrame
      });
      const handle = new paperMain.Path.Ellipse({
        center: selectedSegment.point.add(handlePoint),
        radius: new paperMain.Size(3, 3),
        fillColor: '#fff',
        strokeColor: { hue: 0, saturation: 0, lightness: 0, alpha: 0.24 },
        strokeWidth: strokeWidth / paperMain.view.zoom,
        shadowColor: { hue: 0, saturation: 0, lightness: 0, alpha: 0.5 },
        shadowBlur: 1 / paperMain.view.zoom,
        data: {
          type: 'UIElementChild',
          interactive: true,
          interactiveType: handleId,
          elementId: vectorEditFrameId
        },
        parent: handleGroup
      })
      handle.scaling.x = 1 / paperMain.view.zoom;
      handle.scaling.y = 1 / paperMain.view.zoom;
    }
    // base frame
    const baseFrame = new paperMain.Group({
      opacity: 0.33,
      data: {
        type: 'UIElementChild',
        interactive: false,
        interactiveType: null,
        elementId: vectorEditFrameId
      },
      children: [
        new paperMain.Path({
          pathData: pathData,
          strokeColor: '#fff',
          strokeWidth: 1 / paperMain.view.zoom,
          blendMode: 'multiply',
          data: {
            type: 'UIElementChild',
            interactive: false,
            interactiveType: null,
            elementId: vectorEditFrameId
          }
        }),
        new paperMain.Path({
          pathData: pathData,
          strokeColor: '#999',
          strokeWidth: 1 / paperMain.view.zoom,
          blendMode: 'difference',
          data: {
            type: 'UIElementChild',
            interactive: false,
            interactiveType: null,
            elementId: vectorEditFrameId
          }
        })
      ],
      parent: vectorEditFrame
    })
    if (curveHover) {
      const curveHoverPath = new paperMain.Path({
        segments: [curveHover.curve.segment1, curveHover.curve.segment2],
        strokeColor: theme.palette.primary,
        strokeWidth: 2 / paperMain.view.zoom,
        data: {
          type: 'UIElementChild',
          interactive: false,
          interactiveType: null,
          elementId: vectorEditFrameId
        },
        parent: vectorEditFrame
      });
      const curveHoverPoint = new paperMain.Path.Ellipse({
        center: curveHover.point,
        radius: new paperMain.Size(3, 3),
        fillColor: theme.palette.primary,
        data: {
          type: 'UIElementChild',
          interactive: false,
          interactiveType: null,
          elementId: vectorEditFrameId
        },
        parent: vectorEditFrame
      })
      curveHoverPoint.scaling.x = 1 / paperMain.view.zoom;
      curveHoverPoint.scaling.y = 1 / paperMain.view.zoom;
    }
    if (selectedSegment && selectedSegment.handleIn) {
      createHandle('In');
    }
    if (selectedSegment && selectedSegment.handleOut) {
      createHandle('Out');
    }
    if (segments && segments.length > 0) {
      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        const isSelected = selectedSegment && selectedSegment.point.equals(segment.point) && selectedSegmentType === 'point';
        const strokeWidth = isSelected ? 2 : 1;
        const segmentPoint = new paperMain.Path.Ellipse({
          center: segment.point,
          radius: new paperMain.Size(4, 4),
          fillColor: '#fff',
          strokeColor: { hue: 0, saturation: 0, lightness: 0, alpha: 0.24 },
          strokeWidth: strokeWidth / paperMain.view.zoom,
          shadowColor: { hue: 0, saturation: 0, lightness: 0, alpha: 0.5 },
          shadowBlur: 1 / paperMain.view.zoom,
          data: {
            type: 'UIElementChild',
            interactive: true,
            interactiveType: 'segmentPoint',
            elementId: vectorEditFrameId
          },
          parent: vectorEditFrame
        });
        segmentPoint.scaling.x = 1 / paperMain.view.zoom;
        segmentPoint.scaling.y = 1 / paperMain.view.zoom;
      }
    }
  }
};

const VectorEditFrame = (): ReactElement => {
  const themeName = useSelector((state: RootState) => state.preferences.theme);
  const zoom = useSelector((state: RootState) => state.documentSettings.zoom);
  const layerId = useSelector((state: RootState) => state.vectorEditTool.layerId);
  const pathData = useSelector((state: RootState) => state.vectorEditTool.pathData);
  const segments = useSelector((state: RootState) => state.vectorEditTool.segments);
  const curveHover = useSelector((state: RootState) => state.vectorEditTool.curveHover);
  const selectedSegment = useSelector((state: RootState) => state.vectorEditTool.selectedSegment);
  const selectedSegmentType = useSelector((state: RootState) => state.vectorEditTool.selectedSegmentType);

  useEffect(() => {
    const paperSegments = segments && segments.map((arr) => {
      return new paperMain.Segment({
        point: arr[0],
        handleIn: arr[1],
        handleOut: arr[2]
      });
    });
    const paperCurveHover = curveHover && (() => {
      const curveSegment1 = new paperMain.Segment({
        point: curveHover[0][0][0],
        handleIn: curveHover[0][0][1],
        handleOut: curveHover[0][0][2]
      });
      const curveSegment2 = new paperMain.Segment({
        point: curveHover[0][1][0],
        handleIn: curveHover[0][1][1],
        handleOut: curveHover[0][1][2]
      });
      const curve = new paperMain.Curve(curveSegment1, curveSegment2);
      const curvePoint = curveHover[2] && new paperMain.Point(curveHover[2] as number[]);
      return new paperMain.CurveLocation(curve, curveHover[1] as number, curvePoint);
    })();
    const paperSelectedSegment = selectedSegment && (() => {
      return new paperMain.Segment({
        point: selectedSegment[0],
        handleIn: selectedSegment[1],
        handleOut: selectedSegment[2]
      });
    })();
    updateVectorEditFrame({
      layerId,
      themeName,
      pathData,
      segments: paperSegments,
      curveHover: paperCurveHover,
      selectedSegment: paperSelectedSegment,
      selectedSegmentType
    });
    return (): void => {
      clearVectorEditFrame();
    }
  }, [zoom, themeName, layerId, pathData, segments, curveHover, selectedSegment, selectedSegmentType]);

  return null;
}

export default VectorEditFrame;