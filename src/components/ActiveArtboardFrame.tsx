import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { updateActiveArtboardFrame } from '../store/utils/layer';
import { LayerState } from '../store/reducers/layer';
import { paperMain } from '../canvas';

interface ActiveArtboardFrameProps {
  activeArtboard?: string;
  activeArtboardItem?: em.Artboard;
}

const ActiveArtboardFrame = (props: ActiveArtboardFrameProps): ReactElement => {
  const { activeArtboard, activeArtboardItem } = props;

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
    document.getElementById('canvas').addEventListener('wheel', handleWheel);
    return () => {
      const activeArtboardFrame = paperMain.project.getItem({ data: { id: 'activeArtboardFrame' } });
      document.getElementById('canvas').removeEventListener('wheel', handleWheel);
      if (activeArtboardFrame) {
        activeArtboardFrame.remove();
      }
    }
  }, [activeArtboard, activeArtboardItem]);

  return (
    <div />
  );
}

const mapStateToProps = (state: RootState): {
  activeArtboard: string;
  activeArtboardItem: em.Artboard;
} => {
  const { layer } = state;
  const activeArtboard = layer.present.activeArtboard;
  const activeArtboardItem = layer.present.byId[activeArtboard] as em.Artboard;
  return { activeArtboard, activeArtboardItem };
};

export default connect(
  mapStateToProps
)(ActiveArtboardFrame);