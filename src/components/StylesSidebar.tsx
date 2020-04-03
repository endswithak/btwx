import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { store } from '../store';
import Sidebar from './Sidebar';
import SidebarSectionHead from './SidebarSectionHead';
import SidebarSectionWrap from './SidebarSectionWrap';
import SidebarSection from './SidebarSection';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarFrameStyles from './SidebarFrameStyles';
import SidebarContextStyles from './SidebarContextStyles';
import SidebarFillStyles from './SidebarFillStyles';

const StylesSidebar = (): ReactElement => {
  const globalState = useContext(store);
  const { theme, dispatch, stylesSidebarWidth } = globalState;

  return (
    <Sidebar
      width={stylesSidebarWidth}
      position={'right'}
      resizable={false}>
      <SidebarFrameStyles />
      <SidebarContextStyles />
      <SidebarSectionWrap>
        <SidebarSection>
          <SidebarSectionRow>
            <SidebarSectionHead text={'style'} />
          </SidebarSectionRow>
        </SidebarSection>
      </SidebarSectionWrap>
      <SidebarFillStyles />
    </Sidebar>
  );
}

export default StylesSidebar;