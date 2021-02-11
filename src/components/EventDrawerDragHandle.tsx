import React, { ReactElement, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { paperMain } from '../canvas';
import { setEventDrawerHeight } from '../store/actions/viewSettings';
import { RootState } from '../store/reducers';
import DragHandle from './DragHandle';

const EventDrawerDragHandle = (): ReactElement => {
  const ref = useRef<HTMLDivElement>(null);
  const eventDrawerHeight = useSelector((state: RootState) => state.viewSettings.eventDrawer.height);
  const dispatch = useDispatch();

  const handleDrag = (draggable: Draggable.Vars): void => {
    const canvasContainer = document.getElementById('canvas-container');
    gsap.set('#event-drawer', {height: draggable.y * -1});
    paperMain.projects.forEach((project) => {
      if (project.activeLayer.children.length > 0) {
        project.view.viewSize.height = canvasContainer.clientHeight;
      }
    });
  }

  const handleRelease = (draggable: Draggable.Vars): void => {
    dispatch(setEventDrawerHeight({height: draggable.y * -1}));
  }

  useEffect(() => {
    if (ref.current) {
      gsap.set(ref.current, {y: -eventDrawerHeight});
    }
  }, [eventDrawerHeight]);

  return (
    <DragHandle
      ref={ref}
      side='bottom'
      bounds='#main-canvas'
      type='y'
      onDrag={handleDrag}
      onRelease={handleRelease} />
  );
}

export default EventDrawerDragHandle;