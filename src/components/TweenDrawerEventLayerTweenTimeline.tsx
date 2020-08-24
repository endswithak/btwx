/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement } from 'react';
import { connect } from 'react-redux';
import gsap from 'gsap';
import { RootState } from '../store/reducers';
import { Draggable } from 'gsap/Draggable';
import { ThemeContext } from './ThemeProvider';
import { setTweenDrawerTweenHover, setTweenDrawerTweenEditing } from '../store/actions/tweenDrawer';
import { SetTweenDrawerTweenHoverPayload, TweenDrawerTypes } from '../store/actionTypes/tweenDrawer';
import { setLayerHover } from '../store/actions/layer';
import { SetLayerHoverPayload, LayerTypes } from '../store/actionTypes/layer';
import TimelineLeftHandle from './TimelineLeftHandle';
import TimelineRightHandle from './TimelineRightHandle';
import TimelineTweenHandle from './TimelineTweenHandle';

gsap.registerPlugin(Draggable);

interface TweenDrawerEventLayerTweenTimelineProps {
  tweenId: string;
  tweenHover?: string;
  tweenEditing?: string;
  hover?: string;
  tweenLayer?: string;
  setTweenDrawerTweenHover?(payload: SetTweenDrawerTweenHoverPayload): TweenDrawerTypes;
  setLayerHover?(payload: SetLayerHoverPayload): LayerTypes;
}

const TweenDrawerEventLayerTweenTimeline = (props: TweenDrawerEventLayerTweenTimelineProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { tweenId, tweenHover, tweenEditing, setTweenDrawerTweenHover, hover, tweenLayer, setLayerHover } = props;

  const handleMouseEnter = (): void => {
    if (!tweenEditing) {
      if (hover !== tweenLayer) {
        setLayerHover({id: tweenLayer});
      }
      setTweenDrawerTweenHover({id: tweenId});
    }
  }

  const handleMouseLeave = (): void => {
    if (!tweenEditing) {
      setTweenDrawerTweenHover({id: null});
    }
  }

  return (
    <div
      id={`${tweenId}-timeline`}
      className='c-tween-drawer-event-layer__tween-timeline'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        color: theme.text.lighter,
        background: tweenId === tweenHover && !tweenEditing || tweenId === tweenEditing
        ? theme.background.z3
        : 'none',
        zIndex: tweenId === tweenEditing
        ? 3
        : 'inherit'
      }}>
      <TimelineTweenHandle
        tweenId={tweenId} />
      <TimelineLeftHandle
        tweenId={tweenId} />
      <TimelineRightHandle
        tweenId={tweenId} />
    </div>
  );
}

const mapStateToProps = (state: RootState, ownProps: TweenDrawerEventLayerTweenTimelineProps): {
  tweenHover: string;
  tweenEditing: string;
  hover: string;
  tweenLayer: string;
} => {
  const { tweenDrawer, layer } = state;
  const tweenHover = tweenDrawer.tweenHover;
  const tweenEditing = tweenDrawer.tweenEditing;
  const hover = layer.present.hover;
  const tweenLayer = layer.present.tweenById[ownProps.tweenId].layer;
  return { tweenHover, tweenEditing, hover, tweenLayer };
};

export default connect(
  mapStateToProps,
  { setTweenDrawerTweenHover, setTweenDrawerTweenEditing, setLayerHover }
)(TweenDrawerEventLayerTweenTimeline);