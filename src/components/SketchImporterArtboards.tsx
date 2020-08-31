import FileFormat from '@sketch-hq/sketch-file-format-ts';
import React, { useContext, ReactElement } from 'react';
import { ThemeContext } from './ThemeProvider';
import SketchImporterArtboard from './SketchImporterArtboard';
import SidebarSectionHead from './SidebarSectionHead';

interface SketchImporterArtboardsProps {
  artboards: FileFormat.Artboard[];
  selectedArtboards: string[];
  setSelectedArtboards(selectedArtboards: string[]): void;
}

const SketchImporterArtboards = (props: SketchImporterArtboardsProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { artboards, selectedArtboards, setSelectedArtboards } = props;

  return (
    <div className='c-sketch-importer__artboards'>
      <SidebarSectionHead
        text='Artboards'
        extraPadding />
      {
        artboards.map((artboard, index) => (
          <SketchImporterArtboard
            key={index}
            artboard={artboard}
            selectedArtboards={selectedArtboards}
            setSelectedArtboards={setSelectedArtboards} />
        ))
      }
    </div>
  );
}

export default SketchImporterArtboards;