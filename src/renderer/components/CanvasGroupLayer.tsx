import React, { ReactElement, useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import tinyColor from 'tinycolor2';
import { gsap } from 'gsap';
import { RootState } from '../store/reducers';
import { getLayerBounds } from '../store/selectors/layer';
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
  const activeArtboard = useSelector((state: RootState) => state.layer.present.activeArtboard);
  const layerItem: Btwx.Group = useSelector((state: RootState) => state.layer.present.byId[id] as Btwx.Group);
  const layerItemBounds: paper.Rectangle = useSelector((state: RootState) => layerItem ? getLayerBounds(state.layer.present, id) : null);
  const scrollFrameBounds = useSelector((state: RootState) => {
    if (layerItemBounds) {
      if (layerItem.scroll.frame.x === 'auto') {
        return layerItemBounds;
      } else {
        return new paperLayerScope.Rectangle({
          point: layerItemBounds.topLeft.add(
            new paperLayerScope.Point(
              layerItem.scroll.frame.x as number,
              layerItem.scroll.frame.y as number
            )
          ),
          size: new paperLayerScope.Size(
            layerItem.scroll.frame.width as number,
            layerItem.scroll.frame.height as number
          )
        });
      }
    } else {
      return null;
    }
  });
  const parentItem: Btwx.Artboard | Btwx.Group = useSelector((state: RootState) => layerItem ? state.layer.present.byId[layerItem.parent] as Btwx.Artboard | Btwx.Group : null);
  const artboardItem: Btwx.Artboard = useSelector((state: RootState) => layerItem ? state.layer.present.byId[layerItem.artboard] as Btwx.Artboard : null);
  const layerIndex = parentItem.children.indexOf(layerItem.id);
  const underlyingMaskIndex = layerItem.underlyingMask ? parentItem.children.indexOf(layerItem.underlyingMask) : null;
  const maskedIndex = (layerIndex - underlyingMaskIndex) + 1;
  const projectIndex = artboardItem.projectIndex;
  const [paperProject, setPaperProject] = useState(paperScope === 'main' ? paperMain.projects[projectIndex] : paperPreview.project);
  const [rendered, setRendered] = useState<boolean>(false);
  const [scrollX, setScrollX] = useState<number>(0);
  const [scrollY, setScrollY] = useState<number>(0);
  const [prevScrollX, setPrevScrollX] = useState<number>(0);
  const [prevScrollY, setPrevScrollY] = useState<number>(0);
  const [maxScrollX, setMaxScrollX] = useState<number>(0);
  const [maxScrollY, setMaxScrollY] = useState<number>(0);

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
      const paperLayer = paperProject.getItem({ data: { id } });
      paperLayer.data.scope = layerItem.scope;
    }
  }, [layerItem.scope]);

  useEffect(() => {
    if (rendered) {
      const paperLayer = paperProject.getItem({ data: { id } });
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
      const paperLayer = paperProject.getItem({ data: { id } });
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
      const paperLayer = paperProject.getItem({ data: { id } });
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
    if (layerItem.scroll.axis.x) {
      const deltaX = e.nativeEvent.deltaX;
      if (maxScrollX > 0) {
        if (deltaX > 0 && (scrollX + deltaX <= maxScrollX)) {
          setScrollX(scrollX + deltaX);
        }
        if (deltaX > 0 && (scrollX + deltaX > maxScrollX)) {
          setScrollX(maxScrollX);
        }
        if (deltaX < 0 && (scrollX + deltaX >= 0)) {
          setScrollX(scrollX + deltaX);
        }
        if (deltaX < 0 && (scrollX + deltaX < 0)) {
          setScrollX(0);
        }
      } else {
        if (deltaX < 0 && (scrollX + deltaX >= maxScrollX)) {
          setScrollX(scrollX + deltaX);
        }
        if (deltaX < 0 && (scrollX + deltaX < maxScrollX)) {
          setScrollX(maxScrollX);
        }
        if (deltaX > 0 && (scrollX + deltaX <= 0)) {
          setScrollX(scrollX + deltaX);
        }
        if (deltaX > 0 && (scrollX + deltaX > 0)) {
          setScrollX(0);
        }
      }
    }
    if (layerItem.scroll.axis.y) {
      const deltaY = e.nativeEvent.deltaY;
      if (maxScrollY > 0) {
        if (deltaY > 0 && (scrollY + deltaY <= maxScrollY)) {
          setScrollY(scrollY + deltaY);
        }
        if (deltaY > 0 && (scrollY + deltaY > maxScrollY)) {
          setScrollY(maxScrollY);
        }
        if (deltaY < 0 && (scrollY + deltaY >= 0)) {
          setScrollY(scrollY + deltaY);
        }
        if (deltaY < 0 && (scrollY + deltaY < 0)) {
          setScrollY(0);
        }
      } else {
        if (deltaY < 0 && (scrollY + deltaY >= maxScrollY)) {
          setScrollY(scrollY + deltaY);
        }
        if (deltaY < 0 && (scrollY + deltaY < maxScrollY)) {
          setScrollY(maxScrollY);
        }
        if (deltaY > 0 && (scrollY + deltaY <= 0)) {
          setScrollY(scrollY + deltaY);
        }
        if (deltaY > 0 && (scrollY + deltaY > 0)) {
          setScrollY(0);
        }
      }
    }
  }

  useEffect(() => {
    if (rendered) {
      const { paperLayer, scrollMask, scrollBackground } = getPaperLayer();
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
      const maxScrollX = scrollFrameBounds.width - layerItemBounds.width;
      const maxScrollY = scrollFrameBounds.height - layerItemBounds.height;
      const scrollX = scrollFrameBounds.left - layerItemBounds.left;
      const scrollY = scrollFrameBounds.top - layerItemBounds.top;
      setMaxScrollX(maxScrollX);
      setMaxScrollY(maxScrollY);
      setScrollX(scrollX);
      setScrollY(scrollY);
    }
    if (rendered) {
      const { paperLayer, scrollMask, scrollBackground } = getPaperLayer();
      scrollMask.bounds = scrollFrameBounds;
      scrollBackground.bounds = scrollFrameBounds;
    }
  }, [
    layerItem.frame.x, layerItem.frame.y, layerItem.frame.width, layerItem.frame.height,
    layerItem.scroll.frame.x, layerItem.scroll.frame.y, layerItem.scroll.frame.width,
    layerItem.scroll.frame.height, layerItem.scroll.enabled, layerItem.scroll.axis.x,
    layerItem.scroll.axis.y, layerItem.scroll.overflow
  ]);

  // useEffect(() => {
  //   if (rendered && paperScope === 'preview') {
  //     if (!layerItem.scroll.axis.x && scrollX) {
  //       setScrollX(scrollX * -1);
  //     }
  //   }
  // }, [layerItem.scroll.axis.x]);

  // useEffect(() => {
  //   if (rendered && paperScope === 'preview') {
  //     if (!layerItem.scroll.axis.y && scrollY) {
  //       setScrollY(scrollY * -1);
  //     }
  //   }
  // }, [layerItem.scroll.axis.y]);

  useEffect(() => {
    if (rendered && paperScope === 'preview' && prevScrollX !== null && scrollX !== prevScrollX) {
      const { groupLayers } = getPaperLayer();
      const diff = scrollX - prevScrollX;
      groupLayers.position.x += diff;
      // translate gets weird with gradient origin/destination
      // groupLayers.translate(new paperLayerScope.Point(diff, 0));
    }
    setPrevScrollX(scrollX);
  }, [scrollX]);

  useEffect(() => {
    if (rendered && paperScope === 'preview' && prevScrollY !== null && scrollY !== prevScrollY) {
      const { groupLayers } = getPaperLayer();
      const diff = scrollY - prevScrollY;
      groupLayers.position.y += diff;
      // translate gets weird with gradient origin/destination
      // groupLayers.translate(new paperLayerScope.Point(0, diff));
    }
    setPrevScrollY(scrollY);
  }, [scrollY]);

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
                background: `rgba(0, 255, 255, 0.25)`,
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
              onWheel={handleWheel} />
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