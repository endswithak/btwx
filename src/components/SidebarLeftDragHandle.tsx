import React, { ReactElement, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { paperMain } from '../canvas';
import { setLeftSidebarWidth } from '../store/actions/viewSettings';
import { RootState } from '../store/reducers';
import DragHandle from './DragHandle';

const SidebarLeftDragHandle = (): ReactElement => {
  const ref = useRef<HTMLDivElement>(null);
  const sidebarWidth = useSelector((state: RootState) => state.viewSettings.leftSidebar.width);
  const dispatch = useDispatch();

  const handleDrag = (draggable: Draggable.Vars): void => {
    const canvasContainer = document.getElementById('canvas-container');
    gsap.set('#sidebar-left', {width: draggable.x});
    paperMain.projects.forEach((project) => {
      if (project.activeLayer.children.length > 0) {
        project.view.viewSize.width = canvasContainer.clientWidth;
      }
    });
  }

  const handleRelease = (draggable: Draggable.Vars): void => {
    dispatch(setLeftSidebarWidth({width: draggable.x}));
  }

  useEffect(() => {
    gsap.set(ref.current, {x: sidebarWidth});
  }, [sidebarWidth]);

  return (
    <DragHandle
      ref={ref}
      side='left'
      bounds='#main'
      type='x'
      onDrag={handleDrag}
      onRelease={handleRelease} />
  );
}

export default SidebarLeftDragHandle;