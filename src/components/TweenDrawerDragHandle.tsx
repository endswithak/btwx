import React, { useContext, ReactElement, useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import styled from 'styled-components';
import { setTweenDrawerHeight } from '../store/actions/documentSettings';
import { SetTweenDrawerHeightPayload, DocumentSettingsTypes } from '../store/actionTypes/documentSettings';
import { RootState } from '../store/reducers';
import { ThemeContext } from './ThemeProvider';
import { paperMain } from '../canvas';

gsap.registerPlugin(Draggable);

interface TweenDrawerDragHandleProps {
  tweenDrawerHeight?: number;
  setTweenDrawerHeight?(payload: SetTweenDrawerHeightPayload): DocumentSettingsTypes;
}

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
      cursor: 'row-resize',
      onPress: function() {
        setDragging(true);
      },
      onDrag: function() {
        const canvasContainer = document.getElementById('canvas-container');
        gsap.set('#tween-drawer', {height: this.y * -1});
        paperMain.view.viewSize.height = canvasContainer.clientHeight;
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
  const { documentSettings } = state;
  const tweenDrawerHeight = documentSettings.view.tweenDrawer.height;
  return { tweenDrawerHeight };
};

export default connect(
  mapStateToProps,
  { setTweenDrawerHeight }
)(TweenDrawerDragHandle);