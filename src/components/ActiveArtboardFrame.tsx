import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { updateActiveArtboardFrame } from '../store/actions/layer';
import { uiPaperScope } from '../canvas';
import { getActiveArtboardBounds } from '../store/selectors/layer';

interface ActiveArtboardFrameProps {
  activeArtboardBounds?: paper.Rectangle;
  zoom?: number;
}

const ActiveArtboardFrame = (props: ActiveArtboardFrameProps): ReactElement => {
  const { activeArtboardBounds, zoom } = props;

  useEffect(() => {
    updateActiveArtboardFrame(activeArtboardBounds);
    return () => {
      const activeArtboardFrame = uiPaperScope.projects[0].getItem({ data: { id: 'activeArtboardFrame' } });
      activeArtboardFrame.removeChildren();
    }
  }, [activeArtboardBounds, zoom]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  activeArtboardBounds: paper.Rectangle;
  zoom: number;
} => {
  const activeArtboardBounds = getActiveArtboardBounds(state);
  const zoom = state.documentSettings.zoom;
  return { activeArtboardBounds, zoom };
};

export default connect(
  mapStateToProps,
)(ActiveArtboardFrame);