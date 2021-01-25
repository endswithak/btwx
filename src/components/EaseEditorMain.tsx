import React, { useContext, ReactElement, useState } from 'react';
import { ThemeContext } from './ThemeProvider';
import EaseEditorMainHead from './EaseEditorMainHead';
import EaseEditorMainFoot from './EaseEditorMainFoot';
import EaseEditorMainBody from './EaseEditorMainBody';

const EaseEditorMain = (): ReactElement => {
  const theme = useContext(ThemeContext);
  const [tab, setTab] = useState<Btwx.EaseEditorTab>('ease');

  return (
    <div
      className='c-ease-editor__main'
      style={{
        height: 568,
        width: 310,
        background: theme.name === 'dark' ? theme.background.z1 : theme.background.z2,
        borderRadius: `0 ${theme.unit}px ${theme.unit}px 0`,
        boxShadow: `1px 0 0 0 ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5} inset`
      }}>
      <EaseEditorMainHead
        tab={tab}
        setTab={setTab} />
      <EaseEditorMainBody
        tab={tab} />
      <EaseEditorMainFoot />
    </div>
  );
}

export default EaseEditorMain;