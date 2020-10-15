import React, { useContext, ReactElement } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { setTweenDrawerEventThunk, setTweenDrawerEventHoverThunk } from '../store/actions/tweenDrawer';
import { SetTweenDrawerEventPayload, TweenDrawerTypes, SetTweenDrawerEventHoverPayload } from '../store/actionTypes/tweenDrawer';
import { setLayerHover, setActiveArtboard } from '../store/actions/layer';
import { SetLayerHoverPayload, LayerTypes, SetActiveArtboardPayload } from '../store/actionTypes/layer';
import { ContextMenuTypes, OpenContextMenuPayload } from '../store/actionTypes/contextMenu';
import { openContextMenu } from '../store/actions/contextMenu';
import { DEFAULT_TWEEN_EVENTS } from '../constants';
import { ThemeContext } from './ThemeProvider';
import TweenDrawerEventsItemEdit from './TweenDrawerEventsItemEdit';
import TweenDrawerEventsItemRemove from './TweenDrawerEventsItemRemove';
import SidebarLayerIcon from './SidebarLayerIcon';

interface TweenDrawerEventItemProps {
  id: string;
  activeArtboard?: string;
  tweenEvent?: em.TweenEvent;
  layerItem?: em.Layer;
  artboardName?: string;
  destinationName?: string;
  tweenEventDisplayName?: string;
  hovering?: boolean;
  setTweenDrawerEventThunk?(payload: SetTweenDrawerEventPayload): void;
  setLayerHover?(payload: SetLayerHoverPayload): LayerTypes;
  setTweenDrawerEventHoverThunk?(payload: SetTweenDrawerEventHoverPayload): TweenDrawerTypes;
  setActiveArtboard?(payload: SetActiveArtboardPayload): LayerTypes;
  openContextMenu?(payload: OpenContextMenuPayload): ContextMenuTypes;
}

interface ItemProps {
  hovering: boolean;
}

const Item = styled.div<ItemProps>`
  color: ${props => props.theme.text.base};
  box-shadow: ${props => props.hovering ? `0 0 0 1px ${props.theme.palette.primary} inset` : 'none'};
  cursor: pointer;
`;

const TweenDrawerEventItem = (props: TweenDrawerEventItemProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { openContextMenu, activeArtboard, id, tweenEvent, layerItem, artboardName, destinationName, setTweenDrawerEventThunk, setLayerHover, tweenEventDisplayName, setTweenDrawerEventHoverThunk, hovering, setActiveArtboard } = props;

  const handleMouseEnter = (): void => {
    if (activeArtboard !== tweenEvent.artboard) {
      setActiveArtboard({id: tweenEvent.artboard});
    }
    setTweenDrawerEventHoverThunk({id});
  }

  const handleMouseLeave = (): void => {
    setTweenDrawerEventHoverThunk({id: null});
  }

  const handleDoubleClick = (e: any): void => {
    // ignore clicks on edit / remove buttons
    if (e.target.nodeName !== 'path' && e.target.nodeName !== 'svg') {
      setTweenDrawerEventThunk({id});
      setLayerHover({id: null});
    }
  }

  const handleContextMenu = (e: any): void => {
    openContextMenu({
      type: 'TweenDrawerEvent',
      id: id,
      x: e.clientX,
      y: e.clientY,
      paperX: e.clientX,
      paperY: e.clientY
    });
  }

  return (
    <Item
      className='c-tween-drawer-events__item'
      onDoubleClick={handleDoubleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onContextMenu={handleContextMenu}
      theme={theme}
      hovering={hovering}>
      <div className='c-tween-drawer-events-item__module'>
        <SidebarLayerIcon
          layer={layerItem.id}
          dragGhost={true} />
        <span style={{marginLeft: 8}}>{layerItem.name}</span>
      </div>
      <div className='c-tween-drawer-events-item__module'>
        <span>{tweenEventDisplayName}</span>
      </div>
      <div className='c-tween-drawer-events-item__module'>
        <span>{artboardName}</span>
      </div>
      <div className='c-tween-drawer-events-item__module'>
        <span>{destinationName}</span>
      </div>
      <div className='c-tween-drawer-events-item__module'>
        <TweenDrawerEventsItemEdit id={id} />
        <TweenDrawerEventsItemRemove id={id} />
      </div>
    </Item>
  );
}

const mapStateToProps = (state: RootState, ownProps: TweenDrawerEventItemProps): {
  activeArtboard: string;
  tweenEvent: em.TweenEvent;
  layerItem: em.Layer;
  artboardName: string;
  destinationName: string;
  tweenEventDisplayName: string;
  hovering: boolean;
} => {
  const { layer, tweenDrawer } = state;
  const activeArtboard = layer.present.activeArtboard;
  const tweenEvent = layer.present.tweenEventById[ownProps.id];
  const artboard = layer.present.byId[tweenEvent.artboard];
  const artboardName = artboard.name;
  const layerItem = layer.present.byId[tweenEvent.layer];
  const destination = layer.present.byId[tweenEvent.destinationArtboard];
  const destinationName = destination.name;
  const tweenEventDisplayName = DEFAULT_TWEEN_EVENTS.find((defaultEvent) => defaultEvent.event === tweenEvent.event).titleCase;
  const hovering = tweenDrawer.eventHover === ownProps.id;
  return { activeArtboard, artboardName, tweenEvent, layerItem, destinationName, tweenEventDisplayName, hovering };
};

export default connect(
  mapStateToProps,
  { openContextMenu, setTweenDrawerEventThunk, setLayerHover, setTweenDrawerEventHoverThunk, setActiveArtboard }
)(TweenDrawerEventItem);