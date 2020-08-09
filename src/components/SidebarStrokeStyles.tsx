import React, { useContext, ReactElement } from 'react';
import { connect } from 'react-redux';
import SidebarCollapseSection from './SidebarCollapseSection';
import StrokeInput from './StrokeInput';
import SidebarStrokeOptionsStyle from './SidebarStrokeOptionsStyle';
import StrokeOptionsToggle from './StrokeOptionsToggle';
import StrokeToggle from './StrokeToggle';
import StrokeParamsInput from './StrokeParamsInput';
import { RootState } from '../store/reducers';
import { ThemeContext } from './ThemeProvider';
import { RightSidebarTypes } from '../store/actionTypes/rightSidebar';
import { expandStrokeStyles, collapseStrokeStyles, expandStrokeOptionsStyles, collapseStrokeOptionsStyles } from '../store/actions/rightSidebar';

interface SidebarStrokeStylesProps {
  selected?: string[];
  validFillSelection?: boolean;
  strokeStylesCollapsed?: boolean;
  strokeOptionsStylesCollapsed?: boolean;
  expandStrokeStyles?(): RightSidebarTypes;
  collapseStrokeStyles?(): RightSidebarTypes;
  expandStrokeOptionsStyles?(): RightSidebarTypes;
  collapseStrokeOptionsStyles?(): RightSidebarTypes;
}

const SidebarStrokeStyles = (props: SidebarStrokeStylesProps): ReactElement => {
  const { selected, validFillSelection, strokeStylesCollapsed, expandStrokeStyles, collapseStrokeStyles, strokeOptionsStylesCollapsed, expandStrokeOptionsStyles, collapseStrokeOptionsStyles } = props;
  const theme = useContext(ThemeContext);

  const handleClick = () => {
    if (strokeStylesCollapsed) {
      expandStrokeStyles();
    } else {
      collapseStrokeStyles();
    }
  }

  const handleOptionsClick = () => {
    if (strokeOptionsStylesCollapsed) {
      expandStrokeOptionsStyles();
    } else {
      collapseStrokeOptionsStyles();
    }
  }

  return (
    validFillSelection
    ? <SidebarCollapseSection
        onClick={handleClick}
        collapsed={strokeStylesCollapsed}
        header='stroke'
        actions={[
          <StrokeOptionsToggle
            showOptions={strokeOptionsStylesCollapsed}
            onClick={handleOptionsClick}
            key='strokeOptions' />,
          <StrokeToggle key='strokeToggle' />
        ]}>
        <StrokeInput />
        <StrokeParamsInput />
        {
          strokeOptionsStylesCollapsed
          ? <SidebarStrokeOptionsStyle />
          : null
        }
      </SidebarCollapseSection>
    : null
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer, rightSidebar } = state;
  const selected = layer.present.selected;
  const validFillSelection = !selected.some((id: string) => layer.present.byId[id].type === 'Artboard' || layer.present.byId[id].type === 'Group' || layer.present.byId[id].type === 'Image');
  const strokeStylesCollapsed = rightSidebar.strokeStylesCollapsed;
  const strokeOptionsStylesCollapsed = rightSidebar.strokeOptionsStylesCollapsed;
  return { selected, validFillSelection, strokeStylesCollapsed, strokeOptionsStylesCollapsed };
};

export default connect(
  mapStateToProps,
  { expandStrokeStyles, collapseStrokeStyles, expandStrokeOptionsStyles, collapseStrokeOptionsStyles }
)(SidebarStrokeStyles);