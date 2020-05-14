import React, { useContext, ReactElement } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { getTweenEventLayers } from '../store/selectors/layer';
import TweenDrawerEventLayerTimeline from './TweenDrawerEventLayerTimeline';

interface TweenDrawerEventLayersTimelineProps {
  tweenEventLayers?: {
    allIds: string[];
    byId: {
      [id: string]: em.Layer;
    };
  };
}

const TweenDrawerEventLayersTimeline = (props: TweenDrawerEventLayersTimelineProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { tweenEventLayers } = props;

  return (
    <div className={`c-tween-drawer-event__layers-timeline`}>
      <div
        className='c-tween-drawer-event-layers-timeline__header'>

      </div>
      <div className='c-tween-drawer-event-layers-timeline__layers'>
        {
          tweenEventLayers.allIds.map((layer, index) => (
            <TweenDrawerEventLayerTimeline
              key={index}
              id={layer} />
          ))
        }
      </div>
    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer, tweenDrawer } = state;
  const tweenEventLayers = getTweenEventLayers(layer.present, tweenDrawer.event);
  return { tweenEventLayers };
};

export default connect(
  mapStateToProps
)(TweenDrawerEventLayersTimeline);