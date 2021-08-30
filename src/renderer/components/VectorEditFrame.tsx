import React, { ReactElement, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { updateVectorEditFrame } from '../store/actions/layer';
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
      const vectorEditFrame = paperMain.projects[0].getItem({ data: { id: vectorEditFrameId } });
      vectorEditFrame.removeChildren();
    }
  }, [zoom, themeName, layerId, pathData, segments, curveHover, selectedSegment, selectedSegmentType]);

  return null;
}

export default VectorEditFrame;