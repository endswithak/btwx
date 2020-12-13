import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { getTweenEventLayerTweens } from '../store/selectors/layer';
import TweenDrawerEventLayerTween from './TweenDrawerEventLayerTween';

interface TweenDrawerEventLayerTweensProps {
  layerId: string;
}

const TweenDrawerEventLayerTweens = (props: TweenDrawerEventLayerTweensProps): ReactElement => {
  const { layerId } = props;
  const tweenEventLayerTweens = useSelector((state: RootState) => getTweenEventLayerTweens(state.layer.present, state.tweenDrawer.event, layerId));
  const sortedProps: string[] = tweenEventLayerTweens.allIds.reduce((result, current) => {
    const tween = tweenEventLayerTweens.byId[current];
    result = [...result, tween.prop];
    return result;
  }, []).sort();
  const orderedLayerTweensByProp: string[] = sortedProps.reduce((result, current: Btwx.TweenProp) => {
    const tween = tweenEventLayerTweens.allIds.find((id: string) => tweenEventLayerTweens.byId[id].prop === current);
    result = [...result, tween];
    return result;
  }, []);

  return (
    <>
      {
        orderedLayerTweensByProp.map((id, index) => (
          <TweenDrawerEventLayerTween
            key={index}
            tweenId={id}
            index={index} />
        ))
      }
    </>
  );
}

export default TweenDrawerEventLayerTweens;