import React, { useContext, ReactElement, useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import styled from 'styled-components';
import { uiPaperScope } from '../canvas';
import { setTweenDrawerHeight } from '../store/actions/viewSettings';
import { SetTweenDrawerHeightPayload, ViewSettingsTypes } from '../store/actionTypes/viewSettings';
import { RootState } from '../store/reducers';
import { ThemeContext } from './ThemeProvider';

gsap.registerPlugin(Draggable);

interface TweenDrawerDragHandleProps {
  tweenDrawerHeight?: number;
  allPaperScopes?: string[];
  setTweenDrawerHeight?(payload: SetTweenDrawerHeightPayload): ViewSettingsTypes;
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
  const { tweenDrawerHeight, setTweenDrawerHeight, allPaperScopes } = props;

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
        allPaperScopes.forEach((key, index) => {
          uiPaperScope.projects[index].view.viewSize.height = canvasContainer.clientHeight;
        });
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

const mapStateToProps = (state: RootState): {
  tweenDrawerHeight: number;
  allPaperScopes: string[];
} => {
  const { viewSettings, layer } = state;
  const tweenDrawerHeight = viewSettings.tweenDrawer.height;
  const allPaperScopes = ['ui', ...layer.present.childrenById.root];
  return { tweenDrawerHeight, allPaperScopes };
};

export default connect(
  mapStateToProps,
  { setTweenDrawerHeight }
)(TweenDrawerDragHandle);