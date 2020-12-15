import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayersFontFamily } from '../store/actions/layer';
import { getSelectedFontFamily } from '../store/selectors/layer';
import { setTextSettingsFontFamily } from '../store/actions/textSettings';
import SidebarSelect from './SidebarSelect';

const FontFamilySelector = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const fontFamilyValue = useSelector((state: RootState) => getSelectedFontFamily(state));
  const dispatch = useDispatch();

  const options: { value: string; label: string }[] = [
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Palatino Linotype', label: 'Palatino Linotype' },
    { value: 'Book Antiqua', label: 'Book Antiqua' },
    { value: 'Palatino', label: 'Palatino' },
    { value: 'Times New Roman', label: 'Times New Roman' },
    { value: 'Times', label: 'Times' },
    { value: 'Arial', label: 'Arial' },
    { value: 'Helvetica', label: 'Helvetica' },
    { value: 'Arial Black', label: 'Arial Black' },
    { value: 'Gadget', label: 'Gadget' },
    { value: 'Comic Sans MS', label: 'Comic Sans MS' },
    { value: 'Impact', label: 'Impact' },
    { value: 'Charcoal', label: 'Charcoal' },
    { value: 'Lucida Sans Unicode', label: 'Lucida Sans Unicode' },
    { value: 'Lucida Grande', label: 'Lucida Grande' },
    { value: 'Tahoma', label: 'Tahoma' },
    { value: 'Geneva', label: 'Geneva' },
    { value: 'Trebuchet MS', label: 'Trebuchet MS' },
    { value: 'Verdana', label: 'Verdana' },
    { value: 'Courier New', label: 'Courier New' },
    { value: 'Courier', label: 'Courier' },
    { value: 'Lucida Console', label: 'Lucida Console' },
    { value: 'Monaco', label: 'Monaco' },
  ];

  const [fontFamily, setFontFamily] = useState(fontFamilyValue !== 'multi' ? options.find((option) => option.value === fontFamilyValue) : null);

  useEffect(() => {
    if (fontFamilyValue === 'multi') {
      setFontFamily(null);
    } else {
      setFontFamily(options.find((option) => option.value === fontFamilyValue));
    }
  }, [fontFamilyValue, selected]);

  const handleChange = (selectedOption: { value: string; label: string }): void => {
    setFontFamily(selectedOption);
    dispatch(setLayersFontFamily({layers: selected, fontFamily: selectedOption.value}));
    dispatch(setTextSettingsFontFamily({fontFamily: selectedOption.value}));
  }

  return (
    <SidebarSelect
      value={fontFamily}
      onChange={handleChange}
      options={options}
      placeholder='multi'
      type='fontFamily'
      bottomLabel='Family'
    />
  );
}

export default FontFamilySelector;