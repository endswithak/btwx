import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { updateActiveArtboardFrame } from '../store/utils/layer';
import { LayerState } from '../store/reducers/layer';
import { paperMain } from '../canvas';

interface ActiveArtboardFrameProps {
  activeArtboard?: string;
  activeArtboardItem?: em.Artboard;
  zoom?: number;
}

const ActiveArtboardFrame = (props: ActiveArtboardFrameProps): ReactElement => {
  const { activeArtboard, activeArtboardItem, zoom } = props;

  const handleWheel = (e: WheelEvent) => {
    if (e.ctrlKey) {
      const activeArtboardFrame = paperMain.project.getItem({ data: { id: 'activeArtboardFrame' } });
      if (activeArtboardFrame) {
        activeArtboardFrame.remove();
      }
    }
  }

  useEffect(() => {
    updateActiveArtboardFrame({activeArtboard: activeArtboard, byId: {[activeArtboard]: activeArtboardItem}} as LayerState, true);
    document.getElementById('canvas-main').addEventListener('wheel', handleWheel);
    return () => {
      const activeArtboardFrame = paperMain.project.getItem({ data: { id: 'activeArtboardFrame' } });
      document.getElementById('canvas-main').removeEventListener('wheel', handleWheel);
      if (activeArtboardFrame) {
        activeArtboardFrame.remove();
      }
    }
  }, [activeArtboard, activeArtboardItem, zoom]);

  return (
    <div />
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer, canvasSettings } = state;
  const activeArtboard = layer.present.activeArtboard;
  const activeArtboardItem = layer.present.byId[activeArtboard];
  const zoom = canvasSettings.matrix[0];
  return { activeArtboard, activeArtboardItem, zoom };
};

export default connect(
  mapStateToProps
)(ActiveArtboardFrame);