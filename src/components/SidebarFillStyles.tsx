import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import { store } from '../store';
import SidebarSectionWrap from './SidebarSectionWrap';
import SidebarSection from './SidebarSection';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionHead from './SidebarSectionHead';
import SidebarFillStyle from './SidebarFillStyle';

const SidebarFillStyles = (): ReactElement => {
  const globalState = useContext(store);
  const { selectedLayer, theme, dispatch, selectedPaperLayer } = globalState;

  const fills = selectedLayer ? selectedLayer.children.find((child) => child.name === 'fills') : null;

  return (
    <SidebarSectionWrap>
      <SidebarSection>
        <SidebarSectionRow>
          <SidebarSectionHead text={'fills'} />
        </SidebarSectionRow>
        {
          selectedLayer
          ? <SidebarSection>
              {
                fills
                ? fills.children.reverse().map((fill: paper.Layer, index: number) => (
                    <SidebarFillStyle
                      fill={fill}
                      index={index}
                      key={index} />
                  ))
                : null
              }
            </SidebarSection>
          : null
        }
      </SidebarSection>
    </SidebarSectionWrap>
  );
}

export default SidebarFillStyles;