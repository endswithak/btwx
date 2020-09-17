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
import SidebarEmptyState from './SidebarEmptyState';

interface TweenDrawerEventLayersProps {
  isEmpty?: boolean;
  tweenDrawerLayersWidth?: number;
  artboardItem?: em.Artboard;
  tweenEventLayers?: {
    allIds: string[];
    byId: {
      [id: string]: em.Layer;
    };
  };
  scrollLayerItem?: em.Layer;
  scrollLayerMaskItem?: em.Layer;
  scrollLayer: string;
  setTweenDrawerEvent?(payload: SetTweenDrawerEventPayload): TweenDrawerTypes;
  setLayerHover?(payload: SetLayerHoverPayload): LayerTypes;
  selectLayers?(payload: SelectLayersPayload): LayerTypes;
}

const TweenDrawerEventLayers = (props: TweenDrawerEventLayersProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { isEmpty, scrollLayer, scrollLayerItem, scrollLayerMaskItem, tweenDrawerLayersWidth, tweenEventLayers, setTweenDrawerEvent, artboardItem, setLayerHover, selectLayers } = props;

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
        icon={{
          name: 'thicc-chevron-left',
          small: true
        }}
        onClick={() => handleClick(artboardItem.id)}
        onMouseEnter={() => handleMouseEnter(artboardItem.id)}
        onMouseLeave={handleMouseLeave}
        onIconClick={() => setTweenDrawerEvent({id: null})} />
      {
        isEmpty
        ? <div style={{position: 'relative', display: 'flex', flexDirection: 'column', width: '100%', height: '100%', overflow: 'hidden'}}>
            <SidebarEmptyState
              icon='ease-curve'
              text='Event Layers'
              detail={<span>View and edit event<br/> layer eases here.</span>} />
          </div>
        : <>
            {
              scrollLayer
              ? <TweenDrawerEventLayersHeader
                  text={scrollLayerItem.name}
                  icon={{
                    name: (() => {
                      switch(scrollLayerItem.type) {
                        case 'Artboard':
                          return 'artboard'
                        case 'Group':
                          return scrollLayerMaskItem ? 'shape' : 'folder';
                        case 'Shape':
                          return 'shape';
                        case 'Text':
                          return 'text';
                        case 'Image':
                          return 'image';
                      }
                    })(),
                    small: scrollLayerItem.type === 'Shape' || scrollLayerMaskItem !== null,
                    shapeId: scrollLayerItem.type === 'Shape' ? scrollLayerItem.id : scrollLayerMaskItem ? scrollLayerMaskItem.id : null
                  }}
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
          </>
      }
    </div>
  );
}

const mapStateToProps = (state: RootState, ownProps: TweenDrawerEventLayersProps) => {
  const { layer, tweenDrawer, documentSettings } = state;
  const tweenEventLayers = getTweenEventLayers(layer.present, tweenDrawer.event);
  const isEmpty = tweenEventLayers.allIds.length === 0;
  const eventItem = layer.present.tweenEventById[tweenDrawer.event];
  const artboardItem = layer.present.byId[eventItem.artboard];
  const tweenDrawerLayersWidth = documentSettings.tweenDrawerLayersWidth;
  const scrollLayerItem = ownProps.scrollLayer ? layer.present.byId[ownProps.scrollLayer] : null;
  const mask = scrollLayerItem && scrollLayerItem.type === 'Group' && (scrollLayerItem as em.Group).clipped ? (() => {
    return (scrollLayerItem as em.Group).children.find((id) => layer.present.byId[id].mask);
  })() : null;
  const scrollLayerMaskItem = mask ? layer.present.byId[mask] : null;
  return { tweenEventLayers, artboardItem, tweenDrawerLayersWidth, scrollLayerItem, scrollLayerMaskItem, isEmpty };
};

export default connect(
  mapStateToProps,
  { setTweenDrawerEvent, setLayerHover, selectLayers }
)(TweenDrawerEventLayers);