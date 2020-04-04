import React, { useContext, ReactElement, useRef, useEffect, useState, FormEvent } from 'react';
import { store } from '../store';
import SidebarInput from './SidebarInput';
import SidebarSection from './SidebarSection';
import SidebarSlider from './SidebarSlider';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';

const SidebarOpacityStyles = (): ReactElement => {
  const globalState = useContext(store);
  const { selectedLayer, theme, dispatch, selectedPaperLayer } = globalState;
  const layerOpacity = selectedLayer.opacity * 100;
  const [opacity, setOpacity] = useState<string | number>(layerOpacity);

  const handleChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setOpacity(target.value);
  };

  useEffect(() => {
    setOpacity(layerOpacity);
  }, [selectedLayer]);

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
            readOnly={true}
            label={'%'} />
        </SidebarSectionColumn>
      </SidebarSectionRow>
    </SidebarSection>
  );
}

export default SidebarOpacityStyles;