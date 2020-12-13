import React, { useContext, ReactElement, useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import styled from 'styled-components';
import { uiPaperScope } from '../canvas';
import { setTweenDrawerHeight } from '../store/actions/viewSettings';
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

const TweenDrawerDragHandle = (): ReactElement => {
  const theme = useContext(ThemeContext);
  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const tweenDrawerHeight = useSelector((state: RootState) => state.viewSettings.tweenDrawer.height);
  const dispatch = useDispatch();

  useEffect(() => {
    Draggable.create(ref.current, {
      type: 'y',
      zIndexBoost: false,
      bounds: '#main-canvas',
      cursor: 'row-resize',
      onPress: function() {
        setDragging(true);
      },
      onDrag: function() {
        const canvasContainer = document.getElementById('canvas-container');
        gsap.set('#tween-drawer', {height: this.y * -1});
        uiPaperScope.projects.forEach((project) => {
          if (project.activeLayer.children.length > 0) {
            project.view.viewSize.height = canvasContainer.clientHeight;
          }
        });
      },
      onRelease: function() {
        dispatch(setTweenDrawerHeight({height: this.y * -1}));
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
    gsap.set(ref.current, {y: -tweenDrawerHeight});
  }, [tweenDrawerHeight]);

  return (
    <DragHandle
      ref={ref}
      className='c-tween-drawer__drag-handle'
      theme={theme}
      dragging={dragging} />
  );
}

export default TweenDrawerDragHandle;