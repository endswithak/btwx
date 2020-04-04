import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { store } from '../store';
import SidebarPositionStyles from './SidebarPositionStyles';
import SidebarSizeStyles from './SidebarSizeStyles';
import SidebarSectionHead from './SidebarSectionHead';
import SidebarRotationStyles from './SidebarRotationStyles';
import SidebarFlippedStyles from './SidebarFlippedStyles';
import SidebarSectionWrap from './SidebarSectionWrap';
import SidebarSection from './SidebarSection';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';

const SidebarFrameStyles = (): ReactElement => {
  const globalState = useContext(store);
  const { selectedLayer, theme, dispatch, selectedPaperLayer } = globalState;

  return (
    <SidebarSectionWrap>
      <SidebarSection>
        <SidebarSectionRow>
          <SidebarSectionHead text={'position'} />
        </SidebarSectionRow>
        {
          selectedLayer
          ? <SidebarSectionRow>
              <SidebarSectionColumn width={'66%'}>
                <SidebarPositionStyles />
                <SidebarSizeStyles />
              </SidebarSectionColumn>
              <SidebarSectionColumn width={'33%'}>
                <SidebarRotationStyles />
                <SidebarFlippedStyles />
              </SidebarSectionColumn>
            </SidebarSectionRow>
          : null
        }
      </SidebarSection>
    </SidebarSectionWrap>
  );
}

export default SidebarFrameStyles;