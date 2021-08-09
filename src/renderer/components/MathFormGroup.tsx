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
  placeholder?: string;
  rightReadOnly?: boolean;
  leftReadOnly?: boolean;
  label?: string;
  submitOnBlur?: boolean;
  canvasAutoFocus?: boolean;
  inline?: boolean;
  min?: number;
  max?: number;
  canDirty?: boolean;
  onSubmitSuccess(value: any): void;
  onSubmitError?(): void;
  onBlur?(e: any): void;
  onFocus?(e: any): void;
}

const getFixedValue = (v) => !isNaN(v) ? Number(Number(v).toFixed(2)) : v;

const MathFormGroup = forwardRef(function MathFormGroup(props: MathFormGroupProps, ref: any) {
  const { canDirty = false, controlId, disabled, size, inline, min, max, submitOnBlur, canvasAutoFocus, placeholder, right, rightReadOnly = true, left, leftReadOnly = true, label, value, onSubmitSuccess, onSubmitError, onBlur, onFocus } = props;
  const initialEval = evaluateExp(value);
  const validInitialEval = initialEval !== null;
  const aboveRange = max !== undefined && validInitialEval && initialEval > max;
  const belowRange = min !== undefined && validInitialEval && initialEval < min;
  const [currentValue, setCurrentValue] = useState(getFixedValue(value));
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
    if ((valid && dirty) || (valid && canDirty)) {
      setCurrentValue(getFixedValue(evaluation));
      onSubmitSuccess(Number(evaluation));
    } else {
      if (onSubmitError) {
        onSubmitError();
      }
      setCurrentValue(getFixedValue(value));
      setValid(true);
    }
    setDirty(false);
  }

  useEffect(() => {
    const nextEval = evaluateExp(value);
    const validEval = initialEval !== null;
    const aboveRange = max !== undefined && validEval && nextEval > max;
    const belowRange = min !== undefined && validEval && nextEval < min;
    setCurrentValue(getFixedValue(value));
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
          placeholder={placeholder}
          size={size}
          type='text'
          // isInvalid={!valid && dirty}
          // isValid={valid && dirty}
          onChange={handleChange}
          required
          right={right}
          left={left}
          rightReadOnly={rightReadOnly}
          leftReadOnly={leftReadOnly} />
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