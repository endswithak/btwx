import React, { ReactElement, useEffect } from 'react';
import { useSelector, connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { uiPaperScope } from '../canvas';
import { getLayerAbsPosition } from '../store/utils/paper';

interface CanvasLayerFrameProps {
  id: string;
  layerItem: Btwx.Layer;
  artboardItem: Btwx.Artboard;
  rendered: boolean;
}

const CanvasLayerFrame = (props: CanvasLayerFrameProps): ReactElement => {
  const { id, layerItem, artboardItem, rendered } = props;
  // const layerItem = useSelector((state: RootState) => state.layer.present.byId[id]);
  // const artboardItem = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[state.layer.present.byId[id].artboard] as Btwx.Artboard);
  const projectIndex = layerItem ? layerItem.type === 'Artboard' ? (layerItem as Btwx.Artboard).projectIndex : artboardItem.projectIndex : null;
  const layerType = layerItem ? layerItem.type : null;
  const rotation =  layerItem ? layerItem.transform.rotation : null;
  const x = layerItem ? layerItem.frame.x : null;
  const y = layerItem ? layerItem.frame.y : null;
  const innerWidth = layerItem ? layerItem.frame.innerWidth : null;
  const innerHeight = layerItem ? layerItem.frame.innerHeight : null;

  const getPaperLayer = (): paper.Item => {
    return uiPaperScope.projects[projectIndex].getItem({data: {id}});
  }

  useEffect(() => {
    if (rendered) {
      const paperLayer = getPaperLayer();
      paperLayer.position = getLayerAbsPosition(layerItem.frame, layerType === 'Artboard' ? null : artboardItem.frame);
    }
  }, [x, y]);

  useEffect(() => {
    if (rendered) {
      const paperLayer = getPaperLayer();
      const startPosition = paperLayer.position;
      switch(layerType) {
        case 'Shape':
        case 'Image': {
          if (rotation !== 0) {
            paperLayer.rotation = -rotation;
          }
          paperLayer.bounds.width = innerWidth;
          paperLayer.bounds.height = innerHeight;
          if (rotation !== 0) {
            paperLayer.rotation = rotation;
          }
          paperLayer.position = startPosition;
          break;
        }
        case 'Artboard': {
          const mask = paperLayer.getItem({data: { id: 'artboardLayersMask' }});
          const background = paperLayer.getItem({data: { id: 'artboardBackground' }});
          mask.bounds.width = innerWidth;
          background.bounds.width = innerWidth;
          mask.bounds.height = innerHeight;
          background.bounds.height = innerHeight;
          mask.position = startPosition;
          background.position = startPosition;
          break;
        }
      }
    }
  }, [innerWidth, innerHeight]);

  return (
    <></>
  );
}

export default CanvasLayerFrame;

// import React, { ReactElement, useEffect } from 'react';
// import { useSelector, connect } from 'react-redux';
// import { RootState } from '../store/reducers';
// import { uiPaperScope } from '../canvas';
// import { getLayerAbsPosition } from '../store/utils/paper';

// interface CanvasLayerFrameProps {
//   id: string;
// }

// interface CanvasLayerFrameStateProps {
//   layerType: Btwx.LayerType;
//   projectIndex: number;
//   rotation: number;
//   layerFrame: Btwx.Frame;
//   artboardFrame: Btwx.Frame;
// }

// const CanvasLayerFrame = (props: CanvasLayerFrameProps & CanvasLayerFrameStateProps): ReactElement => {
//   const { id, layerType, projectIndex, rotation, layerFrame, artboardFrame } = props;
//   // const layerItem = useSelector((state: RootState) => state.layer.present.byId[id]);
//   // const layerType = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].type);
//   // const projectIndex = useSelector((state: RootState) => state.layer.present.byId[id] && (state.layer.present.byId[state.layer.present.byId[id].artboard] as Btwx.Artboard).projectIndex);
//   // const rotation = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].transform.rotation);
//   // const layerFrame = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].frame);
//   // const artboardFrame = useSelector((state: RootState) => state.layer.present.byId[id] && (state.layer.present.byId[state.layer.present.byId[id].artboard] as Btwx.Artboard).frame);

//   const getPaperLayer = (): paper.Item => {
//     return uiPaperScope.projects[projectIndex].getItem({data: {id}});
//   }

//   useEffect(() => {
//     const paperLayer = getPaperLayer();
//     if (paperLayer) {
//       paperLayer.position = getLayerAbsPosition(layerFrame, layerType === 'Artboard' ? null : artboardFrame);
//     }
//   }, [layerFrame.x, layerFrame.y]);

//   useEffect(() => {
//     const paperLayer = getPaperLayer();
//     if (paperLayer) {
//       const startPosition = paperLayer.position;
//       switch(layerType) {
//         case 'Shape':
//         case 'Image': {
//           if (rotation !== 0) {
//             paperLayer.rotation = -rotation;
//           }
//           paperLayer.bounds.width = layerFrame.innerWidth;
//           paperLayer.bounds.height = layerFrame.innerHeight;
//           if (rotation !== 0) {
//             paperLayer.rotation = rotation;
//           }
//           paperLayer.position = startPosition;
//           break;
//         }
//         case 'Artboard': {
//           const mask = paperLayer.getItem({data: { id: 'artboardLayersMask' }});
//           const background = paperLayer.getItem({data: { id: 'artboardBackground' }});
//           mask.bounds.width = layerFrame.innerWidth;
//           background.bounds.width = layerFrame.innerWidth;
//           mask.bounds.height = layerFrame.innerHeight;
//           background.bounds.height = layerFrame.innerHeight;
//           mask.position = startPosition;
//           background.position = startPosition;
//           break;
//         }
//       }
//     }
//   }, [layerFrame.innerWidth, layerFrame.innerHeight]);

//   return (
//     <></>
//   );
// }

// const mapStateToProps = (state: RootState, ownProps: CanvasLayerFrameProps): CanvasLayerFrameStateProps => {
//   const layerItem = state.layer.present.byId[ownProps.id];
//   const artboardItem = layerItem ? state.layer.present.byId[layerItem.artboard] as Btwx.Artboard : null;
//   const layerType = layerItem ? layerItem.type : null;
//   const projectIndex = layerItem ? artboardItem.projectIndex : null;
//   const rotation = layerItem ? layerItem.transform.rotation : null;
//   const layerFrame = layerItem ? layerItem.frame : null;
//   const artboardFrame = layerItem ? artboardItem.frame : null;
//   return {
//     layerType,
//     projectIndex,
//     rotation,
//     layerFrame,
//     artboardFrame
//   }
// };

// export default connect(
//   mapStateToProps
// )(CanvasLayerFrame);