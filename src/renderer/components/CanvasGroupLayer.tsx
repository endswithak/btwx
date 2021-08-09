import React, { ReactElement, useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import tinyColor from 'tinycolor2';
import { RootState } from '../store/reducers';
import { getLayerBounds, getLayerScrollBounds, getLayerScrollFrameBounds } from '../store/selectors/layer';
import { getLayerAbsPosition, getPaperParent } from '../store/utils/paper';
import { paperMain, paperPreview } from '../canvas';
import CanvasLayer from './CanvasLayer';

interface CanvasGroupLayerProps {
  id: string;
  paperScope: Btwx.PaperScope;
  eventTimelines?: {
    [id: string]: GSAPTimeline;
  };
  nestedScrollLeft?: number;
  nestedScrollTop?: number;
  wheelEvent?: any;
}

const debug = false;

const CanvasGroupLayer = (props: CanvasGroupLayerProps): ReactElement => {
  const { id, paperScope, eventTimelines, wheelEvent, nestedScrollLeft = 0, nestedScrollTop = 0 } = props;
  const paperLayerScope = paperScope === 'main' ? paperMain : paperPreview;
  // const activeArtboard = useSelector((state: RootState) => state.layer.present.activeArtboard);
  const layerItem: Btwx.Group = useSelector((state: RootState) => state.layer.present.byId[id] as Btwx.Group);
  const parentItem: Btwx.Artboard | Btwx.Group = useSelector((state: RootState) => layerItem ? state.layer.present.byId[layerItem.parent] as Btwx.Artboard | Btwx.Group : null);
  const artboardItem: Btwx.Artboard = useSelector((state: RootState) => layerItem ? state.layer.present.byId[layerItem.artboard] as Btwx.Artboard : null);
  const layerItemBounds = useSelector((state: RootState) => getLayerBounds(state.layer.present, id, paperLayerScope));
  const scrollFrameBounds = useSelector((state: RootState) => getLayerScrollFrameBounds(state.layer.present, id, paperLayerScope));
  const nestedScrollFrameBounds = scrollFrameBounds ? new paperPreview.Rectangle({
    point: scrollFrameBounds.topLeft.add(
      new paperPreview.Point(nestedScrollLeft, nestedScrollTop)
    ),
    size: scrollFrameBounds.size
  }) : null;
  const isTweening = useSelector((state: RootState) => state.preview.tweening);
  // const scrollBounds = useSelector((state: RootState) => getLayerScrollBounds(state.layer.present, id, paperLayerScope));
  const layerIndex = parentItem.children.indexOf(layerItem.id);
  const underlyingMaskIndex = layerItem.underlyingMask ? parentItem.children.indexOf(layerItem.underlyingMask) : null;
  const maskedIndex = (layerIndex - underlyingMaskIndex) + 1;
  const projectIndex = artboardItem.projectIndex;
  const [paperProject, setPaperProject] = useState(paperScope === 'main' ? paperMain.projects[projectIndex] : paperPreview.project);
  const [rendered, setRendered] = useState<boolean>(false);
  const [scrollLeft, setScrollLeft] = useState<number>(layerItem.scroll.scrollLeft);
  const [scrollTop, setScrollTop] = useState<number>(layerItem.scroll.scrollTop);
  const [scrollWidth, setScrollWidth] = useState<number>(scrollFrameBounds.width - layerItemBounds.width);
  const [scrollHeight, setScrollHeight] = useState<number>(scrollFrameBounds.height - layerItemBounds.height);
  const [scrollBounds, setScrollBounds] = useState(nestedScrollFrameBounds);

  ///////////////////////////////////////////////////////
  // HELPER FUNCTIONS
  ///////////////////////////////////////////////////////

  const createGroup = (): paper.Group => {
    const paperParent = getPaperParent({
      paperScope,
      projectIndex,
      parent: layerItem.parent,
      parentType: parentItem.type,
      masked: layerItem.masked,
      underlyingMask: layerItem.underlyingMask
    });
    const layerIndex = parentItem.children.indexOf(id);
    const underlyingMaskIndex = layerItem.underlyingMask ? parentItem.children.indexOf(layerItem.underlyingMask) : null;
    const paperLayerIndex = layerItem.masked ? (layerIndex - underlyingMaskIndex) + 1 : layerIndex;
    const group = new paperLayerScope.Group({
      name: `group-${layerItem.name}`,
      data: {
        id: id,
        type: 'Layer',
        layerType: 'Group',
        scope: layerItem.scope
      },
      position: getLayerAbsPosition(layerItem.frame, artboardItem.frame),
      insert: false,
      children: [
        new paperLayerScope.Path.Rectangle({
          rectangle: scrollFrameBounds,
          position: scrollFrameBounds.center,
          data: {
            id: 'scrollMask',
            type: 'LayerChild',
            layerType: 'Group',
            layerId: id
          },
          clipMask: layerItem.scroll.overflow === 'hidden',
          visible: layerItem.scroll.overflow === 'hidden'
        }),
        new paperLayerScope.Path.Rectangle({
          rectangle: scrollFrameBounds,
          position: scrollFrameBounds.center,
          fillColor: debug ? tinyColor('red').setAlpha(0.25).toRgbString() : tinyColor('#fff').setAlpha(0.01).toRgbString(),
          blendMode: debug ? 'normal' : 'multiply',
          data: {
            id: 'scrollBackground',
            type: 'LayerChild',
            layerType: 'Group',
            layerId: id
          }
        }),
        new paperLayerScope.Group({
          data: {
            id: 'groupLayers',
            type: 'LayerContainer',
            layerType: 'Group',
            layerId: id
          }
        })
      ]
    });
    // group.position = getLayerAbsPosition(layerItem.frame, artboardItem.frame);
    paperParent.insertChild(paperLayerIndex, group);
    return group;
  }

  const getPaperLayer = (): {
    paperLayer: paper.Group;
    groupLayers: paper.Group;
    scrollBackground: paper.Path.Rectangle;
    scrollMask: paper.Path.Rectangle;
  } => {
    const paperLayer = paperProject.getItem({ data: { id } }) as paper.Group;
    if (paperLayer) {
      const groupLayers = paperLayer.getItem({ data: { id: 'groupLayers' } }) as paper.Group;
      const scrollBackground = paperLayer.getItem({ data: { id: 'scrollBackground' } }) as paper.Path.Rectangle;
      const scrollMask = paperLayer.getItem({ data: { id: 'scrollMask' } }) as paper.Path.Rectangle;
      return {
        paperLayer,
        groupLayers,
        scrollBackground,
        scrollMask
      };
    } else {
      return {
        paperLayer: null,
        groupLayers: null,
        scrollBackground: null,
        scrollMask: null
      }
    }
  }

  ///////////////////////////////////////////////////////
  // INIT
  ///////////////////////////////////////////////////////

  useEffect(() => {
    // build layer
    createGroup();
    setRendered(true);
    return (): void => {
      // remove layer
      const paperLayer = paperProject.getItem({ data: { id } });
      if (paperLayer) {
        paperLayer.remove();
      }
    }
  }, []);

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
          paperParent = paperParent.getItem({ data: { id:'artboardLayers' } });
        } else {
          paperParent = paperParent.getItem({ data: { id:'groupLayers' } });
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
        } else {
          paperParent = paperParent.getItem({ data: { id:'groupLayers' } });
        }
        paperParent.insertChild(layerIndex, paperLayer);
      }
    }
  }, [layerItem.underlyingMask]);

  ///////////////////////////////////////////////////////
  // SCROLL
  ///////////////////////////////////////////////////////

  const handleWheel = (e: any) => {
    if ((layerItem.scroll.direction.horizontal && (Math.abs(e.nativeEvent.deltaX) > Math.abs(e.nativeEvent.deltaY))) || (layerItem.scroll.direction.vertical && (Math.abs(e.nativeEvent.deltaX) < Math.abs(e.nativeEvent.deltaY))) || (layerItem.scroll.direction.horizontal && layerItem.scroll.direction.vertical)) {
      if (layerItem.scroll.direction.horizontal) {
        const deltaX = e.nativeEvent.deltaX;
        const sl = scrollLeft + deltaX;
        if (scrollWidth > 0) {
          if (deltaX > 0 && (sl <= scrollWidth)) {
            setScrollLeft(sl);
          }
          if (deltaX > 0 && (sl > scrollWidth)) {
            setScrollLeft(scrollWidth);
          }
          if (layerItemBounds.left > scrollFrameBounds.left) {
            if (deltaX < 0 && (sl >= 0)) {
              setScrollLeft(sl);
            }
            if (deltaX < 0 && (sl < 0)) {
              setScrollLeft(0);
            }
          } else {
            if (deltaX < 0 && (sl >= layerItemBounds.left - scrollFrameBounds.left)) {
              setScrollLeft(sl);
            }
            if (deltaX < 0 && (sl < layerItemBounds.left - scrollFrameBounds.left)) {
              setScrollLeft(layerItemBounds.left - scrollFrameBounds.left);
            }
          }
        } else {
          if (deltaX < 0 && (sl >= scrollWidth)) {
            setScrollLeft(sl);
          }
          if (deltaX < 0 && (sl < scrollWidth)) {
            setScrollLeft(scrollWidth);
          }
          if (layerItemBounds.top > scrollFrameBounds.top) {
            if (deltaX > 0 && (sl <= layerItemBounds.left - scrollFrameBounds.left)) {
              setScrollLeft(sl);
            }
            if (deltaX > 0 && (sl > layerItemBounds.left - scrollFrameBounds.left)) {
              setScrollLeft(layerItemBounds.left - scrollFrameBounds.left);
            }
          } else {
            if (deltaX > 0 && (sl <= 0)) {
              setScrollLeft(sl);
            }
            if (deltaX > 0 && (sl > 0)) {
              setScrollLeft(0);
            }
          }
        }
      }
      if (layerItem.scroll.direction.vertical) {
        const deltaY = e.nativeEvent.deltaY;
        const st = scrollTop + deltaY;
        if (scrollHeight > 0) {
          if (deltaY > 0 && (st <= scrollHeight)) {
            setScrollTop(st);
          }
          if (deltaY > 0 && (st > scrollHeight)) {
            setScrollTop(scrollHeight);
          }
          if (layerItemBounds.top > scrollFrameBounds.top) {
            if (deltaY < 0 && (st >= 0)) {
              setScrollTop(st);
            }
            if (deltaY < 0 && (st < 0)) {
              setScrollTop(0);
            }
          } else {
            if (deltaY < 0 && (st >= layerItemBounds.top - scrollFrameBounds.top)) {
              setScrollTop(st);
            }
            if (deltaY < 0 && (st < layerItemBounds.top - scrollFrameBounds.top)) {
              setScrollTop(layerItemBounds.top - scrollFrameBounds.top);
            }
          }
        } else {
          if (deltaY < 0 && (st >= scrollHeight)) {
            setScrollTop(st);
          }
          if (deltaY < 0 && (st < scrollHeight)) {
            setScrollTop(scrollHeight);
          }
          if (layerItemBounds.top > scrollFrameBounds.top) {
            if (deltaY > 0 && (st <= layerItemBounds.top - scrollFrameBounds.top)) {
              setScrollTop(st);
            }
            if (deltaY > 0 && (st > layerItemBounds.top - scrollFrameBounds.top)) {
              setScrollTop(layerItemBounds.top - scrollFrameBounds.top);
            }
          } else {
            if (deltaY > 0 && (st <= 0)) {
              setScrollTop(st);
            }
            if (deltaY > 0 && (st > 0)) {
              setScrollTop(0);
            }
          }
        }
      }
    }
  }

  useEffect(() => {
    if (rendered) {
      const { scrollMask, scrollBackground } = getPaperLayer();
      if (layerItem.scroll.enabled) {
        scrollBackground.visible = true;
        switch(layerItem.scroll.overflow) {
          case 'visible':
            scrollMask.clipMask = false;
            scrollMask.visible = false;
            break;
          case 'hidden':
            scrollMask.visible = true;
            scrollMask.clipMask = true;
            break;
        }
      } else {
        scrollMask.clipMask = false;
        scrollMask.visible = false;
        scrollBackground.visible = false;
      }
    }
  }, [layerItem.scroll.enabled, layerItem.scroll.overflow]);

  useEffect(() => {
    if (rendered) {
      if (paperScope === 'preview') {
        setScrollWidth(scrollFrameBounds.width - layerItemBounds.width);
        setScrollLeft(layerItem.scroll.scrollLeft);
        setScrollHeight(scrollFrameBounds.height - layerItemBounds.height);
        setScrollTop(layerItem.scroll.scrollTop);
        setScrollBounds(nestedScrollFrameBounds);
      } else {
        setScrollBounds(scrollFrameBounds);
      }
    }
  }, [
    layerItem.frame.x, layerItem.frame.y, layerItem.frame.width, layerItem.frame.height,
    layerItem.scroll.frame.x, layerItem.scroll.frame.y, layerItem.scroll.frame.width,
    layerItem.scroll.frame.height, layerItem.scroll.enabled, layerItem.scroll.direction.horizontal,
    layerItem.scroll.direction.vertical, layerItem.scroll.overflow, layerItem.scroll.scrollLeft,
    layerItem.scroll.scrollTop, layerItem.scroll.scrollHeight, layerItem.scroll.scrollWidth,
    layerItem.scope
  ]);

  useEffect(() => {
    if (rendered && paperScope === 'preview' && !isTweening) {
      setScrollWidth(scrollFrameBounds.width - layerItemBounds.width);
      setScrollLeft(layerItem.scroll.scrollLeft);
      setScrollHeight(scrollFrameBounds.height - layerItemBounds.height);
      setScrollTop(layerItem.scroll.scrollTop);
      setScrollBounds(nestedScrollFrameBounds);
    }
  }, [isTweening]);

  useEffect(() => {
    if (rendered && paperScope === 'preview') {
      setScrollBounds(nestedScrollFrameBounds);
    }
  }, [nestedScrollLeft, nestedScrollTop]);

  useEffect(() => {
    if (rendered) {
      const { scrollMask, scrollBackground, groupLayers } = getPaperLayer();
      scrollMask.bounds = scrollBounds;
      scrollBackground.bounds = scrollBounds;
      if (paperScope === 'preview') {
        groupLayers.bounds.left = scrollBounds.left + scrollLeft;
        groupLayers.bounds.top = scrollBounds.top + scrollTop;
      }
    }
  }, [scrollBounds, scrollLeft, scrollTop]);

  useEffect(() => {
    if (rendered && paperScope === 'preview' && wheelEvent) {
      const point = paperProject.view.getEventPoint(wheelEvent);
      if (point.isInside(scrollBounds)) {
        handleWheel(wheelEvent);
      }
    }
  }, [wheelEvent]);

  ///////////////////////////////////////////////////////
  // CHILDREN & EVENTS
  ///////////////////////////////////////////////////////

  return (
    rendered && layerItem && layerItem.children.length > 0
    ? <>
        {
          layerItem.children.map((childId) => (
            <CanvasLayer
              key={childId}
              id={childId}
              paperScope={paperScope}
              eventTimelines={eventTimelines}
              wheelEvent={wheelEvent}
              nestedScrollLeft={(nestedScrollLeft + scrollLeft) - layerItem.scroll.scrollLeft}
              nestedScrollTop={(nestedScrollTop + scrollTop) - layerItem.scroll.scrollTop} />
          ))
        }
      </>
    : null
  );
}

export default CanvasGroupLayer;