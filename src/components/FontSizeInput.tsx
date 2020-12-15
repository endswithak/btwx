import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import mexp from 'math-expression-evaluator';
import { RootState } from '../store/reducers';
import { setLayersFontSize } from '../store/actions/layer';
import { getSelectedFontSize } from '../store/selectors/layer';
import { setTextSettingsFontSize } from '../store/actions/textSettings';
import SidebarInput from './SidebarInput';

const FontSizeInput = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const fontSizeValue = useSelector((state: RootState) => getSelectedFontSize(state));
  const [fontSize, setFontSize] = useState(fontSizeValue);
  const dispatch = useDispatch();

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
        dispatch(setLayersFontSize({layers: selected, fontSize: Math.round(nextFontSize)}));
        dispatch(setTextSettingsFontSize({fontSize: Math.round(nextFontSize)}));
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

export default FontSizeInput;