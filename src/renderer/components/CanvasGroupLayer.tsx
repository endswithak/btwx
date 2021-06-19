import React, { ReactElement, useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import tinyColor from 'tinycolor2';
import { gsap } from 'gsap';
import { RootState } from '../store/reducers';
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
  const scrollContainer = useRef<HTMLDivElement>(null);
  const activeArtboard = useSelector((state: RootState) => state.layer.present.activeArtboard);
  const layerItem: Btwx.Group = useSelector((state: RootState) => state.layer.present.byId[id] as Btwx.Group);
  const parentItem: Btwx.Artboard | Btwx.Group = useSelector((state: RootState) => layerItem ? state.layer.present.byId[layerItem.parent] as Btwx.Artboard | Btwx.Group : null);
  const artboardItem: Btwx.Artboard = useSelector((state: RootState) => layerItem ? state.layer.present.byId[layerItem.artboard] as Btwx.Artboard : null);
  const layerIndex = parentItem.children.indexOf(layerItem.id);
  const underlyingMaskIndex = layerItem.underlyingMask ? parentItem.children.indexOf(layerItem.underlyingMask) : null;
  const maskedIndex = (layerIndex - underlyingMaskIndex) + 1;
  const projectIndex = artboardItem.projectIndex;
  const paperLayerScope = paperScope === 'main' ? paperMain : paperPreview;
  const [paperProject, setPaperProject] = useState(paperScope === 'main' ? paperMain.projects[projectIndex] : paperPreview.project);
  const [rendered, setRendered] = useState<boolean>(false);
  const [scrollX, setScrollX] = useState<number>(0);
  const [scrollY, setScrollY] = useState<number>(0);
  const [maxScrollX, setMaxScrollX] = useState<number>(Math.abs(layerItem.frame.width - layerItem.scroll.frame.width));
  const [maxScrollY, setMaxScrollY] = useState<number>(Math.abs(layerItem.frame.height - layerItem.scroll.frame.height));

  ///////////////////////////////////////////////////////
  // HELPER FUNCTIONS
  ///////////////////////////////////////////////////////

  const getScrollFramePosition = () => {
    const groupPosition = getLayerAbsPosition(layerItem.frame, artboardItem.frame);
    const scrollPosition = new paperLayerScope.Point(layerItem.scroll.frame.x, layerItem.scroll.frame.y);
    return groupPosition.add(scrollPosition);
  }

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
    const scp = getScrollFramePosition();
    const scpBounds = new paperLayerScope.Rectangle({
      from: new paperLayerScope.Point(
        scp.x - (layerItem.scroll.frame.width / 2),
        scp.y - (layerItem.scroll.frame.height / 2)
      ),
      to: new paperLayerScope.Point(
        scp.x + (layerItem.scroll.frame.width / 2),
        scp.y + (layerItem.scroll.frame.height / 2)
      )
    });
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
          rectangle: scpBounds,
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
          rectangle: scpBounds,
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
      if ((scrollX + deltaX <= maxScrollX) || (scrollX + deltaX >= -maxScrollX)) {
        setScrollX(scrollX + deltaX);
      } else {
        if (scrollX + deltaX > maxScrollX) {
          setScrollX(maxScrollX);
        }
        if (scrollX + deltaX < -maxScrollX) {
          setScrollX(-maxScrollX);
        }
      }
    }
    if (layerItem.scroll.axis.y) {
      const deltaY = e.nativeEvent.deltaY;
      if ((scrollY + deltaY <= maxScrollY) || (scrollY + deltaY >= -maxScrollY)) {
        setScrollY(scrollY + deltaY);
      } else {
        if (scrollY + deltaY > maxScrollY) {
          setScrollY(maxScrollY);
        }
        if (scrollY + deltaY < -maxScrollY) {
          setScrollY(-maxScrollY);
        }
      }
    }
  }

  useEffect(() => {
    if (rendered) {
      if (layerItem.scroll.enabled && scrollContainer.current) {
        const scp = getScrollFramePosition();
        const topLeft = new paperLayerScope.Point(
          scp.x - (layerItem.scroll.frame.width / 2),
          scp.y - (layerItem.scroll.frame.height / 2)
        );
        const viewPosition = paperMain.view.projectToView(topLeft);
        gsap.set(scrollContainer.current, {
          x: viewPosition.x,
          y: viewPosition.y
        });
      }
    }
  }, [activeArtboard]);

  useEffect(() => {
    if (rendered) {
      const { paperLayer, scrollMask } = getPaperLayer();
      if (layerItem.scroll.enabled) {
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
      }
    }
  }, [layerItem.scroll.enabled]);

  useEffect(() => {
    const gp = getLayerAbsPosition(layerItem.frame as any, artboardItem.frame);
    const gBounds = new paperLayerScope.Rectangle({
      from: new paperLayerScope.Point(
        gp.x - (layerItem.frame.width / 2),
        gp.y - (layerItem.frame.height / 2)
      ),
      to: new paperLayerScope.Point(
        gp.x + (layerItem.frame.width / 2),
        gp.y + (layerItem.frame.height / 2)
      )
    })
    const scp = getScrollFramePosition();
    const scpBounds = new paperLayerScope.Rectangle({
      from: new paperLayerScope.Point(
        scp.x - (layerItem.scroll.frame.width / 2),
        scp.y - (layerItem.scroll.frame.height / 2)
      ),
      to: new paperLayerScope.Point(
        scp.x + (layerItem.scroll.frame.width / 2),
        scp.y + (layerItem.scroll.frame.height / 2)
      )
    });
    const maxScrollX = Math.abs(layerItem.frame.width - layerItem.scroll.frame.width);
    const maxScrollY = Math.abs(layerItem.frame.height - layerItem.scroll.frame.height);
    const scrollX = scpBounds.left - gBounds.left;
    const scrollY = scpBounds.top - gBounds.top;
    if (rendered) {
      const { paperLayer, scrollMask, scrollBackground } = getPaperLayer();
      scrollMask.bounds = scpBounds;
      scrollBackground.bounds = scpBounds;
    }
    setMaxScrollX(maxScrollX);
    setMaxScrollY(maxScrollY);
    setScrollX(scrollX);
    setScrollY(scrollY);
  }, [layerItem.scroll.frame.x, layerItem.scroll.frame.y, layerItem.scroll.frame.width, layerItem.scroll.frame.height]);

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
                width: layerItem.scroll.frame.width,
                height: layerItem.scroll.frame.height,
                background: `rgba(0, 255, 255, 0.25)`
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