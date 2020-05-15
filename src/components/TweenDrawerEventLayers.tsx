import React, { useContext, ReactElement } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { getTweenEventLayers } from '../store/selectors/layer';
import TweenDrawerEventLayer from './TweenDrawerEventLayer';
import { setTweenDrawerEvent } from '../store/actions/tweenDrawer';
import { SetTweenDrawerEventPayload, TweenDrawerTypes } from '../store/actionTypes/tweenDrawer';

interface TweenDrawerEventLayersProps {
  tweenEventLayers?: {
    allIds: string[];
    byId: {
      [id: string]: em.Layer;
    };
  };
  setTweenDrawerEvent?(payload: SetTweenDrawerEventPayload): TweenDrawerTypes;
}

const TweenDrawerEventLayers = (props: TweenDrawerEventLayersProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { tweenEventLayers, setTweenDrawerEvent } = props;

  return (
    <div className={`c-tween-drawer-event__layers`}>
      <div
        className='c-tween-drawer-event-layers__header'>
        <div
          className={`c-tween-drawer-event-layer__tween`}
          style={{
            color: theme.text.base
          }}>
          <div
            className='c-tween-drawer__icon'
            onClick={() => setTweenDrawerEvent({id: null})}>
            <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            style={{
              fill: theme.text.lighter
            }}>
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
          </div>
        </div>
      </div>
      <div className='c-tween-drawer-event-layers__layers'>
        {
          tweenEventLayers.allIds.map((layer, index) => (
            <TweenDrawerEventLayer
              key={index}
              id={layer}
              index={index} />
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
  mapStateToProps,
  { setTweenDrawerEvent }
)(TweenDrawerEventLayers);