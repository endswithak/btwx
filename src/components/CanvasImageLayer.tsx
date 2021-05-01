import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import tinyColor from 'tinycolor2';
import { getPaperShadowColor, getPaperShadowOffset, getLayerAbsPosition, getPaperParent, getPaperShadowBlur, getPaperLayerIndex, getPaperStrokeColor, getPaperFillColor, clearLayerTransforms, applyLayerTransforms } from '../store/utils/paper';
import { paperMain, paperPreview } from '../canvas';
import CanvasPreviewLayerEvent from './CanvasPreviewLayerEvent';

interface CanvasImageLayerProps {
  id: string;
  paperScope: Btwx.PaperScope;
}

const CanvasImageLayer = (props: CanvasImageLayerProps): ReactElement => {
  const { id, paperScope } = props;
  const layerItem: Btwx.Image = useSelector((state: RootState) => state.layer.present.byId[id] as Btwx.Image);
  const parentItem: Btwx.Artboard | Btwx.Group = useSelector((state: RootState) => layerItem ? state.layer.present.byId[layerItem.parent] as Btwx.Artboard | Btwx.Group : null);
  const artboardItem: Btwx.Artboard = useSelector((state: RootState) => layerItem ? state.layer.present.byId[layerItem.artboard] as Btwx.Artboard : null);
  const layerIndex = parentItem.children.indexOf(layerItem.id);
  const underlyingMaskIndex = layerItem.underlyingMask ? parentItem.children.indexOf(layerItem.underlyingMask) : null;
  const maskedIndex = (layerIndex - underlyingMaskIndex) + 1;
  const projectIndex = artboardItem.projectIndex;
  const paperLayerScope = paperScope === 'main' ? paperMain : paperPreview;
  const paperProject = paperScope === 'main' ? paperMain.projects[projectIndex] : paperPreview.project;
  const [rendered, setRendered] = useState<boolean>(false);
  // const [prevRotation, setPrevRotation] = useState(layerItem.transform.rotation);

  ///////////////////////////////////////////////////////
  // HELPER FUNCTIONS
  ///////////////////////////////////////////////////////

  const getPaperLayer = (): {
    paperLayer: paper.Group;
    raster: paper.Raster;
    scrim: paper.Path.Rectangle;
  } => {
    const paperLayer = paperProject.getItem({ data: { id } }) as paper.Group;
    if (paperLayer) {
      const raster = paperLayer.getItem({ data: { id: 'imageRaster' } }) as paper.Raster;
      const scrim = paperLayer.getItem({ data: { id: 'imageScrim' } }) as paper.Path.Rectangle;
      return {
        paperLayer,
        raster,
        scrim
      };
    } else {
      return {
        paperLayer: null,
        raster: null,
        scrim: null
      }
    }
  }

  const applyStroke = (): void => {
    const { paperLayer } = getPaperLayer();
    paperLayer.strokeColor = getPaperStrokeColor({
      stroke: layerItem.style.stroke,
      isLine: false,
      layerFrame: layerItem.frame,
      artboardFrame: artboardItem.frame
    });
  }

  const applyShadow = (): void => {
    const { paperLayer } = getPaperLayer();
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

  const createImage = (): Promise<paper.Group> => {
    const imageAbsPosition = getLayerAbsPosition(layerItem.frame, artboardItem.frame);
    return new Promise((resolve, reject) => {
      const raster = new paperLayerScope.Raster(layerItem.imageId);
      raster.visible = false;
      const imageContainer = new paperLayerScope.Group({
        name: `image-${layerItem.name}`,
        fillColor: null,
        strokeColor: null,
        shadowColor: getPaperShadowColor(layerItem.style.shadow),
        shadowOffset: getPaperShadowOffset(layerItem.style.shadow),
        shadowBlur: getPaperShadowBlur(layerItem.style.shadow),
        data: {
          id: layerItem.id,
          imageId: layerItem.imageId,
          type: 'Layer',
          layerType: 'Image',
          scope: layerItem.scope
        },
        children: [
          raster,
          new paperLayerScope.Path.Rectangle({
            from: new paperLayerScope.Point(
              imageAbsPosition.x - (layerItem.frame.innerWidth / 2),
              imageAbsPosition.y - (layerItem.frame.innerHeight / 2)
            ),
            to: new paperLayerScope.Point(
              imageAbsPosition.x + (layerItem.frame.innerWidth / 2),
              imageAbsPosition.y + (layerItem.frame.innerHeight / 2)
            ),
            data: {
              id: 'imageScrim',
              type: 'LayerChild',
              layerType: 'Image',
              layerId: id
            },
            // fillColor: tinyColor('blue').setAlpha(0.20).toRgbString(),
            fillColor: tinyColor('#fff').setAlpha(0.01).toRgbString(),
            blendMode: 'multiply'
          })
        ],
        insert: false
      });
      raster.onLoad = (): void => {
        raster.data = {
          id: 'imageRaster',
          type: 'LayerChild',
          layerType: 'Image',
          layerId: id
        };
        raster.bounds.width = layerItem.frame.innerWidth;
        raster.bounds.height = layerItem.frame.innerHeight;
        raster.position = imageAbsPosition;
        raster.visible = true;
        applyLayerTransforms({
          paperLayer: imageContainer,
          transform: layerItem.transform
        });
        resolve(imageContainer);
      }
    })
  }

  ///////////////////////////////////////////////////////
  // INIT
  ///////////////////////////////////////////////////////

  useEffect(() => {
    // build layer
    createImage().then((imageContainer) => {
      getPaperParent({
        paperScope,
        projectIndex,
        parent: layerItem.parent,
        isParentArtboard: layerItem.parent === layerItem.artboard,
        masked: layerItem.masked,
        underlyingMask: layerItem.underlyingMask
      }).insertChild(
        getPaperLayerIndex(layerItem, parentItem),
        imageContainer
      );
      setRendered(true);
    });
    return (): void => {
      // remove layer
      const paperLayer = paperProject.getItem({data: {id}});
      if (paperLayer) {
        paperLayer.remove();
      }
    }
  }, []);

  ///////////////////////////////////////////////////////
  // IMAGE ID
  ///////////////////////////////////////////////////////

  useEffect(() => {
    if (rendered) {
      const { raster } = getPaperLayer();
      const imageAbsPosition = getLayerAbsPosition(layerItem.frame, artboardItem.frame);
      const newRaster = new paperLayerScope.Raster(layerItem.imageId);
      newRaster.visible = false;
      newRaster.onLoad = (): void => {
        newRaster.bounds.width = layerItem.frame.innerWidth;
        newRaster.bounds.height = layerItem.frame.innerHeight;
        newRaster.position = imageAbsPosition;
        applyLayerTransforms({
          paperLayer: newRaster,
          transform: layerItem.transform
        });
        newRaster.data = {
          id: 'imageRaster',
          type: 'LayerChild',
          layerType: 'Image',
          layerId: id
        };
        newRaster.visible = true;
        raster.replaceWith(newRaster);
      }
    }
  }, [layerItem.imageId]);

  ///////////////////////////////////////////////////////
  // INDEX & MASK
  ///////////////////////////////////////////////////////

  useEffect(() => {
    if (rendered) {
      const { paperLayer } = getPaperLayer();
      paperLayer.data.scope = layerItem.scope;
    }
  }, [layerItem.scope]);

  useEffect(() => {
    if (rendered) {
      const { paperLayer } = getPaperLayer();
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
      const { paperLayer } = getPaperLayer();
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
      const { paperLayer } = getPaperLayer();
      if (layerItem.masked) {
        const maskGroup = paperProject.getItem({ data: { id: layerItem.underlyingMask } }).parent;
        maskGroup.insertChild(maskedIndex, paperLayer);
      } else {
        let paperParent = paperProject.getItem({ data: { id: layerItem.parent } });
        if (layerItem.parent === layerItem.artboard) {
          paperParent = paperParent.getItem({ data: { id: 'artboardLayers' } });
        }
        paperParent.insertChild(layerIndex, paperLayer);
      }
    }
  }, [layerItem.underlyingMask]);

  ///////////////////////////////////////////////////////
  // TRANSFORM
  ///////////////////////////////////////////////////////

  useEffect(() => {
    if (rendered) {
      const { paperLayer } = getPaperLayer();
      clearLayerTransforms({
        layerType: 'Image',
        paperLayer
      });
      applyLayerTransforms({
        paperLayer: paperLayer,
        transform: layerItem.transform
      });
    }
  }, [layerItem.transform.rotation, layerItem.transform.horizontalFlip, layerItem.transform.verticalFlip]);

  ///////////////////////////////////////////////////////
  // FRAME
  ///////////////////////////////////////////////////////

  useEffect(() => {
    if (rendered) {
      const { paperLayer } = getPaperLayer();
      const absoluteX = layerItem.frame.x + artboardItem.frame.x;
      clearLayerTransforms({
        layerType: 'Image',
        paperLayer
      });
      paperLayer.bounds.width = layerItem.frame.innerWidth;
      applyLayerTransforms({
        paperLayer: paperLayer,
        transform: layerItem.transform
      });
      paperLayer.position.x = absoluteX;
    }
  }, [layerItem.frame.innerWidth]);

  useEffect(() => {
    if (rendered) {
      const { paperLayer } = getPaperLayer();
      const absoluteY = layerItem.frame.y + artboardItem.frame.y;
      clearLayerTransforms({
        layerType: 'Image',
        paperLayer
      });
      paperLayer.bounds.height = layerItem.frame.innerHeight;
      applyLayerTransforms({
        paperLayer: paperLayer,
        transform: layerItem.transform
      });
      paperLayer.position.y = absoluteY;
    }
  }, [layerItem.frame.innerHeight]);

  useEffect(() => {
    if (rendered) {
      const { paperLayer } = getPaperLayer();
      const absoluteX = layerItem.frame.x + artboardItem.frame.x;
      paperLayer.position.x = absoluteX;
    }
  }, [layerItem.frame.x, artboardItem.frame.innerWidth]);

  useEffect(() => {
    if (rendered) {
      const { paperLayer } = getPaperLayer();
      const absoluteY = layerItem.frame.y + artboardItem.frame.y;
      paperLayer.position.y = absoluteY;
    }
  }, [layerItem.frame.y, artboardItem.frame.innerHeight]);

  ///////////////////////////////////////////////////////
  // CONTEXT STYLE
  ///////////////////////////////////////////////////////

  useEffect(() => {
    if (rendered) {
      const { paperLayer } = getPaperLayer();
      paperLayer.opacity = layerItem.style.opacity;
    }
  }, [layerItem.style.opacity]);

  useEffect(() => {
    if (rendered) {
      const { paperLayer } = getPaperLayer();
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
  // STROKE & SHADOW STYLE
  ///////////////////////////////////////////////////////

  // useEffect(() => {
  //   if (rendered) {
  //     applyStroke();
  //   }
  // }, [layerItem.style.stroke]);

  useEffect(() => {
    if (rendered) {
      applyShadow();
    }
  }, [layerItem.style.shadow]);

  // useEffect(() => {
  //   if (rendered) {
  //     if (layerItem.style.stroke.fillType === 'gradient') {
  //       applyStroke();
  //     }
  //   }
  // }, [layerItem.transform.rotation, layerItem.frame.innerWidth, layerItem.frame.innerHeight]);

  // useEffect(() => {
  //   if (rendered) {
  //     const { paperLayer } = getPaperLayer();
  //     paperLayer.strokeWidth = layerItem.style.stroke.width;
  //   }
  // }, [layerItem.style.stroke.width]);

  ///////////////////////////////////////////////////////
  // STROKE OPTIONS STYLE
  ///////////////////////////////////////////////////////

  useEffect(() => {
    if (rendered) {
      const { paperLayer } = getPaperLayer();
      paperLayer.strokeCap = layerItem.style.strokeOptions.cap;
    }
  }, [layerItem.style.strokeOptions.cap]);

  useEffect(() => {
    if (rendered) {
      const { paperLayer } = getPaperLayer();
      paperLayer.strokeJoin = layerItem.style.strokeOptions.join;
    }
  }, [layerItem.style.strokeOptions.join]);

  useEffect(() => {
    if (rendered) {
      const { paperLayer } = getPaperLayer();
      paperLayer.dashArray = [layerItem.style.strokeOptions.dashArray[0], layerItem.style.strokeOptions.dashArray[1]];
    }
  }, [layerItem.style.strokeOptions.dashArray]);

  useEffect(() => {
    if (rendered) {
      const { paperLayer } = getPaperLayer();
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
  };
}

export default CanvasImageLayer;