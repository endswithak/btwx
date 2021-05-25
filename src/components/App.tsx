import { ipcRenderer } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import * as fontFinder from 'font-finder';
import { useSelector, useDispatch } from 'react-redux';
import { setTextSettingsSystemFonts, setTextSettingsReady } from '../store/actions/textSettings';
import { addImageThunk } from '../store/actions/layer';
import { hydrateDocumentThunk } from '../store/actions/documentSettings';
import { WEB_SAFE_FONTS } from '../constants';
import { base64ToBuffer } from '../utils';
import { RootState } from '../store/reducers';
import Topbar from './Topbar';
import EaseEditorWrap from './EaseEditorWrap';
import ArtboardPresetEditorWrap from './ArtboardPresetEditorWrap';
import SessionImages from './SessionImages';
import Titlebar from './Titlebar';
import AutoSaver from './AutoSaver';
import Touchbar from './Touchbar';
import Main from './Main';
import KeyBindings from './KeyBindings';

const App = (): ReactElement => {
  const instanceId = useSelector((state: RootState) => state.session.instance);
  const theme = useSelector((state: RootState) => state.preferences.theme);
  const platform = useSelector((state: RootState) => state.session.platform);
  const isClean = useSelector((state: RootState) => !state.documentSettings.id && !state.layer.present.edit.id);
  const activeArtboard = useSelector((state: RootState) => state.layer.present.activeArtboard);
  const draggingLayers = useSelector((state: RootState) => state.leftSidebar.dragging);
  const dispatch = useDispatch();
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!dragOver && !draggingLayers) {
      setDragOver(true);
    }
  }

  const handleDragEnd = (e: any): void => {
    setDragOver(false);
  }

  const handleDrop = (e) => {
    e.preventDefault();
    let isDirty = !isClean;
    if (e.dataTransfer.items) {
      for(let i = 0; i < e.dataTransfer.items.length; i++) {
        if (e.dataTransfer.items[i].kind === 'file') {
          let file = e.dataTransfer.items[i].getAsFile();
          const isImage = file.type.startsWith('image');
          const isDocument = file.name.endsWith('.btwx');
          if (isImage && activeArtboard) {
            handleImageDrop(file);
          }
          if (isDocument) {
            handleDocumentDrop(file, isDirty);
            isDirty = true;
          }
        }
      }
    } else {
      for(let i = 0; i < e.dataTransfer.files.length; i++) {
        let file = e.dataTransfer.files[i];
        const isImage = file.type.startsWith('image');
        const isDocument = file.name.endsWith('.btwx');
        if (isImage && activeArtboard) {
          handleImageDrop(file);
        }
        if (isDocument) {
          handleDocumentDrop(file, isDirty);
          isDirty = true;
        }
      }
    }
    setDragOver(false);
  }

  const handleDocumentDrop = (file: File, dirty) => {
    file.text().then((text) => {
      try {
        const documentState = JSON.parse(text) as Btwx.Document;
        if (!dirty) {
          dispatch(hydrateDocumentThunk({
            ...documentState,
            layer: {
              ...documentState.layer,
              present: {
                ...documentState.layer.present,
                tree: {
                  ...documentState.layer.present.tree,
                  byId: documentState.layer.present.byId
                }
              }
            }
          }));
          ipcRenderer.send('setDocumentRepresentedFilename', JSON.stringify({
            instanceId,
            documentPath: file.path
          }));
        } else {
          ipcRenderer.send('openDroppedDocument', JSON.stringify({
            path: file.path
          }));
        }
      } catch {
        console.log('error reading dropped document');
      }
    });
  }

  const handleImageDrop = (file: File) => {
    const ext = file.type.replace('image/', '');
    const fileReader = new FileReader();
    fileReader.addEventListener('load', function() {
      let image = new Image();
      image.onload = () => {
        const buffer = base64ToBuffer((this.result as string).replace(`data:image/${ext};base64,`, ''));
        const width = image.width;
        const height = image.height;
        dispatch(addImageThunk({
          layer: {
            name: file.name,
            frame: {
              x: 0,
              y: 0,
              width,
              height,
              innerWidth: width,
              innerHeight: height
            },
            originalDimensions: {
              width,
              height
            }
          },
          buffer: buffer as any,
          ext: ext
        }));
      }
      image.src = this.result as string;
    }, false);
    if (file) {
      fileReader.readAsDataURL(file);
    }
  }

  useEffect(() => {
    (async () => {
      const fontList = await fontFinder.list();
      const compiledFontList = [
        ...WEB_SAFE_FONTS,
        ...Object.keys(fontList)
      ].reduce((result: string[], current) => {
        if (!result.includes(current) && !current.startsWith('.')) {
          result = [...result, current];
        }
        return result;
      }, []).sort();
      dispatch(setTextSettingsSystemFonts({
        systemFonts: compiledFontList
      }));
      dispatch(setTextSettingsReady());
    })();
  }, []);

  return (
    <div
      id='app'
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragLeave={handleDragEnd}
      onDrop={handleDrop}
      className={`c-app theme--${theme} ${`os--${platform === 'darwin' ? 'mac' : 'windows'}`}`}>
      {/* flex items */}
      <Titlebar />
      <Topbar />
      <Main />
      {
        dragOver
        ? <div className='c-app__drop-frame' />
        : null
      }
      {/* abs elements */}
      <EaseEditorWrap />
      <ArtboardPresetEditorWrap />
      <SessionImages />
      <AutoSaver />
      <Touchbar />
      <KeyBindings />
    </div>
  );
}

export default App;