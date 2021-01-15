import React, { ReactElement, useState, useEffect } from 'react';
import { paperMain, paperPreview } from '../canvas';

export interface CanvasMaskableLayerProps {
  layerItem: Btwx.MaskableLayer;
  parentItem: Btwx.Artboard | Btwx.Group;
  artboardItem: Btwx.Artboard;
  paperScope: Btwx.PaperScope;
  rendered: boolean;
  projectIndex: number;
}

const CanvasMaskableLayer = (props: CanvasMaskableLayerProps): ReactElement => {
  const { paperScope, rendered, layerItem, parentItem, projectIndex, artboardItem } = props;
  const paperLayerScope = paperScope === 'main' ? paperMain : paperPreview;
  const paperProject = paperScope === 'main' ? paperMain.projects[projectIndex] : paperPreview.project;
  const layerIndex = parentItem.children.indexOf(layerItem.id);
  const underlyingMaskIndex = layerItem.underlyingMask ? parentItem.children.indexOf(layerItem.underlyingMask) : null;
  const maskedIndex = (layerIndex - underlyingMaskIndex) + 1;
  const isMask = layerItem.type === 'Shape' && (layerItem as Btwx.Shape).mask;
  const [prevLayerIndex, setPrevLayerIndex] = useState(layerIndex);
  const [prevScope, setPrevScope] = useState(layerItem.scope);
  const [prevMask, setPrevMask] = useState(isMask);
  const [prevUnderlyingMask, setPrevUnderlyingMask] = useState(layerItem.underlyingMask);
  const [prevMasked, setPrevMasked] = useState(layerItem.masked);

  useEffect(() => {
    const scopeLengthMatch = (prevScope && layerItem.scope) && prevScope.length === layerItem.scope.length;
    if (rendered && (!scopeLengthMatch || (scopeLengthMatch && !prevScope.every((s, i) => layerItem.scope[i] === s)))) {
      const paperLayer = paperProject.getItem({data: {id: layerItem.id}});
      paperLayer.data.scope = layerItem.scope;
      setPrevScope(layerItem.scope);
    }
  }, [layerItem.scope]);

  useEffect(() => {
    if (rendered && prevLayerIndex !== layerIndex) {
      let paperLayer = paperProject.getItem({data: {id: layerItem.id}});
      if (isMask) {
        const maskGroup = paperLayer.parent;
        // const nonMaskChildren = maskGroup.children.slice(1, maskGroup.children.length);
        // maskGroup.parent.insertChildren(maskGroup.index, nonMaskChildren);
        paperLayer = maskGroup;
      }
      if (layerItem.masked) {
        const maskGroup = paperProject.getItem({data: {id: layerItem.underlyingMask}}).parent;
        maskGroup.insertChild(maskedIndex, paperLayer);
      } else {
        paperLayer.parent.insertChild(layerIndex, paperLayer);
      }
      setPrevLayerIndex(layerIndex);
    }
  }, [layerIndex]);

  useEffect(() => {
    if (rendered && prevMask !== isMask) {
      const paperLayer = paperProject.getItem({data: {id: layerItem.id}}) as paper.Path;
      if (isMask && !prevMask) {
        paperLayer.replaceWith(
          new paperLayerScope.Group({
            name: 'MaskGroup',
            data: { id: 'maskGroup', type: 'LayerContainer', layerType: 'Shape' },
            children: [
              new paperLayerScope.CompoundPath({
                pathData: paperLayer.pathData,
                position: paperLayer.position,
                fillColor: 'black',
                clipMask: true,
                data: { id: 'mask', type: 'LayerChild', layerType: 'Shape' }
              }),
              paperLayer.clone()
            ]
          })
        );
      }
      if (!isMask && prevMask) {
        const maskGroup = paperLayer.parent;
        maskGroup.children[0].remove();
        maskGroup.parent.insertChildren(maskGroup.index, maskGroup.children);
        maskGroup.remove();
      }
      setPrevMask(isMask);
    }
  }, [isMask]);

  useEffect(() => {
    if (rendered && prevMasked !== layerItem.masked) {
      let paperLayer = paperProject.getItem({data: {id: layerItem.id}});
      if (isMask) {
        paperLayer = paperLayer.parent;
      }
      if (layerItem.masked && !prevMasked) {
        const maskGroup = paperProject.getItem({data: {id: layerItem.underlyingMask}}).parent;
        maskGroup.insertChild(maskedIndex, paperLayer);
      }
      if (!layerItem.masked && prevMasked) {
        let paperParent = paperProject.getItem({data: {id: parent}});
        if (layerItem.parent === layerItem.artboard) {
          paperParent = paperParent.getItem({data:{id:'artboardLayers'}});
        }
        paperParent.insertChild(layerIndex, paperLayer);
      }
      setPrevMasked(layerItem.masked);
    }
  }, [layerItem.masked]);

  useEffect(() => {
    if (rendered && prevUnderlyingMask !== layerItem.underlyingMask) {
      let paperLayer = paperProject.getItem({data: {id: layerItem.id}});
      if (isMask) {
        paperLayer = paperLayer.parent;
      }
      if (layerItem.masked) {
        const maskGroup = paperProject.getItem({data: {id: layerItem.underlyingMask}}).parent;
        maskGroup.insertChild(maskedIndex, paperLayer);
      } else {
        let paperParent = paperProject.getItem({data: {id: parent}});
        if (layerItem.parent === layerItem.artboard) {
          paperParent = paperParent.getItem({data:{id:'artboardLayers'}});
        }
        paperParent.insertChild(layerIndex, paperLayer);
      }
      setPrevUnderlyingMask(layerItem.underlyingMask);
    }
  }, [layerItem.underlyingMask]);

  return (
    <></>
  );
}

export default CanvasMaskableLayer;