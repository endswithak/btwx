import React, { ReactElement, useEffect, useState } from 'react';
import { paperMain, paperPreview } from '../canvas';

interface CanvasLayerContextStyleProps {
  layerItem: Btwx.Layer;
  parentItem: Btwx.Artboard | Btwx.Group;
  artboardItem: Btwx.Artboard;
  paperScope: Btwx.PaperScope;
  rendered: boolean;
  projectIndex: number;
}

const CanvasLayerContextStyle = (props: CanvasLayerContextStyleProps): ReactElement => {
  const { paperScope, rendered, layerItem, parentItem, projectIndex, artboardItem } = props;
  const paperProject = paperScope === 'main' ? paperMain.projects[projectIndex] : paperPreview.project;
  const [prevOpacity, setPrevOpacity] = useState(layerItem.style.opacity);
  const [prevBlendMode, setPrevBlendMode] = useState(layerItem.style.blendMode);

  const getStyleLayer = (): paper.Item => {
    let paperLayer = paperProject.getItem({data: {id: layerItem.id}});
    if (paperLayer) {
      if (layerItem.type === 'Text') {
        paperLayer = paperLayer.getItem({data: {id: 'textLines'}});
      }
      if (layerItem.type === 'Artboard') {
        paperLayer = paperLayer.getItem({data: {id: 'artboardBackground'}});
      }
    }
    return paperLayer;
  }

  useEffect(() => {
    if (rendered && prevOpacity !== layerItem.style.opacity) {
      const paperLayer = getStyleLayer();
      paperLayer.opacity = layerItem.style.opacity;
      setPrevOpacity(layerItem.style.opacity);
    }
  }, [layerItem.style.opacity]);

  useEffect(() => {
    if (rendered && prevBlendMode !== layerItem.style.blendMode) {
      const paperLayer = getStyleLayer();
      paperLayer.blendMode = layerItem.style.blendMode;
      setPrevBlendMode(layerItem.style.blendMode);
    }
  }, [layerItem.style.blendMode]);

  return (
    <></>
  );
}

export default CanvasLayerContextStyle;

// import React, { ReactElement, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import { RootState } from '../store/reducers';
// import { paperMain } from '../canvas';

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
//     let paperLayer = paperMain.projects[projectIndex].getItem({data: {id}});
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