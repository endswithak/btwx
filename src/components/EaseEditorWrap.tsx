import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import EaseEditor from './EaseEditor';

const EaseEditorWrap = (): ReactElement => {
  const isOpen = useSelector((state: RootState) => state.easeEditor.isOpen);

  return (
    isOpen
    ? <EaseEditor />
    : null
  );
}

export default EaseEditorWrap;