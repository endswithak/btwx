/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, useState, forwardRef } from 'react';
import { evaluatePathData } from '../utils';
import Form from './Form';

interface PathDataFormGroup {
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

const PathDataFormGroup = forwardRef(function PathDataFormGroup(props: PathDataFormGroup, ref: any) {
  const { controlId, size, disabled, inline, submitOnBlur, canvasAutoFocus, label, value, onSubmitSuccess, onSubmitError } = props;
  const [currentValue, setCurrentValue] = useState(value);
  const [evaluation, setEvaluation] = useState(evaluatePathData(value));
  const [valid, setValid] = useState(value === 'multi' || evaluatePathData(value));
  const [dirty, setDirty] = useState(false);

  const handleChange = (e: any): void => {
    const nextValue = e.target.value;
    const nextEval = evaluatePathData(nextValue);
    setEvaluation(nextEval);
    setValid(nextEval !== null);
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
    const nextEval = evaluatePathData(value);
    setCurrentValue(value);
    setEvaluation(nextEval);
    setValid(nextEval !== null);
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
          // isInvalid={!valid && dirty}
          // isValid={valid && dirty}
          onChange={handleChange}
          required
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

export default PathDataFormGroup;