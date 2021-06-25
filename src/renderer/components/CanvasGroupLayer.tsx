import React, { ReactElement, useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import tinyColor from 'tinycolor2';
import { RootState } from '../store/reducers';
import { getLayerBounds, getLayerScrollBounds } from '../store/selectors/layer';
import { getLayerAbsPosition, getPaperParent } from '../store/utils/paper';
import { paperMain, paperPreview } from '../canvas';
import CanvasLayer from './CanvasLayer';

interface CanvasGroupLayerProps {
  id: string;
  paperScope: Btwx.PaperScope;
  eventTimelines?: {
    [id: string]: GSAPTimeline;
  }
}

const debug = true;

const CanvasGroupLayer = (props: CanvasGroupLayerProps): ReactElement => {
  const { id, paperScope, eventTimelines } = props;
  const paperLayerScope = paperScope === 'main' ? paperMain : paperPreview;
  const scrollContainer = useRef<HTMLDivElement>(null);
  const previewMatrix = useSelector((state: RootState) => paperScope === 'preview' ? state.preview.matrix : null);
  // const activeArtboard = useSelector((state: RootState) => state.layer.present.activeArtboard);
  const layerItem: Btwx.Group = useSelector((state: RootState) => state.layer.present.byId[id] as Btwx.Group);
  const parentItem: Btwx.Artboard | Btwx.Group = useSelector((state: RootState) => layerItem ? state.layer.present.byId[layerItem.parent] as Btwx.Artboard | Btwx.Group : null);
  const artboardItem: Btwx.Artboard = useSelector((state: RootState) => layerItem ? state.layer.present.byId[layerItem.artboard] as Btwx.Artboard : null);
  const layerItemBounds: paper.Rectangle = useSelector((state: RootState) => getLayerBounds(state.layer.present, id, paperLayerScope));
  const scrollFrameBounds = useSelector((state: RootState) => getLayerScrollBounds(state.layer.present, id, paperLayerScope));
  const layerIndex = parentItem.children.indexOf(layerItem.id);
  const underlyingMaskIndex = layerItem.underlyingMask ? parentItem.children.indexOf(layerItem.underlyingMask) : null;
  const maskedIndex = (layerIndex - underlyingMaskIndex) + 1;
  const projectIndex = artboardItem.projectIndex;
  const [paperProject, setPaperProject] = useState(paperScope === 'main' ? paperMain.projects[projectIndex] : paperPreview.project);
  const [rendered, setRendered] = useState<boolean>(false);
  const [scrollLeft, setScrollLeft] = useState<number>(0);
  const [scrollTop, setScrollTop] = useState<number>(0);
  const [prevScrollLeft, setPrevScrollLeft] = useState<number>(0);
  const [prevScrollTop, setPrevScrollTop] = useState<number>(0);
  const [scrollWidth, setScrollWidth] = useState<number>(0);
  const [scrollHeight, setScrollHeight] = useState<number>(0);

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
          paperParent = paperParent.getItem({ data:{ id:'artboardLayers' } });
        } else {
          paperParent = paperParent.getItem({ data:{ id:'groupLayers' } });
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
          paperParent = paperParent.getItem({ data:{ id:'groupLayers' } });
        }
        paperParent.insertChild(layerIndex, paperLayer);
      }
    }
  }, [layerItem.underlyingMask]);

  ///////////////////////////////////////////////////////
  // SCROLL
  ///////////////////////////////////////////////////////

  const handleWheel = (e: any) => {
    if (layerItem.scroll.direction.horizontal) {
      const deltaX = e.nativeEvent.deltaX;
      if (scrollWidth > 0) {
        if (deltaX > 0 && (scrollLeft + deltaX <= scrollWidth)) {
          setScrollLeft(scrollLeft + deltaX);
        }
        if (deltaX > 0 && (scrollLeft + deltaX > scrollWidth)) {
          setScrollLeft(scrollWidth);
        }
        if (deltaX < 0 && (scrollLeft + deltaX >= 0)) {
          setScrollLeft(scrollLeft + deltaX);
        }
        if (deltaX < 0 && (scrollLeft + deltaX < 0)) {
          setScrollLeft(0);
        }
      } else {
        if (deltaX < 0 && (scrollLeft + deltaX >= scrollWidth)) {
          setScrollLeft(scrollLeft + deltaX);
        }
        if (deltaX < 0 && (scrollLeft + deltaX < scrollWidth)) {
          setScrollLeft(scrollWidth);
        }
        if (deltaX > 0 && (scrollLeft + deltaX <= 0)) {
          setScrollLeft(scrollLeft + deltaX);
        }
        if (deltaX > 0 && (scrollLeft + deltaX > 0)) {
          setScrollLeft(0);
        }
      }
    }
    if (layerItem.scroll.direction.vertical) {
      const deltaY = e.nativeEvent.deltaY;
      if (scrollHeight > 0) {
        if (deltaY > 0 && (scrollTop + deltaY <= scrollHeight)) {
          setScrollTop(scrollTop + deltaY);
        }
        if (deltaY > 0 && (scrollTop + deltaY > scrollHeight)) {
          setScrollTop(scrollHeight);
        }
        if (deltaY < 0 && (scrollTop + deltaY >= 0)) {
          setScrollTop(scrollTop + deltaY);
        }
        if (deltaY < 0 && (scrollTop + deltaY < 0)) {
          setScrollTop(0);
        }
      } else {
        if (deltaY < 0 && (scrollTop + deltaY >= scrollHeight)) {
          setScrollTop(scrollTop + deltaY);
        }
        if (deltaY < 0 && (scrollTop + deltaY < scrollHeight)) {
          setScrollTop(scrollHeight);
        }
        if (deltaY > 0 && (scrollTop + deltaY <= 0)) {
          setScrollTop(scrollTop + deltaY);
        }
        if (deltaY > 0 && (scrollTop + deltaY > 0)) {
          setScrollTop(0);
        }
      }
    }
  }

  const handleMouseMove = (e: any) => {
    const point = paperProject.view.getEventPoint(e);
    const hitTest = paperProject.hitTest(point);
    if (hitTest.item) {
      hitTest.item.emit('mousemove', e);
    }
  }

  const handleMouseEnter = (e: any) => {
    const point = paperProject.view.getEventPoint(e);
    const hitTest = paperProject.hitTest(point);
    if (hitTest.item) {
      hitTest.item.emit('mouseenter', e);
    }
  }

  const handleMouseLeave = (e: any) => {
    const point = paperProject.view.getEventPoint(e);
    const hitTest = paperProject.hitTest(point);
    if (hitTest.item) {
      hitTest.item.emit('mouseleave', e);
    }
  }

  const handleMouseDown = (e: any) => {
    const point = paperProject.view.getEventPoint(e);
    const hitTest = paperProject.hitTest(point);
    if (hitTest.item) {
      hitTest.item.emit('mousedown', e);
    }
  }

  const handleMouseUp = (e: any) => {
    const point = paperProject.view.getEventPoint(e);
    const hitTest = paperProject.hitTest(point);
    if (hitTest.item) {
      hitTest.item.emit('mouseup', e);
    }
  }

  const handleClick = (e: any) => {
    const point = paperProject.view.getEventPoint(e);
    const hitTest = paperProject.hitTest(point);
    if (hitTest.item) {
      hitTest.item.emit('click', e);
    }
  }

  const handleDoubleClick = (e: any) => {
    const point = paperProject.view.getEventPoint(e);
    const hitTest = paperProject.hitTest(point);
    if (hitTest.item) {
      hitTest.item.emit('doubleclick', e);
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
    if (paperScope === 'preview') {
      const scrollWidth = scrollFrameBounds.width - layerItemBounds.width;
      const scrollHeight = scrollFrameBounds.height - layerItemBounds.height;
      const scrollLeft = scrollFrameBounds.left - layerItemBounds.left;
      const scrollTop = scrollFrameBounds.top - layerItemBounds.top;
      setScrollWidth(scrollWidth);
      setScrollHeight(scrollHeight);
      setScrollLeft(scrollLeft);
      setScrollTop(scrollTop);
    }
    if (rendered) {
      const { scrollMask, scrollBackground } = getPaperLayer();
      scrollMask.bounds = scrollFrameBounds;
      scrollBackground.bounds = scrollFrameBounds;
    }
  }, [
    layerItem.frame.x, layerItem.frame.y, layerItem.frame.width, layerItem.frame.height,
    layerItem.scroll.frame.x, layerItem.scroll.frame.y, layerItem.scroll.frame.width,
    layerItem.scroll.frame.height, layerItem.scroll.enabled, layerItem.scroll.direction.horizontal,
    layerItem.scroll.direction.vertical, layerItem.scroll.overflow, previewMatrix
  ]);

  useEffect(() => {
    if (rendered && paperScope === 'preview' && prevScrollLeft !== null && scrollLeft !== prevScrollLeft) {
      const { groupLayers } = getPaperLayer();
      const diff = scrollLeft - prevScrollLeft;
      groupLayers.position.x += diff;
      // translate gets weird with gradient origin/destination
      // groupLayers.translate(new paperLayerScope.Point(diff, 0));
    }
    setPrevScrollLeft(scrollLeft);
  }, [scrollLeft]);

  useEffect(() => {
    if (rendered && paperScope === 'preview' && prevScrollTop !== null && scrollTop !== prevScrollTop) {
      const { groupLayers } = getPaperLayer();
      const diff = scrollTop - prevScrollTop;
      groupLayers.position.y += diff;
      // translate gets weird with gradient origin/destination
      // groupLayers.translate(new paperLayerScope.Point(0, diff));
    }
    setPrevScrollTop(scrollTop);
  }, [scrollTop]);

  ///////////////////////////////////////////////////////
  // CHILDREN & EVENTS
  ///////////////////////////////////////////////////////

  return (
    rendered && layerItem && layerItem.children.length > 0
    ? <>
        {
          layerItem.scroll.enabled && paperScope === 'preview'
          ? <div
              ref={scrollContainer}
              style={{
                position: 'absolute',
                transformOrigin: 'left top',
                background: debug ? `rgba(0, 255, 255, 0.25)` : 'none',
                width: scrollFrameBounds.width,
                height: scrollFrameBounds.height,
                ...(() => {
                  const viewPos = paperPreview.view.projectToView(scrollFrameBounds.topLeft);
                  return {
                    left: viewPos.x,
                    top: viewPos.y
                  }
                })()
              }}
              onWheel={handleWheel}
              onMouseMove={handleMouseMove}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              onDoubleClick={handleDoubleClick}
              onContextMenu={handleClick} />
          : null
        }
        {
          layerItem.children.map((childId) => (
            <CanvasLayer
              key={childId}
              id={childId}
              paperScope={paperScope}
              eventTimelines={eventTimelines} />
          ))
        }
      </>
    : null
  );
}

export default CanvasGroupLayer;