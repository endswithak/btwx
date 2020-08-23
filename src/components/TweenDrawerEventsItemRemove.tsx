import React, { useContext, ReactElement, useState } from 'react';
import { connect } from 'react-redux';
import { removeLayerTweenEvent } from '../store/actions/layer';
import { RemoveLayerTweenEventPayload, LayerTypes } from '../store/actionTypes/layer';
import { ThemeContext } from './ThemeProvider';
import Icon from './Icon';

interface TweenDrawerEventsItemRemoveProps {
  id: string;
  removeLayerTweenEvent?(payload: RemoveLayerTweenEventPayload): LayerTypes;
}

const TweenDrawerEventsItemRemove = (props: TweenDrawerEventsItemRemoveProps): ReactElement => {
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
      className={`c-tween-drawer-events-item__action c-tween-drawer-events-item__action--remove`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        color: 'red'
      }}>
      {/* <Icon
        name='trash-can'
        style={{
          fill: hover
          ? theme.text.onPrimary
          : theme.text.lighter
        }} /> */}
      Remove
    </div>
  );
}

export default connect(
  null,
  { removeLayerTweenEvent }
)(TweenDrawerEventsItemRemove);