import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import mexp from 'math-expression-evaluator';
import { RootState } from '../store/reducers';
import { setLayersLetterSpacingThunk } from '../store/actions/layer';
import { getSelectedLetterSpacing } from '../store/selectors/layer';
import { setTextSettingsLetterSpacing } from '../store/actions/textSettings';
import SidebarInput from './SidebarInput';

const LetterSpacingInput = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const letterSpacingValue = useSelector((state: RootState) => getSelectedLetterSpacing(state));
  const [letterSpacing, setLetterSpacing] = useState(letterSpacingValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setLetterSpacing(letterSpacingValue);
  }, [letterSpacingValue, selected]);

  const handleChange = (e: any) => {
    const target = e.target;
    setLetterSpacing(target.value);
  };

  const handleSubmit = (e: any) => {
    try {
      let nextLetterSpacing = mexp.eval(`${letterSpacing}`) as any;
      if (nextLetterSpacing !== letterSpacingValue) {
        if (nextLetterSpacing < 0) {
          nextLetterSpacing = 0;
        }
        dispatch(setLayersLetterSpacingThunk({layers: selected, letterSpacing: Math.round(nextLetterSpacing)}));
        dispatch(setTextSettingsLetterSpacing({letterSpacing: Math.round(nextLetterSpacing)}));
        setLetterSpacing(Math.round(nextLetterSpacing));
      } else {
        setLetterSpacing(letterSpacingValue);
      }
    } catch(error) {
      setLetterSpacing(letterSpacingValue);
    }
  }

  return (
    <SidebarInput
      value={letterSpacing}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitOnBlur
      bottomLabel={'Tracking'} />
  );
}

export default LetterSpacingInput;