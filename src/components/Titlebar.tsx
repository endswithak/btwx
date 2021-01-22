import React, { ReactElement, useEffect, useContext } from 'react';
import { remote } from 'electron';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { MAC_TITLEBAR_HEIGHT, WINDOWS_TITLEBAR_HEIGHT, PREVIEW_PREFIX } from '../constants';
import { RootState } from '../store/reducers';
import { ThemeContext } from './ThemeProvider';

interface TitlebarProps {
  isPreview?: boolean;
}

interface TitleProps {
  recording: boolean;
}

const Title = styled.div<TitleProps>`
  height: ${remote.process.platform === 'darwin' ? MAC_TITLEBAR_HEIGHT : WINDOWS_TITLEBAR_HEIGHT}px;
  color: ${props => props.recording ? '#fff' : props.theme.text.base};
  line-height: ${remote.process.platform === 'darwin' ? MAC_TITLEBAR_HEIGHT : WINDOWS_TITLEBAR_HEIGHT}px;
  background: ${props => props.recording ? props.theme.palette.recording : props.theme.name === 'dark' ? props.theme.background.z1 : props.theme.background.z2};
  .c-topbar-title__unsaved-indicator {
    color: ${props => props.recording ? 'rgba(255, 255, 255, 0.5)' : props.theme.text.lighter};
    margin-left: ${props => props.theme.unit}px;
  }
  -webkit-app-region: drag;
`;

const Titlebar = (props: TitlebarProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { isPreview } = props;
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
    if (!isPreview) {
      if (unsavedEdits) {
        remote.getCurrentWindow().setDocumentEdited(true);
      } else {
        remote.getCurrentWindow().setDocumentEdited(false);
      }
    }
  }, [unsavedEdits]);

  useEffect(() => {
    if (!isPreview) {
      if (documentPath) {
        remote.getCurrentWindow().setRepresentedFilename(documentPath);
      }
    }
  }, [documentPath]);

  return (
    <Title
      className='c-topbar-title'
      theme={theme}
      recording={recording}
      onDoubleClick={handleDoubleClick}>
      <span>
        <span className='c-topbar-title__title'>
          {
            isPreview
            ? ''
            : documentName
          }
        </span>
        {
          unsavedEdits && !isPreview
          ? <span className='c-topbar-title__unsaved-indicator'>
              (unsaved changes)
            </span>
          : null
        }
      </span>
    </Title>
  );
}

export default Titlebar;