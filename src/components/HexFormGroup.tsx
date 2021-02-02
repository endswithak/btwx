/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, useState, forwardRef } from 'react';
import tinyColor from 'tinycolor2';
import { evaluateHex } from '../utils';
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
  const { controlId, size, disabled, inline, submitOnBlur, canvasAutoFocus, label, value, onSubmitSuccess, onSubmitError } = props;
  const [currentValue, setCurrentValue] = useState(value);
  const [evaluation, setEvaluation] = useState(evaluateHex(value));
  const [valid, setValid] = useState(value === 'multi' || tinyColor(value).isValid());
  const [dirty, setDirty] = useState(false);

  const handleChange = (e: any): void => {
    const nextValue = e.target.value;
    const nextEval = evaluateHex(nextValue);
    const nextValid = (nextEval === 'multi' && value === 'multi') || tinyColor(nextValue).isValid();
    setEvaluation(nextEval);
    setValid(nextValid);
    setDirty(nextEval !== value);
    setCurrentValue(nextValue);
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

  useEffect(() => {
    const nextEval = evaluateHex(value);
    setCurrentValue(value);
    setEvaluation(nextEval);
    setValid(value === 'multi' || tinyColor(value).isValid());
  }, [value]);

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
          isInvalid={!valid && dirty}
          isValid={valid && dirty}
          onChange={handleChange}
          required
          left={<Form.Text>#</Form.Text>}
          leftReadOnly />
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