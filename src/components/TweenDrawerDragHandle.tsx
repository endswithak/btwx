import React, { useContext, ReactElement, useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import styled from 'styled-components';
import { setTweenDrawerHeight } from '../store/actions/canvasSettings';
import { SetTweenDrawerHeightPayload, CanvasSettingsTypes } from '../store/actionTypes/canvasSettings';
import { RootState } from '../store/reducers';
import { ThemeContext } from './ThemeProvider';

gsap.registerPlugin(Draggable);

interface TweenDrawerDragHandleProps {
  tweenDrawerHeight?: number;
  setTweenDrawerHeight?(payload: SetTweenDrawerHeightPayload): CanvasSettingsTypes;
}

interface DragHandleProps {
  dragging: boolean;
}

const DragHandle = styled.div<DragHandleProps>`
  background: ${props => props.dragging ? props.theme.palette.primary : 'none'};
  :hover {
    background: ${props => props.theme.palette.primary};
  }
`;

const TweenDrawerDragHandle = (props: TweenDrawerDragHandleProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const { tweenDrawerHeight, setTweenDrawerHeight } = props;

  useEffect(() => {
    gsap.set(ref.current, {y: `-=${tweenDrawerHeight}`});
    Draggable.create(ref.current, {
      type: 'y',
      zIndexBoost: false,
      bounds: '#main-canvas',
      onPress: function() {
        setDragging(true);
      },
      onDrag: function() {
        gsap.set('#tween-drawer', {height: this.y * -1});
      },
      onRelease: function() {
        setTweenDrawerHeight({height: this.y * -1});
        setDragging(false);
      }
    });
    return () => {
      if (Draggable.get(ref.current)) {
        Draggable.get(ref.current).kill();
      }
    }
  }, []);

  return (
    <DragHandle
      ref={ref}
      className='c-tween-drawer__drag-handle'
      theme={theme}
      dragging={dragging} />
  );
}

const mapStateToProps = (state: RootState) => {
  const { canvasSettings } = state;
  const tweenDrawerHeight = canvasSettings.tweenDrawerHeight;
  return { tweenDrawerHeight };
};

export default connect(
  mapStateToProps,
  { setTweenDrawerHeight }
)(TweenDrawerDragHandle);