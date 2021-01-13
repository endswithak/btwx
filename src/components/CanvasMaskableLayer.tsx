import React, { ReactElement, useState, useEffect } from 'react';
import { uiPaperScope } from '../canvas';
import  CanvasTextLayer from './CanvasTextLayer';
import  CanvasShapeLayer from './CanvasShapeLayer';
import  CanvasImageLayer from './CanvasImageLayer';
import  CanvasGroupLayer from './CanvasGroupLayer';

interface CanvasMaskableLayerProps {
  id: string;
  layerItem: Btwx.MaskableLayer;
  layerIndex: number;
  artboardItem: Btwx.Artboard;
  rendered: boolean;
  underlyingMaskIndex: number;
  setRendered(rendered: boolean): void;
}

const CanvasMaskableLayer = (props: CanvasMaskableLayerProps): ReactElement => {
  const { id, layerItem, artboardItem, layerIndex, rendered, underlyingMaskIndex, setRendered } = props;
  const isShape = layerItem ? layerItem.type === 'Shape' : false;
  const mask = isShape && (layerItem as Btwx.Shape).mask;
  const underlyingMask = layerItem ? layerItem.underlyingMask : null;
  const ignoreUnderlyingMask = layerItem ? layerItem.ignoreUnderlyingMask : null;
  const masked = layerItem ? layerItem.masked : null;
  const maskedIndex = masked ? (layerIndex - underlyingMaskIndex) + 1 : null;
  const scope = layerItem ? layerItem.scope : null;
  const projectIndex = artboardItem ? artboardItem.projectIndex : null;
  const [prevLayerIndex, setPrevLayerIndex] = useState(layerIndex);
  const [prevScope, setPrevScope] = useState(scope);
  const [prevMask, setPrevMask] = useState(mask);
  const [prevUnderlyingMask, setPrevUnderlyingMask] = useState(underlyingMask);
  const [prevIgnoreUnderlyingMask, setPrevIgnoreUnderlyingMask] = useState(ignoreUnderlyingMask);
  const [prevMasked, setPrevMasked] = useState(masked);

  useEffect(() => {
    const scopeLengthMatch = (prevScope && scope) && prevScope.length === scope.length;
    if (rendered && (!scopeLengthMatch || (scopeLengthMatch && !prevScope.every((s, i) => scope[i] === s)))) {
      const paperLayer = uiPaperScope.projects[projectIndex].getItem({data: {id}});
      paperLayer.data.scope = scope;
      setPrevScope(scope);
    }
  }, [scope]);

  useEffect(() => {
    if (rendered && prevLayerIndex !== layerIndex) {
      let paperLayer = uiPaperScope.projects[projectIndex].getItem({data: {id}});
      if (mask) {
        const maskGroup = paperLayer.parent;
        // const nonMaskChildren = maskGroup.children.slice(1, maskGroup.children.length);
        // maskGroup.parent.insertChildren(maskGroup.index, nonMaskChildren);
        paperLayer = maskGroup;
      }
      if (masked) {
        const maskGroup = uiPaperScope.projects[projectIndex].getItem({data: {id: underlyingMask}}).parent;
        maskGroup.insertChild(maskedIndex, paperLayer);
      } else {
        paperLayer.parent.insertChild(layerIndex, paperLayer);
      }
      console.log(paperLayer);
      setPrevLayerIndex(layerIndex);
    }
  }, [layerIndex]);

  useEffect(() => {
    if (rendered && prevMask !== mask) {
      const paperLayer = uiPaperScope.projects[projectIndex].getItem({data: {id}}) as paper.Path;
      if (mask && !prevMask) {
        paperLayer.replaceWith(
          new uiPaperScope.Group({
            name: 'MaskGroup',
            data: { id: 'maskGroup', type: 'LayerContainer', layerType: 'Shape' },
            children: [
              new uiPaperScope.CompoundPath({
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
      if (!mask && prevMask) {
        const maskGroup = paperLayer.parent;
        maskGroup.children[0].remove();
        maskGroup.parent.insertChildren(maskGroup.index, maskGroup.children);
        maskGroup.remove();
      }
      setPrevMask(mask);
    }
  }, [mask]);

  useEffect(() => {
    if (rendered && prevMasked !== masked) {
      let paperLayer = uiPaperScope.projects[projectIndex].getItem({data: {id}});
      if (mask) {
        paperLayer = paperLayer.parent;
      }
      if (masked && !prevMasked) {
        const maskGroup = uiPaperScope.projects[projectIndex].getItem({data: {id: underlyingMask}}).parent;
        maskGroup.insertChild(maskedIndex, paperLayer);
      }
      if (!masked && prevMasked) {
        let parent = uiPaperScope.projects[projectIndex].getItem({data: {id: layerItem.parent}});
        if (layerItem.parent === artboardItem.id) {
          parent = parent.getItem({data:{id:'artboardLayers'}});
        }
        parent.insertChild(layerIndex, paperLayer);
      }
      setPrevMasked(masked);
    }
  }, [masked]);

  useEffect(() => {
    if (rendered && prevUnderlyingMask !== underlyingMask) {
      let paperLayer = uiPaperScope.projects[projectIndex].getItem({data: {id}});
      if (mask) {
        paperLayer = paperLayer.parent;
      }
      if (masked) {
        const maskGroup = uiPaperScope.projects[projectIndex].getItem({data: {id: underlyingMask}}).parent;
        maskGroup.insertChild(maskedIndex, paperLayer);
      } else {
        let parent = uiPaperScope.projects[projectIndex].getItem({data: {id: layerItem.parent}});
        if (layerItem.parent === artboardItem.id) {
          parent = parent.getItem({data:{id:'artboardLayers'}});
        }
        parent.insertChild(layerIndex, paperLayer);
      }
      setPrevUnderlyingMask(underlyingMask);
    }
  }, [underlyingMask]);

  return (
    <>
      {
        ((): ReactElement => {
          switch(layerItem.type) {
            case 'Text':
              return (
                <CanvasTextLayer
                  {...props}
                  layerItem={layerItem as Btwx.Text} />
              )
            case 'Shape':
              return (
                <CanvasShapeLayer
                  {...props}
                  layerItem={layerItem as Btwx.Shape} />
              )
            case 'Image':
              return (
                <CanvasImageLayer
                  {...props}
                  layerItem={layerItem as Btwx.Image}/>
              )
            case 'Group':
              return (
                <CanvasGroupLayer
                  {...props}
                  layerItem={layerItem as Btwx.Group} />
              )
          }
        })()
      }
    </>
  );
}

export default CanvasMaskableLayer;