import React, { useContext, ReactElement, useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import styled from 'styled-components';
import { getAllPaperScopes } from '../store/selectors/layer';
import { setLeftSidebarWidth } from '../store/actions/viewSettings';
import { SetLeftSidebarWidthPayload, ViewSettingsTypes } from '../store/actionTypes/viewSettings';
import { RootState } from '../store/reducers';
import { ThemeContext } from './ThemeProvider';

gsap.registerPlugin(Draggable);

interface SidebarLeftDragHandleProps {
  sidebarWidth?: number;
  allPaperScopes?: {
    [id: string]: paper.PaperScope;
  };
  setLeftSidebarWidth?(payload: SetLeftSidebarWidthPayload): ViewSettingsTypes;
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

const SidebarLeftDragHandle = (props: SidebarLeftDragHandleProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const { sidebarWidth, setLeftSidebarWidth, allPaperScopes } = props;

  useEffect(() => {
    gsap.set(ref.current, {x: sidebarWidth});
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
        Object.keys(allPaperScopes).forEach((id) => {
          const paperScope = allPaperScopes[id];
          paperScope.view.viewSize.width = canvasContainer.clientWidth;
        });
      },
      onRelease: function() {
        setLeftSidebarWidth({width: this.x});
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
      className='c-sidebar__drag-handle c-sidebar__drag-handle--left'
      theme={theme}
      dragging={dragging} />
  );
}

const mapStateToProps = (state: RootState): {
  sidebarWidth: number;
  allPaperScopes: {
    [id: string]: paper.PaperScope;
  };
} => {
  const { viewSettings } = state;
  const sidebarWidth = viewSettings.leftSidebar.width;
  const allPaperScopes = getAllPaperScopes(state);
  return { sidebarWidth, allPaperScopes };
};

export default connect(
  mapStateToProps,
  { setLeftSidebarWidth }
)(SidebarLeftDragHandle);