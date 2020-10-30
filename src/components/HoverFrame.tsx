import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { updateHoverFrame } from '../store/actions/layer';
import { paperMain } from '../canvas';

interface HoverFrameProps {
  hover?: string;
}

const HoverFrame = (props: HoverFrameProps): ReactElement => {
  const { hover } = props;

  useEffect(() => {
    updateHoverFrame();
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
  mapStateToProps
)(HoverFrame);