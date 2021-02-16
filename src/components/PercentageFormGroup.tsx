/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { forwardRef, useCallback } from 'react';
import { remote } from 'electron';
import debounce from 'lodash.debounce';
import Form from './Form';
import { clearTouchbar } from '../utils';
import MathFormGroup, { MathFormGroupProps } from './MathFormGroup';

const PercentageFormGroup = forwardRef(function PercentageFormGroup({
  value,
  label,
  onFocus,
  onBlur,
  onSubmitSuccess,
  ...rest
}: MathFormGroupProps, ref: any) {
  const isMac = remote.process.platform === 'darwin';

  const debounceColorChange = useCallback(
    debounce((percentage: number) => {
      onSubmitSuccess(percentage);
    }, 150),
    []
  );

  const debounceBuildTouchbar = useCallback(
    debounce((nextEval: number) => {
      buildTouchBar(nextEval);
    }, 150),
    []
  );

  const handleSubmitSuccess = (evaluation: any): void => {
    onSubmitSuccess(evaluation / 100);
    debounceBuildTouchbar(evaluation / 100);
  }

  const buildTouchBar = (opt = value): void => {
    const { TouchBarSlider } = remote.TouchBar;
    const radiusSlider = new TouchBarSlider({
      label: label ? label : '%',
      value: opt !== 'multi' ? Math.round(opt * 100) : 0,
      minValue: 0,
      maxValue: 100,
      change: (newValue) => {
        const newRadius = newValue / 100;
        debounceColorChange(newRadius);
      }
    });
    const newTouchBar = new remote.TouchBar({
      items: [radiusSlider]
    });
    remote.getCurrentWindow().setTouchBar(newTouchBar);
  }

  const handleFocus = (e: any): void => {
    if (onFocus) {
      onFocus(e);
    }
    if (isMac) {
      buildTouchBar();
    }
  }

  const handleBlur = (e: any): void => {
    if (onBlur) {
      onBlur(e);
    }
    if (isMac) {
      clearTouchbar();
    }
  }

  return (
    <MathFormGroup
      {...rest}
      label={label}
      ref={ref}
      value={value !== 'multi' ? Math.round(value * 100) : value}
      right={<Form.Text>%</Form.Text>}
      min={0}
      max={100}
      onSubmitSuccess={handleSubmitSuccess}
      onFocus={handleFocus}
      onBlur={handleBlur} />
  );
});

export default PercentageFormGroup;