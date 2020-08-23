import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { openTweenDrawer, closeTweenDrawer } from '../store/actions/tweenDrawer';
import { TweenDrawerTypes } from '../store/actionTypes/tweenDrawer';
import { paperMain } from '../canvas';
import TopbarButton from './TopbarButton';

interface TweensButtonProps {
  isTweenDrawerOpen: boolean;
  tweenDrawerHeight?: number;
  openTweenDrawer(): TweenDrawerTypes;
  closeTweenDrawer(): TweenDrawerTypes;
}

const TweensButton = (props: TweensButtonProps): ReactElement => {
  const { isTweenDrawerOpen, openTweenDrawer, closeTweenDrawer, tweenDrawerHeight } = props;

  const handleTweensClick = () => {
    if (isTweenDrawerOpen) {
      paperMain.view.viewSize = new paperMain.Size(paperMain.view.viewSize.width, paperMain.view.viewSize.height + tweenDrawerHeight);
      closeTweenDrawer();
    } else {
      paperMain.view.viewSize = new paperMain.Size(paperMain.view.viewSize.width, paperMain.view.viewSize.height - tweenDrawerHeight);
      openTweenDrawer();
    }
  }

  return (
    <TopbarButton
      label='Tweens'
      onClick={handleTweensClick}
      icon='tweens'
      isActive={isTweenDrawerOpen} />
  );
}

const mapStateToProps = (state: RootState): {
  isTweenDrawerOpen: boolean;
  tweenDrawerHeight: number;
} => {
  const { tweenDrawer, canvasSettings } = state;
  const isTweenDrawerOpen = tweenDrawer.isOpen;
  const tweenDrawerHeight = canvasSettings.tweenDrawerHeight;
  return { isTweenDrawerOpen, tweenDrawerHeight };
};

export default connect(
  mapStateToProps,
  { openTweenDrawer, closeTweenDrawer }
)(TweensButton);