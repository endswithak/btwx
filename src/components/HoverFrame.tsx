import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { updateHoverFrame } from '../store/utils/layer';
import { LayerState } from '../store/reducers/layer';
import { paperMain } from '../canvas';

interface HoverFrameProps {
  selected?: string[];
  hover?: string;
  hoverItem?: em.Layer;
  zoom?: number;
}

const HoverFrame = (props: HoverFrameProps): ReactElement => {
  const { selected, hover, hoverItem, zoom } = props;

  const handleWheel = (e: WheelEvent) => {
    if (e.ctrlKey) {
      const hoverFrame = paperMain.project.getItem({ data: { id: 'hoverFrame' } });
      if (hoverFrame) {
        hoverFrame.remove();
      }
    }
  }

  useEffect(() => {
    updateHoverFrame({byId: hoverItem ? {[hover]: hoverItem} : {}, selected: selected, hover: hover} as LayerState);
    document.getElementById('canvas').addEventListener('wheel', handleWheel);
    return () => {
      const hoverFrame = paperMain.project.getItem({ data: { id: 'hoverFrame' } });
      document.getElementById('canvas').removeEventListener('wheel', handleWheel);
      if (hoverFrame) {
        hoverFrame.remove();
      }
    }
  }, [selected, hover, hoverItem, zoom]);

  return (
    <div />
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer, canvasSettings } = state;
  const hover = layer.present.hover;
  const hoverItem = layer.present.byId[hover];
  const selected = layer.present.selected;
  const zoom = canvasSettings.matrix[0];
  return { hover, hoverItem, selected, zoom };
};

export default connect(
  mapStateToProps
)(HoverFrame);