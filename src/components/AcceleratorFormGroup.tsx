/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState, forwardRef } from 'react';
import { evaluateAccelerator } from '../utils';
import Form from './Form';

export interface AcceleratorFormGroupProps {
  value: any;
  controlId: string;
  size?: Btwx.SizeVariant;
  disabled?: boolean;
  right?: ReactElement;
  left?: ReactElement;
  label?: string;
  submitOnBlur?: boolean;
  canvasAutoFocus?: boolean;
  inline?: boolean;
  onSubmitSuccess(value: any): void;
  onSubmitError?(): void;
  onBlur?(e: any): void;
  onFocus?(e: any): void;
}

const AcceleratorFormGroup = forwardRef(function AcceleratorFormGroup(props: AcceleratorFormGroupProps, ref: any) {
  const { controlId, disabled, size, inline, submitOnBlur, canvasAutoFocus, right, left, label, value, onSubmitSuccess, onSubmitError, onBlur, onFocus } = props;
  const initialEval = evaluateAccelerator(value);
  const validInitialEval = initialEval !== null;
  const [currentValue, setCurrentValue] = useState(value);
  const [evaluation, setEvaluation] = useState(initialEval);
  const [valid, setValid] = useState(validInitialEval);
  const [dirty, setDirty] = useState(false);

  // 1. activate on focus
  // 2. on every keydown, get key and modifiers
  // 3. apply styled binding to input
  // 4. if already taken, provide prompt to set and clear or cancel

  const handleChange = (e: any): void => {
    const nextValue = e.target.value;
    const nextEval = evaluateAccelerator(nextValue);
    const validEval = nextEval;
    setEvaluation(nextEval);
    setValid(validEval);
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
    const nextEval = evaluateAccelerator(value);
    const validEval = initialEval;
    setCurrentValue(value);
    setEvaluation(nextEval);
    setValid(validEval);
  }, [value]);

  return (
    <Form
      inline={inline}
      onSubmit={handleSubmit}
      submitOnBlur={submitOnBlur}
      canvasAutoFocus={canvasAutoFocus}>
      <Form.Group controlId={controlId}>
        <Form.Control
          onBlur={onBlur}
          onFocus={onFocus}
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
          right={right}
          left={left}
          rightReadOnly
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

export default AcceleratorFormGroup;