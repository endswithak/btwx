import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
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
import { expandStrokeStyles, collapseStrokeStyles } from '../store/actions/rightSidebar';

interface SidebarStrokeStylesProps {
  selected?: string[];
  validFillSelection?: boolean;
  strokeStylesCollapsed?: boolean;
  expandStrokeStyles?(): RightSidebarTypes;
  collapseStrokeStyles?(): RightSidebarTypes;
}

const SidebarStrokeStyles = (props: SidebarStrokeStylesProps): ReactElement => {
  const [showOptions, setShowOptions] = useState(false);
  const { selected, validFillSelection, strokeStylesCollapsed, expandStrokeStyles, collapseStrokeStyles } = props;
  const theme = useContext(ThemeContext);

  const handleClick = () => {
    if (strokeStylesCollapsed) {
      expandStrokeStyles();
    } else {
      collapseStrokeStyles();
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
            showOptions={showOptions}
            setShowOptions={setShowOptions}
            key='strokeOptions' />,
          <StrokeToggle key='strokeToggle' />
        ]}>
        <StrokeInput />
        <StrokeParamsInput />
        {
          showOptions
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
  const validFillSelection = !selected.some((id: string) => layer.present.byId[id].type === 'Artboard' || layer.present.byId[id].type === 'Group');
  const strokeStylesCollapsed = rightSidebar.strokeStylesCollapsed;
  return { selected, validFillSelection, strokeStylesCollapsed };
};

export default connect(
  mapStateToProps,
  { expandStrokeStyles, collapseStrokeStyles }
)(SidebarStrokeStyles);