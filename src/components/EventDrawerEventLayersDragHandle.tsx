import React, { ReactElement, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { setEventDrawerLayersWidth } from '../store/actions/viewSettings';
import { RootState } from '../store/reducers';
import DragHandle from './DragHandle';

const EventDrawerEventLayersDragHandle = (): ReactElement => {
  const ref = useRef<HTMLDivElement>(null);
  const eventDrawerEventLayersWidth = useSelector((state: RootState) => state.viewSettings.eventDrawer.layersWidth);
  const eventDrawerHeight = useSelector((state: RootState) => state.viewSettings.eventDrawer.height);
  const dispatch = useDispatch();

  const handleDrag = (draggable: Draggable.Vars): void => {
    gsap.set('#event-layers', {width: draggable.x});
  }

  const handleRelease = (draggable: Draggable.Vars): void => {
    dispatch(setEventDrawerLayersWidth({width: draggable.x}));
  }

  useEffect(() => {
    gsap.set(ref.current, {x: eventDrawerEventLayersWidth});
  }, [eventDrawerEventLayersWidth]);

  return (
    <div className='c-event-drawer__layers-drag-handle'>
      <DragHandle
        ref={ref}
        side='left'
        bounds='#main-canvas'
        type='x'
        onDrag={handleDrag}
        onRelease={handleRelease}
        style={{
          height: eventDrawerHeight
        }} />
    </div>
  );
}

export default EventDrawerEventLayersDragHandle;