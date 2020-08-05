import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import SidebarCollapseSection from './SidebarCollapseSection';
import OpacityInput from './OpacityInput';
import { RightSidebarTypes } from '../store/actionTypes/rightSidebar';
import { expandOpacityStyles, collapseOpacityStyles } from '../store/actions/rightSidebar';

interface SidebarOpacityStylesProps {
  selected?: string[];
  selectedType?: string;
  opacityStylesCollapsed?: boolean;
  expandOpacityStyles?(): RightSidebarTypes;
  collapseOpacityStyles?(): RightSidebarTypes;
}

const SidebarOpacityStyles = (props: SidebarOpacityStylesProps): ReactElement => {
  const { selected, selectedType, opacityStylesCollapsed, expandOpacityStyles, collapseOpacityStyles } = props;

  const handleClick = () => {
    if (opacityStylesCollapsed) {
      expandOpacityStyles();
    } else {
      collapseOpacityStyles();
    }
  }

  return (
    selected.length === 1 && (selectedType === 'Shape' || selectedType === 'Text' || selectedType === 'Group' || selectedType === 'Image')
    ? <SidebarCollapseSection
        onClick={handleClick}
        collapsed={opacityStylesCollapsed}
        header='opacity'>
        <OpacityInput />
      </SidebarCollapseSection>
    : null
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer, rightSidebar } = state;
  const selected = layer.present.selected;
  const selectedType = selected.length > 0 ? layer.present.byId[selected[0]].type : null;
  const opacityStylesCollapsed = rightSidebar.opacityStylesCollapsed;
  return { selected, selectedType, opacityStylesCollapsed };
};

export default connect(
  mapStateToProps,
  { expandOpacityStyles, collapseOpacityStyles }
)(SidebarOpacityStyles);