import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch  } from 'react-redux';
import { RootState } from '../store/reducers';
import { DEFAULT_TEXT_TRANSFORM_OPTIONS } from '../constants';
import { setLayersTextTransformThunk } from '../store/actions/layer';
import { getSelectedTextTransform } from '../store/selectors/layer';
import ButtonGroupInput from './ButtonGroupInput';

const TextTransformInput = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const textTransformValue = useSelector((state: RootState) => getSelectedTextTransform(state));
  const [textTransform, setTextTransform] = useState(textTransformValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setTextTransform(textTransformValue);
  }, [textTransformValue, selected]);

  const handleClick = (textTransformButtonValue: Btwx.TextTransform): void => {
    dispatch(setLayersTextTransformThunk({layers: selected, textTransform: textTransformButtonValue as Btwx.TextTransform}));
    setTextTransform(textTransformButtonValue);
  };

  const options = DEFAULT_TEXT_TRANSFORM_OPTIONS.map((option, index) => ({
    icon: `text-transform-${option}`,
    active: textTransform === option,
    onClick: () => handleClick(option)
  }));

  return (
    <ButtonGroupInput
      buttons={options}
      label='Transform' />
  );
}

export default TextTransformInput;