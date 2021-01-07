import React, { ReactElement, useEffect } from 'react';
import { useSelector, connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { uiPaperScope } from '../canvas';

interface CanvasLayerStrokeOptionsStyleProps {
  id: string;
}

interface CanvasLayerStrokeOptionsStyleStateProps {
  layerType: Btwx.LayerType;
  projectIndex: number;
  strokeCap: Btwx.StrokeCap;
  strokeJoin: Btwx.StrokeJoin;
  strokeDashArray: number[];
  strokeDashOffset: number;
}

const CanvasLayerStrokeOptionsStyle = (props: CanvasLayerStrokeOptionsStyleProps & CanvasLayerStrokeOptionsStyleStateProps): ReactElement => {
  const { id, layerType, projectIndex, strokeCap, strokeJoin, strokeDashArray, strokeDashOffset } = props;
  // const layerItem = useSelector((state: RootState) => state.layer.present.byId[id]);
  // const layerType = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].type);
  // const projectIndex = useSelector((state: RootState) => state.layer.present.byId[id] && (state.layer.present.byId[state.layer.present.byId[id].artboard] as Btwx.Artboard).projectIndex);
  // // stroke options
  // const strokeCap = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.strokeOptions.cap);
  // const strokeJoin = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.strokeOptions.join);
  // const strokeDashArray = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.strokeOptions.dashArray);
  // const strokeDashOffset = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.strokeOptions.dashOffset);

  const getStyleLayer = (): paper.Item => {
    let paperLayer = uiPaperScope.projects[projectIndex].getItem({data: {id}});
    if (paperLayer) {
      if (layerType === 'Text') {
        paperLayer = paperLayer.getItem({data: {id: 'textLines'}});
      }
      if (layerType === 'Artboard') {
        paperLayer = paperLayer.getItem({data: {id: 'artboardBackground'}});
      }
    }
    return paperLayer;
  }

  useEffect(() => {
    const paperLayer = getStyleLayer();
    if (paperLayer) {
      paperLayer.strokeCap = strokeCap;
    }
  }, [strokeCap]);

  useEffect(() => {
    const paperLayer = getStyleLayer();
    if (paperLayer) {
      paperLayer.strokeJoin = strokeJoin;
    }
  }, [strokeJoin]);

  useEffect(() => {
    const paperLayer = getStyleLayer();
    if (paperLayer) {
      paperLayer.dashArray = strokeDashArray;
    }
  }, [strokeDashArray]);

  useEffect(() => {
    const paperLayer = getStyleLayer();
    if (paperLayer) {
      paperLayer.dashOffset = strokeDashOffset;
    }
  }, [strokeDashOffset]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState, ownProps: CanvasLayerStrokeOptionsStyleProps): CanvasLayerStrokeOptionsStyleStateProps => {
  const layerItem = state.layer.present.byId[ownProps.id];
  const artboardItem = layerItem ? state.layer.present.byId[layerItem.artboard] as Btwx.Artboard : null;
  const layerType = layerItem ? layerItem.type : null;
  const projectIndex = layerItem ? artboardItem.projectIndex : null;
  const strokeCap = layerItem ? layerItem.style.strokeOptions.cap : null;
  const strokeJoin = layerItem ? layerItem.style.strokeOptions.join : null;
  const strokeDashArray = layerItem ? layerItem.style.strokeOptions.dashArray : null;
  const strokeDashOffset = layerItem ? layerItem.style.strokeOptions.dashOffset : null;
  return {
    layerType,
    projectIndex,
    strokeCap,
    strokeJoin,
    strokeDashArray,
    strokeDashOffset
  }
}

export default connect(
  mapStateToProps
)(CanvasLayerStrokeOptionsStyle);