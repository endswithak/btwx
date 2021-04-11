import React, { ReactElement } from 'react';
import EaseEditorEaseInput from './EaseEditorEaseInput';
import EaseEditorTextInput from './EaseEditorTextInput';

interface EaseEditorParamsSelectorProps {
  tab: Btwx.EaseEditorTab;
}

const EaseEditorParamsSelector = (props: EaseEditorParamsSelectorProps): ReactElement => {
  const { tab } = props;

  return (
    <div className='c-ease-editor__param-selector'>
      {
        tab === 'ease'
        ? <EaseEditorEaseInput />
        : <EaseEditorTextInput />
      }
    </div>
  );
}

export default EaseEditorParamsSelector;