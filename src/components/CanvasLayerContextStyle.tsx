import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { uiPaperScope } from '../canvas';

interface CanvasLayerContextStyleProps {
  id: string;
  layerType?: Btwx.LayerType;
  projectIndex?: number;
  opacity?: number;
  blendMode?: Btwx.BlendMode;
}

interface CanvasLayerContextStyleStateProps {
  layerType: Btwx.LayerType;
  projectIndex: number;
  opacity: number;
  blendMode: Btwx.BlendMode;
}

const CanvasLayerContextStyle = (props: CanvasLayerContextStyleProps & CanvasLayerContextStyleStateProps): ReactElement => {
  const { id, layerType, projectIndex, opacity, blendMode } = props;
  // const layerItem = useSelector((state: RootState) => state.layer.present.byId[id]);
  // const layerType = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].type);
  // const projectIndex = useSelector((state: RootState) => state.layer.present.byId[id] && (state.layer.present.byId[state.layer.present.byId[id].artboard] as Btwx.Artboard).projectIndex);
  // context style
  // const opacity = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.opacity);
  // const blendMode = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.blendMode);

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
      paperLayer.opacity = opacity;
    }
  }, [opacity]);

  useEffect(() => {
    const paperLayer = getStyleLayer();
    if (paperLayer) {
      paperLayer.blendMode = blendMode;
    }
  }, [blendMode]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState, ownProps: CanvasLayerContextStyleProps): CanvasLayerContextStyleStateProps => {
  const layerItem = state.layer.present.byId[ownProps.id];
  const artboardItem = layerItem ? state.layer.present.byId[layerItem.artboard] as Btwx.Artboard : null;
  const layerType = layerItem ? layerItem.type : null;
  const projectIndex = layerItem ? artboardItem.projectIndex : null;
  const opacity = layerItem ? layerItem.style.opacity : null;
  const blendMode = layerItem ? layerItem.style.blendMode : null;
  return {
    layerType,
    projectIndex,
    opacity,
    blendMode
  }
};

export default connect(
  mapStateToProps
)(CanvasLayerContextStyle);

// import React, { ReactElement, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import { RootState } from '../store/reducers';
// import { uiPaperScope } from '../canvas';

// interface CanvasLayerContextStyleProps {
//   id: string;
// }

// const CanvasLayerContextStyle = (props: CanvasLayerContextStyleProps): ReactElement => {
//   const { id } = props;
//   // const layerItem = useSelector((state: RootState) => state.layer.present.byId[id]);
//   const layerType = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].type);
//   const projectIndex = useSelector((state: RootState) => state.layer.present.byId[id] && (state.layer.present.byId[state.layer.present.byId[id].artboard] as Btwx.Artboard).projectIndex);
//   // context style
//   const opacity = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.opacity);
//   const blendMode = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.blendMode);

//   const getStyleLayer = (): paper.Item => {
//     let paperLayer = uiPaperScope.projects[projectIndex].getItem({data: {id}});
//     if (paperLayer) {
//       if (layerType === 'Text') {
//         paperLayer = paperLayer.getItem({data: {id: 'textLines'}});
//       }
//       if (layerType === 'Artboard') {
//         paperLayer = paperLayer.getItem({data: {id: 'artboardBackground'}});
//       }
//     }
//     return paperLayer;
//   }

//   useEffect(() => {
//     const paperLayer = getStyleLayer();
//     if (paperLayer) {
//       paperLayer.opacity = opacity;
//     }
//   }, [opacity]);

//   useEffect(() => {
//     const paperLayer = getStyleLayer();
//     if (paperLayer) {
//       paperLayer.blendMode = blendMode;
//     }
//   }, [blendMode]);

//   return (
//     <></>
//   );
// }

// export default CanvasLayerContextStyle;