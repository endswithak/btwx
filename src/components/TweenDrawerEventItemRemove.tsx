import paper from 'paper';
import React, { useRef, useContext, useEffect, ReactElement, useState } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { removeLayerTweenEvent } from '../store/actions/layer';
import { RemoveLayerTweenEventPayload, LayerTypes } from '../store/actionTypes/layer';

interface TweenDrawerEventItemRemoveProps {
  id: string;
  removeLayerTweenEvent?(payload: RemoveLayerTweenEventPayload): LayerTypes;
}

const TweenDrawerEventItemRemove = (props: TweenDrawerEventItemRemoveProps): ReactElement => {
  const [hover, setHover] = useState(false);
  const theme = useContext(ThemeContext);
  const { id, removeLayerTweenEvent } = props;

  const handleMouseEnter = () => {
    setHover(true);
  }

  const handleMouseLeave = () => {
    setHover(false);
  }

  const handleClick = () => {
    removeLayerTweenEvent({id});
  }

  return (
    <div
      className={`c-tween-drawer-event-item__action c-tween-drawer-event-item__action--remove`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        color: 'red'
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
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
      </svg> */}
      Remove
    </div>
  );
}

export default connect(
  null,
  { removeLayerTweenEvent }
)(TweenDrawerEventItemRemove);