import React, { useContext, ReactElement } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { getTweenEventLayerTweens } from '../store/selectors/layer';
import TweenDrawerEventLayerTweenTimeline from './TweenDrawerEventLayerTweenTimeline';

interface TweenDrawerEventLayerTweensTimelineProps {
  layerId: string;
  orderedLayerTweensByProp?: string[];
}

const TweenDrawerEventLayerTweensTimeline = (props: TweenDrawerEventLayerTweensTimelineProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { orderedLayerTweensByProp } = props;

  return (
    <>
      {
        orderedLayerTweensByProp.map((id, index) => (
          <TweenDrawerEventLayerTweenTimeline
            key={index}
            tweenId={id} />
        ))
      }
    </>
  );
}

const mapStateToProps = (state: RootState, ownProps: TweenDrawerEventLayerTweensTimelineProps) => {
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
)(TweenDrawerEventLayerTweensTimeline);