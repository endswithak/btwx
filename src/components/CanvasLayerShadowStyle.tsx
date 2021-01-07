import React, { ReactElement, useEffect } from 'react';
import { useSelector, connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { uiPaperScope } from '../canvas';

interface CanvasLayerShadowStyleProps {
  id: string;
}

interface CanvasLayerShadowStyleStateProps {
  layerType: Btwx.LayerType;
  projectIndex: number;
  shadowEnabled: boolean;
  shadowFillType: Btwx.FillType;
  shadowColor: Btwx.Color;
  shadowBlur: number;
  shadowOffset: Btwx.Point;
}

const CanvasLayerShadowStyle = (props: CanvasLayerShadowStyleProps & CanvasLayerShadowStyleStateProps): ReactElement => {
  const { id, layerType, projectIndex, shadowEnabled, shadowFillType, shadowColor, shadowBlur, shadowOffset } = props;
  // const layerItem = useSelector((state: RootState) => state.layer.present.byId[id]);
  // const layerType = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].type);
  // const projectIndex = useSelector((state: RootState) => state.layer.present.byId[id] && (state.layer.present.byId[state.layer.present.byId[id].artboard] as Btwx.Artboard).projectIndex);
  // // shadow
  // const shadowEnabled = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.shadow.enabled);
  // const shadowFillType = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.shadow.fillType);
  // const shadowColor = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.shadow.color);
  // const shadowBlur = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.shadow.blur);
  // const shadowOffset = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.shadow.offset);

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
      if (shadowEnabled) {
        paperLayer.shadowColor = {
          hue: shadowColor.h,
          saturation: shadowColor.s,
          lightness: shadowColor.l,
          alpha: shadowColor.a
        } as paper.Color;
        paperLayer.shadowBlur = shadowBlur;
        paperLayer.shadowOffset = new uiPaperScope.Point(shadowOffset.x, shadowOffset.y);
      } else {
        paperLayer.shadowColor = null;
      }
    }
  }, [shadowEnabled, shadowFillType, shadowColor, shadowBlur, shadowOffset]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState, ownProps: CanvasLayerShadowStyleProps): CanvasLayerShadowStyleStateProps => {
  const layerItem = state.layer.present.byId[ownProps.id];
  const artboardItem = layerItem ? state.layer.present.byId[layerItem.artboard] as Btwx.Artboard : null;
  const projectIndex = layerItem ? artboardItem.projectIndex : null;
  const layerType = layerItem ? layerItem.type : null;
  const shadowEnabled = layerItem ? layerItem.style.shadow.enabled : null;
  const shadowFillType = layerItem ? layerItem.style.shadow.fillType : null;
  const shadowColor = layerItem ? layerItem.style.shadow.color : null;
  const shadowBlur = layerItem ? layerItem.style.shadow.blur : null;
  const shadowOffset = layerItem ? layerItem.style.shadow.offset : null;
  return {
    layerType,
    projectIndex,
    shadowEnabled,
    shadowFillType,
    shadowColor,
    shadowBlur,
    shadowOffset
  }
}

export default connect(
  mapStateToProps
)(CanvasLayerShadowStyle);