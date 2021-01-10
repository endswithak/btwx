import React, { ReactElement, useEffect } from 'react';
import { getLayerAbsPosition, getLayerPaperParent } from '../store/utils/paper';
import { uiPaperScope } from '../canvas';

interface CanvasGroupLayerProps {
  id: string;
  layerItem: Btwx.Group;
  layerIndex: number;
  artboardItem: Btwx.Artboard;
  rendered: boolean;
  setRendered(rendered: boolean): void;
}

const CanvasGroupLayer = (props: CanvasGroupLayerProps): ReactElement => {
  const { id, layerItem, layerIndex, artboardItem, rendered, setRendered } = props;

  const createGroup = (): void => {
    const paperParent = getLayerPaperParent(uiPaperScope.projects[artboardItem.projectIndex].getItem({data: {id: layerItem.parent}}), layerItem);
    const group = new uiPaperScope.Group({
      name: layerItem.name,
      data: { id: id, type: 'Layer', layerType: 'Group', scope: layerItem.scope },
      position: getLayerAbsPosition(layerItem.frame, artboardItem.frame),
      insert: false
    });
    paperParent.insertChild(layerIndex, group);
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