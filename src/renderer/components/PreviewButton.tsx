import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import StackedButton from './StackedButton';
import Icon from './Icon';

const PreviewButton = (): ReactElement => {
  const instance = useSelector((state: RootState) => state.session.instance);
  const isOpen = useSelector((state: RootState) => state.preview.isOpen);
  const recording = useSelector((state: RootState) => state.preview.recording);
  const focusing = useSelector((state: RootState) => state.preview.focusing);
  const isEaseEditorOpen = useSelector((state: RootState) => state.easeEditor.isOpen);

  const handlePreviewClick = (): void => {
    if (recording) {
      (window as any).api.setPreviewRecordingStopped(JSON.stringify({
        instanceId: instance
      }));
    } else {
      (window as any).api.openPreview(JSON.stringify({
        instanceId: instance,
        stick: isEaseEditorOpen
      }));
    }
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
      recording={recording}>
      <Icon
        name={buttonIcon()}
        size='small' />
    </StackedButton>
  );
}

export default PreviewButton;