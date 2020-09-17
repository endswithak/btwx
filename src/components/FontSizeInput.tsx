import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import mexp from 'math-expression-evaluator';
import SidebarInput from './SidebarInput';
import { RootState } from '../store/reducers';
import { SetLayersFontSizePayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayersFontSize } from '../store/actions/layer';
import { TextSettingsTypes, SetTextSettingsFontSizePayload } from '../store/actionTypes/textSettings';
import { setTextSettingsFontSize } from '../store/actions/textSettings';

interface FontSizeInputProps {
  selected?: string[];
  fontSizeValue?: number | 'multi';
  setLayersFontSize?(payload: SetLayersFontSizePayload): LayerTypes;
  setTextSettingsFontSize?(payload: SetTextSettingsFontSizePayload): TextSettingsTypes;
}

const FontSizeInput = (props: FontSizeInputProps): ReactElement => {
  const { selected, setLayersFontSize, fontSizeValue, setTextSettingsFontSize } = props;
  const [fontSize, setFontSize] = useState(fontSizeValue);

  useEffect(() => {
    setFontSize(fontSizeValue);
  }, [fontSizeValue, selected]);

  const handleChange = (e: any) => {
    const target = e.target;
    setFontSize(target.value);
  };

  const handleSubmit = (e: any) => {
    try {
      const nextFontSize = mexp.eval(`${fontSize}`) as any;
      if (nextFontSize !== fontSizeValue) {
        setLayersFontSize({layers: selected, fontSize: Math.round(nextFontSize)});
        setTextSettingsFontSize({fontSize: Math.round(nextFontSize)});
        setFontSize(Math.round(nextFontSize));
      } else {
        setFontSize(fontSizeValue);
      }
    } catch(error) {
      setFontSize(fontSizeValue);
    }
  }

  return (
    <SidebarInput
      value={fontSize}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitOnBlur
      bottomLabel={'Size'} />
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const selected = layer.present.selected;
  const layerItems: em.Text[] = selected.reduce((result, current) => {
    const layerItem = layer.present.byId[current];
    return [...result, layerItem];
  }, []);
  const fontSizeValues: number[] = layerItems.reduce((result, current) => {
    return [...result, current.textStyle.fontSize];
  }, []);
  const fontSizeValue = fontSizeValues.every((fontSize: number) => fontSize === fontSizeValues[0]) ? fontSizeValues[0] : 'multi';
  return { selected, fontSizeValue };
};

export default connect(
  mapStateToProps,
  { setLayersFontSize, setTextSettingsFontSize }
)(FontSizeInput);