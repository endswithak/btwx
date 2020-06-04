import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { evaluate } from 'mathjs';
import SidebarInput from './SidebarInput';
import { RootState } from '../store/reducers';
import { SetLayerFontSizePayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayerFontSize } from '../store/actions/layer';
import { getPaperLayer } from '../store/selectors/layer';
import { TextSettingsTypes, SetTextSettingsFontSizePayload } from '../store/actionTypes/textSettings';
import { setTextSettingsFontSize } from '../store/actions/textSettings';

interface FontSizeInputProps {
  selected?: string[];
  fontSizeValue?: number | string;
  setLayerFontSize?(payload: SetLayerFontSizePayload): LayerTypes;
  setTextSettingsFontSize?(payload: SetTextSettingsFontSizePayload): TextSettingsTypes;
}

const FontSizeInput = (props: FontSizeInputProps): ReactElement => {
  const { selected, setLayerFontSize, fontSizeValue, setTextSettingsFontSize } = props;
  const [fontSize, setFontSize] = useState<string | number>(props.fontSizeValue);

  useEffect(() => {
    setFontSize(fontSizeValue);
  }, [fontSizeValue, selected]);

  const handleChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setFontSize(target.value);
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLInputElement>) => {
    try {
      const nextFontSize = evaluate(`${fontSize}`);
      if (nextFontSize !== fontSizeValue) {
        setLayerFontSize({id: selected[0], fontSize: nextFontSize});
        setTextSettingsFontSize({fontSize: nextFontSize});
        setFontSize(nextFontSize);
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
      disabled={selected.length > 1 || selected.length === 0}
      bottomLabel={'Size'} />
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const selected = layer.present.selected;
  const fontSizeValue = (() => {
    switch(layer.present.selected.length) {
      case 0:
        return null;
      case 1:
        return (layer.present.byId[layer.present.selected[0]] as em.Text).textStyle.fontSize;
      default:
        return null;
    }
  })();
  return { selected, fontSizeValue };
};

export default connect(
  mapStateToProps,
  { setLayerFontSize, setTextSettingsFontSize }
)(FontSizeInput);