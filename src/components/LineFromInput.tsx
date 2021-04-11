import React, { ReactElement } from 'react';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarSectionLabel from './SidebarSectionLabel';
import FromXInput from './FromXInput';
import FromYInput from './FromYInput';

const LineFromInput = (): ReactElement => (
  <SidebarSectionRow>
    <SidebarSectionColumn width={'33.33%'}>
      <SidebarSectionLabel text='From' />
    </SidebarSectionColumn>
    <SidebarSectionColumn width={'33.33%'}>
      <FromXInput />
    </SidebarSectionColumn>
    <SidebarSectionColumn width={'33.33%'}>
      <FromYInput />
    </SidebarSectionColumn>
  </SidebarSectionRow>
);

export default LineFromInput;