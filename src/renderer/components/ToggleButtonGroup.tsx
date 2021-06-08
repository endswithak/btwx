import React, { forwardRef, useMemo } from 'react';
import { Omit, RefForwardingComponent } from '../utils';
import ButtonGroup, { ButtonGroupProps } from './ButtonGroup';
import ToggleButton from './ToggleButton';
import ToggleGroupContext from './ToggleGroupContext';

export interface ToggleButtonGroupRadioProps<T>
  extends Omit<ButtonGroupProps, 'toggle'> {
  type?: 'radio';
  name: string;
  value?: T;
  defaultValue?: T;
  onChange?: (value: T, event: any) => void;
}

export interface ToggleButtonGroupCheckboxProps<T>
  extends Omit<ButtonGroupProps, 'toggle'> {
  type: 'checkbox';
  name?: string;
  value?: T[];
  defaultValue?: T[];
  onChange?: (value: T[]) => void;
}

export type ToggleButtonGroupProps<T> = ToggleButtonGroupRadioProps<T> | ToggleButtonGroupCheckboxProps<T>;

type ToggleButtonGroup<T> = RefForwardingComponent<'div',ToggleButtonGroupProps<T>> & {
  Button: typeof ToggleButton;
};

const ToggleButtonGroup: ToggleButtonGroup<any> = (forwardRef(function ToggleButtonGroup(props: ToggleButtonGroupProps<any>, ref) {
  const { name, size, type, value, disabled, onChange, children } = props;

  const context = useMemo(() => ({ disabled, name, size, type, value, onChange }), [disabled, name, size, type, value, onChange]);

  return (
    <ToggleGroupContext.Provider value={context}>
      <ButtonGroup {...props}>
        { children }
      </ButtonGroup>
    </ToggleGroupContext.Provider>
  );
}) as unknown) as ToggleButtonGroup<any>;

ToggleButtonGroup.Button = ToggleButton;

export default ToggleButtonGroup;