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
  validFillSelection?: boolean;
  shadowStylesCollapsed?: boolean;
  expandShadowStyles?(): RightSidebarTypes;
  collapseShadowStyles?(): RightSidebarTypes;
}

const SidebarShadowStyles = (props: SidebarShadowStylesProps): ReactElement => {
  const { selected, validFillSelection, shadowStylesCollapsed, expandShadowStyles, collapseShadowStyles } = props;

  const handleClick = () => {
    if (shadowStylesCollapsed) {
      expandShadowStyles();
    } else {
      collapseShadowStyles();
    }
  }

  return (
    validFillSelection
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
  const validFillSelection = !selected.some((id: string) => layer.present.byId[id].type === 'Artboard' || layer.present.byId[id].type === 'Group');
  const shadowStylesCollapsed = rightSidebar.shadowStylesCollapsed;
  return { selected, validFillSelection, shadowStylesCollapsed };
};

export default connect(
  mapStateToProps,
  { expandShadowStyles, collapseShadowStyles }
)(SidebarShadowStyles);