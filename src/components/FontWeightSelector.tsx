import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayersFontWeight } from '../store/actions/layer';
import { getSelectedFontWeight } from '../store/selectors/layer';
import { setTextSettingsFontWeight } from '../store/actions/textSettings';
import SidebarSelect from './SidebarSelect';

const FontWeightSelector = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const fontWeightValue = useSelector((state: RootState) => getSelectedFontWeight(state));
  const fontFamily = useSelector((state: RootState) => state.textSettings.fontFamily);
  const dispatch = useDispatch();

  const options: { value: string; label: string }[] = [
    { value: 'normal', label: 'Regular' },
    { value: 'bold', label: 'Bold' },
    { value: 'italic', label: 'Italic' },
    { value: 'bold italic', label: 'Bold Italic' }
  ];

  const [fontWeight, setFontWeight] = useState(fontWeightValue !== 'multi' ? options.find((option) => option.value === fontWeightValue) : null);

  useEffect(() => {
    if (fontWeightValue === 'multi') {
      setFontWeight(null);
    } else {
      setFontWeight(options.find((option) => option.value === fontWeightValue));
    }
  }, [fontWeightValue, selected]);

  const handleChange = (selectedOption: { value: string; label: string }) => {
    setFontWeight(selectedOption);
    dispatch(setLayersFontWeight({layers: selected, fontWeight: selectedOption.value}));
    dispatch(setTextSettingsFontWeight({fontWeight: selectedOption.value as Btwx.FontWeight}));
  }

  return (
    <SidebarSelect
      value={fontWeight}
      onChange={handleChange}
      options={options}
      placeholder='multi'
      type='fontWeight'
      data={{fontFamily}}
      bottomLabel='Weight'
    />
  );
}

export default FontWeightSelector;