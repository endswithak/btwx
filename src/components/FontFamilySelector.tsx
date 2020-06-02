import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import SidebarSelect from './SidebarSelect';
import { RootState } from '../store/reducers';
import { SetLayerFontFamilyPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayerFontFamily } from '../store/actions/layer';
import { getPaperLayer } from '../store/selectors/layer';
import { TextSettingsTypes, SetTextSettingsFontFamilyPayload } from '../store/actionTypes/textSettings';
import { setTextSettingsFontFamily } from '../store/actions/textSettings';

interface FontFamilySelectorProps {
  selected?: string[];
  fontFamilyValue?: string;
  setLayerFontFamily?(payload: SetLayerFontFamilyPayload): LayerTypes;
  setTextSettingsFontFamily?(payload: SetTextSettingsFontFamilyPayload): TextSettingsTypes;
}

const FontFamilySelector = (props: FontFamilySelectorProps): ReactElement => {
  const { selected, fontFamilyValue, setLayerFontFamily, setTextSettingsFontFamily } = props;

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

  const [fontFamily, setFontFamily] = useState(options.find((option) => option.value === fontFamilyValue));

  useEffect(() => {
    setFontFamily(options.find((option) => option.value === fontFamilyValue));
  }, [fontFamilyValue, selected]);

  const handleChange = (selectedOption: { value: string; label: string }) => {
    setFontFamily(selectedOption);
    setLayerFontFamily({id: selected[0], fontFamily: selectedOption.value});
    setTextSettingsFontFamily({fontFamily: selectedOption.value});
  }

  return (
    <SidebarSelect
      value={fontFamily}
      onChange={handleChange}
      options={options}
      placeholder={'Font Family'}
      type='fontFamily'
      bottomLabel='Family'
    />
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const selected = layer.present.selected;
  const fontFamilyValue = (layer.present.byId[selected[0]] as em.Text).textStyle.fontFamily;
  return { selected, fontFamilyValue };
};

export default connect(
  mapStateToProps,
  { setLayerFontFamily, setTextSettingsFontFamily }
)(FontFamilySelector);