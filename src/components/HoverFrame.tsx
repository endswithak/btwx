import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { updateHoverFrame } from '../store/actions/layer';
import { paperMain } from '../canvas';

interface HoverFrameProps {
  hover?: string;
  hoverItem?: Btwx.Layer;
  artboardItem?: Btwx.Artboard;
}

const HoverFrame = (props: HoverFrameProps): ReactElement => {
  const { hover, hoverItem, artboardItem } = props;

  useEffect(() => {
    updateHoverFrame(hoverItem, artboardItem);
    return () => {
      const hoverFrame = paperMain.projects[1].getItem({ data: { id: 'hoverFrame' } });
      hoverFrame.removeChildren();
    }
  }, [hover]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  hover: string;
  hoverItem: Btwx.Layer;
  artboardItem: Btwx.Artboard;
} => {
  const { layer } = state;
  const hover = layer.present.hover;
  const hoverItem = hover ? layer.present.byId[hover] : null;
  const artboardLayer = hoverItem ? hoverItem.artboardLayer : null;
  const artboard = artboardLayer ? (hoverItem as Btwx.ArtboardLayer).artboard : null;
  const artboardItem = artboard ? layer.present.byId[artboard] as Btwx.Artboard : null;
  return { hover, hoverItem, artboardItem };
};

export default connect(
  mapStateToProps
)(HoverFrame);