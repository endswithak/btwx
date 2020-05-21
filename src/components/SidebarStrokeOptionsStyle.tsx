import React, { ReactElement } from 'react';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import StrokeCapInput from './StrokeCapInput';
import SidebarSectionHead from './SidebarSectionHead';
import StrokeJoinInput from './StrokeJoinInput';
import StrokeDashInput from './StrokeDashInput';
import StrokeGapInput from './StrokeGapInput';
import StrokeMiterLimitInput from './StrokeMiterLimitInput';
import SidebarSection from './SidebarSection';

const SidebarStrokeOptionStyles = (): ReactElement => {
  return (
    <SidebarSection>
      <SidebarSectionRow>
        <SidebarSectionColumn width='50%'>
          <SidebarSectionRow>
            <SidebarSectionHead text={'cap'} />
          </SidebarSectionRow>
          <StrokeCapInput />
        </SidebarSectionColumn>
        <SidebarSectionColumn width='50%'>
          <SidebarSectionRow>
            <SidebarSectionHead text={'join'} />
          </SidebarSectionRow>
          <StrokeJoinInput />
        </SidebarSectionColumn>
      </SidebarSectionRow>
      <SidebarSectionRow>
        <SidebarSectionColumn width='50%'>
          <SidebarSectionRow>
            <SidebarSectionColumn width='50%'>
              <SidebarSectionRow>
                <SidebarSectionHead text={'dash'} />
              </SidebarSectionRow>
              <SidebarSectionRow>
                <StrokeDashInput />
              </SidebarSectionRow>
            </SidebarSectionColumn>
            <SidebarSectionColumn width='50%'>
              <SidebarSectionRow>
                <SidebarSectionHead text={'gap'} />
              </SidebarSectionRow>
              <SidebarSectionRow>
                <StrokeGapInput />
              </SidebarSectionRow>
            </SidebarSectionColumn>
          </SidebarSectionRow>
        </SidebarSectionColumn>
        <SidebarSectionColumn width='50%'>
          {/* <SidebarSectionRow>
            <SidebarSectionColumn width='50%'>
              <SidebarSectionRow>
                <SidebarSectionHead text={'Miter'} />
              </SidebarSectionRow>
              <SidebarSectionRow>
                <StrokeMiterLimitInput />
              </SidebarSectionRow>
            </SidebarSectionColumn>
            <SidebarSectionColumn width='50%'>

            </SidebarSectionColumn>
          </SidebarSectionRow> */}
        </SidebarSectionColumn>
      </SidebarSectionRow>
    </SidebarSection>
  );
}

export default SidebarStrokeOptionStyles;