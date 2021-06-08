import React, { forwardRef, useMemo } from 'react';
import { Omit, RefForwardingComponent } from '../utils';
import ListGroup, { ListGroupProps } from './ListGroup';
import ToggleListItem from './ToggleListItem';
import ToggleGroupContext from './ToggleGroupContext';

export interface ToggleListGroupRadioProps<T>
  extends Omit<ListGroupProps, 'toggle'> {
  type?: 'radio';
  name: string;
  value?: T;
  defaultValue?: T;
  onChange?: (value: T, event: any) => void;
}

export interface ToggleListGroupCheckboxProps<T>
  extends Omit<ListGroupProps, 'toggle'> {
  type: 'checkbox';
  name?: string;
  value?: T[];
  defaultValue?: T[];
  onChange?: (value: T[]) => void;
}

export type ToggleListGroupProps<T> = ToggleListGroupRadioProps<T> | ToggleListGroupCheckboxProps<T>;

type ToggleListGroup<T> = RefForwardingComponent<'ul',ToggleListGroupProps<T>> & {
  Item: typeof ToggleListItem;
};

const ToggleListGroup: ToggleListGroup<any> = (forwardRef(function ToggleButtonGroup(props: ToggleListGroupProps<any>, ref) {
  const { name, size, type, value, disabled, onChange, children } = props;
  const context = useMemo(() => ({ disabled, name, size, type, value, onChange }), [disabled, name, size, type, value, onChange]);

  return (
    <ToggleGroupContext.Provider value={context}>
      <ListGroup {...props}>
        { children }
      </ListGroup>
    </ToggleGroupContext.Provider>
  );
}) as unknown) as ToggleListGroup<any>;

ToggleListGroup.Item = ToggleListItem;

export default ToggleListGroup;