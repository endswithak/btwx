import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SidebarSelect from './SidebarSelect';
import { RootState } from '../store/reducers';
import { getSelectedBlendMode } from '../store/selectors/layer';
import { setLayersBlendMode } from '../store/actions/layer';

const BlendModeSelector = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const blendModeValue = useSelector((state: RootState) => getSelectedBlendMode(state));
  const dispatch = useDispatch();

  const options: { value: Btwx.BlendMode; label: string }[] = [
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
    { value: 'luminosity', label: 'Luminosity' }
    // { value: 'add', label: 'Add' },
    // { value: 'subtract', label: 'Subtract' },
    // { value: 'average', label: 'Average' },
    // { value: 'pin-light', label: 'Pin Light' },
    // { value: 'negation', label: 'Negation' },
    // { value: 'source-over', label: 'Source Over' },
    // { value: 'source-in', label: 'Source In' },
    // { value: 'source-out', label: 'Source Out' },
    // { value: 'source-atop', label: 'Source Atop' },
    // { value: 'destination-over', label: 'Destination Over' },
    // { value: 'destination-in', label: 'Destination In' },
    // { value: 'destination-out', label: 'Destination Out' },
    // { value: 'destination-atop', label: 'Destination Atop' },
    // { value: 'lighter', label: 'Lighter' },
    // { value: 'darker', label: 'Darker' },
    // { value: 'copy', label: 'Copy' },
    // { value: 'xor', label: 'Xor' }
  ];

  const [blendMode, setBlendMode] = useState(blendModeValue !== 'multi' ? options.find((option) => option.value === blendModeValue) : null);

  useEffect(() => {
    if (blendModeValue === 'multi') {
      setBlendMode(null);
    } else {
      setBlendMode(options.find((option) => option.value === blendModeValue));
    }
  }, [blendModeValue, selected]);

  const handleChange = (selectedOption: { value: Btwx.BlendMode; label: string }): void => {
    setBlendMode(selectedOption);
    dispatch(setLayersBlendMode({layers: selected, blendMode: selectedOption.value}));
  }

  return (
    <SidebarSelect
      value={blendMode}
      onChange={handleChange}
      options={options}
      placeholder='multi'
      bottomLabel='Blend'
    />
  );
}

export default BlendModeSelector;