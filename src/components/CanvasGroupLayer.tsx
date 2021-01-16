import React, { ReactElement, useEffect } from 'react';
import { getLayerAbsPosition, getPaperParent } from '../store/utils/paper';
import CanvasLayerContainer, { CanvasLayerContainerProps } from './CanvasLayerContainer';
import { paperMain, paperPreview } from '../canvas';
import CanvasLayers from './CanvasLayers';
import CanvasMaskableLayer from './CanvasMaskableLayer';

interface CanvasGroupLayerProps {
  id: string;
  paperScope: Btwx.PaperScope;
}

const CanvasGroupLayer = (props: CanvasLayerContainerProps & CanvasGroupLayerProps): ReactElement => {
  const { id, paperScope, layerItem, parentItem, artboardItem, projectIndex, rendered, setRendered } = props;
  const groupItem = layerItem as Btwx.Group;
  const paperLayerScope = paperScope === 'main' ? paperMain : paperPreview;
  const paperProject = paperScope === 'main' ? paperMain.projects[projectIndex] : paperPreview.project;

  const createGroup = (): void => {
    const paperParent = getPaperParent({
      paperScope,
      projectIndex,
      parent: groupItem.parent,
      isParentArtboard: groupItem.parent === groupItem.artboard,
      masked: groupItem.masked,
      underlyingMask: groupItem.underlyingMask
    });
    const layerIndex = parentItem.children.indexOf(id);
    const underlyingMaskIndex = groupItem.underlyingMask ? parentItem.children.indexOf(groupItem.underlyingMask) : null;
    const paperLayerIndex = groupItem.masked ? (layerIndex - underlyingMaskIndex) + 1 : layerIndex;
    const group = new paperLayerScope.Group({
      name: groupItem.name,
      data: { id: id, type: 'Layer', layerType: 'Group', scope: groupItem.scope },
      position: getLayerAbsPosition(groupItem.frame, artboardItem.frame),
      insert: false
    });
    paperParent.insertChild(paperLayerIndex, group);
  }

  useEffect(() => {
    // build layer
    createGroup();
    setRendered(true);
    return (): void => {
      // remove layer
      const paperLayer = paperProject.getItem({data: {id}});
      if (paperLayer) {
        paperLayer.remove();
      }
    }
  }, []);

  return (
    <>
      <CanvasMaskableLayer
        layerItem={layerItem as Btwx.MaskableLayer}
        artboardItem={artboardItem}
        parentItem={parentItem}
        paperScope={paperScope}
        rendered={rendered}
        projectIndex={projectIndex} />
      {
        rendered && groupItem.children.length > 0
        ? <CanvasLayers
            layers={groupItem.children}
            paperScope={paperScope} />
        : null
      }
    </>
  );
}

export default CanvasLayerContainer(CanvasGroupLayer);