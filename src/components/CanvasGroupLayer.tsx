import React, { ReactElement, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { getLayerAbsPosition, getLayerPaperParent } from '../store/utils/paper';
import { uiPaperScope } from '../canvas';
import  CanvasLayers from './CanvasLayers';

interface CanvasGroupLayerProps {
  id: string;
  rendered: boolean;
  setRendered(rendered: boolean): void;
}

const CanvasGroupLayer = (props: CanvasGroupLayerProps): ReactElement => {
  const { id, rendered, setRendered } = props;
  const layerItem = useSelector((state: RootState) => state.layer.present.byId[id] as Btwx.Group);
  const artboardItem = useSelector((state: RootState) => state.layer.present.byId[state.layer.present.byId[id].artboard] as Btwx.Artboard);
  const projectIndex = useSelector((state: RootState) => (state.layer.present.byId[state.layer.present.byId[id].artboard] as Btwx.Artboard).projectIndex);

  const createGroup = (): void => {
    const groupItem = layerItem as Btwx.Group;
    new uiPaperScope.Group({
      name: groupItem.name,
      data: { id: id, type: 'Layer', layerType: 'Group', scope: groupItem.scope },
      parent: getLayerPaperParent(uiPaperScope.projects[projectIndex].getItem({data: {id}}), groupItem),
      position: getLayerAbsPosition(groupItem.frame, artboardItem.frame)
    });
  }

  useEffect(() => {
    // build layer
    createGroup();
    setRendered(true);
    return (): void => {
      // remove layer
      const paperLayer = uiPaperScope.projects[projectIndex].getItem({data: {id}});
      if (paperLayer) {
        paperLayer.remove();
      }
    }
  }, []);

  return (
    <>
      {
        rendered && layerItem.children.length > 0
        ? <CanvasLayers
            layers={layerItem.children} />
        : null
      }
    </>
  );
}

export default CanvasGroupLayer;