import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { updateHoverFrame } from '../store/actions/layer';
import { paperMain } from '../canvas';
import { getLayerProjectIndex } from '../store/selectors/layer';

interface HoverFrameProps {
  hover?: string;
  hoverProjectIndex?: number;
}

const HoverFrame = (props: HoverFrameProps): ReactElement => {
  const { hover, hoverProjectIndex } = props;

  useEffect(() => {
    updateHoverFrame(hoverProjectIndex);
    return () => {
      const hoverFrame = paperMain.projects[1].getItem({ data: { id: 'hoverFrame' } });
      hoverFrame.removeChildren();
    }
  }, [hover]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  hover: string;
  hoverProjectIndex: number;
} => {
  const { layer } = state;
  const hover = layer.present.hover;
  const hoverProjectIndex = getLayerProjectIndex(layer.present, hover);
  return { hover, hoverProjectIndex };
};

export default connect(
  mapStateToProps
)(HoverFrame);