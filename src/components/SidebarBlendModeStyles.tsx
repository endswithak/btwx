import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import SidebarSelect from './SidebarSelect';
import { store } from '../store';
import { getBlendMode } from '../canvas/layer/utils/contextUtils';


const SidebarBlendModeStyles = (): ReactElement => {
  const globalState = useContext(store);
  const { selectedLayer, theme, dispatch } = globalState;

  const options: { value: string; label: string }[] = [
    { value: 'normal', label: 'Normal' },
    { value: 'darken', label: 'Darken' },
    { value: 'multiply', label: 'Multiply' },
    { value: 'color-burn', label: 'Color Burn' },
    { value: 'lighten', label: 'Lighten' },
    { value: 'screen', label: 'Screen' },
    { value: 'color-dodge', label: 'Color Dodge' },
    { value: 'overlay', label: 'Overlay' },
    { value: 'soft-light', label: 'Soft Light' },
    { value: 'hard-light', label: 'Hard Light' },
    { value: 'difference', label: 'Difference' },
    { value: 'exclusion', label: 'Exclusion' },
    { value: 'hue', label: 'Hue' },
    { value: 'saturation', label: 'Saturation' },
    { value: 'color', label: 'Color' },
    { value: 'luminosity', label: 'Luminosity' },
    { value: 'darker', label: 'Plus Darker' },
    { value: 'lighter', label: 'Plus Lighter' },
  ];

  const blendMode = selectedLayer ? options.find((option) => {
    return option.value === getBlendMode({blendMode: selectedLayer.style.contextSettings.blendMode});
  }) : null;

  const [selected, setSelected] = useState(blendMode);

  const handleChange = (selectedOption: { value: string; label: string }) => {
    setSelected(selectedOption);
  };

  useEffect(() => {
    setSelected(blendMode);
  }, [selectedLayer]);

  return (
    <SidebarSelect
      value={selected}
      onChange={handleChange}
      options={options}
      placeholder={'Blend Mode'}
    />
  );
}

export default SidebarBlendModeStyles;