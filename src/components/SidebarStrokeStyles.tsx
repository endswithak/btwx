import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import SidebarSectionWrap from './SidebarSectionWrap';
import SidebarSection from './SidebarSection';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarSectionHead from './SidebarSectionHead';
import StrokeInput from './StrokeInput';
import SidebarStrokeOptionsStyle from './SidebarStrokeOptionsStyle';
import StrokeOptionsToggle from './StrokeOptionsToggle';
import StrokeToggle from './StrokeToggle';
import StrokeDashInput from './StrokeDashInput';
import StrokeGapInput from './StrokeGapInput';
import StrokeWidthInput from './StrokeWidthInput';
import { RootState } from '../store/reducers';
import { ThemeContext } from './ThemeProvider';

interface SidebarStrokeStylesProps {
  selected?: string[];
  selectedType?: string;
}

const SidebarStrokeStyles = (props: SidebarStrokeStylesProps): ReactElement => {
  const [showOptions, setShowOptions] = useState(false);
  const { selected, selectedType } = props;
  const theme = useContext(ThemeContext);

  return (
    selected.length === 1 && (selectedType === 'Shape' || selectedType === 'Text')
    ? <SidebarSectionWrap topBorder>
        <SidebarSection>
          <SidebarSectionRow>
            <SidebarSectionColumn width='50%'>
              <SidebarSectionRow>
                <SidebarSectionHead text={'stroke'} />
              </SidebarSectionRow>
            </SidebarSectionColumn>
            <SidebarSectionColumn width='50%'>
              <SidebarSectionRow justifyContent='flex-end'>
                <StrokeOptionsToggle
                  showOptions={showOptions}
                  setShowOptions={setShowOptions} />
                <StrokeToggle />
              </SidebarSectionRow>
            </SidebarSectionColumn>
          </SidebarSectionRow>
          <SidebarSectionRow>
            <StrokeInput />
          </SidebarSectionRow>
          <SidebarSectionRow>
            <SidebarSectionColumn width='33.33%'>
              <StrokeWidthInput />
            </SidebarSectionColumn>
            <SidebarSectionColumn width='33.33%'>
              <StrokeDashInput />
            </SidebarSectionColumn>
            <SidebarSectionColumn width='33.33%'>
              <StrokeGapInput />
            </SidebarSectionColumn>
          </SidebarSectionRow>
        </SidebarSection>
        {
          showOptions
          ? <SidebarStrokeOptionsStyle />
          : null
        }
      </SidebarSectionWrap>
    : null
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const selected = layer.present.selected;
  const selectedType = selected.length > 0 ? layer.present.byId[selected[0]].type : null;
  return { selected, selectedType };
};

export default connect(
  mapStateToProps
)(SidebarStrokeStyles);