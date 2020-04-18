import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { store } from '../store';
import SidebarSectionWrap from './SidebarSectionWrap';
import SidebarSection from './SidebarSection';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionHead from './SidebarSectionHead';
import SidebarFillStyle from './SidebarFillStyle';
import ShapeNode from '../canvas/base/shapeNode';
import SortableTree from './SortableTree';

const SidebarFillStyles = (): ReactElement => {
  const globalState = useContext(store);
  const { selection } = globalState;

  const fills = selection.length === 1 && selection[0].layerType === 'Shape' ? (selection[0] as ShapeNode).fills : null;

  return (
    <SidebarSectionWrap>
      {
        selection.length === 1 && selection[0].layerType === 'Shape'
        ? <SidebarSection>
            <SidebarSectionRow>
              <SidebarSectionHead text={'fills'} />
            </SidebarSectionRow>
            <SidebarSection>
              {
                fills
                ? <SortableTree
                    treeData={fills}
                    nodeComponent={
                      <SidebarFillStyle />
                    } />
                : null
              }
            </SidebarSection>
          </SidebarSection>
        : null
      }
    </SidebarSectionWrap>
  );
}

export default SidebarFillStyles;