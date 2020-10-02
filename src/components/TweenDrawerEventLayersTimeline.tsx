import React, { useContext, ReactElement, useRef } from 'react';
import { connect } from 'react-redux';
import { ScrollSyncPane } from 'react-scroll-sync';
import { RootState } from '../store/reducers';
import { getTweenEventLayers } from '../store/selectors/layer';
import { ThemeContext } from './ThemeProvider';
import TweenDrawerEventLayerTimeline from './TweenDrawerEventLayerTimeline';
import EmptyState from './EmptyState';

interface TweenDrawerEventLayersTimelineProps {
  isEmpty?: boolean;
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
  const { tweenEventLayers, isEmpty } = props;

  return (
    <div className='c-tween-drawer-event__layers-timeline-wrap'>
      {
        isEmpty
        ? <div style={{position: 'relative', display: 'flex', flexDirection: 'column', width: '100%', height: '100%'}}>
            <div
              className='c-tween-drawer-event-layers-timeline__header'
              style={{
                background: theme.name === 'dark' ? theme.background.z3 : theme.background.z0,
                boxShadow: `0 -1px 0 ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5} inset`
              }} />
            <div style={{position: 'relative', display: 'flex', flexDirection: 'column', width: '100%', height: '100%', overflow: 'hidden'}}>
              <EmptyState
                icon='tweens'
                text='Event Timelines'
                detail='Timelines are added when the event origin and destination have corresponding layers (same name and type) with mismatched style props.'
                style={{width: 550}} />
            </div>
          </div>
        : <div className='c-tween-drawer-event__layers-timeline'>
            <div
              className='c-tween-drawer-event-layers-timeline__header'
              style={{
                background: theme.name === 'dark' ? theme.background.z3 : theme.background.z0,
                boxShadow: `0 -1px 0 ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5} inset`
              }} />
            <div
              className='c-tween-drawer-event-layers-timeline__header'
              style={{
                background: theme.name === 'dark' ? theme.background.z2 : theme.background.z1,
                boxShadow: `0 -1px 0 ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5} inset`,
                zIndex: 3,
                position: 'absolute',
                top: 32
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
      }
    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer, tweenDrawer } = state;
  const tweenEventLayers = getTweenEventLayers(layer.present, tweenDrawer.event);
  const isEmpty = tweenEventLayers.allIds.length === 0;
  return { tweenEventLayers, isEmpty };
};

export default connect(
  mapStateToProps
)(TweenDrawerEventLayersTimeline);