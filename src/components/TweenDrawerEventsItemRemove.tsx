import React, { useContext, ReactElement } from 'react';
import { useDispatch } from 'react-redux';
import { removeLayerTweenEvent } from '../store/actions/layer';
import { ThemeContext } from './ThemeProvider';
import IconButton from './IconButton';

interface TweenDrawerEventsItemRemoveProps {
  id: string;
}

const TweenDrawerEventsItemRemove = (props: TweenDrawerEventsItemRemoveProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { id } = props;
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(removeLayerTweenEvent({id}));
  }

  return (
    <div
      className={`c-tween-drawer-events-item__action c-tween-drawer-events-item__action--remove`}
      style={{
        color: 'red'
      }}>
      <IconButton
        onClick={handleClick}
        icon='trash-can'
        remove />
      {/* Remove */}
    </div>
  );
}

export default TweenDrawerEventsItemRemove;