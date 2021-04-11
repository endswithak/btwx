/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { deselectLayerEventTweens } from '../store/actions/layer';

const EventDrawerEventClearSelection = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.tweens.selected.allIds);
  const dispatch = useDispatch();

  const handleMouseDown = (e) => {
    if (selected.length > 0 && !e.metaKey) {
      dispatch(deselectLayerEventTweens({
        tweens: selected
      }));
    }
  }

  return (
    <div
      className='h-absolute-full'
      onMouseDown={handleMouseDown} />
  );
}

export default EventDrawerEventClearSelection;