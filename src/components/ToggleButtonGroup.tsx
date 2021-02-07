import React, { forwardRef, useMemo } from 'react';
import { Omit, RefForwardingComponent } from '../utils';
import ButtonGroup, { ButtonGroupProps } from './ButtonGroup';
import ToggleButton from './ToggleButton';
import ToggleButtonGroupContext from './ToggleButtonGroupContext';

export interface ToggleButtonRadioProps<T>
  extends Omit<ButtonGroupProps, 'toggle'> {
  type?: 'radio';
  name: string;
  value?: T;
  defaultValue?: T;
  onChange?: (value: T, event: any) => void;
}

export interface ToggleButtonCheckboxProps<T>
  extends Omit<ButtonGroupProps, 'toggle'> {
  type: 'checkbox';
  name?: string;
  value?: T[];
  defaultValue?: T[];
  onChange?: (value: T[]) => void;
}

export type ToggleButtonGroupProps<T> = ToggleButtonRadioProps<T> | ToggleButtonCheckboxProps<T>;

type ToggleButtonGroup<T> = RefForwardingComponent<'div',ToggleButtonGroupProps<T>> & {
  Button: typeof ToggleButton;
};

const ToggleButtonGroup: ToggleButtonGroup<any> = (forwardRef(function ToggleButtonGroup(props: ToggleButtonGroupProps<any>, ref) {
  const { name, size, type, value, disabled, onChange, children } = props;

  const context = useMemo(() => ({ disabled, name, size, type, value, onChange }), [disabled, name, size, type, value, onChange]);

  return (
    <ToggleButtonGroupContext.Provider value={context}>
      <ButtonGroup {...props}>
        { children }
      </ButtonGroup>
    </ToggleButtonGroupContext.Provider>
  );
}) as unknown) as ToggleButtonGroup<any>;

ToggleButtonGroup.Button = ToggleButton;

export default ToggleButtonGroup;