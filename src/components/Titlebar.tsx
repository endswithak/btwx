import React, { ReactElement, useEffect, useContext } from 'react';
import { remote } from 'electron';
import { useSelector } from 'react-redux';
import { MAC_TITLEBAR_HEIGHT, WINDOWS_TITLEBAR_HEIGHT } from '../constants';
import { RootState } from '../store/reducers';
import { ThemeContext } from './ThemeProvider';

interface TitlebarProps {
  previewWindow?: boolean;
}

const Titlebar = (props: TitlebarProps): ReactElement => {
  const { previewWindow } = props;
  const unsavedEdits = useSelector((state: RootState) => state.layer.present.edit && state.layer.present.edit.id !== state.documentSettings.edit);
  const documentName = useSelector((state: RootState) => state.documentSettings.name);
  const documentPath = useSelector((state: RootState) => state.documentSettings.path);
  const recording = useSelector((state: RootState) => state.preview.recording);

  const handleDoubleClick = () => {
    if (!remote.getCurrentWindow().isMaximized()) {
      remote.getCurrentWindow().maximize();
    }
  }

  useEffect(() => {
    if (!previewWindow) {
      if (unsavedEdits) {
        remote.getCurrentWindow().setDocumentEdited(true);
      } else {
        remote.getCurrentWindow().setDocumentEdited(false);
      }
    }
  }, [unsavedEdits]);

  useEffect(() => {
    if (!previewWindow) {
      if (documentPath) {
        remote.getCurrentWindow().setRepresentedFilename(documentPath);
      }
    }
  }, [documentPath]);

  return (
    <div
      className={`c-titlebar${
        recording
        ? `${' '}c-titlebar--recording`
        : ''
      }`}
      onDoubleClick={handleDoubleClick}
      style={{
        height: remote.process.platform === 'darwin' ? MAC_TITLEBAR_HEIGHT : WINDOWS_TITLEBAR_HEIGHT,
        lineHeight: remote.process.platform === 'darwin' ? MAC_TITLEBAR_HEIGHT : WINDOWS_TITLEBAR_HEIGHT
      }}>
      <span>
        <span className='c-titlebar__title'>
          {
            previewWindow
            ? ''
            : documentName
          }
        </span>
        {
          unsavedEdits && !previewWindow
          ? <span className='c-titlebar__unsaved-indicator'>
              (unsaved changes)
            </span>
          : null
        }
      </span>
    </div>
  );
}

export default Titlebar;