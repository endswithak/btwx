import React, { useContext, ReactElement } from 'react';
import { connect } from 'react-redux';
import { ScrollSyncPane } from 'react-scroll-sync';
import { RootState } from '../store/reducers';
import { getTweenEventLayers } from '../store/selectors/layer';
import { setTweenDrawerEvent } from '../store/actions/tweenDrawer';
import { SetTweenDrawerEventPayload, TweenDrawerTypes } from '../store/actionTypes/tweenDrawer';
import { setLayerHover, selectLayers } from '../store/actions/layer';
import { SetLayerHoverPayload, SelectLayersPayload, LayerTypes } from '../store/actionTypes/layer';
import { ThemeContext } from './ThemeProvider';
import TweenDrawerEventLayer from './TweenDrawerEventLayer';
import TweenDrawerEventLayersHeader from './TweenDrawerEventLayersHeader';

interface TweenDrawerEventLayersProps {
  tweenDrawerLayersWidth?: number;
  artboardItem?: em.Artboard;
  tweenEventLayers?: {
    allIds: string[];
    byId: {
      [id: string]: em.Layer;
    };
  };
  scrollLayerItem?: em.Layer;
  scrollLayer: string;
  setTweenDrawerEvent?(payload: SetTweenDrawerEventPayload): TweenDrawerTypes;
  setLayerHover?(payload: SetLayerHoverPayload): LayerTypes;
  selectLayers?(payload: SelectLayersPayload): LayerTypes;
}

const TweenDrawerEventLayers = (props: TweenDrawerEventLayersProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { scrollLayer, scrollLayerItem, tweenDrawerLayersWidth, tweenEventLayers, setTweenDrawerEvent, artboardItem, setLayerHover, selectLayers } = props;

  const handleMouseEnter = (id: string) => {
    setLayerHover({id: id});
  }

  const handleMouseLeave = () => {
    setLayerHover({id: null});
  }

  const handleClick = (id: string) => {
    selectLayers({layers: [id], newSelection: true});
  }

  return (
    <div
      id='tween-layers'
      className='c-tween-drawer-event__layers'
      style={{
        boxShadow: `-1px 0 0 ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5} inset`,
        width: tweenDrawerLayersWidth
      }}>
      <TweenDrawerEventLayersHeader
        text={artboardItem.name}
        icon='thicc-chevron-left'
        onClick={() => handleClick(artboardItem.id)}
        onMouseEnter={() => handleMouseEnter(artboardItem.id)}
        onMouseLeave={handleMouseLeave}
        onIconClick={() => setTweenDrawerEvent({id: null})} />
      {
        scrollLayer
        ? <TweenDrawerEventLayersHeader
            text={scrollLayerItem.name}
            icon='shape'
            layerItem={scrollLayerItem}
            onClick={() => handleClick(scrollLayerItem.id)}
            onMouseEnter={() => handleMouseEnter(scrollLayerItem.id)}
            onMouseLeave={handleMouseLeave}
            sticky />
        : null
      }
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

const mapStateToProps = (state: RootState, ownProps: TweenDrawerEventLayersProps) => {
  const { layer, tweenDrawer, canvasSettings } = state;
  const tweenEventLayers = getTweenEventLayers(layer.present, tweenDrawer.event);
  const eventItem = layer.present.tweenEventById[tweenDrawer.event];
  const artboardItem = layer.present.byId[eventItem.artboard];
  const tweenDrawerLayersWidth = canvasSettings.tweenDrawerLayersWidth;
  const scrollLayerItem = layer.present.byId[ownProps.scrollLayer];
  return { tweenEventLayers, artboardItem, tweenDrawerLayersWidth, scrollLayerItem };
};

export default connect(
  mapStateToProps,
  { setTweenDrawerEvent, setLayerHover, selectLayers }
)(TweenDrawerEventLayers);