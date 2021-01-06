import React, { ReactElement, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { uiPaperScope } from '../canvas';
import { getLayerAbsPosition } from '../store/utils/paper';

interface CanvasLayerProps {
  id: string;
  rendered: boolean;
}

const CanvasLayerFrame = (props: CanvasLayerProps): ReactElement => {
  const { id, rendered } = props;
  const layerType = useSelector((state: RootState) => state.layer.present.byId[id].type);
  const projectIndex = useSelector((state: RootState) => (state.layer.present.byId[state.layer.present.byId[id].artboard] as Btwx.Artboard).projectIndex);
  const rotation = useSelector((state: RootState) => state.layer.present.byId[id].transform.rotation);
  const layerFrame = useSelector((state: RootState) => state.layer.present.byId[id].frame);
  const artboardFrame = useSelector((state: RootState) => (state.layer.present.byId[state.layer.present.byId[id].artboard] as Btwx.Artboard).frame);

  const getPaperLayer = (): paper.Item => {
    return uiPaperScope.projects[projectIndex].getItem({data: {id}});
  }

  useEffect(() => {
    if (rendered) {
      const paperLayer = getPaperLayer();
      paperLayer.position = getLayerAbsPosition(layerFrame, layerType === 'Artboard' ? null : artboardFrame);
    }
  }, [layerFrame.x, layerFrame.y]);

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

export default CanvasLayerFrame;