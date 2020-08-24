import React, { useContext, ReactElement } from 'react';
import { connect } from 'react-redux';
import { removeLayerTweenEvent } from '../store/actions/layer';
import { RemoveLayerTweenEventPayload, LayerTypes } from '../store/actionTypes/layer';
import { ThemeContext } from './ThemeProvider';
import IconButton from './IconButton';

interface TweenDrawerEventsItemRemoveProps {
  id: string;
  removeLayerTweenEvent?(payload: RemoveLayerTweenEventPayload): LayerTypes;
}

const TweenDrawerEventsItemRemove = (props: TweenDrawerEventsItemRemoveProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { id, removeLayerTweenEvent } = props;

  const handleClick = () => {
    removeLayerTweenEvent({id});
  }

  return (
    <div
      className={`c-tween-drawer-events-item__action c-tween-drawer-events-item__action--remove`}
      style={{
        color: 'red'
      }}>
      <IconButton
        onClick={handleClick}
        icon='trash-can' />
      {/* Remove */}
    </div>
  );
}

export default connect(
  null,
  { removeLayerTweenEvent }
)(TweenDrawerEventsItemRemove);