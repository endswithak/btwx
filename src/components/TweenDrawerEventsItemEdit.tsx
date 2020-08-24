import React, { useContext, ReactElement } from 'react';
import { connect } from 'react-redux';
import { setTweenDrawerEvent } from '../store/actions/tweenDrawer';
import { SetTweenDrawerEventPayload, TweenDrawerTypes } from '../store/actionTypes/tweenDrawer';
import { ThemeContext } from './ThemeProvider';
import IconButton from './IconButton';

interface TweenDrawerEventsItemEditProps {
  id: string;
  setTweenDrawerEvent?(payload: SetTweenDrawerEventPayload): TweenDrawerTypes;
}

const TweenDrawerEventsItemEdit = (props: TweenDrawerEventsItemEditProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { id, setTweenDrawerEvent } = props;

  const handleClick = () => {
    setTweenDrawerEvent({id});
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

export default connect(
  null,
  { setTweenDrawerEvent }
)(TweenDrawerEventsItemEdit);