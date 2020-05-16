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
        {
          [...Array(120).keys()].map((item, index) => (
            <div
              key={index}
              style={{
                width: theme.unit * 25,
                minWidth: theme.unit * 25,
                height: '100%',
                background: theme.background.z1,
                boxShadow: `-1px 0 0 ${theme.background.z3} inset`,
                flexShrink: 0
              }} />
          ))
        }
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