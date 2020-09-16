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
  validFillSelection?: boolean;
  fillStylesCollapsed?: boolean;
  expandFillStyles?(): RightSidebarTypes;
  collapseFillStyles?(): RightSidebarTypes;
}

const SidebarFillStyles = (props: SidebarFillStylesProps): ReactElement => {
  const { selected, validFillSelection, fillStylesCollapsed, expandFillStyles, collapseFillStyles } = props;

  const handleClick = () => {
    if (fillStylesCollapsed) {
      expandFillStyles();
    } else {
      collapseFillStyles();
    }
  }

  return (
    validFillSelection
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
  const validFillSelection = !selected.some((id: string) => layer.present.byId[id].type === 'Artboard' || layer.present.byId[id].type === 'Group' || layer.present.byId[id].type === 'Image' || (layer.present.byId[id].type === 'Shape' && (layer.present.byId[id] as em.Shape).shapeType === 'Line'));
  const fillStylesCollapsed = rightSidebar.fillStylesCollapsed;
  return { selected, validFillSelection, fillStylesCollapsed };
};

export default connect(
  mapStateToProps,
  { expandFillStyles, collapseFillStyles }
)(SidebarFillStyles);