import React, { ReactElement, useEffect } from 'react';
import * as fontFinder from 'font-finder';
import { useSelector, useDispatch } from 'react-redux';
import { setTextSettingsSystemFonts, setTextSettingsReady } from '../store/actions/textSettings';
import { WEB_SAFE_FONTS } from '../constants';
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
    (async () => {
      const fontList = await fontFinder.list();
      const compiledFontList = [...WEB_SAFE_FONTS, ...Object.keys(fontList)].reduce((result: string[], current) => {
        if (!result.includes(current) && !current.startsWith('.')) {
          result = [...result, current];
        }
        return result;
      }, []).sort();
      dispatch(setTextSettingsSystemFonts({systemFonts: compiledFontList}));
      dispatch(setTextSettingsReady());
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