import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import SidebarCollapseSection from './SidebarCollapseSection';
import OpacityInput from './OpacityInput';
import { RightSidebarTypes } from '../store/actionTypes/rightSidebar';
import { expandOpacityStyles, collapseOpacityStyles } from '../store/actions/rightSidebar';

interface SidebarOpacityStylesProps {
  isEnabled: boolean;
  opacityStylesCollapsed?: boolean;
  expandOpacityStyles?(): RightSidebarTypes;
  collapseOpacityStyles?(): RightSidebarTypes;
}

const SidebarOpacityStyles = (props: SidebarOpacityStylesProps): ReactElement => {
  const { isEnabled, opacityStylesCollapsed, expandOpacityStyles, collapseOpacityStyles } = props;

  const handleClick = () => {
    if (opacityStylesCollapsed) {
      expandOpacityStyles();
    } else {
      collapseOpacityStyles();
    }
  }

  return (
    isEnabled
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
  const opacityStylesCollapsed = rightSidebar.opacityStylesCollapsed;
  const isEnabled = selected.length > 0 && !selected.some((id: string) => layer.present.byId[id].type === 'Artboard' || layer.present.byId[id].type === 'Group');
  return { opacityStylesCollapsed, isEnabled };
};

export default connect(
  mapStateToProps,
  { expandOpacityStyles, collapseOpacityStyles }
)(SidebarOpacityStyles);