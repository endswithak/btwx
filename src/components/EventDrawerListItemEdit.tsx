import React, { ReactElement } from 'react';
import { useDispatch } from 'react-redux';
import { setEventDrawerEventThunk } from '../store/actions/eventDrawer';
import IconButton from './IconButton';

interface EventDrawerListItemEditProps {
  id: string;
}

const EventDrawerListItemEdit = (props: EventDrawerListItemEditProps): ReactElement => {
  const { id } = props;
  const dispatch = useDispatch();

  const handleClick = (): void => {
    dispatch(setEventDrawerEventThunk({id}));
  }

  return (
    <div className='c-event-drawer-list-item__action c-event-drawer-list-item__action--edit'>
      <IconButton
        onClick={handleClick}
        icon='edit' />
    </div>
  );
}

export default EventDrawerListItemEdit;