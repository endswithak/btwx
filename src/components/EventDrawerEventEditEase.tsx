import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { openEaseEditor } from '../store/actions/easeEditor';
import IconButton from './IconButton';

interface EventDrawerEventEditEaseProps {
  tweenId: string;
}

const EventDrawerEventEditEase = ({ tweenId }: EventDrawerEventEditEaseProps): ReactElement => {
  const editingEase = useSelector((state: RootState) => state.easeEditor.tween && state.easeEditor.tween === tweenId);
  const dispatch = useDispatch();

  const handleClick = (): void => {
    dispatch(openEaseEditor({tween: tweenId}));
  }

  return (
    <IconButton
      onClick={handleClick}
      iconName='more'
      toggle
      isActive={editingEase}
      label='edit' />
  );
}

export default EventDrawerEventEditEase;