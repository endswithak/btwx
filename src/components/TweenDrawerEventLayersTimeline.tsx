import React, { useContext, ReactElement, useRef } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { getTweenEventLayers } from '../store/selectors/layer';
import TweenDrawerEventLayerTimeline from './TweenDrawerEventLayerTimeline';
import { ScrollSyncPane } from 'react-scroll-sync';

interface TweenDrawerEventLayersTimelineProps {
  tweenEventLayers?: {
    allIds: string[];
    byId: {
      [id: string]: em.Layer;
    };
  };
}

const TweenDrawerEventLayersTimeline = (props: TweenDrawerEventLayersTimelineProps): ReactElement => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const theme = useContext(ThemeContext);
  const { tweenEventLayers } = props;

  return (
    <div className='c-tween-drawer-event__layers-timeline-wrap'>
      <div className='c-tween-drawer-event__layers-timeline'>
        <div
          className='c-tween-drawer-event-layers-timeline__header'
          style={{
            background: theme.name === 'dark' ? theme.background.z3 : theme.background.z0,
            boxShadow: `0 -1px 0 ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5} inset`
          }}>
          {
            [...Array(200).keys()].map((item, index) => (
              <div
                key={index}
                style={{
                  width: theme.unit * 5,
                  minWidth: theme.unit * 5,
                  height:
                  (index + 1) % 20 === 0
                  ? '100%'
                  : (index + 1) % 10 === 0
                    ? '75%'
                    : (index + 1) % 5 === 0
                      ? '50%'
                      : '25%',
                  boxShadow: `-1px 0 0 ${theme.background.z5} inset`,
                  flexShrink: 0,
                  position: 'relative',
                  display: 'flex',
                  alignSelf: 'flex-end'
                }}>
                <span style={{
                  position: 'absolute',
                  bottom: theme.unit * 4,
                  right: theme.unit,
                  color: theme.text.lighter,
                  fontSize: 10
                }}>
                  {
                    (index + 1) % 20 === 0
                    ?  `${(index + 1) / 20}s`
                    : (index + 1) % 10 === 0
                      ? `${(index + 1) / 20}s`
                      : (index + 1) % 5 === 0
                        ? `${(index + 1) / 20}s`
                        : ''
                  }
                </span>
              </div>
            ))
          }
        </div>
        <ScrollSyncPane>
          <div
            ref={timelineRef}
            id='tween-drawer-event-layers-timeline'
            className='c-tween-drawer-event-layers-timeline__layers'>
            {
              tweenEventLayers.allIds.map((layer, index) => (
                <TweenDrawerEventLayerTimeline
                  key={index}
                  id={layer} />
              ))
            }
          </div>
        </ScrollSyncPane>
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