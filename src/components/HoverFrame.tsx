import React, { ReactElement, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { updateHoverFrame } from '../store/actions/layer';
import { getHoverBounds } from '../store/selectors/layer';
import { uiPaperScope } from '../canvas';

const HoverFrame = (): ReactElement => {
  const hover = useSelector((state: RootState) => state.layer.present.hover);
  const hoverBounds = useSelector((state: RootState) => getHoverBounds(state));
  const hoverItem = useSelector((state: RootState) => hover ? state.layer.present.byId[state.layer.present.hover] : null);
  const artboardLayer = hoverItem ? hoverItem.type !== 'Artboard' : null;
  const artboard = artboardLayer ? (hoverItem as Btwx.MaskableLayer).artboard : null;
  const artboardItem = useSelector((state: RootState) => artboard ? state.layer.present.byId[artboard] : null) as Btwx.Artboard;
  const zoom = useSelector((state: RootState) => state.documentSettings.zoom);

  useEffect(() => {
    updateHoverFrame(hoverItem, artboardItem);
    return (): void => {
      const hoverFrame = uiPaperScope.projects[0].getItem({ data: { id: 'hoverFrame' } });
      hoverFrame.removeChildren();
    }
  }, [hover, zoom, hoverBounds]);

  return (
    <></>
  );
}

export default HoverFrame;