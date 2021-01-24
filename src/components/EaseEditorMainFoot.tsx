import React, { ReactElement, useContext } from 'react';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarSectionRow from './SidebarSectionRow';
import EaseEditorDelayInput from './EaseEditorDelayInput';
import EaseEditorDurationInput from './EaseEditorDurationInput';
import { ThemeContext } from './ThemeProvider';

const EaseEditorMainFoot = (): ReactElement => {
  const theme = useContext(ThemeContext);

  return (
    <div
      className='c-ease-editor-main__section c-ease-editor-main__section--foot'
      style={{
        boxShadow: `0 -1px 0 0 ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5}`
      }}>
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
}

export default EaseEditorMainFoot;