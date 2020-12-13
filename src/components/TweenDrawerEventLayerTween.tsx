import React, { useContext, ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { setTweenDrawerTweenHoverThunk } from '../store/actions/tweenDrawer';
import TweenDrawerEditEase from './TweenDrawerEditEase';

interface TweenDrawerEventLayerTweenProps {
  tweenId: string;
  index: number;
}

const TweenDrawerEventLayerTween = (props: TweenDrawerEventLayerTweenProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { tweenId, index } = props;
  const tween = useSelector((state: RootState) => state.layer.present.tweens.byId[tweenId]);
  const tweenHover = useSelector((state: RootState) => state.tweenDrawer.tweenHover);
  const tweenEditing = useSelector((state: RootState) => state.tweenDrawer.tweenEditing);
  const titleCaseProp = ((): string => {
    const reg = tween.prop.replace( /([A-Z])/g, " $1" );
    return reg.charAt(0).toUpperCase() + reg.slice(1);
  })();
  const dispatch = useDispatch();

  const handleMouseEnter = () => {
    dispatch(setTweenDrawerTweenHoverThunk({id: tweenId}));
  }

  const handleMouseLeave = () => {
    dispatch(setTweenDrawerTweenHoverThunk({id: null}));
  }

  return (
    <div
      className='c-tween-drawer-event-layer__tween'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      <div className='c-tween-drawer__icon' />
      <div
        className='c-tween-drawer-event-layer-tween__name'
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
        ? <TweenDrawerEditEase tweenId={tweenId} />
        : null
      }
    </div>
  );
}

export default TweenDrawerEventLayerTween;