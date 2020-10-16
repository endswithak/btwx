import React, { useContext, ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../store/reducers';
import { ThemeContext } from './ThemeProvider';

interface SidebarLayerBackgroundProps {
  layer: string;
  isDragGhost?: boolean;
  isSelected?: boolean;
  isHovering?: boolean;
  isArtboard?: boolean;
  editing?: boolean;
}

interface BackgroundProps {
  isSelected: boolean;
  editing: boolean;
  isArtboard: boolean;
  isHovering: boolean;
}

const Background = styled.div<BackgroundProps>`
  background: ${
    props => (props.isSelected || props.editing)
    ? props.theme.palette.primary
    : props.isArtboard
      ? props.theme.name === 'dark' ? props.theme.background.z3 : props.theme.background.z0
      : 'none'
  };
  box-shadow: 0 0 0 1px ${
    props => (props.isSelected || props.isHovering)
    ? props.theme.palette.primary
    : props.isArtboard
      ? props.theme.name === 'dark'
        ? props.theme.background.z4
        : props.theme.background.z5
      : 'none'
  } inset;
`;

const SidebarLayerBackground = (props: SidebarLayerBackgroundProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { layer, isHovering, isSelected, isArtboard, editing } = props;

  useEffect(() => {
    console.log('LAYER BACKGROUND');
  }, []);

  return (
    <Background
      isSelected={isSelected}
      editing={editing}
      isArtboard={isArtboard}
      isHovering={isHovering}
      theme={theme}
      className='c-layers-sidebar-layer-item__background' />
  );
}

const mapStateToProps = (state: RootState, ownProps: SidebarLayerBackgroundProps): {
  isSelected: boolean;
  isHovering: boolean;
  isArtboard: boolean;
  editing: boolean;
} => {
  const { layer, leftSidebar } = state;
  const hover = layer.present.hover;
  const layerItem = layer.present.byId[ownProps.layer];
  const isSelected = layerItem.selected && !ownProps.isDragGhost;
  const isHovering = hover === ownProps.layer && !ownProps.isDragGhost;
  const isArtboard = layerItem.type === 'Artboard' && !ownProps.isDragGhost;
  const editing = leftSidebar.editing === ownProps.layer && !ownProps.isDragGhost;
  return { isSelected, isHovering, isArtboard, editing };
};

export default connect(
  mapStateToProps
)(SidebarLayerBackground);