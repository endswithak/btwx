import React, { useContext, forwardRef } from 'react';
import { RefForwardingComponent } from '../utils';
import ListItem, { ListItemProps } from './ListItem';
import ToggleGroupContext from './ToggleGroupContext';
import Icon from './Icon';
import Text from './Text';
import ListItemBody from './ListItemBody';
import ListItemRight from './ListItemRight';

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

type ToggleListItem = RefForwardingComponent<'button', ToggleListItemProps> & {
  Text: typeof Text;
  Icon: typeof Icon;
  Body: typeof ListItemBody;
  Right: typeof ListItemRight;
}

const ToggleListItem: ToggleListItem = (forwardRef(function ToggleListItem({
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
      {
        !hideRight
        ? <Icon
            name={getIcon()}
            size='small'
            variant={checked ? 'primary' : null} />
        : null
      }
      { children }
    </ListItem>
  );
}) as unknown) as ToggleListItem;

ToggleListItem.Text = Text;
ToggleListItem.Icon = Icon;
ToggleListItem.Body = ListItemBody;
ToggleListItem.Right = ListItemRight;

export default ToggleListItem;