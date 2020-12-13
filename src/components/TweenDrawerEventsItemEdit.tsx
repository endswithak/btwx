import React, { useContext, ReactElement } from 'react';
import { useDispatch } from 'react-redux';
import { setTweenDrawerEventThunk } from '../store/actions/tweenDrawer';
import { ThemeContext } from './ThemeProvider';
import IconButton from './IconButton';

interface TweenDrawerEventsItemEditProps {
  id: string;
}

const TweenDrawerEventsItemEdit = (props: TweenDrawerEventsItemEditProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { id } = props;
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(setTweenDrawerEventThunk({id}));
  }

  return (
    <div
      className='c-tween-drawer-events-item__action c-tween-drawer-events-item__action--edit'
      style={{
        color: theme.palette.primary
      }}>
      <IconButton
        onClick={handleClick}
        icon='edit' />
      {/* Edit */}
    </div>
  );
}

export default TweenDrawerEventsItemEdit;