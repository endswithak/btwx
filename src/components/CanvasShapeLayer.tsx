import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { getPaperStyle, getLayerAbsPosition, getPaperParent, getPaperLayerIndex, getPaperFillColor, getPaperStrokeColor, clearLayerTransforms, applyLayerTransforms } from '../store/utils/paper';
import { paperMain, paperPreview } from '../canvas';
import CanvasPreviewLayerEvent from './CanvasPreviewLayerEvent';

interface CanvasShapeLayerProps {
  id: string;
  paperScope: Btwx.PaperScope;
}


const CanvasShapeLayer = (props: CanvasShapeLayerProps): ReactElement => {
  const { id, paperScope } = props;
  const layerItem: Btwx.Shape = useSelector((state: RootState) => state.layer.present.byId[id] as Btwx.Shape);
  const parentItem: Btwx.Artboard | Btwx.Group = useSelector((state: RootState) => layerItem ? state.layer.present.byId[layerItem.parent] as Btwx.Artboard | Btwx.Group : null);
  const artboardItem: Btwx.Artboard = useSelector((state: RootState) => layerItem ? state.layer.present.byId[layerItem.artboard] as Btwx.Artboard : null);
  const layerIndex = parentItem.children.indexOf(layerItem.id);
  const underlyingMaskIndex = layerItem.underlyingMask ? parentItem.children.indexOf(layerItem.underlyingMask) : null;
  const maskedIndex = (layerIndex - underlyingMaskIndex) + 1;
  const projectIndex = artboardItem.projectIndex;
  const paperLayerScope = paperScope === 'main' ? paperMain : paperPreview;
  const paperProject = paperScope === 'main' ? paperMain.projects[projectIndex] : paperPreview.project;
  const [rendered, setRendered] = useState<boolean>(false);

  ///////////////////////////////////////////////////////
  // HELPER FUNCTIONS
  ///////////////////////////////////////////////////////

  const createShape = (): paper.Item => {
    const shapePaperLayer = new paperLayerScope.CompoundPath({
      name: `shape-${layerItem.name}`,
      pathData: layerItem.pathData,
      closed: layerItem.closed,
      position: getLayerAbsPosition(layerItem.frame, artboardItem.frame),
      insert: false,
      data: {
        id: id,
        type: 'Layer',
        layerType: 'Shape',
        shapeType: layerItem.shapeType,
        scope: layerItem.scope
      },
      ...getPaperStyle({
        style: layerItem.style,
        textStyle: null,
        isLine: layerItem.shapeType === 'Line',
        layerFrame: layerItem.frame,
        artboardFrame: artboardItem.frame
      })
    });
    shapePaperLayer.children.forEach((item) => {
      item.data = {
        id: 'shapePartial',
        type: 'LayerChild',
        layerType: 'Shape',
        layerId: id
      };
    });
    if (layerItem.mask) {
      return new paperLayerScope.Group({
        name: 'MaskGroup',
        data: {
          id: 'maskGroup',
          type: 'LayerContainer',
          layerType: 'Shape',
          layerId: id
        },
        insert: false,
        children: [
          new paperLayerScope.CompoundPath({
            name: 'mask',
            pathData: shapePaperLayer.pathData,
            position: shapePaperLayer.position,
            fillColor: 'black',
            clipMask: true,
            data: {
              id: 'mask',
              type: 'LayerChild',
              layerType: 'Shape',
              layerId: id
            }
          }),
          shapePaperLayer
        ]
      });
    } else {
      return shapePaperLayer;
    }
  }

  const applyFill = (): void => {
    const paperLayer = paperProject.getItem({ data: { id } });
    paperLayer.fillColor = getPaperFillColor({
      fill: layerItem.style.fill,
      isLine: layerItem.shapeType === 'Line',
      layerFrame: layerItem.frame,
      artboardFrame: artboardItem.frame
    });
  }

  const applyStroke = (): void => {
    const paperLayer = paperProject.getItem({ data: { id } });
    paperLayer.strokeColor = getPaperStrokeColor({
      stroke: layerItem.style.stroke,
      isLine: layerItem.shapeType === 'Line',
      layerFrame: layerItem.frame,
      artboardFrame: artboardItem.frame
    });
  }

  const applyShadow = (): void => {
    const paperLayer = paperProject.getItem({ data: { id } });
    if (layerItem.style.shadow.enabled) {
      paperLayer.shadowColor = {
        hue: layerItem.style.shadow.color.h,
        saturation: layerItem.style.shadow.color.s,
        lightness: layerItem.style.shadow.color.l,
        alpha: layerItem.style.shadow.color.a
      } as paper.Color;
      paperLayer.shadowBlur = layerItem.style.shadow.blur;
      paperLayer.shadowOffset = new paperMain.Point(layerItem.style.shadow.offset.x, layerItem.style.shadow.offset.y);
    } else {
      paperLayer.shadowColor = null;
    }
  }

  ///////////////////////////////////////////////////////
  // INIT
  ///////////////////////////////////////////////////////

  useEffect(() => {
    getPaperParent({
      paperScope,
      projectIndex,
      parent: layerItem.parent,
      isParentArtboard: layerItem.parent === layerItem.artboard,
      masked: layerItem.masked,
      underlyingMask: layerItem.underlyingMask
    }).insertChild(
      getPaperLayerIndex(layerItem, parentItem),
      createShape()
    );
    setRendered(true);
    return (): void => {
      const paperLayer = paperProject.getItem({data: {id}});
      if (paperLayer) {
        if (layerItem.mask) {
          const maskGroup = paperLayer.parent;
          maskGroup.children[0].remove();
          maskGroup.parent.insertChildren(maskGroup.index, maskGroup.children);
          maskGroup.remove();
        }
        paperLayer.remove();
      }
    }
  }, []);

  ///////////////////////////////////////////////////////
  // INDEX & MASK & SCOPE
  ///////////////////////////////////////////////////////

  useEffect(() => {
    if (rendered) {
      const paperLayer = paperProject.getItem({ data: { id: layerItem.id } });
      paperLayer.data.scope = layerItem.scope;
    }
  }, [layerItem.scope]);

  useEffect(() => {
    if (rendered) {
      let paperLayer = paperProject.getItem({ data: { id: layerItem.id } });
      if (layerItem.mask) {
        const maskGroup = paperLayer.parent;
        // const nonMaskChildren = maskGroup.children.slice(1, maskGroup.children.length);
        // maskGroup.parent.insertChildren(maskGroup.index, nonMaskChildren);
        paperLayer = maskGroup;
      }
      if (layerItem.masked) {
        const maskGroup = paperProject.getItem({ data: { id: layerItem.underlyingMask } }).parent;
        maskGroup.insertChild(maskedIndex, paperLayer);
      } else {
        paperLayer.parent.insertChild(layerIndex, paperLayer);
      }
    }
  }, [layerIndex]);

  useEffect(() => {
    if (rendered) {
      const paperLayer = paperProject.getItem({ data: { id: layerItem.id } }) as paper.Path;
      if (layerItem.mask) {
        paperLayer.replaceWith(
          new paperLayerScope.Group({
            name: 'MaskGroup',
            data: {
              id: 'maskGroup',
              type: 'LayerContainer',
              layerType: 'Shape',
              layerId: id
            },
            children: [
              new paperLayerScope.CompoundPath({
                pathData: paperLayer.pathData,
                position: paperLayer.position,
                fillColor: 'black',
                clipMask: true,
                data: {
                  id: 'mask',
                  type: 'LayerChild',
                  layerType: 'Shape',
                  layerId: id
                }
              }),
              paperLayer.clone()
            ]
          })
        );
      } else {
        const maskGroup = paperLayer.parent;
        maskGroup.children[0].remove();
        maskGroup.parent.insertChildren(maskGroup.index, maskGroup.children);
        maskGroup.remove();
      }
    }
  }, [layerItem.mask]);

  useEffect(() => {
    if (rendered) {
      let paperLayer = paperProject.getItem({ data: { id: layerItem.id } });
      if (layerItem.mask) {
        paperLayer = paperLayer.parent;
      }
      if (layerItem.masked) {
        const maskGroup = paperProject.getItem({ data: { id: layerItem.underlyingMask } }).parent;
        maskGroup.insertChild(maskedIndex, paperLayer);
      } else {
        let paperParent = paperProject.getItem({ data: { id: layerItem.parent } });
        if (layerItem.parent === layerItem.artboard) {
          paperParent = paperParent.getItem({ data:{ id:'artboardLayers' } });
        }
        paperParent.insertChild(layerIndex, paperLayer);
      }
    }
  }, [layerItem.masked]);

  useEffect(() => {
    if (rendered) {
      let paperLayer = paperProject.getItem({ data: { id: layerItem.id } });
      if (layerItem.mask) {
        paperLayer = paperLayer.parent;
      }
      if (layerItem.masked) {
        const maskGroup = paperProject.getItem({ data: { id: layerItem.underlyingMask } }).parent;
        maskGroup.insertChild(maskedIndex, paperLayer);
      } else {
        let paperParent = paperProject.getItem({ data: { id: layerItem.parent } });
        if (layerItem.parent === layerItem.artboard) {
          paperParent = paperParent.getItem({data:{id:'artboardLayers'}});
        }
        paperParent.insertChild(layerIndex, paperLayer);
      }
    }
  }, [layerItem.underlyingMask]);

  ///////////////////////////////////////////////////////
  // PATHDATA
  ///////////////////////////////////////////////////////

  useEffect(() => {
    if (rendered) {
      const absPosition = getLayerAbsPosition(layerItem.frame, artboardItem.frame);
      const paperLayer = paperProject.getItem({ data: { id } }) as paper.CompoundPath;
      paperLayer.pathData = layerItem.pathData;
      paperLayer.children.forEach((item) => {
        item.data = {
          id: 'shapePartial',
          type: 'LayerChild',
          layerType: 'Shape',
          layerId: id
        };
      });
      paperLayer.position = absPosition;
      if (layerItem.mask) {
        const maskGroup = paperProject.getItem({ data: { id } }).parent;
        (maskGroup.children[0] as paper.CompoundPath).pathData = paperLayer.pathData;
        maskGroup.children[0].position = absPosition;
      }
    }
  }, [layerItem.pathData]);

  ///////////////////////////////////////////////////////
  // FRAME
  ///////////////////////////////////////////////////////

  useEffect(() => {
    if (rendered) {
      const absPosition = getLayerAbsPosition(layerItem.frame, artboardItem.frame);
      const paperLayer = paperProject.getItem({ data: { id } });
      paperLayer.position = absPosition;
      if (layerItem.mask) {
        const maskGroup = paperLayer.parent;
        const mask = maskGroup.children[0];
        mask.position = paperLayer.position;
      }
    }
  }, [layerItem.frame.x, layerItem.frame.y, artboardItem.frame.innerWidth, artboardItem.frame.innerHeight]);

  // useEffect(() => {
  //   if (rendered) {
  //     const absoluteY = layerItem.frame.y + artboardItem.frame.y;
  //     const paperLayer = paperProject.getItem({ data: { id } });
  //     paperLayer.position.y = absoluteY;
  //     if (layerItem.mask) {
  //       const maskGroup = paperLayer.parent;
  //       const mask = maskGroup.children[0];
  //       mask.position = paperLayer.position;
  //     }
  //   }
  // }, [layerItem.frame.y, artboardItem.frame.innerHeight]);

  ///////////////////////////////////////////////////////
  // CONTEXT STYLE
  ///////////////////////////////////////////////////////

  useEffect(() => {
    if (rendered) {
      const paperLayer = paperProject.getItem({ data: { id } });
      paperLayer.opacity = layerItem.style.opacity;
    }
  }, [layerItem.style.opacity]);

  useEffect(() => {
    if (rendered) {
      const paperLayer = paperProject.getItem({ data: { id } });
      paperLayer.blendMode = layerItem.style.blendMode;
    }
  }, [layerItem.style.blendMode]);

  ///////////////////////////////////////////////////////
  // BLUR STYLE
  ///////////////////////////////////////////////////////

  useEffect(() => {
    if (rendered) {
      const paperLayer = paperProject.getItem({ data: { id } });
      if (layerItem.style.blur.enabled) {
        paperLayer.style.blur = layerItem.style.blur.radius;
      } else {
        paperLayer.style.blur = null;
      }
    }
  }, [layerItem.style.blur.enabled]);

  useEffect(() => {
    if (rendered) {
      if (layerItem.style.blur.enabled) {
        const paperLayer = paperProject.getItem({ data: { id } });
        paperLayer.style.blur = layerItem.style.blur.radius;
      }
    }
  }, [layerItem.style.blur.radius]);

  ///////////////////////////////////////////////////////
  // FILL & STROKE & SHADOW
  ///////////////////////////////////////////////////////

  useEffect(() => {
    if (rendered) {
      applyFill();
    }
  }, [layerItem.style.fill]);

  useEffect(() => {
    if (rendered) {
      applyStroke();
    }
  }, [layerItem.style.stroke]);

  useEffect(() => {
    if (rendered) {
      applyShadow();
    }
  }, [layerItem.style.shadow]);

  useEffect(() => {
    if (rendered) {
      if (layerItem.style.fill.fillType === 'gradient') {
        applyFill();
      }
      if (layerItem.style.stroke.fillType === 'gradient') {
        applyStroke();
      }
    }
  }, [layerItem.transform.rotation, layerItem.frame.innerWidth, layerItem.frame.innerHeight]);

  useEffect(() => {
    if (rendered) {
      const paperLayer = paperProject.getItem({ data: { id } });
      paperLayer.strokeWidth = layerItem.style.stroke.width;
    }
  }, [layerItem.style.stroke.width]);

  ///////////////////////////////////////////////////////
  // STROKE OPTIONS
  ///////////////////////////////////////////////////////

  useEffect(() => {
    if (rendered) {
      const paperLayer = paperProject.getItem({ data: { id } });
      paperLayer.strokeCap = layerItem.style.strokeOptions.cap;
    }
  }, [layerItem.style.strokeOptions.cap]);

  useEffect(() => {
    if (rendered) {
      const paperLayer = paperProject.getItem({ data: { id } });
      paperLayer.strokeJoin = layerItem.style.strokeOptions.join;
    }
  }, [layerItem.style.strokeOptions.join]);

  useEffect(() => {
    if (rendered) {
      const paperLayer = paperProject.getItem({ data: { id } });
      paperLayer.dashArray = [layerItem.style.strokeOptions.dashArray[0], layerItem.style.strokeOptions.dashArray[1]];
    }
  }, [layerItem.style.strokeOptions.dashArray]);

  useEffect(() => {
    if (rendered) {
      const paperLayer = paperProject.getItem({ data: { id } });
      paperLayer.dashOffset = layerItem.style.strokeOptions.dashOffset;
    }
  }, [layerItem.style.strokeOptions.dashOffset]);

  ///////////////////////////////////////////////////////
  // EVENTS
  ///////////////////////////////////////////////////////

  if (paperScope === 'preview') {
    return (
      rendered
      ? <>
          {
            layerItem.events.map((eventId, index) => (
              <CanvasPreviewLayerEvent
                key={eventId}
                eventId={eventId} />
            ))
          }
        </>
      : null
    )
  } else {
    return null;
  }
}

export default CanvasShapeLayer;