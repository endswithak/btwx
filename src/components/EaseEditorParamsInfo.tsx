import React, { ReactElement } from 'react';

interface EaseEditorParamsInfoProps {
  paramInfo: Btwx.ParamInfo;
}

const EaseEditorParamsInfo = (props: EaseEditorParamsInfoProps): ReactElement => {
  const { paramInfo } = props;

  return (
    <>
      {
        paramInfo
        ? <div
            className='c-ease-editor-body__input-description'>
            <div className='c-ease-editor-body-input-description__type'>
              { paramInfo.type }
            </div>
            <div className='c-ease-editor-body-input-description__info'>
              { paramInfo.description }
            </div>
          </div>
        : null
      }
    </>
  );
}

export default EaseEditorParamsInfo;