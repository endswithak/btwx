import React, { useContext, ReactElement } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { setTweenDrawerEvent, setTweenDrawerEventHover } from '../store/actions/tweenDrawer';
import { SetTweenDrawerEventPayload, TweenDrawerTypes, SetTweenDrawerEventHoverPayload } from '../store/actionTypes/tweenDrawer';
import { setLayerHover, setActiveArtboard } from '../store/actions/layer';
import { SetLayerHoverPayload, LayerTypes, SetActiveArtboardPayload } from '../store/actionTypes/layer';
import { ThemeContext } from './ThemeProvider';
import TweenDrawerEventsItemEdit from './TweenDrawerEventsItemEdit';
import TweenDrawerEventsItemRemove from './TweenDrawerEventsItemRemove';
import SidebarLayerIcon from './SidebarLayerIcon';

interface TweenDrawerEventItemProps {
  id: string;
  activeArtboard?: string;
  artboardActive?: boolean;
  destinationActive?: boolean;
  tweenEvent?: em.TweenEvent;
  layerItem?: em.Layer;
  artboardName?: string;
  destinationName?: string;
  tweenEventDisplayName?: string;
  hovering?: boolean;
  setTweenDrawerEvent?(payload: SetTweenDrawerEventPayload): TweenDrawerTypes;
  setLayerHover?(payload: SetLayerHoverPayload): LayerTypes;
  setTweenDrawerEventHover?(payload: SetTweenDrawerEventHoverPayload): TweenDrawerTypes;
  setActiveArtboard?(payload: SetActiveArtboardPayload): LayerTypes;
}

interface ItemProps {
  hovering: boolean;
}

const Item = styled.div<ItemProps>`
  color: ${props => props.theme.text.base};
  box-shadow: ${props => props.hovering ? `0 0 0 1px ${props.theme.palette.primary} inset` : 'none'};
  /* background: ${props => props.hovering ? props.theme.background.z3 : 'none'}; */
  cursor: pointer;
`;

const TweenDrawerEventItem = (props: TweenDrawerEventItemProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { activeArtboard, artboardActive, destinationActive, id, tweenEvent, layerItem, artboardName, destinationName, setTweenDrawerEvent, setLayerHover, tweenEventDisplayName, setTweenDrawerEventHover, hovering, setActiveArtboard } = props;

  const handleMouseEnter = () => {
    setLayerHover({id: layerItem.id});
    if (activeArtboard !== tweenEvent.artboard) {
      setActiveArtboard({id: tweenEvent.artboard, scope: 1});
    }
    setTweenDrawerEventHover({id});
  }

  const handleMouseLeave = () => {
    setLayerHover({id: null});
    setTweenDrawerEventHover({id: null});
  }

  const handleDoubleClick = () => {
    setTweenDrawerEvent({id});
    setLayerHover({id: null});
  }

  return (
    <Item
      className='c-tween-drawer-events__item'
      onDoubleClick={handleDoubleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      theme={theme}
      hovering={hovering}>
      <div className='c-tween-drawer-events-item__module'>
        <SidebarLayerIcon
          layer={layerItem}
          dragGhost={true} />
        <span style={{marginLeft: 8}}>{layerItem.name}</span>
      </div>
      <div className='c-tween-drawer-events-item__module'>
        {tweenEventDisplayName}
      </div>
      <div className='c-tween-drawer-events-item__module'>
        {artboardName}
      </div>
      <div className='c-tween-drawer-events-item__module'>
        {destinationName}
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
  artboardActive: boolean;
  destinationActive: boolean;
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
  const artboardActive = artboard.id === activeArtboard;
  const destinationActive = destination.id === activeArtboard;
  const tweenEventDisplayName = ((): string => {
    switch(tweenEvent.event) {
      case 'click':
        return 'Click';
      case 'doubleclick':
        return 'Double Click';
      case 'mouseenter':
        return 'Mouse Enter';
      case 'mouseleave':
        return 'Mouse Leave';
    }
  })();
  const hovering = tweenDrawer.eventHover === ownProps.id;
  return { activeArtboard, artboardActive, destinationActive, artboardName, tweenEvent, layerItem, destinationName, tweenEventDisplayName, hovering };
};

export default connect(
  mapStateToProps,
  { setTweenDrawerEvent, setLayerHover, setTweenDrawerEventHover, setActiveArtboard }
)(TweenDrawerEventItem);