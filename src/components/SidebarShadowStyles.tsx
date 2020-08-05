import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import SidebarCollapseSection from './SidebarCollapseSection';
import ColorInput from './ColorInput';
import ShadowToggle from './ShadowToggle';
import ShadowParamsInput from './ShadowParamsInput';
import { RightSidebarTypes } from '../store/actionTypes/rightSidebar';
import { expandShadowStyles, collapseShadowStyles } from '../store/actions/rightSidebar';

interface SidebarShadowStylesProps {
  selected?: string[];
  selectedType?: string;
  shadowStylesCollapsed?: boolean;
  expandShadowStyles?(): RightSidebarTypes;
  collapseShadowStyles?(): RightSidebarTypes;
}

const SidebarShadowStyles = (props: SidebarShadowStylesProps): ReactElement => {
  const { selected, selectedType, shadowStylesCollapsed, expandShadowStyles, collapseShadowStyles } = props;

  const handleClick = () => {
    if (shadowStylesCollapsed) {
      expandShadowStyles();
    } else {
      collapseShadowStyles();
    }
  }

  return (
    selected.length === 1 && (selectedType === 'Shape' || selectedType === 'Text' || selectedType === 'Image')
    ? <SidebarCollapseSection
        onClick={handleClick}
        header='shadow'
        collapsed={shadowStylesCollapsed}
        actions={[
          <ShadowToggle key='shadowToggle' />
        ]}>
        <ColorInput prop='shadow' />
        <ShadowParamsInput />
      </SidebarCollapseSection>
    : null
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer, rightSidebar } = state;
  const selected = layer.present.selected;
  const selectedType = selected.length > 0 ? layer.present.byId[selected[0]].type : null;
  const shadowStylesCollapsed = rightSidebar.shadowStylesCollapsed;
  return { selected, selectedType, shadowStylesCollapsed };
};

export default connect(
  mapStateToProps,
  { expandShadowStyles, collapseShadowStyles }
)(SidebarShadowStyles);