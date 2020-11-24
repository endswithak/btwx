import React, { ReactElement, useEffect, useState, useContext } from 'react';
import { remote } from 'electron';
import styled from 'styled-components';
import { Titlebar as ElectronTitlebar, Color } from 'custom-electron-titlebar';
import { connect } from 'react-redux';
import { MAC_TITLEBAR_HEIGHT, WINDOWS_TITLEBAR_HEIGHT, PREVIEW_PREFIX } from '../constants';
import { RootState } from '../store/reducers';
import { ThemeContext } from './ThemeProvider';

interface TitlebarStateProps {
  documentName?: string;
  themeName?: string;
  recording?: boolean;
  unsavedEdits?: boolean;
}

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
  background: ${props => props.recording ? props.theme.palette.recording : 'none'};
  .c-topbar-title__unsaved-indicator {
    color: ${props => props.recording ? 'rgba(255, 255, 255, 0.5)' : props.theme.text.lighter};
    margin-left: ${props => props.theme.unit}px;
  }
`;

const Titlebar = (props: TitlebarProps & TitlebarStateProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { documentName, themeName, recording, unsavedEdits, isPreview } = props;
  const [titlebar, setTitlebar] = useState(null);

  const handleDoubleClick = () => {
    if (!remote.getCurrentWindow().isMaximized()) {
      remote.getCurrentWindow().maximize();
    }
  }

  useEffect(() => {
    setTitlebar(new ElectronTitlebar({
      backgroundColor: Color.fromHex(theme.name === 'dark' ? theme.background.z1 : theme.background.z2)
    }));
  }, []);

  useEffect(() => {
    if (titlebar && documentName) {
      if (isPreview) {
        titlebar.updateTitle(`${PREVIEW_PREFIX}${documentName}`);
      } else {
        titlebar.updateTitle(documentName);
      }
    }
  }, [documentName]);

  useEffect(() => {
    if (titlebar) {
      titlebar.updateBackground(Color.fromHex(themeName === 'dark' ? theme.background.z1 : theme.background.z2));
    }
  }, [themeName]);

  return (
    isPreview
    ? null
    : <Title
        className='c-topbar-title'
        theme={theme}
        recording={recording}
        onDoubleClick={handleDoubleClick}>
        <span>
          <span className='c-topbar-title__title'>{documentName}</span>
          {
            unsavedEdits
            ? <span className='c-topbar-title__unsaved-indicator'>(unsaved changes)</span>
            : null
          }
        </span>
      </Title>
  );
}

const mapStateToProps = (state: RootState): {
  documentName: string;
  themeName: string;
  recording: boolean;
  unsavedEdits: boolean;
} => {
  const { documentSettings, viewSettings, preview, layer } = state;
  const unsavedEdits = layer.present.edit.id !== documentSettings.edit;
  const documentName = documentSettings.name;
  const themeName = viewSettings.theme;
  const recording = preview.recording;
  return { documentName, themeName, recording, unsavedEdits };
};

export default connect(
  mapStateToProps
)(Titlebar);