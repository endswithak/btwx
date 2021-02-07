/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { forwardRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { RefForwardingComponent } from '../utils';
import { setCanvasFocusing } from '../store/actions/canvasSettings';
import FormText from './FormText';
import FormLabel from './FormLabel';
import FormControl from './FormControl';
import FormGroup from './FormGroup';
import FormRow from './FormRow';

export interface FormProps extends React.HTMLAttributes<HTMLFormElement> {
  inline?: boolean;
  validated?: boolean;
  submitOnBlur?: boolean;
  canvasAutoFocus?: boolean;
}

type Form = RefForwardingComponent<'form', FormProps> & {
  Group: typeof FormGroup;
  Control: typeof FormControl;
  Label: typeof FormLabel;
  Text: typeof FormText;
  Row: typeof FormRow;
}

const Form: Form = (forwardRef(function Form(props: FormProps, ref) {
  const canvasFocusing = useSelector((state: RootState) => state.canvasSettings.focusing);
  const { inline, children, validated, submitOnBlur, canvasAutoFocus, onSubmit, onBlur, onFocus } = props;
  const dispatch = useDispatch();

  const handleSubmit = (e: any): void => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  }

  const handleBlur = (e: any): void => {
    if (onBlur) {
      onBlur(e);
    }
    if (submitOnBlur) {
      handleSubmit(e);
    }
    if (canvasAutoFocus && !canvasFocusing) {
      dispatch(setCanvasFocusing({focusing: true}));
    }
  }

  const handleFocus = (e: any): void => {
    if (onFocus) {
      onFocus(e);
    }
    if (canvasAutoFocus && canvasFocusing) {
      dispatch(setCanvasFocusing({focusing: false}));
    }
  }

  return (
    <form
      noValidate
      className={`c-form ${inline ? 'c-form--inline' : ''}`}
      onSubmit={handleSubmit}
      onBlur={handleBlur}
      onFocus={handleFocus}>
      { children }
    </form>
  );
}) as unknown) as Form;

Form.Control = FormControl;
Form.Group = FormGroup;
Form.Label = FormLabel;
Form.Text = FormText;
Form.Row = FormRow;

export default Form;