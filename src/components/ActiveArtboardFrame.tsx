import React, { useContext, ReactElement, useEffect, useState } from 'react';
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

  useEffect(() => {
    updateActiveArtboardFrame({activeArtboard: activeArtboard, byId: {[activeArtboard]: activeArtboardItem}} as LayerState, true);
    return () => {
      const activeArtboardFrame = paperMain.project.getItem({ data: { id: 'activeArtboardFrame' } });
      if (activeArtboardFrame) {
        activeArtboardFrame.remove();
      }
    }
  }, [activeArtboard, activeArtboardItem]);

  return (
    <div />
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const activeArtboard = layer.present.activeArtboard;
  const activeArtboardItem = layer.present.byId[activeArtboard];
  return { activeArtboard, activeArtboardItem };
};

export default connect(
  mapStateToProps
)(ActiveArtboardFrame);