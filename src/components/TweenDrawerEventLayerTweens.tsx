import React, { useContext, ReactElement } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { getTweenEventLayerTweens } from '../store/selectors/layer';
import TweenDrawerEventLayerTween from './TweenDrawerEventLayerTween';

interface TweenDrawerEventLayerTweensProps {
  layerId: string;
  tweenEventLayerTweens?: {
    allIds: string[];
    byId: {
      [id: string]: em.Tween;
    };
  };
}

const TweenDrawerEventLayerTweens = (props: TweenDrawerEventLayerTweensProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { tweenEventLayerTweens } = props;

  return (
    <div className={`c-tween-drawer-event-layer__tweens`}>
      {
        tweenEventLayerTweens.allIds.map((tween, index) => (
          <TweenDrawerEventLayerTween
            key={index}
            tweenId={tween}
            index={index} />
        ))
      }
    </div>
  );
}

const mapStateToProps = (state: RootState, ownProps: TweenDrawerEventLayerTweensProps) => {
  const { layer, tweenDrawer } = state;
  const tweenEventLayerTweens = getTweenEventLayerTweens(layer.present, tweenDrawer.event, ownProps.layerId);
  return { tweenEventLayerTweens };
};

export default connect(
  mapStateToProps
)(TweenDrawerEventLayerTweens);