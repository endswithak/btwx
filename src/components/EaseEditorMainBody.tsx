import React, { ReactElement, useState } from 'react';
import EaseEditorParamsSelector from './EaseEditorParamsSelector';
import EaseEditorParams from './EaseEditorParams';
import EaseEditorParamsInfo from './EaseEditorParamsInfo';

interface EaseEditorMainBodyProps {
  tab: Btwx.EaseEditorTab;
}

const EaseEditorMainBody = (props: EaseEditorMainBodyProps): ReactElement => {
  const { tab } = props;
  const [paramInfo, setParamInfo] = useState(null);

  return (
    <div className='c-ease-editor-main__section c-ease-editor-main__section--body'>
      <EaseEditorParamsSelector
        tab={tab} />
      <EaseEditorParams
        tab={tab}
        setParamInfo={setParamInfo} />
      <EaseEditorParamsInfo
        paramInfo={paramInfo} />
    </div>
  );
}

export default EaseEditorMainBody;