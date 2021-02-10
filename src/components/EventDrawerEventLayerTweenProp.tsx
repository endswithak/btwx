import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setEventDrawerTweenHoverThunk } from '../store/actions/eventDrawer';
import EventDrawerEventEditEase from './EventDrawerEventEditEase';
import Icon from './Icon';
import ListItem from './ListItem';

interface EventDrawerEventLayerTweenPropProps {
  tweenId: string;
}

const EventDrawerEventLayerTweenProp = (props: EventDrawerEventLayerTweenPropProps): ReactElement => {
  const { tweenId } = props;
  const tween = useSelector((state: RootState) => state.layer.present.tweens.byId[tweenId]);
  const tweenHover = useSelector((state: RootState) => state.eventDrawer.tweenHover);
  const tweenEditing = useSelector((state: RootState) => state.eventDrawer.tweenEditing);
  const titleCaseProp = ((): string => {
    const reg = tween.prop.replace( /([A-Z])/g, " $1" );
    return reg.charAt(0).toUpperCase() + reg.slice(1);
  })();
  const dispatch = useDispatch();

  const handleMouseEnter = (): void => {
    dispatch(setEventDrawerTweenHoverThunk({id: tweenId}));
  }

  const handleMouseLeave = (): void => {
    dispatch(setEventDrawerTweenHoverThunk({id: null}));
  }

  return (
    <ListItem
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      flushWithPadding>
      {
        tweenId === tweenHover && !tweenEditing || tweenId === tweenEditing
        ? <EventDrawerEventEditEase tweenId={tweenId} />
        : <Icon />
      }
      <ListItem.Body>
        <ListItem.Text
          size='small'
          variant={
            tweenId === tweenEditing
            ? 'primary'
            : tweenId === tweenHover
              ? 'base'
              : 'lighter'
          }>
          { titleCaseProp }
        </ListItem.Text>
      </ListItem.Body>
    </ListItem>
  );
}

export default EventDrawerEventLayerTweenProp;