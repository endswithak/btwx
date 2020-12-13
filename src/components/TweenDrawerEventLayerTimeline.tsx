import React, { ReactElement } from 'react';
import { useDispatch } from 'react-redux';
import TweenDrawerEventLayerTweensTimeline from './TweenDrawerEventLayerTweensTimeline';
import { setLayerHover } from '../store/actions/layer';

interface TweenDrawerEventLayerTimelineProps {
  id: string;
}

const TweenDrawerEventLayerTimeline = (props: TweenDrawerEventLayerTimelineProps): ReactElement => {
  const { id } = props;
  const dispatch = useDispatch();

  const handleMouseEnter = () => {
    dispatch(setLayerHover({ id }));
  }

  const handleMouseLeave = () => {
    dispatch(setLayerHover({ id: null }));
  }

  return (
    <div
      className={`c-tween-drawer-event__layer-timeline`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      >
      <div className={`c-tween-drawer-event-layer__tween-timeline`} />
      <TweenDrawerEventLayerTweensTimeline layerId={id} />
    </div>
  );
}

export default TweenDrawerEventLayerTimeline;