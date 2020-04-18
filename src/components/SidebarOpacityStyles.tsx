import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { store } from '../store';
import SidebarSection from './SidebarSection';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarInput from './SidebarInput';
import SidebarSlider from './SidebarSlider';

const SidebarOpacityStyles = (): ReactElement => {
  const globalState = useContext(store);
  const [opacity, setOpacity] = useState<string | number>(0);
  const { selection } = globalState;

  const getOpacity = (): number => {
    switch(selection.length) {
      case 0:
        return 0;
      case 1:
        return selection[0].paperItem.opacity * 100;
      default:
        return 0;
    }
  }

  const handleChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setOpacity(target.value);
  };

  useEffect(() => {
    setOpacity(getOpacity());
  }, [selection]);

  return (
    <SidebarSection>
      <SidebarSectionRow alignItems={'center'}>
        <SidebarSectionColumn width={'80%'}>
          <SidebarSlider
            value={opacity}
            onChange={handleChange} />
        </SidebarSectionColumn>
        <SidebarSectionColumn width={'20%'}>
          <SidebarInput
            value={opacity}
            onChange={handleChange}
            label={'%'}
            disabled={selection.length > 1 || selection.length === 0} />
        </SidebarSectionColumn>
      </SidebarSectionRow>
    </SidebarSection>
  );
}

export default SidebarOpacityStyles;