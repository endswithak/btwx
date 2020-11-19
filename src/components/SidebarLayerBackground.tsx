import React, { useContext, ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../store/reducers';
import { ThemeContext } from './ThemeProvider';

interface SidebarLayerBackgroundProps {
  id: string;
  isDragGhost?: boolean;
  isSelected?: boolean;
  isArtboard?: boolean;
  isHovering?: boolean;
  editing?: boolean;
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
  box-shadow: 0 0 0 1px ${
    props => props.isHovering
    ? (props.isSelected || props.editing)
      ? props.theme.palette.primaryHover
      : props.theme.palette.primary
    : props.isArtboard
      ? props.theme.name === 'dark'
        ? props.theme.background.z4
        : props.theme.background.z5
      : 'none'
  } inset;
`;

const SidebarLayerBackground = (props: SidebarLayerBackgroundProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { isHovering, isSelected, isArtboard, isDragGhost, editing } = props;

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

const mapStateToProps = (state: RootState, ownProps: SidebarLayerBackgroundProps): {
  isSelected: boolean;
  isArtboard: boolean;
  isHovering: boolean;
  editing: boolean;
} => {
  const { leftSidebar, layer } = state;
  const layerItem = layer.present.byId[ownProps.id];
  const editing = leftSidebar.editing === ownProps.id;
  const isArtboard = layerItem.type === 'Artboard' && !ownProps.isDragGhost;
  const isSelected = layerItem.selected && !ownProps.isDragGhost;
  const isHovering = layerItem.hover && !ownProps.isDragGhost;
  return { isArtboard, isSelected, isHovering, editing };
};

export default connect(
  mapStateToProps
)(SidebarLayerBackground);

// import React, { useContext, ReactElement } from 'react';
// import { connect } from 'react-redux';
// import styled from 'styled-components';
// import { RootState } from '../store/reducers';
// import { ThemeContext } from './ThemeProvider';

// interface SidebarLayerBackgroundProps {
//   id: string;
//   selected: boolean;
//   hover: boolean;
//   type: Btwx.LayerType;
//   isDragGhost?: boolean;
//   editing?: boolean;
// }

// interface BackgroundProps {
//   isSelected: boolean;
//   editing: boolean;
//   isArtboard: boolean;
//   isHovering: boolean;
// }

// const Background = styled.div<BackgroundProps>`
//   background: ${
//     props => props.isSelected
//     ? props.theme.palette.primary
//     : props.isArtboard
//       ? props.theme.name === 'dark' ? props.theme.background.z3 : props.theme.background.z0
//       : 'none'
//   };
//   box-shadow: 0 0 0 1px ${
//     props => props.isHovering
//     ? props.isSelected
//       ? props.theme.palette.primaryHover
//       : props.theme.palette.primary
//     : props.isArtboard
//       ? props.theme.name === 'dark'
//         ? props.theme.background.z4
//         : props.theme.background.z5
//       : 'none'
//   } inset;
// `;

// const SidebarLayerBackground = (props: SidebarLayerBackgroundProps): ReactElement => {
//   const theme = useContext(ThemeContext);
//   const { hover, selected, type, isDragGhost, editing } = props;

//   return (
//     <Background
//       isSelected={selected && !isDragGhost}
//       editing={editing}
//       isArtboard={type === 'Artboard' && !isDragGhost}
//       isHovering={hover && !isDragGhost}
//       theme={theme}
//       className='c-sidebar-layer__background' />
//   );
// }

// export default SidebarLayerBackground;