import React, { useContext, ReactElement } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { getTweenEventLayerTweens } from '../store/selectors/layer';
import TweenDrawerEventLayerTween from './TweenDrawerEventLayerTween';

interface TweenDrawerEventLayerTweensProps {
  layerId: string;
  orderedLayerTweensByProp?: string[];
}

const TweenDrawerEventLayerTweens = (props: TweenDrawerEventLayerTweensProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { orderedLayerTweensByProp } = props;

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

const mapStateToProps = (state: RootState, ownProps: TweenDrawerEventLayerTweensProps) => {
  const { layer, tweenDrawer } = state;
  const tweenEventLayerTweens = getTweenEventLayerTweens(layer.present, tweenDrawer.event, ownProps.layerId);
  const sortedProps = tweenEventLayerTweens.allIds.reduce((result, current) => {
    const tween = tweenEventLayerTweens.byId[current];
    result = [...result, tween.prop];
    return result;
  }, []).sort();
  const orderedLayerTweensByProp = sortedProps.reduce((result, current: Btwx.TweenProp) => {
    const tween = tweenEventLayerTweens.allIds.find((id: string) => tweenEventLayerTweens.byId[id].prop === current);
    result = [...result, tween];
    return result;
  }, []);
  return { orderedLayerTweensByProp };
};

export default connect(
  mapStateToProps
)(TweenDrawerEventLayerTweens);