import React, { ReactElement, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { updateHoverFrame } from '../store/actions/layer';
import { uiPaperScope } from '../canvas';

const HoverFrame = (): ReactElement => {
  const hover = useSelector((state: RootState) => state.layer.present.hover);
  const hoverItem = hover ? useSelector((state: RootState) => state.layer.present.byId[state.layer.present.hover]) : null;
  const artboardLayer = hoverItem ? hoverItem.type !== 'Artboard' : null;
  const artboard = artboardLayer ? (hoverItem as Btwx.MaskableLayer).artboard : null;
  const artboardItem = artboard ? useSelector((state: RootState) => state.layer.present.byId[artboard]) as Btwx.Artboard : null;
  const zoom = useSelector((state: RootState) => state.documentSettings.zoom);

  useEffect(() => {
    updateHoverFrame(hoverItem, artboardItem);
    return () => {
      const hoverFrame = uiPaperScope.projects[0].getItem({ data: { id: 'hoverFrame' } });
      hoverFrame.removeChildren();
    }
  }, [hover, zoom]);

  return (
    <></>
  );
}

export default HoverFrame;