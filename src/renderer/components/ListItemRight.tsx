/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement } from 'react';

interface ListItemBodyProps {
  children: any;
}

const ListItemRight = (props: ListItemBodyProps): ReactElement => {
  const { children } = props;

  return (
    <div className='c-list-item__right'>
      { children }
    </div>
  );
};

export default ListItemRight;