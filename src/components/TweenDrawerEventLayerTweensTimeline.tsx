import React, { useContext, ReactElement } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { getTweenEventLayerTweens } from '../store/selectors/layer';
import TweenDrawerEventLayerTweenTimeline from './TweenDrawerEventLayerTweenTimeline';

interface TweenDrawerEventLayerTweensTimelineProps {
  layerId: string;
  tweenEventLayerTweens?: {
    allIds: string[];
    byId: {
      [id: string]: em.Tween;
    };
  };
}

const TweenDrawerEventLayerTweensTimeline = (props: TweenDrawerEventLayerTweensTimelineProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { tweenEventLayerTweens } = props;

  return (
    <>
      {
        tweenEventLayerTweens.allIds.map((tween, index) => (
          <TweenDrawerEventLayerTweenTimeline
            key={index}
            tweenId={tween} />
        ))
      }
    </>
  );
}

const mapStateToProps = (state: RootState, ownProps: TweenDrawerEventLayerTweensTimelineProps) => {
  const { layer, tweenDrawer } = state;
  const tweenEventLayerTweens = getTweenEventLayerTweens(layer.present, tweenDrawer.event, ownProps.layerId);
  return { tweenEventLayerTweens };
};

export default connect(
  mapStateToProps
)(TweenDrawerEventLayerTweensTimeline);