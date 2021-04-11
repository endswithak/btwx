import React, { ReactElement } from 'react';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarSectionRow from './SidebarSectionRow';
import EaseEditorDelayInput from './EaseEditorDelayInput';
import EaseEditorDurationInput from './EaseEditorDurationInput';

const EaseEditorMainFoot = (): ReactElement => (
  <div className='c-ease-editor-main__section c-ease-editor-main__section--foot'>
    {/* <div
      className='c-ease-editor__preset c-ease-editor__preset--label'
      style={{
        color: theme.text.lighter
      }}>
      Timing
    </div> */}
    <SidebarSectionRow>
      <SidebarSectionColumn width='33.33%'>
      </SidebarSectionColumn>
      <SidebarSectionColumn width='33.33%'>
        <EaseEditorDurationInput />
      </SidebarSectionColumn>
      <SidebarSectionColumn width='33.33%'>
        <EaseEditorDelayInput />
      </SidebarSectionColumn>
    </SidebarSectionRow>
  </div>
);

export default EaseEditorMainFoot;