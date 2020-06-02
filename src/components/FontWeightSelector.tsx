import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import SidebarSelect from './SidebarSelect';
import { RootState } from '../store/reducers';
import { SetLayerFontWeightPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayerFontWeight } from '../store/actions/layer';
import { getPaperLayer } from '../store/selectors/layer';
import { TextSettingsTypes, SetTextSettingsFontWeightPayload } from '../store/actionTypes/textSettings';
import { setTextSettingsFontWeight } from '../store/actions/textSettings';

interface FontWeightSelectorProps {
  selected?: string[];
  fontWeightValue?: em.FontWeight;
  fontFamily?: string;
  setLayerFontWeight?(payload: SetLayerFontWeightPayload): LayerTypes;
  setTextSettingsFontWeight?(payload: SetTextSettingsFontWeightPayload): TextSettingsTypes;
}

const FontWeightSelector = (props: FontWeightSelectorProps): ReactElement => {
  const { selected, fontWeightValue, fontFamily, setLayerFontWeight, setTextSettingsFontWeight } = props;

  const options: { value: string; label: string }[] = [
    { value: 'normal', label: 'Regular' },
    { value: 'bold', label: 'Bold' },
    { value: 'italic', label: 'Italic' },
    { value: 'bold italic', label: 'Bold Italic' }
  ];

  const [fontWeight, setFontWeight] = useState(options.find((option) => option.value === fontWeightValue));

  useEffect(() => {
    setFontWeight(options.find((option) => option.value === fontWeightValue));
  }, [fontWeightValue, selected]);

  const handleChange = (selectedOption: { value: string; label: string }) => {
    setFontWeight(selectedOption);
    setLayerFontWeight({id: selected[0], fontWeight: selectedOption.value});
    setTextSettingsFontWeight({fontWeight: selectedOption.value as em.FontWeight});
  }

  return (
    <SidebarSelect
      value={fontWeight}
      onChange={handleChange}
      options={options}
      placeholder={'Font Weight'}
      type={'fontWeight'}
      data={{fontFamily}}
      bottomLabel={'Weight'}
    />
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer, textSettings } = state;
  const selected = layer.present.selected;
  const fontWeightValue = (layer.present.byId[selected[0]] as em.Text).textStyle.fontWeight;
  const fontFamily = textSettings.fontFamily;
  return { selected, fontWeightValue, fontFamily };
};

export default connect(
  mapStateToProps,
  { setLayerFontWeight, setTextSettingsFontWeight }
)(FontWeightSelector);