import React, { useEffect, ReactElement, useState } from 'react';
import { useSelector } from 'react-redux';
import LayerContextMenu from './LayerContextMenu';
import EventContextMenu from './EventContextMenu';
import ArtboardPresetContextMenu from './ArtboardPresetContextMenu';
import TweenLayerContextMenu from './TweenLayerContextMenu';
import { RootState } from '../store/reducers';

const ContextMenu = (): ReactElement => {
  const contextMenuType = useSelector((state: RootState) => state.contextMenu.type);
  const contextMenuId = useSelector((state: RootState) => state.contextMenu.menuId);
  const [layerContextMenu, setLayerContextMenu] = useState<any[] | null>(null);
  const [eventContextMenu, setEventContextMenu] = useState<any[] | null>(null);
  const [artboardPresetContextMenu, setArtboardPresetContextMenu] = useState<any[] | null>(null);
  // const [tweenLayerContextMenu, setTweenLayerContextMenu] = useState<any[] | null>(null);
  const [contextMenu, setContextMenu] = useState(null);

  useEffect(() => {
    setContextMenu(contextMenuId);
  }, [contextMenuId])

  // need extra step to make sure latest context menu has been built
  useEffect(() => {
    if (contextMenu) {
      (window as any).api[`build${(contextMenuType as string)[0].toUpperCase()}${(contextMenuType as string).slice(1)}ContextMenu`](JSON.stringify({
        template: (() => {
          switch(contextMenuType) {
            case 'layer':
              return layerContextMenu;
            case 'event':
              return eventContextMenu;
            case 'artboardPreset':
              return artboardPresetContextMenu;
            // case 'tweenLayer':
            //   return tweenLayerContextMenu;
          }
        })()
      })).then(() => {
        (window as any).api.openContextMenu(JSON.stringify({
          type: contextMenuType
        }));
      });
    }
  }, [contextMenu]);

  return (
    <>
      <LayerContextMenu
        setLayerContextMenu={setLayerContextMenu} />
      <EventContextMenu
        setEventContextMenu={setEventContextMenu} />
      <ArtboardPresetContextMenu
        setArtboardPresetContextMenu={setArtboardPresetContextMenu} />
      {/* <TweenLayerContextMenu
        setTweenLayerContextMenu={setTweenLayerContextMenu} /> */}
    </>
  );
}

export default ContextMenu;