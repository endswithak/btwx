import React, { ReactElement } from 'react';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarSectionLabel from './SidebarSectionLabel';
import ToXInput from './ToXInput';
import ToYInput from './ToYInput';

const LineToInput = (): ReactElement => (
  <SidebarSectionRow>
    <SidebarSectionColumn width={'33.33%'}>
      <SidebarSectionLabel text='To' />
    </SidebarSectionColumn>
    <SidebarSectionColumn width={'33.33%'}>
      <ToXInput />
    </SidebarSectionColumn>
    <SidebarSectionColumn width={'33.33%'}>
      <ToYInput />
    </SidebarSectionColumn>
  </SidebarSectionRow>
);

export default LineToInput;