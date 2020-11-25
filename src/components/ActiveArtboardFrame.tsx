import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { updateActiveArtboardFrame } from '../store/actions/layer';
import { paperMain } from '../canvas';
import { getActiveArtboardBounds } from '../store/selectors/layer';

interface ActiveArtboardFrameProps {
  activeArtboardBounds?: paper.Rectangle;
}

const ActiveArtboardFrame = (props: ActiveArtboardFrameProps): ReactElement => {
  const { activeArtboardBounds } = props;

  useEffect(() => {
    updateActiveArtboardFrame(activeArtboardBounds);
    return () => {
      const activeArtboardFrame = paperMain.projects[1].getItem({ data: { id: 'activeArtboardFrame' } });
      activeArtboardFrame.removeChildren();
    }
  }, [activeArtboardBounds]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  activeArtboardBounds: paper.Rectangle;
} => {
  const activeArtboardBounds = getActiveArtboardBounds(state);
  return { activeArtboardBounds };
};

export default connect(
  mapStateToProps,
)(ActiveArtboardFrame);