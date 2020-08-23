import React, { useContext, ReactElement, useState } from 'react';
import { connect } from 'react-redux';
import { setTweenDrawerEvent } from '../store/actions/tweenDrawer';
import { SetTweenDrawerEventPayload, TweenDrawerTypes } from '../store/actionTypes/tweenDrawer';
import { ThemeContext } from './ThemeProvider';
import Icon from './Icon';

interface TweenDrawerEventsItemEditProps {
  id: string;
  setTweenDrawerEvent?(payload: SetTweenDrawerEventPayload): TweenDrawerTypes;
}

const TweenDrawerEventsItemEdit = (props: TweenDrawerEventsItemEditProps): ReactElement => {
  const [hover, setHover] = useState(false);
  const theme = useContext(ThemeContext);
  const { id, setTweenDrawerEvent } = props;

  const handleMouseEnter = () => {
    setHover(true);
  }

  const handleMouseLeave = () => {
    setHover(false);
  }

  const handleClick = () => {
    setTweenDrawerEvent({id});
  }

  return (
    <div
      className={`c-tween-drawer-events-item__action c-tween-drawer-events-item__action--edit`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        color: theme.palette.primary
      }}>
      {/* <Icon
        name='edit'
        style={{
          fill: hover
          ? theme.text.onPrimary
          : theme.text.lighter
        }} /> */}
      Edit
    </div>
  );
}

export default connect(
  null,
  { setTweenDrawerEvent }
)(TweenDrawerEventsItemEdit);