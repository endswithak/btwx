import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { openTweenDrawer, closeTweenDrawer } from '../store/actions/tweenDrawer';
import { TweenDrawerTypes } from '../store/actionTypes/tweenDrawer';
import { paperMain } from '../canvas';
import Icon from './Icon';
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
      // iconOpacity='M21,8 L21,14 L3,14 L3,8 L21,8 Z M21,3 L21,7 L3,7 L3,3.001 C3,3.00044772 3.00044772,3 3.001,3 L21,3 L21,3 Z'
      // icon='M21,15 L21,21 L3,21 L3,15.001 C3,15.0004477 3.00044772,15 3.001,15 L21,15 L21,15 Z'
      icon={Icon('tweens')}
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