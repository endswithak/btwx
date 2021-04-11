import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ipcRenderer } from 'electron';
import { RootState } from '../store/reducers';
import { openPreview, stopPreviewRecording } from '../store/actions/preview';
import StackedButton from './StackedButton';
import Icon from './Icon';

const PreviewButton = (): ReactElement => {
  const instance = useSelector((state: RootState) => state.session.instance);
  const activeArtboard = useSelector((state: RootState) => state.layer.present.byId[state.layer.present.activeArtboard]);
  const isOpen = useSelector((state: RootState) => state.preview.isOpen);
  const recording = useSelector((state: RootState) => state.preview.recording);
  const focusing = useSelector((state: RootState) => state.preview.focusing);
  const isEaseEditorOpen = useSelector((state: RootState) => state.easeEditor.isOpen);
  const dispatch = useDispatch();

  const handlePreviewClick = (): void => {
    ipcRenderer.send('openPreview', JSON.stringify({
      instanceId: instance,
      stick: isEaseEditorOpen
    }));
  }

  const buttonIcon = (): string => {
    if (isOpen) {
      if (recording) {
        return 'stop-recording';
      } else {
        if (focusing) {
          return 'preview';
        } else {
          return 'bring-to-front';
        }
      }
    } else {
      return 'preview';
    }
  }

  return (
    <StackedButton
      id='preview-button'
      label='Preview'
      onClick={handlePreviewClick}
      size='small'
      isActive={isOpen}
      // recording={recording}
      >
      <Icon
        name={buttonIcon()}
        size='small' />
    </StackedButton>
  );
}

export default PreviewButton;