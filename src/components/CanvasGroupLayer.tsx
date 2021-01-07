import React, { ReactElement, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { getLayerAbsPosition, getLayerPaperParent } from '../store/utils/paper';
import { uiPaperScope } from '../canvas';
import  CanvasLayers from './CanvasLayers';

interface CanvasGroupLayerProps {
  id: string;
  layerItem: Btwx.Group;
  artboardItem: Btwx.Artboard;
  rendered: boolean;
  setRendered(rendered: boolean): void;
}

const CanvasGroupLayer = (props: CanvasGroupLayerProps): ReactElement => {
  const { id, layerItem, artboardItem, rendered, setRendered } = props;
  // const layerItem = useSelector((state: RootState) => state.layer.present.byId[id] as Btwx.Group);
  // const artboardItem = useSelector((state: RootState) => state.layer.present.byId[state.layer.present.byId[id].artboard] as Btwx.Artboard);
  // const projectIndex = useSelector((state: RootState) => (state.layer.present.byId[state.layer.present.byId[id].artboard] as Btwx.Artboard).projectIndex);

  const createGroup = (): void => {
    new uiPaperScope.Group({
      name: layerItem.name,
      data: { id: id, type: 'Layer', layerType: 'Group', scope: layerItem.scope },
      parent: getLayerPaperParent(uiPaperScope.projects[artboardItem.projectIndex].getItem({data: {id: layerItem.parent}}), layerItem),
      position: getLayerAbsPosition(layerItem.frame, artboardItem.frame)
    });
  }

  useEffect(() => {
    // build layer
    createGroup();
    setRendered(true);
    return (): void => {
      // remove layer
      const paperLayer = uiPaperScope.projects[artboardItem.projectIndex].getItem({data: {id}});
      if (paperLayer) {
        paperLayer.remove();
      }
    }
  }, []);

  return (
    <></>
  );
}

export default CanvasGroupLayer;