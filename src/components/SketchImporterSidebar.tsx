import FileFormat from '@sketch-hq/sketch-file-format-ts';
import React, { ReactElement } from 'react';
import Sidebar from './Sidebar';
import SidebarSection from './SidebarSection';
import SidebarSectionHead from './SidebarSectionHead';
import SidebarSectionRow from './SidebarSectionRow';
import SketchImporterPage from './SketchImporterPage';

interface SketchImporterSidebarProps {
  pages: FileFormat.Page[];
  activePage: string;
  selectedArtboards: string[];
  setActivePage(activePage: string): void;
}

const SketchImporterSidebar = (props: SketchImporterSidebarProps): ReactElement => {
  const { pages, activePage, setActivePage, selectedArtboards } = props;

  return (
    <Sidebar
      width={216}
      position='left'>
      <SidebarSection>
        <SidebarSectionRow>
          <SidebarSectionHead
            text='Pages'
            extraPadding />
        </SidebarSectionRow>
        <SidebarSectionRow>
          <SidebarSection>
            {
              pages.map((page, index) => (
                <SketchImporterPage
                  key={index}
                  page={page}
                  activePage={activePage}
                  setActivePage={setActivePage}
                  selectedArtboards={selectedArtboards} />
              ))
            }
          </SidebarSection>
        </SidebarSectionRow>
      </SidebarSection>
    </Sidebar>
  );
}

export default SketchImporterSidebar;