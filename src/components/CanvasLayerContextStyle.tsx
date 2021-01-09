import React, { ReactElement, useEffect, useState } from 'react';
import { uiPaperScope } from '../canvas';

interface CanvasLayerContextStyleProps {
  id: string;
  layerItem: Btwx.Layer;
  artboardItem: Btwx.Artboard;
  rendered: boolean;
}

const CanvasLayerContextStyle = (props: CanvasLayerContextStyleProps): ReactElement => {
  const { id, layerItem, artboardItem, rendered } = props;
  const layerType = layerItem ? layerItem.type : null;
  const projectIndex = layerItem ? layerItem.type === 'Artboard' ? (layerItem as Btwx.Artboard).projectIndex : artboardItem.projectIndex : null;
  const opacity = layerItem ? layerItem.style.opacity : null;
  const blendMode = layerItem ? layerItem.style.blendMode : null;
  const [prevOpacity, setPrevOpacity] = useState(opacity);
  const [prevBlendMode, setPrevBlendMode] = useState(blendMode);

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
    if (rendered && prevOpacity !== opacity) {
      const paperLayer = getStyleLayer();
      paperLayer.opacity = opacity;
      setPrevOpacity(opacity);
    }
  }, [opacity]);

  useEffect(() => {
    if (rendered && prevBlendMode !== blendMode) {
      const paperLayer = getStyleLayer();
      paperLayer.blendMode = blendMode;
      setPrevBlendMode(blendMode);
    }
  }, [blendMode]);

  return (
    <></>
  );
}

export default CanvasLayerContextStyle;

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