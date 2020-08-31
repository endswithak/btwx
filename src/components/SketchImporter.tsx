import FileFormat from '@sketch-hq/sketch-file-format-ts';
import React, { useContext, useEffect, ReactElement, useState } from 'react';
import { remote, ipcRenderer } from 'electron';
import { ThemeContext } from './ThemeProvider';
import SketchImporterSidebar from './SketchImporterSidebar';
import SketchImporterArtboards from './SketchImporterArtboards';
import SketchImporterActions from './SketchImporterActions';

interface SketchImporterProps {
  sketchFile: {
    document: FileFormat.Document;
    meta: FileFormat.Meta;
    user: FileFormat.User;
    pages: FileFormat.Page[];
    images: {
      [id: string]: Buffer;
    };
  };
}

const SketchImporter = (props: SketchImporterProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { sketchFile } = props;
  const [activePage, setActivePage] = useState<string>(sketchFile.pages[0] ? sketchFile.pages[0].do_objectID : null);
  const [pageArtboards, setPageArtboards] = useState([]);
  const [selectedArtboards, setSelectedArtboards] = useState([]);

  useEffect(() => {
    const activePageItem = sketchFile.pages.find(page => page.do_objectID === activePage);
    if (activePageItem) {
      const pageArtboards = activePageItem.layers.filter(layer => layer._class === 'artboard');
      setPageArtboards(pageArtboards);
    }
  }, [activePage]);

  const handleImport = () => {
    const parentWindowContents = remote.getCurrentWindow().getParentWindow().webContents;
    const activePageItem = sketchFile.pages.find(page => page.do_objectID === activePage);
    const selectedArtboardItems = activePageItem.layers.filter(layer => selectedArtboards.includes(layer.do_objectID));
    const symbolsPage = sketchFile.pages.find(page => page.layers.some(layer => layer._class === 'symbolMaster'));
    ipcRenderer.sendTo(parentWindowContents.id, 'sketchArtboardsImport', JSON.stringify({
      document: sketchFile.document,
      meta: sketchFile.meta,
      artboards: selectedArtboardItems,
      images: sketchFile.images,
      symbolMasters: symbolsPage ? symbolsPage.layers : []
    }));
    remote.getCurrentWindow().close();
  };

  const handleCancel = () => {
    remote.getCurrentWindow().close();
  };

  return (
    <div
      className='c-sketch-importer'
      style={{
        background: theme.background.z0
      }}>
      <SketchImporterSidebar
        pages={sketchFile.pages.filter(page => !page.layers.some(layer => layer._class === 'symbolMaster'))}
        activePage={activePage}
        setActivePage={setActivePage}
        selectedArtboards={selectedArtboards} />
      <div className='c-sketch-importer__main'>
        <SketchImporterArtboards
          artboards={pageArtboards}
          selectedArtboards={selectedArtboards}
          setSelectedArtboards={setSelectedArtboards} />
        <SketchImporterActions
          selectedArtboards={selectedArtboards}
          handleImport={handleImport}
          handleCancel={handleCancel} />
      </div>
    </div>
  );
}

export default SketchImporter;