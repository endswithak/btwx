import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import SidebarSelect from './SidebarSelect';
import { RootState } from '../store/reducers';
import { SetLayersFontWeightPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayersFontWeight } from '../store/actions/layer';
import { TextSettingsTypes, SetTextSettingsFontWeightPayload } from '../store/actionTypes/textSettings';
import { setTextSettingsFontWeight } from '../store/actions/textSettings';

interface FontWeightSelectorProps {
  selected?: string[];
  fontWeightValue?: em.FontWeight | 'multi';
  fontFamily?: string;
  setLayersFontWeight?(payload: SetLayersFontWeightPayload): LayerTypes;
  setTextSettingsFontWeight?(payload: SetTextSettingsFontWeightPayload): TextSettingsTypes;
}

const FontWeightSelector = (props: FontWeightSelectorProps): ReactElement => {
  const { selected, fontWeightValue, fontFamily, setLayersFontWeight, setTextSettingsFontWeight } = props;

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
    setLayersFontWeight({layers: selected, fontWeight: selectedOption.value});
    setTextSettingsFontWeight({fontWeight: selectedOption.value as em.FontWeight});
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

const mapStateToProps = (state: RootState) => {
  const { layer, textSettings } = state;
  const selected = layer.present.selected;
  const layerItems: em.Text[] = selected.reduce((result, current) => {
    const layerItem = layer.present.byId[current];
    return [...result, layerItem];
  }, []);
  const fontWeightValues: string[] = layerItems.reduce((result, current) => {
    return [...result, current.textStyle.fontWeight];
  }, []);
  const fontWeightValue = fontWeightValues.every((fontWeight: string) => fontWeight === fontWeightValues[0]) ? fontWeightValues[0] : 'multi';
  const fontFamily = textSettings.fontFamily;
  return { selected, fontWeightValue, fontFamily };
};

export default connect(
  mapStateToProps,
  { setLayersFontWeight, setTextSettingsFontWeight }
)(FontWeightSelector);