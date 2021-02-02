/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { forwardRef } from 'react';
import Form from './Form';
import MathFormGroup, { MathFormGroupProps } from './MathFormGroup';

const PercentageFormGroup = forwardRef(function PercentageFormGroup(props: MathFormGroupProps, ref: any) {
  const { onSubmitSuccess, value } = props;

  const handleSubmitSuccess = (evaluation: any): void => {
    onSubmitSuccess(evaluation / 100);
  }

  return (
    <MathFormGroup
      {...props}
      ref={ref}
      value={value !== 'multi' ? Math.round(value * 100) : value}
      right={<Form.Text>%</Form.Text>}
      min={0}
      max={100}
      onSubmitSuccess={handleSubmitSuccess} />
  );
});

export default PercentageFormGroup;