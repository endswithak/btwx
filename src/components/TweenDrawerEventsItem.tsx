import React, { useContext, ReactElement } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { setTweenDrawerEvent, setTweenDrawerEventHover } from '../store/actions/tweenDrawer';
import { SetTweenDrawerEventPayload, TweenDrawerTypes, SetTweenDrawerEventHoverPayload } from '../store/actionTypes/tweenDrawer';
import { setLayerHover } from '../store/actions/layer';
import { SetLayerHoverPayload, LayerTypes } from '../store/actionTypes/layer';
import { ThemeContext } from './ThemeProvider';
import TweenDrawerEventsItemEdit from './TweenDrawerEventsItemEdit';
import TweenDrawerEventsItemRemove from './TweenDrawerEventsItemRemove';

interface TweenDrawerEventItemProps {
  id: string;
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
}

interface ItemProps {
  hovering: boolean;
}

const Item = styled.div<ItemProps>`
  color: ${props => props.theme.text.base};
  box-shadow: ${props => props.hovering ? `2px 0 0 0 ${props.theme.palette.primary} inset` : 'none'};
  background: ${props => props.hovering ? props.theme.background.z3 : 'none'};
`;

const TweenDrawerEventItem = (props: TweenDrawerEventItemProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { artboardActive, destinationActive, id, tweenEvent, layerItem, artboardName, destinationName, setTweenDrawerEvent, setLayerHover, tweenEventDisplayName, setTweenDrawerEventHover, hovering } = props;

  const handleMouseEnter = () => {
    setLayerHover({id: layerItem.id});
    setTweenDrawerEventHover({id});
  }

  const handleMouseLeave = () => {
    setLayerHover({id: null});
    setTweenDrawerEventHover({id: null});
  }

  // const handleDoubleClick = () => {
  //   setTweenDrawerEvent({id});
  // }

  return (
    <Item
      className='c-tween-drawer-events__item'
      // onDoubleClick={handleDoubleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      theme={theme}
      hovering={hovering}>
      <div className='c-tween-drawer-events-item__module'>
        <span className='c-tween-drawer-events-item__artboard'>
          {artboardName}
          <span
            className='c-tween-drawer-events-item__active-artboard'
            style={{
              background: artboardActive ? theme.palette.primary : 'none'
            }} />
        </span>
      </div>
      <div className='c-tween-drawer-events-item__module'>
        {layerItem.name}
      </div>
      <div className='c-tween-drawer-events-item__module'>
        <span className='c-tween-drawer-events-item__artboard'>
          {destinationName}
          <span
            className='c-tween-drawer-events-item__active-artboard'
            style={{
              background: destinationActive ? theme.palette.primary : 'none'
            }} />
        </span>
      </div>
      <div className='c-tween-drawer-events-item__module'>
        {tweenEventDisplayName}
      </div>
      <div className='c-tween-drawer-events-item__module'>
        <TweenDrawerEventsItemEdit id={id} />
        <TweenDrawerEventsItemRemove id={id} />
      </div>
    </Item>
  );
}

const mapStateToProps = (state: RootState, ownProps: TweenDrawerEventItemProps): {
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
  return { artboardActive, destinationActive, artboardName, tweenEvent, layerItem, destinationName, tweenEventDisplayName, hovering };
};

export default connect(
  mapStateToProps,
  { setTweenDrawerEvent, setLayerHover, setTweenDrawerEventHover }
)(TweenDrawerEventItem);