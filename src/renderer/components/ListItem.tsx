import React, { forwardRef } from 'react';
import { RefForwardingComponent } from '../utils';
import Icon from './Icon';
import Text from './Text';
import ListItemBody from './ListItemBody';
import ListItemRight from './ListItemRight';

export interface ListItemProps extends React.HTMLAttributes<HTMLOrSVGElement> {
  as?: React.ElementType;
  children?: any;
  size?: Btwx.SizeVariant;
  variant?: Btwx.ColorVariant;
  right?: any;
  isActive?: boolean;
  root?: boolean;
  flush?: boolean;
  interactive?: boolean;
  hovering?: boolean;
  disabled?: boolean;
  toggle?: boolean;
  classNames?: string;
}

type ListItem = RefForwardingComponent<'li', ListItemProps> & {
  Text: typeof Text;
  Icon: typeof Icon;
  Body: typeof ListItemBody;
  Right: typeof ListItemRight;
}

const ListItem: ListItem = (forwardRef(function ListItem({
  as: Tag = 'li',
  children,
  isActive,
  size,
  variant,
  right,
  root,
  flush,
  interactive,
  hovering,
  disabled,
  toggle,
  classNames,
  ...rest
}: ListItemProps, ref: any) {

  return (
    <Tag
      {...rest}
      ref={ref}
      className={`c-list-item${
        isActive
        ? `${' '}c-list-item--active`
        : ''
      }${
        interactive
        ? `${' '}c-list-item--interactive`
        : ''
      }${
        disabled
        ? `${' '}c-list-item--disabled`
        : ''
      }${
        toggle
        ? `${' '}c-list-item--toggle`
        : ''
      }${
        hovering
        ? `${' '}c-list-item--hovering`
        : ''
      }${
        flush
        ? `${' '}c-list-item--flush`
        : ''
      }${
        root
        ? `${' '}c-list-item--root`
        : ''
      }${
        variant
        ? `${' '}c-list-item--${variant}`
        : ''
      }${
        size
        ? `${' '}c-list-item--${size}`
        : ''
      }${
        right
        ? `${' '}c-list-item--right`
        : ''
      }${
        classNames
        ? `${' '}${classNames}`
        : ''
      }`}>
      { children }
    </Tag>
  );
}) as unknown) as ListItem;

ListItem.Text = Text;
ListItem.Icon = Icon;
ListItem.Body = ListItemBody;
ListItem.Right = ListItemRight;

export default ListItem;