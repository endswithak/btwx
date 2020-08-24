import React, { useContext, ReactElement, useRef } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { getTweenEventLayers } from '../store/selectors/layer';
import TweenDrawerEventLayer from './TweenDrawerEventLayer';
import { setTweenDrawerEvent } from '../store/actions/tweenDrawer';
import { SetTweenDrawerEventPayload, TweenDrawerTypes } from '../store/actionTypes/tweenDrawer';
import TweenDrawerIcon from './TweenDrawerIcon';
import { ScrollSync, ScrollSyncPane } from 'react-scroll-sync';

interface TweenDrawerEventLayersProps {
  tweenEventLayers?: {
    allIds: string[];
    byId: {
      [id: string]: em.Layer;
    };
  };
  scrolled: boolean;
  setScrolled(scrolled: boolean): void;
  setTweenDrawerEvent?(payload: SetTweenDrawerEventPayload): TweenDrawerTypes;
}

const TweenDrawerEventLayers = (props: TweenDrawerEventLayersProps): ReactElement => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const theme = useContext(ThemeContext);
  const { tweenEventLayers, setTweenDrawerEvent, scrolled, setScrolled } = props;

  // const handleScroll = (e) => {
  //   const layersTimeline = document.getElementById('tween-drawer-event-layers-timeline');
  //   layersTimeline.scrollTop = scrollRef.current.scrollTop;
  // }

  const handleScroll = (e) => {
    if (scrolled && e.target.scrollTop === 0) {
      setScrolled(false);
    }
    if (!scrolled && e.target.scrollTop > 0) {
      setScrolled(true);
    }
  }

  return (
    <div
      className={`c-tween-drawer-event__layers`}
      style={{
        boxShadow: `-1px 0 0 ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5} inset`
      }}>
      <div
        className='c-tween-drawer-event-layers__header'
        style={{
          background: theme.name === 'dark' ? theme.background.z3 : theme.background.z0,
          boxShadow: scrolled ? `0 -1px 0 0 ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5} inset, 0 4px 16px 0 rgba(0,0,0,0.16)` : `0 -1px 0 0 ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5} inset`
        }}>
        <div
          className={`c-tween-drawer-event-layer__tween`}
          style={{
            color: theme.text.base
          }}>
          <TweenDrawerIcon
            onClick={() => setTweenDrawerEvent({id: null})}
            icon='left-arrow' />
          <div
            className='c-tween-drawer-event-layer-tween__name'
            style={{
              color: theme.text.lighter,
              textTransform: 'uppercase'
            }}>

          </div>
        </div>
      </div>
      <ScrollSyncPane>
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          id='tween-drawer-event-layers'
          className='c-tween-drawer-event-layers__layers'>
          {
            tweenEventLayers.allIds.map((layer, index) => (
              <TweenDrawerEventLayer
                key={index}
                id={layer}
                index={index} />
            ))
          }
        </div>
      </ScrollSyncPane>
    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer, tweenDrawer } = state;
  const tweenEventLayers = getTweenEventLayers(layer.present, tweenDrawer.event);
  return { tweenEventLayers };
};

export default connect(
  mapStateToProps,
  { setTweenDrawerEvent }
)(TweenDrawerEventLayers);