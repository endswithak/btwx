import React, { ReactElement, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { getPaperStyle, getLayerAbsPosition, getPaperLayerIndex, getPaperFillColor, getPaperStrokeColor } from '../store/utils/paper';
import { paperMain, paperPreview } from '../canvas';
import { setPathData, removePathData } from '../store/actions/pathData';
import { applyLayerTimelines, rawSegToPaperSeg, getShapeIconPathData } from '../utils';
import CanvasPreviewEventLayerTimeline from './CanvasPreviewEventLayerTimeline';

interface CanvasShapeLayerProps {
  id: string;
  paperScope: Btwx.PaperScope;
  eventTimelines?: {
    [id: string]: GSAPTimeline;
  };
  nestedScrollLeft?: number;
  nestedScrollTop?: number;
  deepestSubPath?: string;
  setNestedSubPathFlag?(subPathFlag: string): void;
  setNestedBoolFlag?(boolFlag: string): void;
}

const CanvasShapeLayer = ({
  id,
  paperScope,
  eventTimelines,
  nestedScrollLeft,
  nestedScrollTop,
  deepestSubPath,
  setNestedSubPathFlag,
  setNestedBoolFlag
}: CanvasShapeLayerProps): ReactElement => {
  const layerItem: Btwx.Shape = useSelector((state: RootState) => state.layer.present.byId[id] as Btwx.Shape);
  const parentItem: Btwx.Artboard | Btwx.Group | Btwx.CompoundShape = useSelector((state: RootState) => layerItem ? state.layer.present.byId[layerItem.parent] as Btwx.Artboard | Btwx.Group | Btwx.CompoundShape : null);
  const artboardItem: Btwx.Artboard = useSelector((state: RootState) => layerItem ? state.layer.present.byId[layerItem.artboard] as Btwx.Artboard : null);
  const eventsById = useSelector((state: RootState) => state.layer.present.events.byId);
  const layerIndex = parentItem.children.indexOf(layerItem.id);
  const underlyingMaskIndex = layerItem.underlyingMask ? parentItem.children.indexOf(layerItem.underlyingMask) : null;
  const maskedIndex = layerIndex - underlyingMaskIndex;
  const projectIndex = artboardItem.projectIndex;
  const paperLayerScope = paperScope === 'main' ? paperMain : paperPreview;
  const [paperProject, setPaperProject] = useState(paperScope === 'main' ? paperMain.projects[projectIndex] : paperPreview.project);
  const [rendered, setRendered] = useState<boolean>(false);
  const [layerTimelines, setLayerTimelines] = useState(null);
  const dispatch = useDispatch();

  ///////////////////////////////////////////////////////
  // HELPER FUNCTIONS
  ///////////////////////////////////////////////////////

  const createShapePath = () => {
    return new paperLayerScope.Path({
      name: `shapePath-${layerItem.name}`,
      segments: layerItem.segments,
      closed: layerItem.closed,
      position: getLayerAbsPosition(layerItem.frame, artboardItem.frame),
      insert: false,
      data: {
        id: 'shapePath',
        type: 'LayerChild',
        layerType: 'Shape',
        layerId: id
      },
      ...getPaperStyle({
        style: layerItem.style,
        textStyle: null,
        isLine: layerItem.shapeType === 'Line',
        layerFrame: layerItem.frame,
        artboardFrame: artboardItem.frame
      })
    });
  }

  const createMaskGroup = (shapePath: paper.Path): paper.Group => {
    return new paperLayerScope.Group({
      name: 'maskGroup',
      data: {
        id: 'maskGroup',
        type: 'LayerContainer',
        layerType: 'Shape',
        layerId: id
      },
      insert: false,
      children: [
        new paperLayerScope.Path({
          name: 'mask',
          segments: layerItem.segments,
          closed: layerItem.closed,
          position: shapePath.position,
          fillColor: 'black',
          clipMask: true,
          data: {
            id: 'mask',
            type: 'LayerChild',
            layerType: 'Shape',
            layerId: id
          }
        }),
        shapePath.clone(),
        new paperLayerScope.Group({
          name: 'maskedLayers',
          data: {
            id: 'maskedLayers',
            type: 'LayerContainer',
            layerType: 'Shape',
            layerId: id
          }
        })
      ]
    });
  }

  const createShapeGroup = (): paper.Group => {
    const shapeLayerGroup = new paperLayerScope.Group({
      name: `shape-${layerItem.name}`,
      insert: false,
      data: {
        id: id,
        type: 'Layer',
        layerType: 'Shape',
        shapeType: layerItem.shapeType,
        scope: layerItem.scope
      },
      children: [
        createShapePath()
      ]
    });
    if (layerItem.mask) {
      const shapePath = shapeLayerGroup.children[0] as paper.Path;
      const maskGroup = createMaskGroup(shapePath);
      shapePath.replaceWith(maskGroup);
    }
    return shapeLayerGroup;
  }

  const getParentPaperLayer = (): {
    parent: paper.Group;
    parentLayers: paper.Group;
    parentCompoundShapePath: paper.CompoundPath;
    parentMaskGroup: paper.Group;
    parentMask: paper.CompoundPath;
    parentMaskedLayers: paper.Group;
  } => {
    //
    const parentLayersGroupId = (() => {
      switch(parentItem.type) {
        case 'Artboard':
          return 'artboardLayers';
        case 'Group':
          return 'groupLayers';
        case 'CompoundShape':
          return 'compoundShapeLayers';
      }
    })();
    // parent items
    const parent = paperProject.getItem({
      data: { id: layerItem.parent }
    }) as paper.Group;
    const parentLayers = parentItem.type === 'Artboard'
      ? parent && (parent.getItem({
          data: { id: 'artboardMaskedLayers' },
          recursive: false
        }) as paper.Group).getItem({
          data: { id: parentLayersGroupId },
          recursive: false
        }) as paper.Group
      : parent && parent.getItem({
          data: { id: parentLayersGroupId },
          recursive: false
        }) as paper.Group;
    const parentMaskGroup = parent && parentItem.type === 'CompoundShape' && parentItem.mask && parent.getItem({
      data: { id: 'maskGroup' },
      recursive: false
    }) as paper.Group;
    const parentMaskedLayers = parentMaskGroup && parentMaskGroup.getItem({
      data: { id: 'maskedLayers' },
      recursive: false
    }) as paper.Group;
    const parentMask = parentMaskGroup && parentMaskGroup.getItem({
      data: { id: 'mask' },
      recursive: false
    }) as paper.Path;
    const parentCompoundShapePath = parentItem.type === 'CompoundShape' && parentItem.mask
    ? parentMaskGroup && parentMaskGroup.getItem({
        data: { id: 'compoundShapePath' },
        recursive: false
      }) as paper.Path
    : parent && parent.getItem({
        data: { id: 'compoundShapePath' },
        recursive: false
      }) as paper.Path;
    return {
      parent,
      parentLayers,
      parentCompoundShapePath,
      parentMaskGroup,
      parentMaskedLayers,
      parentMask
    }
  }

  const getUnderlyingMaskPaperLayer = (): {
    underlyingMaskGroup: paper.Group;
    underlyingMaskGroupMaskedLayers: paper.Group;
  } => {
    // underlying mask items
    const underlyingMaskGroup = layerItem.underlyingMask && paperProject.getItem({
      data: { id: layerItem.underlyingMask }
    }) as paper.Group;
    const underlyingMaskGroupMaskedLayers = underlyingMaskGroup && underlyingMaskGroup.getItem({
      data: { id: 'maskedLayers' },
      recursive: false
    }) as paper.Group;
    return {
      underlyingMaskGroup,
      underlyingMaskGroupMaskedLayers
    }
  }

  const getPaperLayer = (): {
    paperLayer: paper.Group;
    shapePath: paper.Path;
    maskGroup: paper.Group;
    mask: paper.Path;
    maskedLayers: paper.Group;
  } => {
    // parent items
    const {
      parent,
      parentLayers
    } = getParentPaperLayer();
    // shape items
    const paperLayer = parent && parentLayers.getItem({
      data: { id },
      recursive: false
    }) as paper.Group;
    const maskGroup = layerItem.mask && paperLayer && paperLayer.getItem({
      data: { id: 'maskGroup' },
      recursive: false
    }) as paper.Group;
    const maskedLayers = maskGroup && maskGroup.getItem({
      data: { id: 'maskedLayers' },
      recursive: false
    }) as paper.Group;
    const mask = maskGroup && maskGroup.getItem({
      data: { id: 'mask' },
      recursive: false
    }) as paper.Path;
    const shapePath = layerItem.mask
    ? maskedLayers && maskedLayers.getItem({
        data: { id: 'shapePath' },
        recursive: false
      }) as paper.Path
    : paperLayer && paperLayer.getItem({
        data: { id: 'shapePath' },
        recursive: false
      }) as paper.Path;
    return {
      paperLayer,
      shapePath,
      maskGroup,
      maskedLayers,
      mask
    }
  }

  const applyFill = (): void => {
    const { shapePath } = getPaperLayer();
    shapePath.fillColor = getPaperFillColor({
      fill: layerItem.style.fill,
      isLine: layerItem.shapeType === 'Line',
      layerFrame: layerItem.frame,
      artboardFrame: artboardItem.frame
    });
  }

  const applyStroke = (): void => {
    const { shapePath } = getPaperLayer();
    shapePath.strokeColor = getPaperStrokeColor({
      stroke: layerItem.style.stroke,
      isLine: layerItem.shapeType === 'Line',
      layerFrame: layerItem.frame,
      artboardFrame: artboardItem.frame
    });
  }

  const applyShadow = (): void => {
    const { shapePath } = getPaperLayer();
    if (layerItem.style.shadow.enabled) {
      shapePath.shadowColor = {
        hue: layerItem.style.shadow.color.h,
        saturation: layerItem.style.shadow.color.s,
        lightness: layerItem.style.shadow.color.l,
        alpha: layerItem.style.shadow.color.a
      } as paper.Color;
      shapePath.shadowBlur = layerItem.style.shadow.blur;
      shapePath.shadowOffset = new paperMain.Point(layerItem.style.shadow.offset.x, layerItem.style.shadow.offset.y);
    } else {
      shapePath.shadowColor = null;
    }
  }

  ///////////////////////////////////////////////////////
  // INIT
  ///////////////////////////////////////////////////////

  useEffect(() => {
    const {
      parent,
      parentLayers,
      parentCompoundShapePath,
      parentMaskGroup,
      parentMaskedLayers,
      parentMask
    } = getParentPaperLayer();
    parentLayers.insertChild(
      getPaperLayerIndex(layerItem, parentItem),
      createShapeGroup()
    );
    setRendered(true);
    const { shapePath } = getPaperLayer();
    dispatch(setPathData({
      id: id,
      pathData: shapePath.pathData,
      icon: getShapeIconPathData(shapePath.pathData)
    }));
    if (parentItem.type === 'CompoundShape') {
      setNestedBoolFlag(uuidv4());
    }
    return (): void => {
      const {
        paperLayer,
        shapePath,
        maskGroup,
        maskedLayers,
        mask
      } = getPaperLayer();
      if (paperLayer) {
        if (layerItem.mask) {
          // remove mask
          mask.remove();
          // move shapePath back into shapeGroup
          paperLayer.insertChildren(0, [shapePath]);
          // move masked layers out of mask group
          paperLayer.parent.insertChildren(paperLayer.index, maskedLayers.children);
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
      const { paperLayer } = getPaperLayer();
      paperLayer.data.scope = layerItem.scope;
    }
  }, [layerItem.scope]);

  useEffect(() => {
    if (rendered) {
      const { paperLayer, maskedLayers } = getPaperLayer();
      const { underlyingMaskGroupMaskedLayers } = getUnderlyingMaskPaperLayer();
      // unmask currently masked layers
      if (layerItem.mask) {
        paperLayer.parent.insertChildren(layerIndex, maskedLayers.children);
      }
      // if masked, add to underlyingMaskGroupMaskedLayers
      if (layerItem.masked) {
        underlyingMaskGroupMaskedLayers.insertChild(maskedIndex, paperLayer);
      }
      // if not masked, add to parent
      if (!layerItem.masked) {
        paperLayer.parent.insertChild(layerIndex, paperLayer);
      }
      if (parentItem.type === 'CompoundShape') {
        setNestedBoolFlag(uuidv4());
      }
    }
  }, [layerIndex]);

  useEffect(() => {
    if (rendered) {
      const {
        paperLayer,
        shapePath,
        maskGroup,
        maskedLayers,
        mask
      } = getPaperLayer();
      if (layerItem.mask) {
        const maskGroup = createMaskGroup(shapePath);
        paperLayer.replaceWith(maskGroup);
      } else {
        // remove mask
        mask.remove();
        // move shapePath back into shapeGroup
        paperLayer.insertChildren(0, [shapePath]);
        // move masked layers out of mask group
        paperLayer.parent.insertChildren(layerIndex, maskedLayers.children);
        // remove mask group
        maskGroup.remove();
      }
    }
  }, [layerItem.mask]);

  useEffect(() => {
    if (rendered) {
      const { parentLayers } = getParentPaperLayer();
      const { paperLayer } = getPaperLayer();
      const { underlyingMaskGroupMaskedLayers } = getUnderlyingMaskPaperLayer();
      if (layerItem.masked) {
        underlyingMaskGroupMaskedLayers.insertChild(maskedIndex, paperLayer);
      }
      if (!layerItem.masked) {
        parentLayers.insertChild(layerIndex, paperLayer);
      }
    }
  }, [layerItem.masked]);

  useEffect(() => {
    if (rendered) {
      const { parentLayers } = getParentPaperLayer();
      const { paperLayer } = getPaperLayer();
      const { underlyingMaskGroupMaskedLayers } = getUnderlyingMaskPaperLayer();
      if (layerItem.masked) {
        underlyingMaskGroupMaskedLayers.insertChild(maskedIndex, paperLayer);
      }
      if (!layerItem.masked) {
        parentLayers.insertChild(layerIndex, paperLayer);
      }
    }
  }, [layerItem.underlyingMask]);

  ///////////////////////////////////////////////////////
  // SEGMENTS
  ///////////////////////////////////////////////////////

  useEffect(() => {
    if (rendered) {
      const { shapePath, mask } = getPaperLayer();
      const absPosition = getLayerAbsPosition(layerItem.frame, artboardItem.frame);
      const nextSegments = layerItem.segments.map((segment) =>
        rawSegToPaperSeg(segment)
      );
      shapePath.segments = nextSegments;
      shapePath.closed = layerItem.closed;
      shapePath.position = absPosition;
      if (layerItem.mask) {
        mask.segments = nextSegments;
        mask.closed = layerItem.closed;
        mask.position = shapePath.position;
      }
      dispatch(setPathData({
        id: id,
        pathData: shapePath.pathData,
        icon: getShapeIconPathData(shapePath.pathData)
      }));
      if (parentItem.type === 'CompoundShape') {
        setNestedBoolFlag(uuidv4());
      }
    }
  }, [layerItem.segments]);

  ///////////////////////////////////////////////////////
  // FRAME
  ///////////////////////////////////////////////////////

  useEffect(() => {
    if (rendered) {
      const { shapePath, mask } = getPaperLayer();
      const absPosition = getLayerAbsPosition(layerItem.frame, artboardItem.frame);
      shapePath.position = absPosition;
      if (layerItem.mask) {
        mask.position = shapePath.position;
      }
      if (parentItem.type === 'CompoundShape') {
        setNestedBoolFlag(uuidv4());
      }
    }
  }, [layerItem.frame.x, layerItem.frame.y, artboardItem.frame.innerWidth, artboardItem.frame.innerHeight]);

  ///////////////////////////////////////////////////////
  // BOOL
  ///////////////////////////////////////////////////////

  useEffect(() => {
    if (rendered) {
      setNestedBoolFlag(uuidv4());
    }
  }, [layerItem.bool]);

  ///////////////////////////////////////////////////////
  // CONTEXT STYLE
  ///////////////////////////////////////////////////////

  useEffect(() => {
    if (rendered) {
      const { shapePath } = getPaperLayer();
      shapePath.opacity = layerItem.style.opacity;
    }
  }, [layerItem.style.opacity]);

  useEffect(() => {
    if (rendered) {
      const { shapePath } = getPaperLayer();
      shapePath.blendMode = layerItem.style.blendMode;
    }
  }, [layerItem.style.blendMode]);

  ///////////////////////////////////////////////////////
  // BLUR STYLE
  ///////////////////////////////////////////////////////

  useEffect(() => {
    if (rendered) {
      const { shapePath } = getPaperLayer();
      if (layerItem.style.blur.enabled) {
        shapePath.style.blur = layerItem.style.blur.radius;
      } else {
        shapePath.style.blur = null;
      }
    }
  }, [layerItem.style.blur.enabled]);

  useEffect(() => {
    if (rendered) {
      if (layerItem.style.blur.enabled) {
        const { shapePath } = getPaperLayer();
        shapePath.style.blur = layerItem.style.blur.radius;
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
      const { shapePath } = getPaperLayer();
      shapePath.strokeWidth = layerItem.style.stroke.width;
      if (layerItem.style.stroke.fillType === 'gradient') {
        applyStroke();
      }
    }
  }, [layerItem.style.stroke.width]);

  ///////////////////////////////////////////////////////
  // STROKE OPTIONS
  ///////////////////////////////////////////////////////

  useEffect(() => {
    if (rendered) {
      const { shapePath } = getPaperLayer();
      shapePath.strokeCap = layerItem.style.strokeOptions.cap;
    }
  }, [layerItem.style.strokeOptions.cap]);

  useEffect(() => {
    if (rendered) {
      const { shapePath } = getPaperLayer();
      shapePath.strokeJoin = layerItem.style.strokeOptions.join;
    }
  }, [layerItem.style.strokeOptions.join]);

  useEffect(() => {
    if (rendered) {
      const { shapePath } = getPaperLayer();
      shapePath.dashArray = [
        layerItem.style.strokeOptions.dashArray[0],
        layerItem.style.strokeOptions.dashArray[1]
      ];
    }
  }, [layerItem.style.strokeOptions.dashArray]);

  useEffect(() => {
    if (rendered) {
      const { shapePath } = getPaperLayer();
      shapePath.dashOffset = layerItem.style.strokeOptions.dashOffset;
    }
  }, [layerItem.style.strokeOptions.dashOffset]);

  ///////////////////////////////////////////////////////
  // EVENTS
  ///////////////////////////////////////////////////////

  if (paperScope === 'preview') {
    useEffect(() => {
      if (rendered && eventTimelines && parentItem.type !== 'CompoundShape') {
        const { paperLayer } = getPaperLayer();
        setLayerTimelines(applyLayerTimelines({
          paperLayer,
          eventTimelines,
          eventsById,
          layerItem
        }));
      } else {
        if (layerTimelines) {
          setLayerTimelines(null);
        }
      }
    }, [eventTimelines, rendered, layerItem.mask]);
  }

  ///////////////////////////////////////////////////////
  // EVENT TWEENS
  ///////////////////////////////////////////////////////

  if (paperScope === 'preview') {
    return (
      rendered && eventTimelines && layerTimelines
      ? <>
          {
            Object.keys(layerTimelines).map((eventId) => (
              <CanvasPreviewEventLayerTimeline
                key={eventId}
                id={id}
                eventId={eventId}
                layerTimeline={layerTimelines[eventId]}
                eventTimeline={eventTimelines[eventId]}
                nestedScrollLeft={nestedScrollLeft}
                nestedScrollTop={nestedScrollTop} />
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