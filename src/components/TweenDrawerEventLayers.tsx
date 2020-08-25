import React, { useContext, ReactElement } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { getTweenEventLayers } from '../store/selectors/layer';
import TweenDrawerEventLayer from './TweenDrawerEventLayer';
import { setTweenDrawerEvent } from '../store/actions/tweenDrawer';
import { SetTweenDrawerEventPayload, TweenDrawerTypes } from '../store/actionTypes/tweenDrawer';
import { setLayerHover, selectLayers } from '../store/actions/layer';
import { SetLayerHoverPayload, SelectLayersPayload, LayerTypes } from '../store/actionTypes/layer';
import TweenDrawerIcon from './TweenDrawerIcon';
import { ScrollSyncPane } from 'react-scroll-sync';

interface TweenDrawerEventLayersProps {
  tweenDrawerLayersWidth?: number;
  artboardItem?: em.Artboard;
  tweenEventLayers?: {
    allIds: string[];
    byId: {
      [id: string]: em.Layer;
    };
  };
  setTweenDrawerEvent?(payload: SetTweenDrawerEventPayload): TweenDrawerTypes;
  setLayerHover?(payload: SetLayerHoverPayload): LayerTypes;
  selectLayers?(payload: SelectLayersPayload): LayerTypes;
}

const TweenDrawerEventLayers = (props: TweenDrawerEventLayersProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { tweenDrawerLayersWidth, tweenEventLayers, setTweenDrawerEvent, artboardItem, setLayerHover, selectLayers } = props;

  const handleMouseEnter = () => {
    setLayerHover({id: artboardItem.id});
  }

  const handleMouseLeave = () => {
    setLayerHover({id: null});
  }

  const handleClick = () => {
    selectLayers({layers: [artboardItem.id], newSelection: true});
  }

  return (
    <div
      id='tween-layers'
      className='c-tween-drawer-event__layers'
      style={{
        boxShadow: `-1px 0 0 ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5} inset`,
        width: tweenDrawerLayersWidth
      }}>
      <div
        className='c-tween-drawer-event-layers__header'
        style={{
          background: theme.name === 'dark' ? theme.background.z3 : theme.background.z0,
          boxShadow: `0 -1px 0 0 ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5} inset`
        }}>
        <button
          className='c-tween-drawer-event-layer__tween'
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            boxShadow: `-1px 0 0 0 ${theme.background.z5} inset`
          }}>
          <TweenDrawerIcon
            onClick={() => setTweenDrawerEvent({id: null})}
            icon='left-arrow' />
          <div
            className='c-tween-drawer-event-layer-tween__name'
            style={{
              color: theme.text.base
            }}>
            { artboardItem.name }
          </div>
        </button>
      </div>
      <ScrollSyncPane>
        <div
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
  const { layer, tweenDrawer, canvasSettings } = state;
  const tweenEventLayers = getTweenEventLayers(layer.present, tweenDrawer.event);
  const eventItem = layer.present.tweenEventById[tweenDrawer.event];
  const artboardItem = layer.present.byId[eventItem.artboard];
  const tweenDrawerLayersWidth = canvasSettings.tweenDrawerLayersWidth;
  return { tweenEventLayers, artboardItem, tweenDrawerLayersWidth };
};

export default connect(
  mapStateToProps,
  { setTweenDrawerEvent, setLayerHover, selectLayers }
)(TweenDrawerEventLayers);