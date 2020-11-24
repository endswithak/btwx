import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { updateActiveArtboardFrame } from '../store/actions/layer';
import { paperMain } from '../canvas';

interface ActiveArtboardFrameProps {
  activeArtboard?: string;
  activeArtboardItemFrame?: Btwx.Frame;
}

const ActiveArtboardFrame = (props: ActiveArtboardFrameProps): ReactElement => {
  const { activeArtboard, activeArtboardItemFrame } = props;

  useEffect(() => {
    updateActiveArtboardFrame(activeArtboardItemFrame);
    return () => {
      const activeArtboardFrame = paperMain.projects[1].getItem({ data: { id: 'activeArtboardFrame' } });
      activeArtboardFrame.removeChildren();
    }
  }, [activeArtboard, activeArtboardItemFrame]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  activeArtboard: string;
  activeArtboardItemFrame: Btwx.Frame;
} => {
  const { layer } = state;
  const activeArtboard = layer.present.activeArtboard;
  const activeArtboardItem = layer.present.byId[activeArtboard] as Btwx.Artboard;
  const activeArtboardItemFrame = activeArtboardItem.frame;
  return { activeArtboard, activeArtboardItemFrame };
};

export default connect(
  mapStateToProps
)(ActiveArtboardFrame);