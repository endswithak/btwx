import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { store } from '../store';
import SidebarInput from './SidebarInput';
import SidebarSection from './SidebarSection';
import SidebarSlider from './SidebarSlider';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';

const SidebarOpacityStyles = (): ReactElement => {
  const globalState = useContext(store);
  const { selectedLayer, theme, dispatch } = globalState;
  const layerOpacity = selectedLayer ? Math.round(100 * selectedLayer.style.contextSettings.opacity) : null;
  const [opacity, setOpacity] = useState(layerOpacity);

  const handleChange = (value: number) => {
    setOpacity(value);
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