import React, { useContext, ReactElement, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../store/reducers';
import { ThemeContext } from './ThemeProvider';

interface SidebarLayerBackgroundProps {
  id: string;
  isDragGhost?: boolean;
}

interface BackgroundProps {
  isSelected: boolean;
  isArtboard: boolean;
  isHovering: boolean;
  editing: boolean;
}

const Background = styled.div<BackgroundProps>`
  background: ${
    props => (props.isSelected || props.editing)
    ? props.theme.palette.primary
    : props.isArtboard
      ? props.theme.name === 'dark' ? props.theme.background.z3 : props.theme.background.z0
      : 'none'
  };
  box-shadow: ${
    props => props.isHovering || props.isSelected || props.editing
    ? `0 0 0 1px ${props.theme.palette.primary} inset`
    : props.isArtboard
      ? props.theme.name === 'dark'
        ? `0 1px 0 0 ${props.theme.background.z4} inset, 0 1px 0 0 ${props.theme.background.z4}`
        : `0 1px 0 0 ${props.theme.background.z5} inset, 0 1px 0 0 ${props.theme.background.z5}`
      : 'none'
  };
`;

const SidebarLayerBackground = (props: SidebarLayerBackgroundProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { id, isDragGhost } = props;
  const editing = useSelector((state: RootState) => state.leftSidebar.editing === id);
  const isArtboard = useSelector((state: RootState) => state.layer.present.byId[id].type === 'Artboard' && !isDragGhost);
  const isSelected = useSelector((state: RootState) => state.layer.present.byId[id].selected && !isDragGhost);
  const isHovering = useSelector((state: RootState) => state.layer.present.byId[id].hover && !isDragGhost);

  useEffect(() => {
    console.log('LAYER BACKGROUND');
  }, []);

  return (
    <Background
      className='c-sidebar-layer__background'
      isSelected={isSelected}
      isArtboard={isArtboard}
      isHovering={isHovering}
      editing={editing}
      theme={theme} />
  );
}

export default SidebarLayerBackground;