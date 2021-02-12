import React from 'react';
import ListItem from './ListItem';
import { PropWithChildren } from '../utils';

export interface ListGroupProps extends PropWithChildren {
  as?: any;
  size?: Btwx.SizeVariant;
  horizontal?: boolean;
  disabled?: boolean;
  toggle?: boolean;
}

type ListGroup = React.FC<ListGroupProps> & {
  Item: typeof ListItem;
}

const ListGroup: ListGroup = ({
  as: Tag = 'ul',
  size,
  children,
  horizontal,
  disabled,
  toggle,
  ...rest
}: ListGroupProps) => (
  <Tag
    {...rest}
    className={`c-list-group${
      horizontal
      ? `${' '}c-list-group--horizontal`
      : ''
    }${
      disabled
      ? `${' '}c-list-group--disabled`
      : ''
    }${
      toggle
      ? `${' '}c-list-group--toggle`
      : ''
    }${
      size
      ? `${' '}c-list-group--size`
      : ''
    }`}>
    { children }
  </Tag>
);

ListGroup.Item = ListItem;

export default ListGroup;