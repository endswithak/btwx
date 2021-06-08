import React, { ReactElement, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { updateHoverFrame } from '../store/actions/layer';
import { getHoverBounds } from '../store/selectors/layer';
import { paperMain } from '../canvas';

const HoverFrame = (): ReactElement => {
  const hover = useSelector((state: RootState) => state.layer.present.hover);
  const hoverBounds = useSelector((state: RootState) => getHoverBounds(state));
  const hoverItem = useSelector((state: RootState) => state.layer.present.hover ? state.layer.present.byId[state.layer.present.hover] : null);
  const artboardItem = useSelector((state: RootState) => state.layer.present.hover && state.layer.present.byId[state.layer.present.hover].type !== 'Artboard' ? state.layer.present.byId[state.layer.present.byId[state.layer.present.hover].artboard] : null) as Btwx.Artboard;
  const zoom = useSelector((state: RootState) => state.documentSettings.zoom);

  useEffect(() => {
    updateHoverFrame(hoverItem, artboardItem);
    return (): void => {
      const hoverFrame = paperMain.projects[0].getItem({ data: { id: 'hoverFrame' } });
      hoverFrame.removeChildren();
    }
  }, [hover, hoverItem, zoom, hoverBounds]);

  return null;
}

export default HoverFrame;