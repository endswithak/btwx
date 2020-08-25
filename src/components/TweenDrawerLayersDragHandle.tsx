import React, { useContext, ReactElement, useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import styled from 'styled-components';
import { setTweenDrawerLayersWidth } from '../store/actions/canvasSettings';
import { SetTweenDrawerLayersWidthPayload, CanvasSettingsTypes } from '../store/actionTypes/canvasSettings';
import { RootState } from '../store/reducers';
import { ThemeContext } from './ThemeProvider';

gsap.registerPlugin(Draggable);

interface TweenDrawerLayersDragHandleProps {
  tweenDrawerLayersWidth?: number;
  tweenDrawerHeight?: number;
  setTweenDrawerLayersWidth?(payload: SetTweenDrawerLayersWidthPayload): CanvasSettingsTypes;
}

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

const TweenDrawerLayersDragHandle = (props: TweenDrawerLayersDragHandleProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const { tweenDrawerHeight, tweenDrawerLayersWidth, setTweenDrawerLayersWidth } = props;

  useEffect(() => {
    gsap.set(ref.current, {x: `+=${tweenDrawerLayersWidth}`});
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
        setTweenDrawerLayersWidth({width: this.x});
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
      className='c-tween-drawer__layers-drag-handle'
      theme={theme}
      dragging={dragging}
      tweenDrawerHeight={tweenDrawerHeight} />
  );
}

const mapStateToProps = (state: RootState) => {
  const { canvasSettings } = state;
  const tweenDrawerLayersWidth = canvasSettings.tweenDrawerLayersWidth;
  const tweenDrawerHeight = canvasSettings.tweenDrawerHeight;
  return { tweenDrawerLayersWidth, tweenDrawerHeight };
};

export default connect(
  mapStateToProps,
  { setTweenDrawerLayersWidth }
)(TweenDrawerLayersDragHandle);