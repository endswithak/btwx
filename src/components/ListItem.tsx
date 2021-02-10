import React from 'react';
import Icon from './Icon';
import Text from './Text';
import ListItemBody from './ListItemBody';
import ListItemRight from './ListItemRight';

interface ListItemProps {
  as?: any;
  children?: any;
  double?: boolean;
  size?: Btwx.SizeVariant;
  variant?: Btwx.ColorVariant;
  right?: any;
  active?: boolean;
  root?: boolean;
  flush?: boolean;
  flushWithPadding?: boolean;
  interactive?: boolean;
}

type ListItem = React.FC<ListItemProps & React.HTMLAttributes<HTMLOrSVGElement>> & {
  Text: typeof Text;
  Icon: typeof Icon;
  Body: typeof ListItemBody;
  Right: typeof ListItemRight;
}

const ListItem: ListItem = ({
  as: Tag = 'li',
  children,
  active,
  double,
  size,
  variant,
  right,
  root,
  flush,
  flushWithPadding,
  interactive,
  ...rest
}: ListItemProps) =>  {

  return (
    <Tag
      {...rest}
      className={`c-list-item${
        active
        ? `${' '}c-list-item--active`
        : ''
      }${
        interactive
        ? `${' '}c-list-item--interactive`
        : ''
      }${
        flush
        ? `${' '}c-list-item--flush`
        : ''
      }${
        flushWithPadding
        ? `${' '}c-list-item--flush-with-padding`
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
        double
        ? `${' '}c-list-item--double`
        : ''
      }${
        right
        ? `${' '}c-list-item--right`
        : ''
      }`}>
      { children }
    </Tag>
  );
}

ListItem.Text = Text;
ListItem.Icon = Icon;
ListItem.Body = ListItemBody;
ListItem.Right = ListItemRight;

export default ListItem;