import paper from 'paper';
import React, { useRef, useContext, useEffect, ReactElement, useState } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { setTweenDrawerEvent } from '../store/actions/tweenDrawer';
import { SetTweenDrawerEventPayload, TweenDrawerTypes } from '../store/actionTypes/tweenDrawer';

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
      {/* <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        style={{
          fill: hover
          ? theme.text.onPrimary
          : theme.text.lighter
        }}>
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
      </svg> */}
      Edit
    </div>
  );
}

export default connect(
  null,
  { setTweenDrawerEvent }
)(TweenDrawerEventsItemEdit);