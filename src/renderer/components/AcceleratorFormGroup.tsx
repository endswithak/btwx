/* eslint-disable @typescript-eslint/no-use-before-define */
// import { ipcRenderer } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import React, { ReactElement, useEffect, useState, forwardRef } from 'react';
import { evaluateAccelerator, getPrettyAccelerator } from '../utils';
import { clearKeyBindingThunk } from '../store/actions/keyBindings';
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

// need a better way to handle this
const BLACKLIST = ['Cmd+R', 'Ctrl+R'];

const AcceleratorFormGroup = forwardRef(function AcceleratorFormGroup(props: AcceleratorFormGroupProps, ref: any) {
  const allBindings = useSelector((state: RootState) => state.keyBindings.allBindings);
  const { controlId, disabled, size, inline, submitOnBlur, canvasAutoFocus, right, left, label, value, onSubmitSuccess, onSubmitError, onBlur, onFocus } = props;
  const [currentValue, setCurrentValue] = useState(value);
  const [prettyValue, setPrettyValue] = useState(getPrettyAccelerator(value));
  const [valid, setValid] = useState(evaluateAccelerator(value));
  const dispatch = useDispatch();

  const handleChange = (e: any): void => {
    e.preventDefault();
    if (e.key && e.key !== 'Shift' && e.key !== 'Command' && e.key !== 'Meta' && e.key !== 'Control' && e.key !== 'Alt') {
      const ctrl = e.ctrlKey;
      const meta = e.metaKey;
      const shift = e.shiftKey;
      const alt = e.altKey;
      const key = `${e.altKey ? String.fromCharCode(e.keyCode) : e.key}`.toUpperCase();
      const nextValue = `${ctrl ? 'Ctrl+' : ''}${meta ? 'Cmd+' : ''}${shift ? 'Shift+' : ''}${alt ? 'Alt+' : ''}${key}`;
      const nextValid = evaluateAccelerator(nextValue);
      const isRegistered = allBindings.includes(nextValue);
      if (nextValid && nextValue !== currentValue && !BLACKLIST.includes(nextValue)) {
        const pretty = getPrettyAccelerator(nextValue);
        if (isRegistered) {
          (window as any).api.overwriteRegisteredBinding(pretty).then((overwrite) => {
            if (overwrite) {
              dispatch(clearKeyBindingThunk({binding: nextValue}));
              onSubmitSuccess(nextValue);
              setCurrentValue(nextValue);
              setPrettyValue(pretty);
            }
          });
          // ipcRenderer.invoke('overwriteRegisteredBinding', pretty).then((overwrite) => {
          //   if (overwrite) {
          //     dispatch(clearKeyBindingThunk({binding: nextValue}));
          //     onSubmitSuccess(nextValue);
          //     setCurrentValue(nextValue);
          //     setPrettyValue(pretty);
          //   }
          // });
        } else {
          onSubmitSuccess(nextValue);
          setCurrentValue(nextValue);
          setPrettyValue(pretty);
        }
      }
    }
  }

  useEffect(() => {
    setCurrentValue(value);
    setValid(evaluateAccelerator(value));
    setPrettyValue(getPrettyAccelerator(value));
  }, [value]);

  return (
    <Form
      inline={inline}
      submitOnBlur={submitOnBlur}
      canvasAutoFocus={canvasAutoFocus}>
      <Form.Group controlId={controlId}>
        <Form.Control
          onBlur={onBlur}
          onFocus={onFocus}
          readOnly
          disabled={disabled}
          ref={ref}
          as='input'
          value={prettyValue}
          size={size}
          type='text'
          // isInvalid={registered && dirty}
          // isValid={valid && dirty}
          onChange={() => {return;}}
          onKeyDown={handleChange}
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