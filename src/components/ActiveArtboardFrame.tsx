import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { updateActiveArtboardFrame } from '../store/actions/layer';
import { paperMain } from '../canvas';

interface ActiveArtboardFrameProps {
  activeArtboard?: string;
  activeArtboardFrame?: Btwx.Frame;
}

const ActiveArtboardFrame = (props: ActiveArtboardFrameProps): ReactElement => {
  const { activeArtboard, activeArtboardFrame } = props;

  useEffect(() => {
    updateActiveArtboardFrame();
    return () => {
      const activeArtboardFrame = paperMain.project.getItem({ data: { id: 'ActiveArtboardFrame' } });
      if (activeArtboardFrame) {
        activeArtboardFrame.remove();
      }
    }
  }, [activeArtboard, activeArtboardFrame]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  activeArtboard: string;
  activeArtboardFrame: Btwx.Frame;
} => {
  const { layer } = state;
  const activeArtboard = layer.present.activeArtboard;
  const activeArtboardFrame = layer.present.byId[activeArtboard].frame;
  return { activeArtboard, activeArtboardFrame };
};

export default connect(
  mapStateToProps
)(ActiveArtboardFrame);