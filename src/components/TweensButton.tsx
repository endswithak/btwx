import React, { ReactElement } from 'react';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import { openTweenDrawer, closeTweenDrawer } from '../store/actions/tweenDrawer';
import { TweenDrawerTypes } from '../store/actionTypes/tweenDrawer';
import TopbarButton from './TopbarButton';
import { paperMain } from '../canvas';

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
      icon='M20,2 C21.1045695,2 22,2.8954305 22,4 C22,5.1045695 21.1045695,6 20,6 C19.198685,6 18.5074366,5.52874899 18.1882777,4.84826986 C14.5079434,5.67662984 11.6831421,7.17519855 9.70198469,9.33775263 C7.69282622,11.5308716 6.12101186,14.5044994 4.99180281,18.2624097 C5.59467168,18.6083555 6,19.256843 6,20 C6,21.1045695 5.1045695,22 4,22 C2.8954305,22 2,21.1045695 2,20 C2,18.9456382 2.81587779,18.0818349 3.85073766,18.0054857 L4.02725117,18.0001819 C5.19720815,14.0937278 6.8415122,10.9797594 8.96462952,8.66224737 C11.1005861,6.33072053 14.1181111,4.73384315 18.0052695,3.86490437 C18.0736125,2.82366656 18.9406174,2 20,2 Z M4,19 C3.44771525,19 3,19.4477153 3,20 C3,20.5522847 3.44771525,21 4,21 C4.55228475,21 5,20.5522847 5,20 C5,19.4477153 4.55228475,19 4,19 Z M20,3 C19.4477153,3 19,3.44771525 19,4 C19,4.55228475 19.4477153,5 20,5 C20.5522847,5 21,4.55228475 21,4 C21,3.44771525 20.5522847,3 20,3 Z'
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