import React, { useContext, ReactElement, useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import styled from 'styled-components';
import { uiPaperScope } from '../canvas';
import { setLeftSidebarWidth } from '../store/actions/viewSettings';
import { RootState } from '../store/reducers';
import { ThemeContext } from './ThemeProvider';

gsap.registerPlugin(Draggable);

interface DragHandleProps {
  dragging: boolean;
}

const DragHandle = styled.div<DragHandleProps>`
  background: ${props => props.dragging ? props.theme.palette.primary : 'none'};
  opacity: ${props => props.dragging ? 0.75 : 0.33};
  :hover {
    background: ${props => props.theme.palette.primary};
  }
`;

const SidebarLeftDragHandle = (): ReactElement => {
  const theme = useContext(ThemeContext);
  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const sidebarWidth = useSelector((state: RootState) => state.viewSettings.leftSidebar.width);
  const dispatch = useDispatch();

  useEffect(() => {
    Draggable.create(ref.current, {
      type: 'x',
      zIndexBoost: false,
      bounds: '#main',
      cursor: 'col-resize',
      onPress: function() {
        setDragging(true);
      },
      onDrag: function() {
        const canvasContainer = document.getElementById('canvas-container');
        gsap.set('#sidebar-left', {width: this.x});
        uiPaperScope.projects.forEach((project) => {
          if (project.activeLayer.children.length > 0) {
            project.view.viewSize.width = canvasContainer.clientWidth;
          }
        });
      },
      onRelease: function() {
        dispatch(setLeftSidebarWidth({width: this.x}));
        setDragging(false);
      }
    });
    return () => {
      if (Draggable.get(ref.current)) {
        Draggable.get(ref.current).kill();
      }
    }
  }, []);

  useEffect(() => {
    gsap.set(ref.current, {x: sidebarWidth});
  }, [sidebarWidth]);

  return (
    <DragHandle
      ref={ref}
      className='c-sidebar__drag-handle c-sidebar__drag-handle--left'
      theme={theme}
      dragging={dragging} />
  );
}

export default SidebarLeftDragHandle;