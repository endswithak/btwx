/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState, forwardRef } from 'react';
import { evaluateExp } from '../utils';
import Form from './Form';

export interface MathFormGroupProps {
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
  min?: number;
  max?: number;
  onSubmitSuccess(value: any): void;
  onSubmitError?(): void;
  onBlur?(e: any): void;
  onFocus?(e: any): void;
}

const MathFormGroup = forwardRef(function MathFormGroup(props: MathFormGroupProps, ref: any) {
  const { controlId, disabled, size, inline, min, max, submitOnBlur, canvasAutoFocus, right, left, label, value, onSubmitSuccess, onSubmitError, onBlur, onFocus } = props;
  const initialEval = evaluateExp(value);
  const validInitialEval = initialEval !== null;
  const aboveRange = max !== undefined && validInitialEval && initialEval > max;
  const belowRange = min !== undefined && validInitialEval && initialEval < min;
  const [currentValue, setCurrentValue] = useState(value);
  const [evaluation, setEvaluation] = useState(initialEval);
  const [valid, setValid] = useState(validInitialEval && !aboveRange && !belowRange);
  const [dirty, setDirty] = useState(false);

  const handleChange = (e: any): void => {
    const nextValue = e.target.value;
    const nextEval = evaluateExp(nextValue);
    const validEval = nextEval !== null;
    const aboveRange = max !== undefined && validEval && nextEval > max;
    const belowRange = min !== undefined && validEval && nextEval < min;
    setEvaluation(nextEval);
    setValid(validEval && !aboveRange && !belowRange);
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
    const nextEval = evaluateExp(value);
    const validEval = initialEval !== null;
    const aboveRange = max !== undefined && validEval && nextEval > max;
    const belowRange = min !== undefined && validEval && nextEval < min;
    setCurrentValue(value);
    setEvaluation(nextEval);
    setValid(validEval && !aboveRange && !belowRange);
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

export default MathFormGroup;