import React, { ReactElement, useEffect } from 'react';
import { useSelector, connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { uiPaperScope } from '../canvas';
import { getLayerAbsPosition } from '../store/utils/paper';

interface CanvasLayerFrameProps {
  id: string;
}

interface CanvasLayerFrameStateProps {
  layerType: Btwx.LayerType;
  projectIndex: number;
  rotation: number;
  layerFrame: Btwx.Frame;
  artboardFrame: Btwx.Frame;
}

const CanvasLayerFrame = (props: CanvasLayerFrameProps & CanvasLayerFrameStateProps): ReactElement => {
  const { id, layerType, projectIndex, rotation, layerFrame, artboardFrame } = props;
  // const layerItem = useSelector((state: RootState) => state.layer.present.byId[id]);
  // const layerType = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].type);
  // const projectIndex = useSelector((state: RootState) => state.layer.present.byId[id] && (state.layer.present.byId[state.layer.present.byId[id].artboard] as Btwx.Artboard).projectIndex);
  // const rotation = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].transform.rotation);
  // const layerFrame = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].frame);
  // const artboardFrame = useSelector((state: RootState) => state.layer.present.byId[id] && (state.layer.present.byId[state.layer.present.byId[id].artboard] as Btwx.Artboard).frame);

  const getPaperLayer = (): paper.Item => {
    return uiPaperScope.projects[projectIndex].getItem({data: {id}});
  }

  useEffect(() => {
    const paperLayer = getPaperLayer();
    if (paperLayer) {
      paperLayer.position = getLayerAbsPosition(layerFrame, layerType === 'Artboard' ? null : artboardFrame);
    }
  }, [layerFrame.x, layerFrame.y]);

  useEffect(() => {
    const paperLayer = getPaperLayer();
    if (paperLayer) {
      const startPosition = paperLayer.position;
      switch(layerType) {
        case 'Shape':
        case 'Image': {
          if (rotation !== 0) {
            paperLayer.rotation = -rotation;
          }
          paperLayer.bounds.width = layerFrame.innerWidth;
          paperLayer.bounds.height = layerFrame.innerHeight;
          if (rotation !== 0) {
            paperLayer.rotation = rotation;
          }
          paperLayer.position = startPosition;
          break;
        }
        case 'Artboard': {
          const mask = paperLayer.getItem({data: { id: 'artboardLayersMask' }});
          const background = paperLayer.getItem({data: { id: 'artboardBackground' }});
          mask.bounds.width = layerFrame.innerWidth;
          background.bounds.width = layerFrame.innerWidth;
          mask.bounds.height = layerFrame.innerHeight;
          background.bounds.height = layerFrame.innerHeight;
          mask.position = startPosition;
          background.position = startPosition;
          break;
        }
      }
    }
  }, [layerFrame.innerWidth, layerFrame.innerHeight]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState, ownProps: CanvasLayerFrameProps): CanvasLayerFrameStateProps => {
  const layerItem = state.layer.present.byId[ownProps.id];
  const artboardItem = layerItem ? state.layer.present.byId[layerItem.artboard] as Btwx.Artboard : null;
  const layerType = layerItem ? layerItem.type : null;
  const projectIndex = layerItem ? artboardItem.projectIndex : null;
  const rotation = layerItem ? layerItem.transform.rotation : null;
  const layerFrame = layerItem ? layerItem.frame : null;
  const artboardFrame = layerItem ? artboardItem.frame : null;
  return {
    layerType,
    projectIndex,
    rotation,
    layerFrame,
    artboardFrame
  }
};

export default connect(
  mapStateToProps
)(CanvasLayerFrame);