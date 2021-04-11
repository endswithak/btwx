import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import EaseEditor from './EaseEditor';

const EaseEditorWrap = (): ReactElement => {
  const ready = useSelector((state: RootState) => state.canvasSettings.ready);
  const isOpen = useSelector((state: RootState) => state.easeEditor.isOpen);

  return (
    ready && isOpen
    ? <EaseEditor />
    : null
  );
}

export default EaseEditorWrap;