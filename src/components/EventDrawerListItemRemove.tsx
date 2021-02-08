import React, { ReactElement } from 'react';
import { useDispatch } from 'react-redux';
import { removeLayerTweenEvent } from '../store/actions/layer';
import IconButton from './IconButton';

interface EventDrawerListItemRemoveProps {
  id: string;
}

const EventDrawerListItemRemove = (props: EventDrawerListItemRemoveProps): ReactElement => {
  const { id } = props;
  const dispatch = useDispatch();

  const handleClick = (): void => {
    dispatch(removeLayerTweenEvent({id}));
  }

  return (
    <div className='c-event-drawer-list-item__action c-event-drawer-list-item__action--remove'>
      <IconButton
        onClick={handleClick}
        iconName='trash-can'
        variant='error' />
    </div>
  );
}

export default EventDrawerListItemRemove;