/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch  } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayersFontStyleThunk } from '../store/actions/layer';
import { setTextSettingsFontStyle } from '../store/actions/textSettings';
import { getSelectedFontStyle } from '../store/selectors/layer';
import { DEFAULT_FONT_STYLE_OPTIONS } from '../constants';
import Form from './Form';
import ToggleButtonGroup from './ToggleButtonGroup';
import Icon from './Icon';

const FontStyleInput = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const fontStyleValue = useSelector((state: RootState) => getSelectedFontStyle(state));
  const [fontStyle, setFontStyle] = useState(fontStyleValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setFontStyle(fontStyleValue);
  }, [fontStyleValue, selected]);

  const handleChange = (e: any): void => {
    if (e.target.value !== fontStyleValue) {
      dispatch(setLayersFontStyleThunk({layers: selected, fontStyle: e.target.value}));
      dispatch(setTextSettingsFontStyle({fontStyle: e.target.value as Btwx.FontStyle}));
      setFontStyle(e.target.value);
    }
  };

  const options = DEFAULT_FONT_STYLE_OPTIONS.map((option, index) => (
    <ToggleButtonGroup.Button
      key={option}
      value={option}>
      <Icon
        name={`font-style-${option}`}
        size='small' />
    </ToggleButtonGroup.Button>
  ));

  return (
    <Form inline>
      <Form.Group controlId='control-font-style'>
        <ToggleButtonGroup
          type='radio'
          name='fontStyle'
          size='small'
          value={fontStyle}
          onChange={handleChange}>
          { options }
        </ToggleButtonGroup>
        <Form.Label>
          Italic
        </Form.Label>
      </Form.Group>
    </Form>
  );
}

export default FontStyleInput;