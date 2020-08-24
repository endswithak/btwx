import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { updateTweenEventsFrame } from '../store/utils/layer';
import { LayerState } from '../store/reducers/layer';
import { paperMain } from '../canvas';

interface TweenEventsFrameProps {
  tweenEventLayers?: {
    allIds: string[];
    byId: {
      [id: string]: em.Layer;
    };
  };
  activeArtboard?: string;
  allArtboardIds?: string[];
  artboardsById?: {
    [id: string]: em.Artboard;
  };
  tweenEventItems?: em.TweenEvent[];
  allArtboardItems?: em.Artboard[];
  eventHover?: string;
  themeName?: em.ThemeName;
  eventSort?: em.TweenEventSort;
}

const TweenEventsFrame = (props: TweenEventsFrameProps): ReactElement => {
  const { tweenEventLayers, allArtboardIds, allArtboardItems, tweenEventItems, eventHover, artboardsById, activeArtboard, themeName, eventSort } = props;

  useEffect(() => {
    updateTweenEventsFrame({allArtboardIds, byId: {...artboardsById, ...tweenEventLayers.byId}, activeArtboard} as LayerState, tweenEventItems, eventHover, themeName);
    return () => {
      const tweenEventsFrame = paperMain.project.getItem({ data: { id: 'tweenEventsFrame' } });
      if (tweenEventsFrame) {
        tweenEventsFrame.remove();
      }
    }
  }, [allArtboardIds, allArtboardItems, tweenEventItems, eventHover, activeArtboard, themeName, eventSort]);

  return (
    <div />
  );
}

const mapStateToProps = (state: RootState): {
  activeArtboard: string;
  allArtboardIds: string[];
  artboardsById: { [id: string]: em.Artboard };
  tweenEventItems: em.TweenEvent[];
  tweenEventLayers: {
    allIds: string[];
    byId: {
      [id: string]: em.Layer;
    };
  };
  allArtboardItems: em.Artboard[];
  eventHover: string;
  themeName: em.ThemeName;
  eventSort: em.TweenEventSort;
} => {
  const { layer, tweenDrawer, theme } = state;
  const eventSort = tweenDrawer.eventSort;
  const activeArtboard = layer.present.activeArtboard;
  const allArtboardIds = layer.present.allArtboardIds;
  const artboardsById = allArtboardIds.reduce((result: {[id: string]: em.Artboard}, current) => {
    result[current] = layer.present.byId[current] as em.Artboard;
    return result;
  }, {});
  const allArtboardItems = allArtboardIds.reduce((result, current) => {
    return [...result, layer.present.byId[current]];
  }, []);
  const eventHover = tweenDrawer.eventHover;
  const eventHoverItem = layer.present.tweenEventById[eventHover]
  const tweenEventItems = tweenDrawer.event === null ? layer.present.allTweenEventIds.reduce((result, current) => {
    const tweenEvent = layer.present.tweenEventById[current];
    if (tweenEvent.artboard === activeArtboard) {
      result = [...result, tweenEvent];
    }
    return result;
  }, []) as em.TweenEvent[] : [layer.present.tweenEventById[tweenDrawer.event]] as em.TweenEvent[];
  const getSort = (sortBy: 'layer' | 'event' | 'artboard' | 'destinationArtboard'): em.TweenEvent[] => {
    return [...tweenEventItems].sort((a, b) => {
      let sortA;
      let sortB;
      switch(sortBy) {
        case 'layer':
        case 'artboard':
        case 'destinationArtboard':
          sortA = layer.present.byId[a.layer].name.toUpperCase();
          sortB = layer.present.byId[b.layer].name.toUpperCase();
          break;
        case 'event':
          sortA = a[sortBy].toUpperCase();
          sortB = b[sortBy].toUpperCase();
          break;
      }
      if (sortA < sortB) {
        return -1;
      }
      if (sortA > sortB) {
        return 1;
      }
      return 0;
    });
  }
  const sortedTweenEventItems = (() => {
    if (eventSort !== 'none') {
      switch(eventSort) {
        case 'artboard-asc':
          return getSort('artboard').reverse();
        case 'artboard-dsc':
          return getSort('artboard');
        case 'destinationArtboard-asc':
          return getSort('destinationArtboard').reverse();
        case 'destinationArtboard-dsc':
          return getSort('destinationArtboard');
        case 'event-asc':
          return getSort('event').reverse();
        case 'event-dsc':
          return getSort('event');
        case 'layer-asc':
          return getSort('layer').reverse();
        case 'layer-dsc':
          return getSort('layer');
      }
    } else {
      return tweenEventItems.reverse();
    }
  })() as em.TweenEvent[];
  const tweenEventLayers = tweenEventItems.reduce((result, current) => {
    const layerItem = layer.present.byId[current.layer];
    if (layerItem.type === 'Group' && (layerItem as em.Group).clipped) {
      const childLayers = (layerItem as em.Group).children.reduce((childrenResult, currentChild) => {
        const childItem = layer.present.byId[currentChild];
        if (!result.allIds.includes(currentChild)) {
          childrenResult.allIds = [...childrenResult.allIds, currentChild];
          childrenResult.byId = {
            ...childrenResult.byId,
            [currentChild]: childItem
          }
        }
        return childrenResult;
      }, { allIds: [], byId: {} });
      result.allIds = [...result.allIds, ...childLayers.allIds];
      result.byId = {...result.byId, ...childLayers.byId};
    }
    if (!result.allIds.includes(current.layer)) {
      result.allIds = [...result.allIds, current.layer];
      result.byId = {
        ...result.byId,
        [current.layer]: layerItem
      }
    }
    return result;
  }, { allIds: [], byId: {} });
  const themeName = theme.theme;
  if (eventHoverItem && !tweenEventItems.some((item: em.TweenEvent) => item.id === eventHoverItem.id)) {
    tweenEventItems.unshift(eventHoverItem);
  }
  return { tweenEventLayers, allArtboardIds, tweenEventItems: sortedTweenEventItems, allArtboardItems, eventHover, artboardsById, activeArtboard, themeName, eventSort };
};

export default connect(
  mapStateToProps
)(TweenEventsFrame);