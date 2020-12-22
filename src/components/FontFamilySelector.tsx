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
  const systemFonts = useSelector((state: RootState) => state.textSettings.systemFonts);
  const dispatch = useDispatch();

  const options: { value: string; label: string }[] = systemFonts.map(font => ({
    value: font,
    label: font
  }));

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
      truncateOptions
    />
  );
}

export default FontFamilySelector;