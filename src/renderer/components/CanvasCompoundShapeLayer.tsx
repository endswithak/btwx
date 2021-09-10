import React, { ReactElement, useEffect, useState, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
import { RootState } from '../store/reducers';
import { setPathData, removePathData } from '../store/actions/pathData';
import { updateCompoundShapeFrame } from '../store/actions/layer';
import { getPaperStyle, getLayerAbsPosition, getPaperLayerIndex, getPaperFillColor, getPaperStrokeColor, clearLayerTransforms, applyLayerTransforms } from '../store/utils/paper';
import { paperMain, paperPreview } from '../canvas';
import { applyLayerTimelines, getShapeIconPathData } from '../utils';
import CanvasPreviewEventLayerTimeline from './CanvasPreviewEventLayerTimeline';
import CanvasLayer from './CanvasLayer';

const getCompoundShapeDeepestPathSelector = () =>
  createSelector(
    (state: RootState) => state.layer.present.byId,
    (_: any, id: string) => id,
    (layersById, id) => {
      let compoundShapes: string[] = [id];
      let i = 0;
      let deepestCompoundShape = id;
      while(i < compoundShapes.length) {
        const layerItem = layersById[compoundShapes[0]] as Btwx.CompoundShape;
        layerItem.children.forEach((childId, childIndex) => {
          const childItem = layersById[childId];
          if (childItem.type === 'CompoundShape') {
            compoundShapes.push(childId);
            if (childIndex === layerItem.children.length - 1) {
              deepestCompoundShape = childId;
            }
          }
        });
        compoundShapes = compoundShapes.slice(1);
      }
      const deepestCompoundShapeItem = (layersById[deepestCompoundShape] as Btwx.CompoundShape);
      return deepestCompoundShapeItem.children[deepestCompoundShapeItem.children.length - 1];
    }
  );

interface CanvasCompoundShapeLayerProps {
  id: string;
  paperScope: Btwx.PaperScope;
  eventTimelines?: {
    [id: string]: GSAPTimeline;
  };
  nestedScrollLeft?: number;
  nestedScrollTop?: number;
  nestedSubPathFlag?: string;
  deepestSubPath?: string;
  setNestedSubPathFlag?(subPathFlag: string): void;
  setNestedBoolFlag?(boolFlag: string): void;
  setNestedSubCompoundPathFlag?(nestedSubCompoundPathFlag: string): void;
}

const CanvasCompoundShapeLayer = ({
  id,
  paperScope,
  eventTimelines,
  nestedScrollLeft,
  nestedScrollTop,
  nestedSubPathFlag,
  setNestedSubPathFlag,
  setNestedBoolFlag,
  setNestedSubCompoundPathFlag,
  ...rest
}: CanvasCompoundShapeLayerProps): ReactElement => {
  const layerItem: Btwx.CompoundShape = useSelector((state: RootState) => state.layer.present.byId[id] as Btwx.CompoundShape);
  const parentItem: Btwx.Artboard | Btwx.Group | Btwx.CompoundShape = useSelector((state: RootState) => layerItem ? state.layer.present.byId[layerItem.parent] as Btwx.Artboard | Btwx.Group | Btwx.CompoundShape : null);
  const artboardItem: Btwx.Artboard = useSelector((state: RootState) => layerItem ? state.layer.present.byId[layerItem.artboard] as Btwx.Artboard : null);
  const eventsById = useSelector((state: RootState) => state.layer.present.events.byId);
  const layerIndex = parentItem.children.indexOf(layerItem.id);
  const underlyingMaskIndex = layerItem.underlyingMask ? parentItem.children.indexOf(layerItem.underlyingMask) : null;
  const maskedIndex = layerIndex - underlyingMaskIndex;
  const projectIndex = artboardItem.projectIndex;
  const paperLayerScope = paperScope === 'main' ? paperMain : paperPreview;
  const deepestPathSelector = useMemo(getCompoundShapeDeepestPathSelector, []);
  const deepestSubPath = useSelector((state: RootState) => parentItem.type !== 'CompoundShape' ? deepestPathSelector(state, id) : rest.deepestSubPath);
  const [paperProject, setPaperProject] = useState(paperScope === 'main' ? paperMain.projects[projectIndex] : paperPreview.project);
  const [rendered, setRendered] = useState<boolean>(false);
  const [layerTimelines, setLayerTimelines] = useState(null);
  // triggered whenever any subpath geometry or index changes
  const [boolFlag, setBoolFlag] = useState(uuidv4());
  // triggered whenever boolFlag updates
  // causes compoundShape to re-render itself and all subpaths
  const [boolRenderFlag, setBoolRenderFlag] = useState(uuidv4());
  // triggerd when last subPath is rendered
  // lets nested compoundShape know when to apply their own bool operations
  // (need to apply subpath bool operations before compoundPath bool operations)
  const [subPathFlag, setSubPathFlag] = useState(uuidv4());
  // triggerd when sub compoundPath applys bool
  // lets compoundShape know when to update pathData
  const [subCompoundPathFlag, setSubCompoundPathFlag] = useState(uuidv4());
  const dispatch = useDispatch();

  ///////////////////////////////////////////////////////
  // HELPER FUNCTIONS
  ///////////////////////////////////////////////////////

  const createCompoundShapePath = () => {
    return new paperLayerScope.CompoundPath({
      name: 'compoundShapePath',
      position: getLayerAbsPosition(layerItem.frame, artboardItem.frame),
      insert: false,
      fillRule: layerItem.fillRule,
      closed: layerItem.closed,
      data: {
        id: 'compoundShapePath',
        type: 'LayerChild',
        layerType: 'CompoundShape',
        layerId: id
      },
      ...getPaperStyle({
        style: layerItem.style,
        textStyle: null,
        isLine: false,
        layerFrame: layerItem.frame,
        artboardFrame: artboardItem.frame
      })
    });
  }

  const createMaskGroup = (compoundShapePath: paper.CompoundPath): paper.Group => {
    return new paperLayerScope.Group({
      name: 'maskGroup',
      data: {
        id: 'maskGroup',
        type: 'LayerContainer',
        layerType: 'CompoundShape',
        layerId: id
      },
      insert: false,
      children: [
        new paperLayerScope.Path({
          name: 'mask',
          closed: layerItem.closed,
          position: compoundShapePath.position,
          fillColor: 'black',
          clipMask: true,
          data: {
            id: 'mask',
            type: 'LayerChild',
            layerType: 'CompoundShape',
            layerId: id
          },
          children: compoundShapePath.children
        }),
        compoundShapePath.clone(),
        new paperLayerScope.Group({
          name: 'maskedLayers',
          data: {
            id: 'maskedLayers',
            type: 'LayerContainer',
            layerType: 'CompoundShape',
            layerId: id
          }
        })
      ]
    });
  }

  const createCompoundShapeGroup = (): paper.Item => {
    const compoundShapeGroup = new paperLayerScope.Group({
      name: `compoundShape-${layerItem.name}`,
      insert: false,
      data: {
        id: id,
        type: 'Layer',
        layerType: 'CompoundShape',
        scope: layerItem.scope
      },
      children: [
        new paperLayerScope.Group({
          name: 'compoundShapeLayers',
          insert: false,
          visible: false,
          data: {
            id: 'compoundShapeLayers',
            type: 'LayerContainer',
            layerType: 'CompoundShape',
            layerId: id
          }
        }),
        createCompoundShapePath()
      ]
    });
    if (layerItem.mask) {
      const compoundShapePath = compoundShapeGroup.children[1] as paper.CompoundPath;
      const maskGroup = createMaskGroup(compoundShapePath);
      compoundShapePath.replaceWith(maskGroup);
    }
    return compoundShapeGroup;
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
    ? parentMaskedLayers && parentMaskedLayers.getItem({
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
    compoundShapeLayers: paper.Group;
    compoundShapePath: paper.CompoundPath;
    maskGroup: paper.Group;
    mask: paper.CompoundPath;
    maskedLayers: paper.Group;
  } => {
    // parent items
    const {
      parent,
      parentLayers
    } = getParentPaperLayer();
    // compoundShape items
    const paperLayer = parentLayers && parentLayers.getItem({
      data: { id },
      recursive: false
    }) as paper.Group;
    const compoundShapeLayers = paperLayer && paperLayer.getItem({
      data: { id: 'compoundShapeLayers' },
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
    const compoundShapePath = layerItem.mask
    ? maskGroup && maskGroup.getItem({
        data: { id: 'compoundShapePath' },
        recursive: false
      }) as paper.Path
    : paperLayer && paperLayer.getItem({
        data: { id: 'compoundShapePath' },
        recursive: false
      }) as paper.Path;
    return {
      paperLayer,
      compoundShapeLayers,
      compoundShapePath,
      maskGroup,
      mask,
      maskedLayers
    }
  }

  const applyFill = (): void => {
    const { compoundShapePath } = getPaperLayer();
    compoundShapePath.fillColor = getPaperFillColor({
      fill: layerItem.style.fill,
      isLine: false,
      layerFrame: layerItem.frame,
      artboardFrame: artboardItem.frame
    });
  }

  const applyStroke = (): void => {
    const { compoundShapePath } = getPaperLayer();
    compoundShapePath.strokeColor = getPaperStrokeColor({
      stroke: layerItem.style.stroke,
      isLine: false,
      layerFrame: layerItem.frame,
      artboardFrame: artboardItem.frame
    });
  }

  const applyShadow = (): void => {
    const { compoundShapePath } = getPaperLayer();
    if (layerItem.style.shadow.enabled) {
      compoundShapePath.shadowColor = {
        hue: layerItem.style.shadow.color.h,
        saturation: layerItem.style.shadow.color.s,
        lightness: layerItem.style.shadow.color.l,
        alpha: layerItem.style.shadow.color.a
      } as paper.Color;
      compoundShapePath.shadowBlur = layerItem.style.shadow.blur;
      compoundShapePath.shadowOffset = new paperMain.Point(layerItem.style.shadow.offset.x, layerItem.style.shadow.offset.y);
    } else {
      compoundShapePath.shadowColor = null;
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
      parentMask
    } = getParentPaperLayer();
    parentLayers.insertChild(
      getPaperLayerIndex(layerItem, parentItem),
      createCompoundShapeGroup()
    );
    setRendered(true);
    return (): void => {
      const {
        paperLayer,
        compoundShapePath,
        compoundShapeLayers,
        maskGroup,
        mask,
        maskedLayers
      } = getPaperLayer();
      if (paperLayer) {
        if (layerItem.mask) {
          // remove mask
          mask.remove();
          // move composite back into compoundShapeGroup
          paperLayer.insertChildren(1, [compoundShapePath]);
          // move masked layers out of mask group
          paperLayer.parent.insertChildren(paperLayer.index, maskedLayers.children);
        }
        paperLayer.remove();
      }
    }
  }, []);

  useEffect(() => {
    if (rendered) {
      const { compoundShapePath } = getPaperLayer();
      compoundShapePath.removeChildren();
      setBoolRenderFlag(uuidv4());
    }
  }, [boolFlag]);

  ///////////////////////////////////////////////////////
  // SUBPATH FLAG
  ///////////////////////////////////////////////////////

  useEffect(() => {
    if (rendered) {
      if (parentItem.type === 'CompoundShape') {
        if (layerItem.bool !== 'none') {
          const { parentCompoundShapePath, parentMask } = getParentPaperLayer();
          const { compoundShapePath } = getPaperLayer();
          const boolWith = parentCompoundShapePath.children[parentCompoundShapePath.children.length - 1];
          const newComposite = boolWith[layerItem.bool](compoundShapePath);
          boolWith.replaceWith(newComposite);
          if (parentItem.mask) {
            const maskBoolWith = parentMask.children[parentMask.children.length - 1];
            const newMaskComposite = boolWith[layerItem.bool](compoundShapePath);
            maskBoolWith.replaceWith(newMaskComposite);
          }
        } else {
          const { parentCompoundShapePath, parentMask } = getParentPaperLayer();
          const { compoundShapePath } = getPaperLayer();
          parentCompoundShapePath.addChild(compoundShapePath);
          if (parentItem.mask) {
            parentMask.addChild(compoundShapePath);
          }
        }
        setNestedSubCompoundPathFlag(uuidv4());
      }
    }
  }, [nestedSubPathFlag]);

  useEffect(() => {
    if (rendered) {
      const { paperLayer, compoundShapePath } = getPaperLayer();
      clearLayerTransforms({
        layerType: 'CompoundShape',
        paperLayer: paperLayer,
        transform: layerItem.transform
      });
      const innerWidth = compoundShapePath.bounds.width;
      const innerHeight = compoundShapePath.bounds.height;
      applyLayerTransforms({
        paperLayer: paperLayer,
        transform: layerItem.transform
      });
      dispatch(setPathData({
        id: id,
        pathData: compoundShapePath.pathData,
        icon: getShapeIconPathData(compoundShapePath.pathData)
      }));
      dispatch(updateCompoundShapeFrame({
        id,
        frame: {
          innerWidth,
          innerHeight,
          x: compoundShapePath.bounds.center.x - artboardItem.frame.x,
          y: compoundShapePath.bounds.center.y - artboardItem.frame.y,
          width: compoundShapePath.bounds.width,
          height: compoundShapePath.bounds.height
        }
      }));
    }
  }, [subPathFlag, subCompoundPathFlag]);

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
      if (parentItem.type === 'CompoundShape') {
        setNestedBoolFlag(uuidv4());
      } else {
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
      }
    }
  }, [layerIndex]);

  useEffect(() => {
    if (rendered) {
      const {
        paperLayer,
        compoundShapePath,
        maskGroup,
        maskedLayers,
        mask
      } = getPaperLayer();
      if (layerItem.mask) {
        const maskGroup = createMaskGroup(compoundShapePath);
        paperLayer.replaceWith(maskGroup);
      } else {
        // remove mask
        mask.remove();
        // move compoundShapePath back into compoundShapeGroup
        paperLayer.insertChildren(0, [compoundShapePath]);
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
      const { compoundShapePath } = getPaperLayer();
      compoundShapePath.opacity = layerItem.style.opacity;
    }
  }, [layerItem.style.opacity]);

  useEffect(() => {
    if (rendered) {
      const { compoundShapePath } = getPaperLayer();
      compoundShapePath.blendMode = layerItem.style.blendMode;
    }
  }, [layerItem.style.blendMode]);

  ///////////////////////////////////////////////////////
  // BLUR STYLE
  ///////////////////////////////////////////////////////

  useEffect(() => {
    if (rendered) {
      const { compoundShapePath } = getPaperLayer();
      if (layerItem.style.blur.enabled) {
        compoundShapePath.style.blur = layerItem.style.blur.radius;
      } else {
        compoundShapePath.style.blur = null;
      }
    }
  }, [layerItem.style.blur.enabled]);

  useEffect(() => {
    if (rendered) {
      if (layerItem.style.blur.enabled) {
        const { compoundShapePath } = getPaperLayer();
        compoundShapePath.style.blur = layerItem.style.blur.radius;
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
      const { compoundShapePath } = getPaperLayer();
      compoundShapePath.strokeWidth = layerItem.style.stroke.width;
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
      const { compoundShapePath } = getPaperLayer();
      compoundShapePath.strokeCap = layerItem.style.strokeOptions.cap;
    }
  }, [layerItem.style.strokeOptions.cap]);

  useEffect(() => {
    if (rendered) {
      const { compoundShapePath } = getPaperLayer();
      compoundShapePath.strokeJoin = layerItem.style.strokeOptions.join;
    }
  }, [layerItem.style.strokeOptions.join]);

  useEffect(() => {
    if (rendered) {
      const { compoundShapePath } = getPaperLayer();
      compoundShapePath.dashArray = [
        layerItem.style.strokeOptions.dashArray[0],
        layerItem.style.strokeOptions.dashArray[1]
      ];
    }
  }, [layerItem.style.strokeOptions.dashArray]);

  useEffect(() => {
    if (rendered) {
      const { compoundShapePath } = getPaperLayer();
      compoundShapePath.dashOffset = layerItem.style.strokeOptions.dashOffset;
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
      rendered && layerItem
      ? <>
          {
            layerItem.children.length > 0
            ? <>
                {
                  layerItem.children.map((childId) => (
                    <CanvasLayer
                      key={parentItem.type === 'CompoundShape' ? childId : `${childId}-${boolFlag}`}
                      id={childId}
                      paperScope={paperScope}
                      eventTimelines={eventTimelines}
                      nestedSubPathFlag={parentItem.type === 'CompoundShape' ? nestedSubPathFlag : subPathFlag}
                      setNestedSubPathFlag={parentItem.type === 'CompoundShape' ? setNestedSubPathFlag : setSubPathFlag}
                      setNestedBoolFlag={parentItem.type === 'CompoundShape' ? setNestedBoolFlag : setBoolFlag}
                      setNestedSubCompoundPathFlag={parentItem.type === 'CompoundShape' ? setNestedSubCompoundPathFlag : setSubCompoundPathFlag}
                      deepestSubPath={deepestSubPath} />
                  ))
                }
              </>
            : null
          }
          {
            eventTimelines && layerTimelines
            ? Object.keys(layerTimelines).map((eventId) => (
                <CanvasPreviewEventLayerTimeline
                  key={eventId}
                  id={id}
                  eventId={eventId}
                  layerTimeline={layerTimelines[eventId]}
                  eventTimeline={eventTimelines[eventId]}
                  nestedScrollLeft={nestedScrollLeft}
                  nestedScrollTop={nestedScrollTop} />
              ))
            : null
          }
        </>
      : null
    )
  } else {
    return (
      rendered && layerItem && layerItem.children.length > 0
      ? <>
          {
            layerItem.children.map((childId) => (
              <CanvasLayer
                key={parentItem.type === 'CompoundShape' ? childId : `${childId}-${boolRenderFlag}`}
                id={childId}
                paperScope={paperScope}
                nestedSubPathFlag={parentItem.type === 'CompoundShape' ? nestedSubPathFlag : subPathFlag}
                setNestedSubPathFlag={parentItem.type === 'CompoundShape' ? setNestedSubPathFlag : setSubPathFlag}
                setNestedBoolFlag={parentItem.type === 'CompoundShape' ? setNestedBoolFlag : setBoolFlag}
                setNestedSubCompoundPathFlag={parentItem.type === 'CompoundShape' ? setNestedSubCompoundPathFlag : setSubCompoundPathFlag}
                deepestSubPath={deepestSubPath} />
            ))
          }
        </>
      : null
    );
  }
}

export default CanvasCompoundShapeLayer;