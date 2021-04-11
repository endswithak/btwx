/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, useState, forwardRef, useCallback } from 'react';
import debounce from 'lodash.debounce';
import tinyColor from 'tinycolor2';
import { evaluateHex, clearTouchbar } from '../utils';
import Form from './Form';

interface HexFormGroup {
  value: string;
  controlId: string;
  size?: Btwx.SizeVariant;
  disabled?: boolean;
  label?: string;
  submitOnBlur?: boolean;
  canvasAutoFocus?: boolean;
  inline?: boolean;
  onSubmitSuccess(value: any): void;
  onSubmitError?(): void;
}

const HexFormGroup = forwardRef(function HexFormGroup(props: HexFormGroup, ref: any) {
  // const isMac = remote.process.platform === 'darwin';
  const { controlId, size, disabled, inline, submitOnBlur, canvasAutoFocus, label, value, onSubmitSuccess, onSubmitError } = props;
  const [currentValue, setCurrentValue] = useState(value);
  const [evaluation, setEvaluation] = useState(evaluateHex(value));
  const [valid, setValid] = useState(value === 'multi' || tinyColor(value).isValid());
  const [dirty, setDirty] = useState(false);

  // const debounceColorChange = useCallback(
  //   debounce((color: string) => {
  //     const hex = tinyColor(color).toHex();
  //     setValid(true);
  //     setDirty(false);
  //     setCurrentValue(hex);
  //     setEvaluation(hex);
  //     onSubmitSuccess(hex);
  //   }, 150),
  //   []
  // );

  // const debounceBuildTouchbar = useCallback(
  //   debounce((nextValid: boolean, nextEval: string) => {
  //     buildColorPickerTouchBar(nextValid ? `#${nextEval}` : null);
  //   }, 150),
  //   []
  // );

  const handleChange = (e: any): void => {
    const nextValue = e.target.value;
    const nextEval = evaluateHex(nextValue);
    const nextValid = (nextEval === 'multi' && value === 'multi') || tinyColor(nextValue).isValid();
    setEvaluation(nextEval);
    setValid(nextValid);
    setDirty(nextEval !== value);
    setCurrentValue(nextValue);
    // if (isMac) {
    //   debounceBuildTouchbar(nextValid, nextEval);
    // }
  }

  const handleSubmit = (e: any): void => {
    if (valid && dirty) {
      setCurrentValue(evaluation);
      onSubmitSuccess(evaluation);
    } else {
      if (onSubmitError) {
        onSubmitError();
      }
      setCurrentValue(value);
      setValid(true);
    }
    setDirty(false);
  }

  // const buildColorPickerTouchBar = (tv = valid ? `#${evaluation}` : null): void => {
  //   const { TouchBarColorPicker } = remote.TouchBar;
  //   const colorPicker = new TouchBarColorPicker({
  //     selectedColor: tv,
  //     change: debounceColorChange
  //   });
  //   const colorEditorTouchBar = new remote.TouchBar({
  //     items: [colorPicker]
  //   });
  //   remote.getCurrentWindow().setTouchBar(colorEditorTouchBar);
  // }

  useEffect(() => {
    const nextEval = evaluateHex(value);
    setCurrentValue(value);
    setEvaluation(nextEval);
    setValid(value === 'multi' || tinyColor(value).isValid());
  }, [value]);

  // const handleFocus = () => {
  //   if (isMac) {
  //     buildColorPickerTouchBar();
  //   }
  // }

  // const handleBlur = () => {
  //   if (isMac) {
  //     clearTouchbar();
  //   }
  // }

  return (
    <Form
      inline={inline}
      onSubmit={handleSubmit}
      submitOnBlur={submitOnBlur}
      canvasAutoFocus={canvasAutoFocus}>
      <Form.Group controlId={controlId}>
        <Form.Control
          disabled={disabled}
          ref={ref}
          as='input'
          value={currentValue}
          size={size}
          type='text'
          // isInvalid={!valid && dirty}
          // isValid={valid && dirty}
          onChange={handleChange}
          required
          left={<Form.Text>#</Form.Text>}
          leftReadOnly
          // onFocus={handleFocus}
          // onBlur={handleBlur}
          />
        {
          label
          ? <Form.Label>
              { label }
            </Form.Label>
          : null
        }
      </Form.Group>
    </Form>
  );
})

export default HexFormGroup;