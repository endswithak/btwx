import React, { useContext, ReactElement, useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import styled from 'styled-components';
import { setTweenDrawerLayersWidth } from '../store/actions/viewSettings';
import { RootState } from '../store/reducers';
import { ThemeContext } from './ThemeProvider';

gsap.registerPlugin(Draggable);

interface DragHandleProps {
  dragging: boolean;
  tweenDrawerHeight: number;
}

const DragHandle = styled.div<DragHandleProps>`
  opacity: ${props => props.dragging ? 0.75 : 0.33};
  :before {
    display: ${props => props.dragging ? 'block' : 'none'};
    background: ${props => props.dragging ? props.theme.palette.primary : 'none'};
    height: ${props => props.tweenDrawerHeight}px;
  }
  :hover {
    :before {
      display: block;
      background: ${props => props.theme.palette.primary};
    }
  }
`;

const TweenDrawerLayersDragHandle = (): ReactElement => {
  const theme = useContext(ThemeContext);
  const ref = useRef<HTMLDivElement>(null);
  const tweenDrawerLayersWidth = useSelector((state: RootState) => state.viewSettings.tweenDrawer.layersWidth);
  const tweenDrawerHeight = useSelector((state: RootState) => state.viewSettings.tweenDrawer.height);
  const [dragging, setDragging] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    Draggable.create(ref.current, {
      type: 'x',
      zIndexBoost: false,
      bounds: '#main-canvas',
      cursor: 'col-resize',
      onPress: function() {
        setDragging(true);
      },
      onDrag: function() {
        gsap.set('#tween-layers', {width: this.x});
      },
      onRelease: function() {
        dispatch(setTweenDrawerLayersWidth({width: this.x}));
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
    gsap.set(ref.current, {x: tweenDrawerLayersWidth});
  }, [tweenDrawerLayersWidth]);

  return (
    <DragHandle
      ref={ref}
      className='c-tween-drawer__layers-drag-handle'
      theme={theme}
      dragging={dragging}
      tweenDrawerHeight={tweenDrawerHeight} />
  );
}

export default TweenDrawerLayersDragHandle;