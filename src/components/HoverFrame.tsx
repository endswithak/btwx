import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { updateHoverFrameThunk } from '../store/actions/layer';
import { paperMain } from '../canvas';

interface HoverFrameProps {
  hover?: string;
  updateHoverFrameThunk?(): void;
}

const HoverFrame = (props: HoverFrameProps): ReactElement => {
  const { hover, updateHoverFrameThunk } = props;

  useEffect(() => {
    updateHoverFrameThunk();
    return () => {
      const hoverFrame = paperMain.project.getItem({ data: { id: 'HoverFrame' } });
      if (hoverFrame) {
        hoverFrame.remove();
      }
    }
  }, [hover]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  hover: string;
} => {
  const { layer } = state;
  const hover = layer.present.hover;
  return { hover };
};

export default connect(
  mapStateToProps,
  { updateHoverFrameThunk }
)(HoverFrame);