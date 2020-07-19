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
}

const HoverFrame = (props: HoverFrameProps): ReactElement => {
  const { selected, hover, hoverItem } = props;

  const handleWheel = (e: WheelEvent) => {
    if (e.ctrlKey) {
      updateHoverFrame({selected: selected, hover: hover} as LayerState);
    }
  }

  useEffect(() => {
    updateHoverFrame({selected: selected, hover: hover} as LayerState);
    document.getElementById('canvas-main').addEventListener('wheel', handleWheel);
    return () => {
      const hoverFrame = paperMain.project.getItem({ data: { id: 'hoverFrame' } });
      document.getElementById('canvas-main').removeEventListener('wheel', handleWheel);
      if (hoverFrame) {
        hoverFrame.remove();
      }
    }
  }, [selected, hover, hoverItem]);

  return (
    <div />
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const hover = layer.present.hover;
  const hoverItem = layer.present.byId[hover];
  const selected = layer.present.selected;
  return { hover, hoverItem, selected };
};

export default connect(
  mapStateToProps
)(HoverFrame);