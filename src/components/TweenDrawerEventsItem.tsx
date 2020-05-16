import React, { useContext, ReactElement, useState } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { setTweenDrawerEvent } from '../store/actions/tweenDrawer';
import { SetTweenDrawerEventPayload, TweenDrawerTypes } from '../store/actionTypes/tweenDrawer';
import { setLayerHover } from '../store/actions/layer';
import { SetLayerHoverPayload, LayerTypes } from '../store/actionTypes/layer';
import TweenDrawerEventsItemEdit from './TweenDrawerEventsItemEdit';
import TweenDrawerEventsItemRemove from './TweenDrawerEventsItemRemove';

interface TweenDrawerEventItemProps {
  id: string;
  tweenEvent?: em.TweenEvent;
  layerItem?: em.Layer;
  destinationItem?: em.Artboard;
  setTweenDrawerEvent?(payload: SetTweenDrawerEventPayload): TweenDrawerTypes;
  setLayerHover?(payload: SetLayerHoverPayload): LayerTypes;
}

const TweenDrawerEventItem = (props: TweenDrawerEventItemProps): ReactElement => {
  const [hover, setHover] = useState(false);
  const theme = useContext(ThemeContext);
  const { id, tweenEvent, layerItem, destinationItem, setTweenDrawerEvent, setLayerHover } = props;

  const handleMouseEnter = () => {
    setHover(true);
    setLayerHover({id: layerItem.id});
  }

  const handleMouseLeave = () => {
    setHover(false);
    setLayerHover({id: null});
  }

  const handleDoubleClick = () => {
    setTweenDrawerEvent({id});
  }

  return (
    <div
      className={`c-tween-drawer-events__item`}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        color: theme.text.base,
        boxShadow: hover ? `0 0 0 ${theme.unit / 2}px ${theme.background.z4} inset` : ''
      }}>
      <div className='c-tween-drawer-events-item__module'>
        {tweenEvent.name}
      </div>
      <div className='c-tween-drawer-events-item__module'>
        {layerItem.name}
      </div>
      <div className='c-tween-drawer-events-item__module'>
        {destinationItem.name}
      </div>
      <div className='c-tween-drawer-events-item__module'>
        {tweenEvent.event}
      </div>
      <div className='c-tween-drawer-events-item__module'>
        <TweenDrawerEventsItemEdit id={id} />
        <TweenDrawerEventsItemRemove id={id} />
      </div>
    </div>
  );
}

const mapStateToProps = (state: RootState, ownProps: TweenDrawerEventItemProps) => {
  const { layer } = state;
  const tweenEvent = layer.present.tweenEventById[ownProps.id];
  const layerItem = layer.present.byId[tweenEvent.layer];
  const destinationItem = layer.present.byId[tweenEvent.destinationArtboard];
  return { tweenEvent, layerItem, destinationItem };
};

export default connect(
  mapStateToProps,
  { setTweenDrawerEvent, setLayerHover }
)(TweenDrawerEventItem);