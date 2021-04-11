import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { getLayerAbsPosition, getPaperParent } from '../store/utils/paper';
import { paperMain, paperPreview } from '../canvas';
import CanvasLayer from './CanvasLayer';
// import CanvasPreviewLayerEvent from './CanvasPreviewLayerEvent';

interface CanvasGroupLayerProps {
  id: string;
  paperScope: Btwx.PaperScope;
}

const CanvasGroupLayer = (props: CanvasGroupLayerProps): ReactElement => {
  const { id, paperScope } = props;
  const layerItem: Btwx.Group = useSelector((state: RootState) => state.layer.present.byId[id] as Btwx.Group);
  const parentItem: Btwx.Artboard | Btwx.Group = useSelector((state: RootState) => layerItem ? state.layer.present.byId[layerItem.parent] as Btwx.Artboard | Btwx.Group : null);
  const artboardItem: Btwx.Artboard = useSelector((state: RootState) => layerItem ? state.layer.present.byId[layerItem.artboard] as Btwx.Artboard : null);
  // const tweening = useSelector((state: RootState) => state.preview.tweening === artboardItem.id);
  const layerIndex = parentItem.children.indexOf(layerItem.id);
  const underlyingMaskIndex = layerItem.underlyingMask ? parentItem.children.indexOf(layerItem.underlyingMask) : null;
  const maskedIndex = (layerIndex - underlyingMaskIndex) + 1;
  const projectIndex = artboardItem.projectIndex;
  const paperLayerScope = paperScope === 'main' ? paperMain : paperPreview;
  const paperProject = paperScope === 'main' ? paperMain.projects[projectIndex] : paperPreview.project;
  const [rendered, setRendered] = useState<boolean>(false);
  // const [prevTweening, setPrevTweening] = useState(tweening);
  // const [eventInstance, setEventInstance] = useState(0);

  ///////////////////////////////////////////////////////
  // HELPER FUNCTIONS
  ///////////////////////////////////////////////////////

  const createGroup = (): paper.Group => {
    const paperParent = getPaperParent({
      paperScope,
      projectIndex,
      parent: layerItem.parent,
      isParentArtboard: layerItem.parent === layerItem.artboard,
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
      insert: false
    });
    paperParent.insertChild(paperLayerIndex, group);
    return group;
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
  // TWEENS
  ///////////////////////////////////////////////////////

  // useEffect(() => {
  //   if (paperScope === 'preview') {
  //     if (!tweening && prevTweening) {
  //       const paperLayer = paperProject.getItem({ data: { id } });
  //       const newGroup = createGroup();
  //       newGroup.addChildren(paperLayer.children);
  //       paperLayer.replaceWith(newGroup);
  //       setEventInstance(eventInstance + 1);
  //     }
  //     setPrevTweening(tweening);
  //   }
  // }, [tweening]);

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
        }
        paperParent.insertChild(layerIndex, paperLayer);
      }
    }
  }, [layerItem.underlyingMask]);

  ///////////////////////////////////////////////////////
  // CHILDREN & EVENTS
  ///////////////////////////////////////////////////////

  if (paperScope === 'preview') {
    return (
      rendered && layerItem
      ? <>
          {
            layerItem.children.length > 0
            ? layerItem.children.map((childId) => (
                <CanvasLayer
                  key={childId}
                  id={childId}
                  paperScope={paperScope} />
              ))
            : null
          }
          {/* {
            layerItem.events.map((eventId) => (
              <CanvasPreviewLayerEvent
                key={eventId}
                eventId={eventId}
                instanceId={`${eventInstance}-${eventId}`} />
            ))
          } */}
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
                key={childId}
                id={childId}
                paperScope={paperScope} />
            ))
          }
        </>
      : null
    );
  }
}

export default CanvasGroupLayer;