import React from 'react';
import ListItem from './ListItem';

interface ListGroupProps {
  as?: any;
  children?: any;
}

type ListGroup = React.FC<ListGroupProps & React.HTMLAttributes<HTMLOrSVGElement>> & {
  Item: typeof ListItem;
}

const ListGroup: ListGroup = ({
  as: Tag = 'ul',
  children,
  ...rest
}: ListGroupProps) =>  {

  return (
    <Tag
      {...rest}
      className={`c-list-group`}>
      { children }
    </Tag>
  );
}

ListGroup.Item = ListItem;

export default ListGroup;