import React, { ReactElement } from 'react';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import ShadowXInput from './ShadowXInput';
import ShadowYInput from './ShadowYInput';
import ShadowBlurInput from './ShadowBlurInput';

const ShadowParamsInput = (): ReactElement => {
  return (
    <SidebarSectionRow>
      <SidebarSectionColumn width='33.33%'>
        <ShadowXInput />
      </SidebarSectionColumn>
      <SidebarSectionColumn width='33.33%'>
        <ShadowYInput />
      </SidebarSectionColumn>
      <SidebarSectionColumn width='33.33%'>
        <ShadowBlurInput />
      </SidebarSectionColumn>
    </SidebarSectionRow>
  );
}

export default ShadowParamsInput;