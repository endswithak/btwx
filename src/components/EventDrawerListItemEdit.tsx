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
    <IconButton
      onClick={handleClick}
      iconName='edit'
      style={{
        flexGrow: 0,
        marginRight: 16
      }}
      label='edit' />
  );
}

export default EventDrawerListItemEdit;