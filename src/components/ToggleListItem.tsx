import React, { useContext, forwardRef } from 'react';
import { RefForwardingComponent } from '../utils';
import ListItem, { ListItemProps } from './ListItem';
import ToggleGroupContext from './ToggleGroupContext';
import Icon from './Icon';

export interface ToggleListItemProps extends ListItemProps {
  type?: 'checkbox' | 'radio';
  name?: string;
  checked?: boolean;
  disabled?: boolean;
  hideRight?: boolean;
  value: any;
  inputRef?: React.LegacyRef<HTMLInputElement>;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const ToggleListItem: RefForwardingComponent<'button', ToggleListItemProps> = forwardRef(function ToggleListItem({
  type,
  size,
  name,
  disabled,
  checked,
  value,
  children,
  hideRight,
  onChange,
  ...rest
}: ToggleListItemProps, ref: any) {
  const tg = useContext(ToggleGroupContext);
  const getIcon = () => {
    switch(type || tg.type) {
      case 'checkbox':
        return checked ? 'checkbox-checked' : 'checkbox-unchecked';
      case 'radio':
        return checked ? 'radio-checked' : 'radio-unchecked';
    }
  }

  return (
    <ListItem
      {...rest}
      as='label'
      size={size || tg.size}
      isActive={!!checked || tg.value === value}
      disabled={!!disabled || tg.disabled}
      toggle
      interactive>
      <input
        name={name || tg.name}
        type={type || tg.type}
        value={value as any}
        ref={ref}
        autoComplete="off"
        checked={!!checked || tg.value === value}
        disabled={!!disabled || tg.disabled}
        onChange={onChange || tg.onChange} />
      { children }
      {
        !hideRight
        ? <ListItem.Right>
            <Icon
              name={getIcon()}
              size={size || tg.size}
              variant={checked ? 'primary' : null} />
          </ListItem.Right>
        : null
      }
    </ListItem>
  );
});

export default ToggleListItem;