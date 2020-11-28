import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { updateHoverFrame } from '../store/actions/layer';
import { uiPaperScope } from '../canvas';

interface HoverFrameProps {
  hover?: string;
  hoverItem?: Btwx.Layer;
  artboardItem?: Btwx.Artboard;
  zoom?: number;
}

const HoverFrame = (props: HoverFrameProps): ReactElement => {
  const { hover, hoverItem, artboardItem, zoom } = props;

  useEffect(() => {
    updateHoverFrame(hoverItem, artboardItem);
    return () => {
      const hoverFrame = uiPaperScope.project.getItem({ data: { id: 'hoverFrame' } });
      hoverFrame.removeChildren();
    }
  }, [hover, zoom]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  hover: string;
  hoverItem: Btwx.Layer;
  artboardItem: Btwx.Artboard;
  zoom: number;
} => {
  const { layer, documentSettings } = state;
  const hover = layer.present.hover;
  const hoverItem = hover ? layer.present.byId[hover] : null;
  const artboardLayer = hoverItem ? hoverItem.artboardLayer : null;
  const artboard = artboardLayer ? (hoverItem as Btwx.ArtboardLayer).artboard : null;
  const artboardItem = artboard ? layer.present.byId[artboard] as Btwx.Artboard : null;
  const zoom = documentSettings.zoom;
  return { hover, hoverItem, artboardItem, zoom };
};

export default connect(
  mapStateToProps
)(HoverFrame);