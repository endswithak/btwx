import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import { store } from '../store';
import SidebarSectionWrap from './SidebarSectionWrap';
import SidebarSection from './SidebarSection';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionLabel from './SidebarSectionLabel';
import SidebarFillStyle from './SidebarFillStyle';

const SidebarFillStyles = (): ReactElement => {
  const globalState = useContext(store);
  const { selectedLayer, theme, dispatch } = globalState;

  const fills = selectedLayer ? selectedLayer.style.fills : null;

  return (
    <SidebarSectionWrap>
      <SidebarSection>
        <SidebarSectionRow>
          <SidebarSectionLabel text={'Fills'} />
        </SidebarSectionRow>
        <SidebarSection>
          {
            fills
            ? fills.map((fill: FileFormat.Fill, index: number) => (
                <SidebarFillStyle fill={fill} key={index} />
              ))
            : null
          }
        </SidebarSection>
      </SidebarSection>
    </SidebarSectionWrap>
  );
}

export default SidebarFillStyles;