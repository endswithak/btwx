import React, { useContext, ReactElement, useState } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import TweenDrawerEventLayerTweensTimeline from './TweenDrawerEventLayerTweensTimeline';
import { setLayerHover } from '../store/actions/layer';
import { SetLayerHoverPayload, LayerTypes } from '../store/actionTypes/layer';

interface TweenDrawerEventLayerTimelineProps {
  id: string;
  layer?: em.Layer;
  setLayerHover?(payload: SetLayerHoverPayload): LayerTypes;
}

const TweenDrawerEventLayerTimeline = (props: TweenDrawerEventLayerTimelineProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { id, layer, setLayerHover } = props;

  const handleMouseEnter = () => {
    setLayerHover({ id });
  }

  const handleMouseLeave = () => {
    setLayerHover({ id: null });
  }

  return (
    <div
      className={`c-tween-drawer-event__layer-timeline`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      <div className={`c-tween-drawer-event-layer__tween-timeline`} />
      <TweenDrawerEventLayerTweensTimeline layerId={id} />
    </div>
  );
}

const mapStateToProps = (state: RootState, ownProps: TweenDrawerEventLayerTimelineProps) => {
  const { layer } = state;
  return { layer: layer.present.byId[ownProps.id] };
};

export default connect(
  mapStateToProps,
  { setLayerHover }
)(TweenDrawerEventLayerTimeline);