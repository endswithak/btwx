import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { deselectLayerEventTweens } from '../store/actions/layer';

const EventDrawerEventTimelineClickZone = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.tweens.selected.allIds);
  const dispatch = useDispatch();

  const handleMouseDown = (e) => {
    if (selected.length > 0 && !e.metaKey) {
      dispatch(deselectLayerEventTweens({tweens: selected}));
    }
  }

  return (
    <div
      className='c-event-drawer-event-layer__tween-timeline'
      onMouseDown={handleMouseDown} />
  );
}

export default EventDrawerEventTimelineClickZone;