import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import SidebarCollapseSection from './SidebarCollapseSection';
import FillInput from './FillInput';
import FillToggle from './FillToggle';
import { RightSidebarTypes } from '../store/actionTypes/rightSidebar';
import { expandFillStyles, collapseFillStyles } from '../store/actions/rightSidebar';

interface SidebarFillStylesProps {
  selected?: string[];
  selectedType?: string;
  fillStylesCollapsed?: boolean;
  expandFillStyles?(): RightSidebarTypes;
  collapseFillStyles?(): RightSidebarTypes;
}

const SidebarFillStyles = (props: SidebarFillStylesProps): ReactElement => {
  const { selected, selectedType, fillStylesCollapsed, expandFillStyles, collapseFillStyles } = props;

  const handleClick = () => {
    if (fillStylesCollapsed) {
      expandFillStyles();
    } else {
      collapseFillStyles();
    }
  }

  return (
    selected.length === 1 && (selectedType === 'Shape' || selectedType === 'Text')
    ? <SidebarCollapseSection
        onClick={handleClick}
        collapsed={fillStylesCollapsed}
        header='fill'
        actions={[
          <FillToggle key='fillToggle' />
        ]}>
        <FillInput />
      </SidebarCollapseSection>
    : null
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer, rightSidebar } = state;
  const selected = layer.present.selected;
  const selectedType = selected.length > 0 ? layer.present.byId[selected[0]].type : null;
  const fillStylesCollapsed = rightSidebar.fillStylesCollapsed;
  return { selected, selectedType, fillStylesCollapsed };
};

export default connect(
  mapStateToProps,
  { expandFillStyles, collapseFillStyles }
)(SidebarFillStyles);