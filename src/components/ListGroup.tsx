import React from 'react';
import ListItem from './ListItem';

interface ListGroupProps {
  as?: any;
  children?: any;
  horizontal?: boolean;
}

type ListGroup = React.FC<ListGroupProps & React.HTMLAttributes<HTMLOrSVGElement>> & {
  Item: typeof ListItem;
}

const ListGroup: ListGroup = ({
  as: Tag = 'ul',
  children,
  horizontal,
  ...rest
}: ListGroupProps) => (
  <Tag
    {...rest}
    className={`c-list-group${
      horizontal
      ? `${' '}c-list-group--horizontal`
      : ''
    }`}>
    { children }
  </Tag>
);

ListGroup.Item = ListItem;

export default ListGroup;