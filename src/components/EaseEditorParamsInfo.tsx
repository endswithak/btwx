import React, { ReactElement, useContext } from 'react';
import { ThemeContext } from './ThemeProvider';

interface EaseEditorParamsInfoProps {
  paramInfo: Btwx.ParamInfo;
}

const EaseEditorParamsInfo = (props: EaseEditorParamsInfoProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { paramInfo } = props;

  return (
    <>
      {
        paramInfo
        ? <div
            className='c-ease-editor-body__input-description'
            style={{
              boxShadow: `0 -1px 0 0 ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5}`
            }}>
            <div
              className='c-ease-editor-body-input-description__type'
              style={{
                color: theme.text.light
              }}>
              { paramInfo.type }
            </div>
            <div
              className='c-ease-editor-body-input-description__info'
              style={{
                color: theme.text.light,
              }}>
              { paramInfo.description }
            </div>
          </div>
        : null
      }
    </>
  );
}

export default EaseEditorParamsInfo;