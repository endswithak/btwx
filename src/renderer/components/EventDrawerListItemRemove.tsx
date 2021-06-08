import React, { ReactElement } from 'react';
import { useDispatch } from 'react-redux';
import { removeLayerEvent } from '../store/actions/layer';
import IconButton from './IconButton';

interface EventDrawerListItemRemoveProps {
  id: string;
}

const EventDrawerListItemRemove = (props: EventDrawerListItemRemoveProps): ReactElement => {
  const { id } = props;
  const dispatch = useDispatch();

  const handleClick = (): void => {
    dispatch(removeLayerEvent({id}));
  }

  return (
    <IconButton
      onClick={handleClick}
      iconName='trash-can'
      style={{
        flexGrow: 0
      }}
      label='remove' />
  );
}

export default EventDrawerListItemRemove;