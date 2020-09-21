import React, { ReactElement, useEffect } from 'react';
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

  useEffect(() => {
    updateActiveArtboardFrame({activeArtboard: activeArtboard, byId: {[activeArtboard]: activeArtboardItem}} as LayerState, true);
    return () => {
      const activeArtboardFrame = paperMain.project.getItem({ data: { id: 'ActiveArtboardFrame' } });
      if (activeArtboardFrame) {
        activeArtboardFrame.remove();
      }
    }
  }, [activeArtboard, activeArtboardItem, zoom]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  activeArtboard: string;
  activeArtboardItem: em.Artboard;
  zoom: number;
} => {
  const { layer, documentSettings } = state;
  const activeArtboard = layer.present.activeArtboard;
  const activeArtboardItem = layer.present.byId[activeArtboard] as em.Artboard;
  const zoom = documentSettings.matrix[0];
  return { activeArtboard, activeArtboardItem, zoom };
};

export default connect(
  mapStateToProps
)(ActiveArtboardFrame);