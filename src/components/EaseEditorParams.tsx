import React, { ReactElement } from 'react';
import EaseEditorEaseParams from './EaseEditorEaseParams';
import EaseEditorTextParams from './EaseEditorTextParams';

interface EaseEditorParamsProps {
  tab: Btwx.EaseEditorTab;
  setParamInfo(paramInfo: Btwx.ParamInfo): void;
}

const EaseEditorParams = (props: EaseEditorParamsProps): ReactElement => {
  const { tab, setParamInfo } = props;

  return (
    <div className='c-ease-editor__params'>
      {
        tab === 'ease'
        ? <EaseEditorEaseParams
            setParamInfo={setParamInfo} />
        : <EaseEditorTextParams
            setParamInfo={setParamInfo} />
      }
    </div>
  );
}

export default EaseEditorParams;