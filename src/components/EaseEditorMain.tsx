import React, { ReactElement, useState } from 'react';
import EaseEditorMainHead from './EaseEditorMainHead';
import EaseEditorMainFoot from './EaseEditorMainFoot';
import EaseEditorMainBody from './EaseEditorMainBody';

const EaseEditorMain = (): ReactElement => {
  const [tab, setTab] = useState<Btwx.EaseEditorTab>('ease');

  return (
    <div
      className='c-ease-editor__main'
      style={{
        height: 568,
        width: 310
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