import React, { useContext, ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setEventDrawerTweenHoverThunk } from '../store/actions/eventDrawer';
import { ThemeContext } from './ThemeProvider';
import EventDrawerEventEditEase from './EventDrawerEventEditEase';

interface EventDrawerEventLayerTweenPropProps {
  tweenId: string;
}

const EventDrawerEventLayerTweenProp = (props: EventDrawerEventLayerTweenPropProps): ReactElement => {
  const theme = useContext(ThemeContext);
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
    <div
      className='c-event-drawer-event-layer__tween'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      <div className='c-event-drawer__icon' />
      <div
        className='c-event-drawer-event-layer-tween__name'
        style={{
          color: tweenId === tweenEditing
          ? theme.palette.primary
          : tweenId === tweenHover
            ? theme.text.base
            : theme.text.lighter
        }}>
        { titleCaseProp }
      </div>
      {
        tweenId === tweenHover && !tweenEditing || tweenId === tweenEditing
        ? <EventDrawerEventEditEase tweenId={tweenId} />
        : null
      }
    </div>
  );
}

export default EventDrawerEventLayerTweenProp;