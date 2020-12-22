import React, { ReactElement, useEffect } from 'react';
import * as fontFinder from 'font-finder';
import { useSelector, useDispatch } from 'react-redux';
import { setTextSettingsSystemFonts } from '../store/actions/textSettings';
import { RootState } from '../store/reducers';
import Topbar from './Topbar';
import EaseEditorWrap from './EaseEditorWrap';
import ArtboardPresetEditorWrap from './ArtboardPresetEditorWrap';
import ContextMenuWrap from './ContextMenuWrap';
import Canvas from './Canvas';
import SidebarLeft from './SidebarLeft';
import SidebarRight from './SidebarRight';
import EventDrawer from './EventDrawer';
import TextEditor from './TextEditor';

const App = (): ReactElement => {
  const ready = useSelector((state: RootState) => state.canvasSettings.ready);
  const dispatch = useDispatch();

  useEffect(() => {
    const browserFonts: {[id: string]: { value: string; label: string }} = {
      'Georgia': { value: 'Georgia', label: 'Georgia' },
      'Palatino Linotype': { value: 'Palatino Linotype', label: 'Palatino Linotype' },
      'Book Antiqua': { value: 'Book Antiqua', label: 'Book Antiqua' },
      'Palatino': { value: 'Palatino', label: 'Palatino' },
      'Times New Roman': { value: 'Times New Roman', label: 'Times New Roman' },
      'Times': { value: 'Times', label: 'Times' },
      'Arial': { value: 'Arial', label: 'Arial' },
      'Helvetica': { value: 'Helvetica', label: 'Helvetica' },
      'Arial Black': { value: 'Arial Black', label: 'Arial Black' },
      'Gadget': { value: 'Gadget', label: 'Gadget' },
      'Comic Sans MS': { value: 'Comic Sans MS', label: 'Comic Sans MS' },
      'Impact': { value: 'Impact', label: 'Impact' },
      'Charcoal': { value: 'Charcoal', label: 'Charcoal' },
      'Lucida Sans Unicode': { value: 'Lucida Sans Unicode', label: 'Lucida Sans Unicode' },
      'Lucida Grande': { value: 'Lucida Grande', label: 'Lucida Grande' },
      'Tahoma': { value: 'Tahoma', label: 'Tahoma' },
      'Geneva': { value: 'Geneva', label: 'Geneva' },
      'Trebuchet MS': { value: 'Trebuchet MS', label: 'Trebuchet MS' },
      'Verdana': { value: 'Verdana', label: 'Verdana' },
      'Courier New': { value: 'Courier New', label: 'Courier New' },
      'Courier': { value: 'Courier', label: 'Courier' },
      'Lucida Console': { value: 'Lucida Console', label: 'Lucida Console' },
      'Monaco': { value: 'Monaco', label: 'Monaco' }
    };
    (async () => {
      const fontList = await fontFinder.list();
      const compiledFontList = Object.keys({
        ...fontList,
        ...browserFonts
      }).sort().filter(font => !font.startsWith('.'));
      dispatch(setTextSettingsSystemFonts({systemFonts: compiledFontList}));
    })();
  }, []);

  return (
    <div
      id='app'
      className='c-app'>
        {/* flex items */}
        <Topbar />
        <div id='main' className='c-app__main'>
          <SidebarLeft />
          <main id='main-canvas' className='c-app__canvas'>
            <Canvas />
            <TextEditor />
            <EventDrawer />
          </main>
          <SidebarRight />
        </div>
        {/* abs elements */}
        {
          ready
          ? <>
              <ContextMenuWrap />
              <EaseEditorWrap />
              <ArtboardPresetEditorWrap />
            </>
          : null
        }
    </div>
  );
}

export default App;